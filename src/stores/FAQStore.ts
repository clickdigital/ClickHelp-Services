// storeFAQs.ts
import { defineStore } from "pinia"
import { ref } from "vue"
import { collection, onSnapshot, Firestore } from "firebase/firestore"

import type { FAQ } from "@/types/FAQ"  //this is the datatypes used the bottom one is the storetype

let db: Firestore

export const useFAQStore = defineStore("faq", () => {
  const faqs = ref<FAQ[]>([])

  const init = (injectedDb: Firestore) => {
    db = injectedDb
  }

const readRecords = async () => {
  if (!db) throw new Error("Firestore not initialized")

  const colRef = collection(db, "faqs")

  // set up a listener
  onSnapshot(colRef, (snapshot) => {
    faqs.value = snapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data()
    } as FAQ))
  })
}

  return {
    faqs,
    init,
    readRecords
  }
})

export type FAQStoreType = ReturnType<typeof useFAQStore>;