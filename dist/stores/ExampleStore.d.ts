import { Firestore } from 'firebase/firestore';
import { Ref } from 'vue';
import { ExampleType } from '../types/ExampleType';
export declare const useExampleStore: import('pinia').StoreDefinition<"example", Pick<{
    records: Ref<ExampleType[], ExampleType[]>;
    init: (injectedDb: Firestore) => void;
    readRecords: () => Promise<void>;
    createRecord: (record: Omit<ExampleType, "id">) => Promise<void>;
    updateRecord: (record: ExampleType) => Promise<void>;
    deleteRecord: (id: string) => Promise<void>;
}, "records">, Pick<{
    records: Ref<ExampleType[], ExampleType[]>;
    init: (injectedDb: Firestore) => void;
    readRecords: () => Promise<void>;
    createRecord: (record: Omit<ExampleType, "id">) => Promise<void>;
    updateRecord: (record: ExampleType) => Promise<void>;
    deleteRecord: (id: string) => Promise<void>;
}, never>, Pick<{
    records: Ref<ExampleType[], ExampleType[]>;
    init: (injectedDb: Firestore) => void;
    readRecords: () => Promise<void>;
    createRecord: (record: Omit<ExampleType, "id">) => Promise<void>;
    updateRecord: (record: ExampleType) => Promise<void>;
    deleteRecord: (id: string) => Promise<void>;
}, "init" | "readRecords" | "createRecord" | "updateRecord" | "deleteRecord">>;
export type ExampleStoreType = ReturnType<typeof useExampleStore>;
