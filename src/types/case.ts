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
