/** Abuse category classification. */
export type Category = "physical" | "emotional" | "sexual" | "neglect";

/** Whether a sign is physical (visible) or behavioral. */
export type SignType = "physical" | "behavioral";

/** Sign severity level based on clinical guidelines. */
export type Severity = "mild" | "moderate" | "severe";

/** A checklist sign sourced from official child protection guidelines. */
export interface Sign {
  id: string;
  type: SignType;
  text: string;
  severity: Severity;
}
