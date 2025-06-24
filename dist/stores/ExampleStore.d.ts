import { Firestore, Timestamp } from 'firebase/firestore';
import { Ref } from 'vue';
export interface ExampleRecord {
    id: string;
    name: string;
    createdAt?: Timestamp;
}
export declare const useExampleStore: import('pinia').StoreDefinition<"example", Pick<{
    records: Ref<ExampleRecord[], ExampleRecord[]>;
    init: (injectedDb: Firestore) => void;
    readRecords: () => Promise<void>;
    createRecord: (record: Omit<ExampleRecord, "id">) => Promise<void>;
    updateRecord: (record: ExampleRecord) => Promise<void>;
    deleteRecord: (id: string) => Promise<void>;
}, "records">, Pick<{
    records: Ref<ExampleRecord[], ExampleRecord[]>;
    init: (injectedDb: Firestore) => void;
    readRecords: () => Promise<void>;
    createRecord: (record: Omit<ExampleRecord, "id">) => Promise<void>;
    updateRecord: (record: ExampleRecord) => Promise<void>;
    deleteRecord: (id: string) => Promise<void>;
}, never>, Pick<{
    records: Ref<ExampleRecord[], ExampleRecord[]>;
    init: (injectedDb: Firestore) => void;
    readRecords: () => Promise<void>;
    createRecord: (record: Omit<ExampleRecord, "id">) => Promise<void>;
    updateRecord: (record: ExampleRecord) => Promise<void>;
    deleteRecord: (id: string) => Promise<void>;
}, "init" | "readRecords" | "createRecord" | "updateRecord" | "deleteRecord">>;
export type ExampleStoreType = ReturnType<typeof useExampleStore>;
