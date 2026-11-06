import { AGE_GROUPS, QUALIFICATIONS } from '@/lib/constants';

type Translate = (key: string) => string;

export function parseQualifications(stored: string | null): string[] {
  if (!stored) return [];
  const known: readonly string[] = QUALIFICATIONS;
  return stored
    .split(',')
    .map((v) => v.trim())
    .filter((v) => known.includes(v));
}

export function formatQualifications(stored: string | null, t: Translate): string {
  if (!stored) return '';
  const known: readonly string[] = QUALIFICATIONS;
  return stored
    .split(',')
    .map((v) => v.trim())
    .filter(Boolean)
    .map((v) => (known.includes(v) ? t(`qual.${v}`) : v))
    .join(', ');
}

export function ageGroupsFromRange(min: number, max: number | null): string[] {
  return AGE_GROUPS.filter(
    (g) => g.min <= (max ?? Infinity) && (g.max ?? Infinity) >= min
  ).map((g) => g.key);
}

export function rangeFromAgeGroups(keys: string[]): { min: number; max: number | null } | null {
  const groups = AGE_GROUPS.filter((g) => keys.includes(g.key));
  if (groups.length === 0) return null;
  const min = Math.min(...groups.map((g) => g.min));
  const max = groups.some((g) => g.max === null) ? null : Math.max(...groups.map((g) => g.max ?? 0));
  return { min, max };
}
