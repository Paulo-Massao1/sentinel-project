import { useLiveQuery } from "dexie-react-hooks";
import { db, type Case, type Observation } from "../lib/db";

export type { Case, Observation };

export function useCases() {
  const cases = useLiveQuery(() =>
    db.cases.orderBy("updatedAt").reverse().toArray(),
  );

  async function createCase(
    name: string,
    category: string,
  ): Promise<number> {
    const now = new Date().toISOString();
    return db.cases.add({
      name,
      category,
      status: "monitoring",
      createdAt: now,
      updatedAt: now,
    });
  }

  async function addObservation(
    caseId: number,
    observation: Omit<Observation, "id" | "caseId" | "createdAt">,
  ): Promise<number> {
    const now = new Date().toISOString();
    const obsId = await db.observations.add({
      ...observation,
      caseId,
      createdAt: now,
    });
    await db.cases.update(caseId, { updatedAt: now });
    return obsId;
  }

  async function updateCaseStatus(
    caseId: number,
    status: string,
  ): Promise<void> {
    await db.cases.update(caseId, {
      status,
      updatedAt: new Date().toISOString(),
    });
  }

  async function deleteCase(caseId: number): Promise<void> {
    await db.transaction("rw", db.cases, db.observations, async () => {
      await db.observations.where("caseId").equals(caseId).delete();
      await db.cases.delete(caseId);
    });
  }

  async function deleteObservation(observationId: number): Promise<void> {
    await db.observations.delete(observationId);
  }

  return {
    cases: cases ?? [],
    createCase,
    addObservation,
    updateCaseStatus,
    deleteCase,
    deleteObservation,
  };
}

export function useCaseDetail(caseId: number | undefined) {
  const caseData = useLiveQuery(
    () => (caseId ? db.cases.get(caseId) : undefined),
    [caseId],
  );

  const observations = useLiveQuery(
    () =>
      caseId
        ? db.observations
            .where("caseId")
            .equals(caseId)
            .reverse()
            .sortBy("date")
        : [],
    [caseId],
  );

  const chronologicalObservations = useLiveQuery(
    () =>
      caseId
        ? db.observations.where("caseId").equals(caseId).sortBy("date")
        : [],
    [caseId],
  );

  return {
    caseData,
    observations: observations ?? [],
    chronologicalObservations: chronologicalObservations ?? [],
  };
}
