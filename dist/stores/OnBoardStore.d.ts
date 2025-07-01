import { Firestore } from 'firebase/firestore';
import { Ref } from 'vue';
import { OnBoardType } from '../types/OnBoardType';
export declare const useOnBoardStore: import('pinia').StoreDefinition<"onboard", Pick<{
    records: Ref<OnBoardType[], OnBoardType[]>;
    init: (injectedDb: Firestore) => void;
    readRecords: () => Promise<void>;
    createRecord: (record: Omit<OnBoardType, "id">) => Promise<void>;
    updateRecord: (record: OnBoardType) => Promise<void>;
    deleteRecord: (id: string) => Promise<void>;
}, "records">, Pick<{
    records: Ref<OnBoardType[], OnBoardType[]>;
    init: (injectedDb: Firestore) => void;
    readRecords: () => Promise<void>;
    createRecord: (record: Omit<OnBoardType, "id">) => Promise<void>;
    updateRecord: (record: OnBoardType) => Promise<void>;
    deleteRecord: (id: string) => Promise<void>;
}, never>, Pick<{
    records: Ref<OnBoardType[], OnBoardType[]>;
    init: (injectedDb: Firestore) => void;
    readRecords: () => Promise<void>;
    createRecord: (record: Omit<OnBoardType, "id">) => Promise<void>;
    updateRecord: (record: OnBoardType) => Promise<void>;
    deleteRecord: (id: string) => Promise<void>;
}, "init" | "readRecords" | "createRecord" | "updateRecord" | "deleteRecord">>;
export type OnBoardStoreType = ReturnType<typeof useOnBoardStore>;
