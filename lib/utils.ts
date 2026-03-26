import { clsx, type ClassValue } from 'clsx';
import { twMerge } from 'tailwind-merge';
import { formatDistanceToNow, format } from 'date-fns';

// ─── Tailwind class merging ───────────────────────────────────────────────────

export function cn(...inputs: ClassValue[]): string {
  return twMerge(clsx(inputs));
}

// ─── Date helpers ─────────────────────────────────────────────────────────────

export function timeAgo(date: string | Date): string {
  return formatDistanceToNow(new Date(date), { addSuffix: true });
}

export function formatDate(date: string | Date): string {
  return format(new Date(date), 'MMM d, yyyy');
}

// ─── Text helpers ─────────────────────────────────────────────────────────────

/** Truncate a string to maxLength, appending "…" if needed. */
export function truncate(text: string, maxLength: number): string {
  if (text.length <= maxLength) return text;
  return text.slice(0, maxLength).trimEnd() + '…';
}

/** Returns initials from a full name (max 2 characters). */
export function getInitials(name: string): string {
  return name
    .split(' ')
    .map((n) => n[0])
    .join('')
    .toUpperCase()
    .slice(0, 2);
}

// ─── URL helpers ──────────────────────────────────────────────────────────────

export function buildQuery(params: Record<string, string | number | boolean | undefined>): string {
  const q = new URLSearchParams();
  for (const [key, value] of Object.entries(params)) {
    if (value !== undefined && value !== '') q.set(key, String(value));
  }
  const str = q.toString();
  return str ? `?${str}` : '';
}

// ─── Validation helpers ───────────────────────────────────────────────────────

export function isValidEmail(email: string): boolean {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
}

// ─── Array helpers ────────────────────────────────────────────────────────────

/** Deduplicate an array of primitives while preserving order. */
export function unique<T>(arr: T[]): T[] {
  return [...new Set(arr)];
}

// ─── API fetch wrapper ────────────────────────────────────────────────────────

interface FetchOptions extends RequestInit {
  params?: Record<string, string | number | boolean | undefined>;
}

export async function apiFetch<T>(
  path: string,
  options: FetchOptions = {}
): Promise<T> {
  const { params, ...init } = options;
  const query = params ? buildQuery(params) : '';
  const res = await fetch(`/api${path}${query}`, {
    headers: { 'Content-Type': 'application/json', ...init.headers },
    ...init,
  });

  const json = await res.json();

  if (!res.ok) {
    throw new Error(json.error ?? json.message ?? 'Request failed');
  }

  return json;
}
