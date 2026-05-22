/**
 * Client-side skill match — a faithful port of the Go backend's
 * `CalculateMatch` (internal/service/job_service.go). Used so job cards in
 * lists can show a match score without an extra request per job; the job
 * detail view still uses the server-computed value.
 *
 * It is a Jaccard index over lower-cased skill sets:
 *   percent = |user ∩ job| / |user ∪ job|
 */
export interface MatchResult {
  percent: number;
  matched: string[];
  missing: string[];
}

function toSet(skills: string[] | null | undefined): Set<string> {
  const set = new Set<string>();
  for (const raw of skills ?? []) {
    const s = raw.toLowerCase().trim();
    if (s) set.add(s);
  }
  return set;
}

export function calculateMatch(
  userSkills: string[] | null | undefined,
  jobSkills: string[] | null | undefined,
): MatchResult {
  const userSet = toSet(userSkills);
  const jobSet = toSet(jobSkills);

  const matched: string[] = [];
  const missing: string[] = [];
  for (const skill of jobSet) {
    if (userSet.has(skill)) matched.push(skill);
    else missing.push(skill);
  }

  const union = userSet.size + jobSet.size - matched.length;
  if (union === 0) return { percent: 0, matched: [], missing: [] };

  const percent = Math.floor((matched.length / union) * 100);
  return { percent, matched, missing };
}

export type MatchTier = 'excellent' | 'strong' | 'fair' | 'low';

export interface MatchTierMeta {
  tier: MatchTier;
  label: string;
  /** CSS color usable directly (reads a theme token). */
  color: string;
}

export function matchTier(percent: number): MatchTierMeta {
  if (percent >= 80)
    return { tier: 'excellent', label: 'Excellent fit', color: 'rgb(var(--c-accent))' };
  if (percent >= 55)
    return { tier: 'strong', label: 'Strong fit', color: 'rgb(var(--c-accent-deep))' };
  if (percent >= 30)
    return { tier: 'fair', label: 'Fair fit', color: 'rgb(var(--s-interview))' };
  return { tier: 'low', label: 'Low fit', color: 'rgb(var(--c-fg-faint))' };
}
