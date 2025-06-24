import { initializeApp, getApps, getApp, FirebaseApp } from "firebase/app";
import { getFirestore, Firestore, connectFirestoreEmulator } from "firebase/firestore";
import { getAuth, Auth, connectAuthEmulator } from "firebase/auth";

let app: FirebaseApp;
let db: Firestore;
let auth: Auth;

export function initFirebase(
  config: {
    apiKey: string;
    authDomain: string;
    projectId: string;
    storageBucket: string;
    messagingSenderId?: string;
    appId: string;
    measurementId?: string;
  },
  options?: {
    useEmulator?: boolean;
  }
) {
  if (!getApps().length) {
    app = initializeApp(config);
    console.log("✅ Firebase initialized with project:", config.projectId);
  } else {
    app = getApp();
    console.log("⚠️ Firebase already initialized");
  }

  db = getFirestore(app);
  auth = getAuth(app);

  if (options?.useEmulator && location.hostname === "localhost") {
    connectFirestoreEmulator(db, "localhost", 8081);
    connectAuthEmulator(auth, "http://localhost:9099");
    console.log("🔥 Connected to Firestore emulator at localhost:8081");
    console.log("🔥 Connected to Auth emulator at http://localhost:9099");
  }
}

export { app, db, auth };