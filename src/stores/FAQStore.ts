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

export interface FAQRecord {
  id?: string;
  content: string;
  expiry: string;
  subject: string;
  title: string;
}

export const useFAQStore = defineStore("FAQStore", () => {
  const records: Ref<FAQRecord[]> = ref([]);  
  let db: Firestore | null = null;

  const init = (injectedDb: Firestore) => {
    db = injectedDb;
  };

  const readRecords = async () => {
    if (!db) throw new Error("Firestore not initialized");
    const snapshot = await getDocs(collection(db, "faqs"));
    records.value = snapshot.docs.map((doc) => ({
      id: doc.id,
      ...(doc.data() as Omit<FAQRecord, "id">),
    }));
  };

  const createRecord = async (record: Omit<FAQRecord, "id">) => {
    if (!db) throw new Error("Firestore not initialized");
    const refDoc = doc(collection(db, "example"));
    await setDoc(refDoc, record);
    await readRecords();
  };

  const updateRecord = async (record: FAQRecord) => {
    if (!db) throw new Error("Firestore not initialized");
    const refDoc = doc(db, "faqs", record.id);
    const { id, ...data } = record;
    await updateDoc(refDoc, data); // ✅ only updates the actual Firestore fields
    await readRecords();
  };

  const deleteRecord = async (id: string) => {
    if (!db) throw new Error("Firestore not initialized");
    await deleteDoc(doc(db, "faqs", id));
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

export type FAQStoreType = ReturnType<typeof useFAQStore>;