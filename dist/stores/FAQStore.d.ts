import { Firestore } from 'firebase/firestore';
import { Ref } from 'vue';
import { FAQType } from '../types/FAQType';
export declare const useFAQStore: import('pinia').StoreDefinition<"faqs", Pick<{
    records: Ref<FAQType[], FAQType[]>;
    init: (injectedDb: Firestore) => void;
    readRecords: () => Promise<void>;
    createRecord: (record: Omit<FAQType, "id">) => Promise<void>;
    updateRecord: (record: FAQType) => Promise<void>;
    deleteRecord: (id: string) => Promise<void>;
}, "records">, Pick<{
    records: Ref<FAQType[], FAQType[]>;
    init: (injectedDb: Firestore) => void;
    readRecords: () => Promise<void>;
    createRecord: (record: Omit<FAQType, "id">) => Promise<void>;
    updateRecord: (record: FAQType) => Promise<void>;
    deleteRecord: (id: string) => Promise<void>;
}, never>, Pick<{
    records: Ref<FAQType[], FAQType[]>;
    init: (injectedDb: Firestore) => void;
    readRecords: () => Promise<void>;
    createRecord: (record: Omit<FAQType, "id">) => Promise<void>;
    updateRecord: (record: FAQType) => Promise<void>;
    deleteRecord: (id: string) => Promise<void>;
}, "init" | "readRecords" | "createRecord" | "updateRecord" | "deleteRecord">>;
export type FAQStoreType = ReturnType<typeof useFAQStore>;
