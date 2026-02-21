/** A documented case being monitored for potential child abuse. */
export interface Case {
  id: number;
  name: string;
  category: string;
  status: string;
  createdAt: string;
  updatedAt: string;
}

/** A single observation recorded within a case, capturing what was seen at a point in time. */
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
