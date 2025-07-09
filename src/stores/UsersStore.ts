import { defineStore } from "pinia";
import {
  collection,
  getDocs,
  Firestore,
  doc,
  setDoc,
  deleteDoc,
  updateDoc,
  Timestamp
} from "firebase/firestore";
import { ref, Ref } from "vue";
import type { UsersType } from "@/types/UsersType"

export const useUsersStore = defineStore("users", () => {
  const records: Ref<UsersType[]> = ref([]);  
  let db: Firestore | null = null;

  const init = (injectedDb: Firestore) => {
    db = injectedDb;
  };

  const readRecords = async () => {
    if (!db) throw new Error("Firestore not initialized");
    const snapshot = await getDocs(collection(db, "users"));
    records.value = snapshot.docs.map((doc) => ({
      id: doc.id,
      ...(doc.data() as Omit<UsersType, "id">),
    }));
  };

  const createRecord = async (record: Omit<UsersType, "id">) => {
    if (!db) throw new Error("Firestore not initialized");
    const refDoc = doc(collection(db, "users"));
    await setDoc(refDoc, record);
    await readRecords();
  };

  const updateRecord = async (record: UsersType) => {
    if (!db) throw new Error("Firestore not initialized");
    const refDoc = doc(db, "users", record.id);
    const { id, ...data } = record;
    await updateDoc(refDoc, data); // ✅ only updates the actual Firestore fields
    await readRecords();
  };

  const deleteRecord = async (id: string) => {
    if (!db) throw new Error("Firestore not initialized");
    await deleteDoc(doc(db, "users", id));
    await readRecords();
  };

  return {
    records,
    init,
    readRecords,
    createRecord,
    updateRecord,
    deleteRecord,
  };
});

export type UsersStoreType = ReturnType<typeof useUsersStore>;