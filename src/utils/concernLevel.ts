import type { Sign, Category, ConcernLevel } from "../types";

export function computeConcernLevel(
  checked: Set<string>,
  signMap: Map<string, Sign & { category: Category }>,
): ConcernLevel | null {
  if (checked.size === 0) return null;

  const checkedSigns = [...checked]
    .map((id) => signMap.get(id))
    .filter(Boolean) as (Sign & { category: Category })[];

  const severeCount = checkedSigns.filter((s) => s.severity === "severe").length;
  const moderateCount = checkedSigns.filter((s) => s.severity === "moderate").length;
  const hasSevereSexual = checkedSigns.some(
    (s) => s.category === "sexual" && s.severity === "severe",
  );
  const categoriesHit = new Set(checkedSigns.map((s) => s.category));

  // Emergency: 2+ severe signs OR any severe sexual sign
  if (severeCount >= 2 || hasSevereSexual) return "emergency";

  // High: 1 severe + 2 moderate, OR 4+ moderate, OR signs across 3+ categories
  if (
    (severeCount >= 1 && moderateCount >= 2) ||
    moderateCount >= 4 ||
    categoriesHit.size >= 3
  ) return "high";

  // Medium: 3+ signs of any severity, OR 2+ moderate signs
  if (checked.size >= 3 || moderateCount >= 2) return "medium";

  // Low: 1-2 mild/moderate signs
  return "low";
}
