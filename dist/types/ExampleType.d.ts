import { Timestamp } from 'firebase/firestore';
export interface ExampleType {
    id: string;
    name: string;
    createdAt?: Timestamp;
}
