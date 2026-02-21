import Dexie, { type EntityTable } from "dexie";
import type { Case, Observation } from "../types";

export type { Case, Observation };

const db = new Dexie("SentinelDB") as Dexie & {
  cases: EntityTable<Case, "id">;
  observations: EntityTable<Observation, "id">;
};

db.version(2).stores({
  cases: "++id, status, updatedAt, createdAt",
  observations: "++id, caseId, date, createdAt",
});

export { db };
