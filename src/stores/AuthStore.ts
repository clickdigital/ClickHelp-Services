import { defineStore } from "pinia";
import { ref, computed } from "vue";
import {
  getAuth,
  onAuthStateChanged as firebaseOnAuthStateChanged,
  isSignInWithEmailLink,
  signInWithEmailLink,
  signOut as firebaseSignOut,
  User
} from "firebase/auth";
import {
  getFirestore,
  doc,
  getDoc
} from "firebase/firestore";
import { getFunctions, connectFunctionsEmulator, httpsCallable } from "firebase/functions";
import { getApp } from "firebase/app";
import { db, auth } from "../services/firebase"; // ✅ Safe, shared instances

export const useAuthStore = defineStore("AuthStore", () => {
  const storName = "AuthStore";
  const user = ref<User | null>(null);
  const userProfile = ref<any>(null);
  const error = ref<string | null>(null);

  async function sendMagicLink(email: string, appName: string) {
    console.log("authStore.sendMagicLink", email, appName);
  
    const payload = {
      data: {
        email: email,
        app: appName,
      }
    };
  
    /** 
     * Using http as opposed to function call as it was apparently more versatile.  This posts the 
     * email and app (CRM) to the cloud function using http.
     */
    const response = await fetch("http://localhost:5001/clickhelp-68faa/us-central1/sendLoginLink", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(payload),
    });
  
    const result = await response.json();
    console.log("✅ Magic link function result:", result);
  
    if (!response.ok) {
      throw new Error(result.error || "Failed to send magic link");
    }
  
    // ✅ write the email into the local storage for link validation when clicked.
    window.localStorage.setItem("emailForSignIn", email);
  }

  async function validateMagicLink(link: string, router?: any) {
    const email = window.localStorage.getItem("emailForSignIn");
    console.log("Email:", email);

    if (!email || !isSignInWithEmailLink(auth, link)) return;
  
    try {
      const result = await signInWithEmailLink(auth, email, link);
      user.value = result.user;
      window.localStorage.removeItem("emailForSignIn");
  
      // Check if user profile exists
      const profileRef = doc(db, "users", user.value.uid);
      const profileSnap = await getDoc(profileRef);
  
      if (!profileSnap.exists()) {
        // 🚫 User exists in Auth but not in Firestore → block login
        await firebaseSignOut(auth); // optionally sign them out
        user.value = null;
        userProfile.value = null;
        error.value = "Your account is not registered. Please contact support.";
        if (router) router.push("/login");
        return;
      }
  
      // ✅ Profile found → continue login
      userProfile.value = profileSnap.data();
      if (router) router.push("/dashboard");
    } catch (err: any) {
      error.value = err.message;
      console.error("Sign-in error:", err);
    }
  }

  async function signOut(router?: any) {
    try {
      await firebaseSignOut(auth);
      user.value = null;
      userProfile.value = null;
      if (router) router.push("/login");
    } catch (err: any) {
      error.value = err.message;
      console.error("Sign-out error:", err);
    }
  }

  function onAuthStateChanged(router?: any) {
    firebaseOnAuthStateChanged(auth, async (firebaseUser) => {
      user.value = firebaseUser;
      if (firebaseUser) {
        const profileSnap = await getDoc(doc(db, "users", firebaseUser.uid));
        userProfile.value = profileSnap.exists() ? profileSnap.data() : null;
        if (router) router.push("/dashboard");
      } else {
        userProfile.value = null;
        if (router) router.push("/login");
      }
    });
  }

  // Getters
  const getUserProfile = computed(() => userProfile.value);
  const getUserRole = computed(() => userProfile.value?.role || null);
  const getError = computed(() => error.value);

  return {
    // State
    storName,
    user,
    userProfile,
    error,

    // Actions
    sendMagicLink,
    validateMagicLink,
    signOut,
    onAuthStateChanged,

    // Getters
    getUserProfile,
    getUserRole,
    getError
  };

});

export type AuthStoreType = ReturnType<typeof useAuthStore>;