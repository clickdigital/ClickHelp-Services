// src/types/ExampleType.ts (aliased as @/types/ExampleType)

import { Timestamp } from "firebase/firestore";

export interface ExampleType {
  id: string;
  name: string;
  createdAt?: Timestamp;
}