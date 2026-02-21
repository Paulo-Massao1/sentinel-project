export type Category = "physical" | "emotional" | "sexual" | "neglect";

export type SignType = "physical" | "behavioral";

export type Severity = "mild" | "moderate" | "severe";

export interface Sign {
  id: string;
  type: SignType;
  text: string;
  severity: Severity;
}
