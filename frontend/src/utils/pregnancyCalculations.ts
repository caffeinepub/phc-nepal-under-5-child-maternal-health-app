export function getGestationalAgeFromEDD(eddMs: number): { weeks: number; days: number } {
  const now = Date.now();
  const lmpMs = eddMs - 280 * 24 * 60 * 60 * 1000;
  const diffMs = now - lmpMs;
  const totalDays = Math.floor(diffMs / (24 * 60 * 60 * 1000));
  const weeks = Math.floor(totalDays / 7);
  const days = totalDays % 7;
  return { weeks: Math.max(0, weeks), days: Math.max(0, days) };
}

export function getTrimester(weeks: number): 1 | 2 | 3 {
  if (weeks <= 13) return 1;
  if (weeks <= 27) return 2;
  return 3;
}

export function getChildAgeFromDob(dobMs: number): { months: number; years: number; totalMonths: number } {
  const now = Date.now();
  const diffMs = now - dobMs;
  const totalMonths = Math.floor(diffMs / (30.44 * 24 * 60 * 60 * 1000));
  const years = Math.floor(totalMonths / 12);
  const months = totalMonths % 12;
  return { months, years, totalMonths };
}

export function formatDate(ms: number): string {
  const date = new Date(ms);
  return date.toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric' });
}

export function nanosToMs(ns: bigint): number {
  return Number(ns) / 1_000_000;
}

export function msToNanos(ms: number): bigint {
  return BigInt(Math.floor(ms)) * BigInt(1_000_000);
}
