import Dexie, { type EntityTable } from "dexie";

export interface Case {
  id: number;
  name: string;
  category: string;
  status: string;
  createdAt: string;
  updatedAt: string;
}

export interface Observation {
  id: number;
  caseId: number;
  date: string;
  description: string;
  childInfo: string;
  signsChecked: string[];
  concernLevel: string;
  createdAt: string;
}

const db = new Dexie("SentinelDB") as Dexie & {
  cases: EntityTable<Case, "id">;
  observations: EntityTable<Observation, "id">;
};

db.version(2).stores({
  cases: "++id, status, updatedAt, createdAt",
  observations: "++id, caseId, date, createdAt",
});

export { db };
