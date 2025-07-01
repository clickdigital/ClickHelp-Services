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
import type { OnBoardType } from "@/types/OnBoardType"

export const useOnBoardStore = defineStore("onboard", () => {
  const records: Ref<OnBoardType[]> = ref([]);  
  let db: Firestore | null = null;

  const init = (injectedDb: Firestore) => {
    db = injectedDb;
  };

  const readRecords = async () => {
    if (!db) throw new Error("Firestore not initialized");
    const snapshot = await getDocs(collection(db, "onboard"));
    records.value = snapshot.docs.map((doc) => ({
      id: doc.id,
      ...(doc.data() as Omit<OnBoardType, "id">),
    }));
  };

  const createRecord = async (record: Omit<OnBoardType, "id">) => {
    if (!db) throw new Error("Firestore not initialized");
    const refDoc = doc(collection(db, "onboard"));
    await setDoc(refDoc, record);
    await readRecords();
  };

  const updateRecord = async (record: OnBoardType) => {
    if (!db) throw new Error("Firestore not initialized");
    const refDoc = doc(db, "onboard", record.id);
    const { id, ...data } = record;
    await updateDoc(refDoc, data); // ✅ only updates the actual Firestore fields
    await readRecords();
  };

  const deleteRecord = async (id: string) => {
    if (!db) throw new Error("Firestore not initialized");
    await deleteDoc(doc(db, "onboard", id));
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

export type OnBoardStoreType = ReturnType<typeof useOnBoardStore>;