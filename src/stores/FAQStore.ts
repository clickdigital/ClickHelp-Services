// storeFAQs.ts
import { defineStore } from "pinia"
import { ref } from "vue"
import { collection, getDocs, Firestore } from "firebase/firestore"

import type { FAQ } from "@/types/FAQ"

let db: Firestore

export const useFAQStore = defineStore("faq", () => {
  const faqs = ref<FAQ[]>([])

  const init = (injectedDb: Firestore) => {
    db = injectedDb
  }

  const readRecords = async () => {
    if (!db) throw new Error("Firestore not initialized")

    const querySnapshot = await getDocs(collection(db, "faqs"))
    faqs.value = querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as FAQ))
  }

  return {
    faqs,
    init,
    readRecords
  }
})