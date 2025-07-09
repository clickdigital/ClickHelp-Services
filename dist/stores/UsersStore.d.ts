import { Firestore } from 'firebase/firestore';
import { Ref } from 'vue';
import { UsersType } from '../types/UsersType';
export declare const useUsersStore: import('pinia').StoreDefinition<"users", Pick<{
    records: Ref<UsersType[], UsersType[]>;
    init: (injectedDb: Firestore) => void;
    readRecords: () => Promise<void>;
    createRecord: (record: Omit<UsersType, "id">) => Promise<void>;
    updateRecord: (record: UsersType) => Promise<void>;
    deleteRecord: (id: string) => Promise<void>;
}, "records">, Pick<{
    records: Ref<UsersType[], UsersType[]>;
    init: (injectedDb: Firestore) => void;
    readRecords: () => Promise<void>;
    createRecord: (record: Omit<UsersType, "id">) => Promise<void>;
    updateRecord: (record: UsersType) => Promise<void>;
    deleteRecord: (id: string) => Promise<void>;
}, never>, Pick<{
    records: Ref<UsersType[], UsersType[]>;
    init: (injectedDb: Firestore) => void;
    readRecords: () => Promise<void>;
    createRecord: (record: Omit<UsersType, "id">) => Promise<void>;
    updateRecord: (record: UsersType) => Promise<void>;
    deleteRecord: (id: string) => Promise<void>;
}, "init" | "readRecords" | "createRecord" | "updateRecord" | "deleteRecord">>;
export type UsersStoreType = ReturnType<typeof useUsersStore>;
