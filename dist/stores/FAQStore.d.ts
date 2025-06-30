import { Firestore } from 'firebase/firestore';
import { FAQ } from '../types/FAQ';
export declare const useFAQStore: import('pinia').StoreDefinition<"faq", Pick<{
    faqs: import('vue').Ref<{
        id?: string;
        content: string;
        title: string;
        expiry: string;
        subject: string;
    }[], FAQ[] | {
        id?: string;
        content: string;
        title: string;
        expiry: string;
        subject: string;
    }[]>;
    init: (injectedDb: Firestore) => void;
    readRecords: () => Promise<void>;
}, "faqs">, Pick<{
    faqs: import('vue').Ref<{
        id?: string;
        content: string;
        title: string;
        expiry: string;
        subject: string;
    }[], FAQ[] | {
        id?: string;
        content: string;
        title: string;
        expiry: string;
        subject: string;
    }[]>;
    init: (injectedDb: Firestore) => void;
    readRecords: () => Promise<void>;
}, never>, Pick<{
    faqs: import('vue').Ref<{
        id?: string;
        content: string;
        title: string;
        expiry: string;
        subject: string;
    }[], FAQ[] | {
        id?: string;
        content: string;
        title: string;
        expiry: string;
        subject: string;
    }[]>;
    init: (injectedDb: Firestore) => void;
    readRecords: () => Promise<void>;
}, "init" | "readRecords">>;
export type FAQStoreType = ReturnType<typeof useFAQStore>;
