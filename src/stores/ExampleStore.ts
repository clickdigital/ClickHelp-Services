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

export interface ExampleRecord {
  id: string;
  name: string;
  createdAt?: Timestamp;
  // Add your other fields here
}

export const useExampleStore = defineStore("example", () => {
  const records: Ref<ExampleRecord[]> = ref([]);  
  let db: Firestore | null = null;

  const init = (injectedDb: Firestore) => {
    db = injectedDb;
  };

  const readRecords = async () => {
    if (!db) throw new Error("Firestore not initialized");
    const snapshot = await getDocs(collection(db, "example"));
    records.value = snapshot.docs.map((doc) => ({
      id: doc.id,
      ...(doc.data() as Omit<ExampleRecord, "id">),
    }));
  };

  const createRecord = async (record: Omit<ExampleRecord, "id">) => {
    if (!db) throw new Error("Firestore not initialized");
    const refDoc = doc(collection(db, "example"));
    await setDoc(refDoc, record);
    await readRecords();
  };

  const updateRecord = async (record: ExampleRecord) => {
    if (!db) throw new Error("Firestore not initialized");
    const refDoc = doc(db, "example", record.id);
    const { id, ...data } = record;
    await updateDoc(refDoc, data); // ✅ only updates the actual Firestore fields
    await readRecords();
  };

  const deleteRecord = async (id: string) => {
    if (!db) throw new Error("Firestore not initialized");
    await deleteDoc(doc(db, "example", id));
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

export type ExampleStoreType = ReturnType<typeof useExampleStore>;