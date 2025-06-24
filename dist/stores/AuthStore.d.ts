import { User } from 'firebase/auth';
export declare const useAuthStore: import('pinia').StoreDefinition<"AuthStore", Pick<{
    storName: string;
    user: import('vue').Ref<{
        readonly emailVerified: boolean;
        readonly isAnonymous: boolean;
        readonly metadata: {
            readonly creationTime?: string;
            readonly lastSignInTime?: string;
        };
        readonly providerData: {
            readonly displayName: string | null;
            readonly email: string | null;
            readonly phoneNumber: string | null;
            readonly photoURL: string | null;
            readonly providerId: string;
            readonly uid: string;
        }[];
        readonly refreshToken: string;
        readonly tenantId: string | null;
        delete: () => Promise<void>;
        getIdToken: (forceRefresh?: boolean) => Promise<string>;
        getIdTokenResult: (forceRefresh?: boolean) => Promise<import('@firebase/auth').IdTokenResult>;
        reload: () => Promise<void>;
        toJSON: () => object;
        readonly displayName: string | null;
        readonly email: string | null;
        readonly phoneNumber: string | null;
        readonly photoURL: string | null;
        readonly providerId: string;
        readonly uid: string;
    }, User | {
        readonly emailVerified: boolean;
        readonly isAnonymous: boolean;
        readonly metadata: {
            readonly creationTime?: string;
            readonly lastSignInTime?: string;
        };
        readonly providerData: {
            readonly displayName: string | null;
            readonly email: string | null;
            readonly phoneNumber: string | null;
            readonly photoURL: string | null;
            readonly providerId: string;
            readonly uid: string;
        }[];
        readonly refreshToken: string;
        readonly tenantId: string | null;
        delete: () => Promise<void>;
        getIdToken: (forceRefresh?: boolean) => Promise<string>;
        getIdTokenResult: (forceRefresh?: boolean) => Promise<import('@firebase/auth').IdTokenResult>;
        reload: () => Promise<void>;
        toJSON: () => object;
        readonly displayName: string | null;
        readonly email: string | null;
        readonly phoneNumber: string | null;
        readonly photoURL: string | null;
        readonly providerId: string;
        readonly uid: string;
    }>;
    userProfile: import('vue').Ref<any, any>;
    error: import('vue').Ref<string, string>;
    sendMagicLink: (email: string, appName: string) => Promise<void>;
    validateMagicLink: (link: string, router?: any) => Promise<void>;
    signOut: (router?: any) => Promise<void>;
    onAuthStateChanged: (router?: any) => void;
    getUserProfile: import('vue').ComputedRef<any>;
    getUserRole: import('vue').ComputedRef<any>;
    getError: import('vue').ComputedRef<string>;
}, "storName" | "user" | "userProfile" | "error">, Pick<{
    storName: string;
    user: import('vue').Ref<{
        readonly emailVerified: boolean;
        readonly isAnonymous: boolean;
        readonly metadata: {
            readonly creationTime?: string;
            readonly lastSignInTime?: string;
        };
        readonly providerData: {
            readonly displayName: string | null;
            readonly email: string | null;
            readonly phoneNumber: string | null;
            readonly photoURL: string | null;
            readonly providerId: string;
            readonly uid: string;
        }[];
        readonly refreshToken: string;
        readonly tenantId: string | null;
        delete: () => Promise<void>;
        getIdToken: (forceRefresh?: boolean) => Promise<string>;
        getIdTokenResult: (forceRefresh?: boolean) => Promise<import('@firebase/auth').IdTokenResult>;
        reload: () => Promise<void>;
        toJSON: () => object;
        readonly displayName: string | null;
        readonly email: string | null;
        readonly phoneNumber: string | null;
        readonly photoURL: string | null;
        readonly providerId: string;
        readonly uid: string;
    }, User | {
        readonly emailVerified: boolean;
        readonly isAnonymous: boolean;
        readonly metadata: {
            readonly creationTime?: string;
            readonly lastSignInTime?: string;
        };
        readonly providerData: {
            readonly displayName: string | null;
            readonly email: string | null;
            readonly phoneNumber: string | null;
            readonly photoURL: string | null;
            readonly providerId: string;
            readonly uid: string;
        }[];
        readonly refreshToken: string;
        readonly tenantId: string | null;
        delete: () => Promise<void>;
        getIdToken: (forceRefresh?: boolean) => Promise<string>;
        getIdTokenResult: (forceRefresh?: boolean) => Promise<import('@firebase/auth').IdTokenResult>;
        reload: () => Promise<void>;
        toJSON: () => object;
        readonly displayName: string | null;
        readonly email: string | null;
        readonly phoneNumber: string | null;
        readonly photoURL: string | null;
        readonly providerId: string;
        readonly uid: string;
    }>;
    userProfile: import('vue').Ref<any, any>;
    error: import('vue').Ref<string, string>;
    sendMagicLink: (email: string, appName: string) => Promise<void>;
    validateMagicLink: (link: string, router?: any) => Promise<void>;
    signOut: (router?: any) => Promise<void>;
    onAuthStateChanged: (router?: any) => void;
    getUserProfile: import('vue').ComputedRef<any>;
    getUserRole: import('vue').ComputedRef<any>;
    getError: import('vue').ComputedRef<string>;
}, "getUserProfile" | "getUserRole" | "getError">, Pick<{
    storName: string;
    user: import('vue').Ref<{
        readonly emailVerified: boolean;
        readonly isAnonymous: boolean;
        readonly metadata: {
            readonly creationTime?: string;
            readonly lastSignInTime?: string;
        };
        readonly providerData: {
            readonly displayName: string | null;
            readonly email: string | null;
            readonly phoneNumber: string | null;
            readonly photoURL: string | null;
            readonly providerId: string;
            readonly uid: string;
        }[];
        readonly refreshToken: string;
        readonly tenantId: string | null;
        delete: () => Promise<void>;
        getIdToken: (forceRefresh?: boolean) => Promise<string>;
        getIdTokenResult: (forceRefresh?: boolean) => Promise<import('@firebase/auth').IdTokenResult>;
        reload: () => Promise<void>;
        toJSON: () => object;
        readonly displayName: string | null;
        readonly email: string | null;
        readonly phoneNumber: string | null;
        readonly photoURL: string | null;
        readonly providerId: string;
        readonly uid: string;
    }, User | {
        readonly emailVerified: boolean;
        readonly isAnonymous: boolean;
        readonly metadata: {
            readonly creationTime?: string;
            readonly lastSignInTime?: string;
        };
        readonly providerData: {
            readonly displayName: string | null;
            readonly email: string | null;
            readonly phoneNumber: string | null;
            readonly photoURL: string | null;
            readonly providerId: string;
            readonly uid: string;
        }[];
        readonly refreshToken: string;
        readonly tenantId: string | null;
        delete: () => Promise<void>;
        getIdToken: (forceRefresh?: boolean) => Promise<string>;
        getIdTokenResult: (forceRefresh?: boolean) => Promise<import('@firebase/auth').IdTokenResult>;
        reload: () => Promise<void>;
        toJSON: () => object;
        readonly displayName: string | null;
        readonly email: string | null;
        readonly phoneNumber: string | null;
        readonly photoURL: string | null;
        readonly providerId: string;
        readonly uid: string;
    }>;
    userProfile: import('vue').Ref<any, any>;
    error: import('vue').Ref<string, string>;
    sendMagicLink: (email: string, appName: string) => Promise<void>;
    validateMagicLink: (link: string, router?: any) => Promise<void>;
    signOut: (router?: any) => Promise<void>;
    onAuthStateChanged: (router?: any) => void;
    getUserProfile: import('vue').ComputedRef<any>;
    getUserRole: import('vue').ComputedRef<any>;
    getError: import('vue').ComputedRef<string>;
}, "sendMagicLink" | "validateMagicLink" | "signOut" | "onAuthStateChanged">>;
export type AuthStoreType = ReturnType<typeof useAuthStore>;
