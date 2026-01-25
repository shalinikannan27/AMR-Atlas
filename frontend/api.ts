/**
 * Centralized API client. All backend requests must use this module.
 * Fails loudly if VITE_API_BASE_URL is missing (required in production).
 */

const RAW = import.meta.env.VITE_API_BASE_URL;
const base = typeof RAW === "string" && RAW.trim() ? RAW.replace(/\/+$/, "") : null;

function getApiBase(): string {
  if (!base) {
    throw new Error(
      "VITE_API_BASE_URL is not set. Configure it in .env and in Vercel environment variables for production."
    );
  }
  return base;
}

export async function apiGet<T = unknown>(path: string): Promise<T> {
  const url = `${getApiBase()}${path.startsWith("/") ? path : `/${path}`}`;
  const res = await fetch(url);
  const body = await res.json().catch(() => ({}));
  if (!res.ok) {
    const msg = (body && typeof body.error === "string") ? body.error : `Request failed: ${res.status}`;
    throw new Error(msg);
  }
  return body as T;
}

export async function apiPost<T = unknown>(path: string, payload: object): Promise<T> {
  const url = `${getApiBase()}${path.startsWith("/") ? path : `/${path}`}`;
  const res = await fetch(url, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(payload),
  });
  const body = await res.json().catch(() => ({}));
  if (!res.ok) {
    const msg = (body && typeof body.error === "string") ? body.error : `Request failed: ${res.status}`;
    throw new Error(msg);
  }
  return body as T;
}

/** Call once at app init to fail fast if API base is missing. */
export function ensureApiBase(): void {
  getApiBase();
}
