import { Firestore } from 'firebase/firestore';
import { Ref } from 'vue';
export interface FAQRecord {
    id?: string;
    content: string;
    expiry: string;
    subject: string;
    title: string;
}
export declare const useFAQStore: import('pinia').StoreDefinition<"FAQStore", Pick<{
    records: Ref<FAQRecord[], FAQRecord[]>;
    init: (injectedDb: Firestore) => Promise<void>;
    readRecords: () => Promise<void>;
    createRecord: (record: Omit<FAQRecord, "id">) => Promise<void>;
    updateRecord: (record: FAQRecord) => Promise<void>;
    deleteRecord: (id: string) => Promise<void>;
}, "records">, Pick<{
    records: Ref<FAQRecord[], FAQRecord[]>;
    init: (injectedDb: Firestore) => Promise<void>;
    readRecords: () => Promise<void>;
    createRecord: (record: Omit<FAQRecord, "id">) => Promise<void>;
    updateRecord: (record: FAQRecord) => Promise<void>;
    deleteRecord: (id: string) => Promise<void>;
}, never>, Pick<{
    records: Ref<FAQRecord[], FAQRecord[]>;
    init: (injectedDb: Firestore) => Promise<void>;
    readRecords: () => Promise<void>;
    createRecord: (record: Omit<FAQRecord, "id">) => Promise<void>;
    updateRecord: (record: FAQRecord) => Promise<void>;
    deleteRecord: (id: string) => Promise<void>;
}, "init" | "readRecords" | "createRecord" | "updateRecord" | "deleteRecord">>;
export type FAQStoreType = ReturnType<typeof useFAQStore>;
