import { Firestore } from 'firebase/firestore';
import { Ref } from 'vue';
import { BlogType } from '../types/BlogType';
export declare const useBlogStore: import('pinia').StoreDefinition<"blog", Pick<{
    records: Ref<BlogType[], BlogType[]>;
    init: (injectedDb: Firestore) => void;
    readRecords: () => Promise<void>;
    createRecord: (record: Omit<BlogType, "id">) => Promise<void>;
    updateRecord: (record: BlogType) => Promise<void>;
    deleteRecord: (id: string) => Promise<void>;
}, "records">, Pick<{
    records: Ref<BlogType[], BlogType[]>;
    init: (injectedDb: Firestore) => void;
    readRecords: () => Promise<void>;
    createRecord: (record: Omit<BlogType, "id">) => Promise<void>;
    updateRecord: (record: BlogType) => Promise<void>;
    deleteRecord: (id: string) => Promise<void>;
}, never>, Pick<{
    records: Ref<BlogType[], BlogType[]>;
    init: (injectedDb: Firestore) => void;
    readRecords: () => Promise<void>;
    createRecord: (record: Omit<BlogType, "id">) => Promise<void>;
    updateRecord: (record: BlogType) => Promise<void>;
    deleteRecord: (id: string) => Promise<void>;
}, "init" | "readRecords" | "createRecord" | "updateRecord" | "deleteRecord">>;
export type BlogStoreType = ReturnType<typeof useBlogStore>;
