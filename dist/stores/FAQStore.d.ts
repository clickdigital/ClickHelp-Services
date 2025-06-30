import { Firestore } from 'firebase/firestore';
export declare const useFAQStore: import('pinia').StoreDefinition<"faq", Pick<{
    faqs: import('vue').Ref<any, any>;
    init: (injectedDb: Firestore) => void;
    readRecords: () => Promise<void>;
}, "faqs">, Pick<{
    faqs: import('vue').Ref<any, any>;
    init: (injectedDb: Firestore) => void;
    readRecords: () => Promise<void>;
}, never>, Pick<{
    faqs: import('vue').Ref<any, any>;
    init: (injectedDb: Firestore) => void;
    readRecords: () => Promise<void>;
}, "init" | "readRecords">>;
