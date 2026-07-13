/**
 * cn — tiny className combiner.
 * Filters falsy values and joins class strings. Later duplicates win
 * for whitespace-separated tokens (last-wins keeps override behaviour predictable).
 */
export type ClassValue = string | number | null | false | undefined;

export function cn(...values: ClassValue[]): string {
  return values.filter(Boolean).join(' ').trim();
}

export default cn;
