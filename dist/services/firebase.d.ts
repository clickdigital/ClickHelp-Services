import { FirebaseApp } from 'firebase/app';
import { Firestore } from 'firebase/firestore';
import { Auth } from 'firebase/auth';
declare let app: FirebaseApp;
declare let db: Firestore;
declare let auth: Auth;
export declare function initFirebase(config: {
    apiKey: string;
    authDomain: string;
    projectId: string;
    storageBucket: string;
    messagingSenderId?: string;
    appId: string;
    measurementId?: string;
}, options?: {
    useEmulator?: boolean;
}): void;
export { app, db, auth };
