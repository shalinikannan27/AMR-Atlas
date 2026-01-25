/**
 * Centralized API client. All backend requests must use this module.
 * Fails loudly if VITE_API_BASE_URL is missing (required in production).
 */

const RAW = import.meta.env.VITE_API_BASE_URL;
const base = typeof RAW === "string" && RAW.trim() ? RAW.replace(/\/+$/, "") : null;

// Log API base URL for debugging (only in development or if explicitly enabled)
if (import.meta.env.DEV || import.meta.env.VITE_DEBUG_API) {
  console.log('[API] VITE_API_BASE_URL:', RAW);
  console.log('[API] Processed base URL:', base);
}

function getApiBase(): string {
  if (!base) {
    const errorMsg = "VITE_API_BASE_URL is not set. Configure it in .env and in Vercel environment variables for production.";
    console.error('[API] Configuration error:', errorMsg);
    console.error('[API] Current env.VITE_API_BASE_URL:', RAW);
    throw new Error(errorMsg);
  }
  return base;
}

export async function apiGet<T = unknown>(path: string): Promise<T> {
  const url = `${getApiBase()}${path.startsWith("/") ? path : `/${path}`}`;
  console.log('[API] GET request:', url);
  try {
    const res = await fetch(url);
    console.log('[API] Response status:', res.status, res.statusText);
    const body = await res.json().catch((err) => {
      console.error('[API] JSON parse error:', err);
      return {};
    });
    if (!res.ok) {
      const msg = (body && typeof body.error === "string") ? body.error : `Request failed: ${res.status}`;
      console.error('[API] Request failed:', msg, body);
      throw new Error(msg);
    }
    console.log('[API] Response data:', body);
    return body as T;
  } catch (err) {
    console.error('[API] Fetch error:', err);
    throw err;
  }
}

export async function apiPost<T = unknown>(path: string, payload: object): Promise<T> {
  const url = `${getApiBase()}${path.startsWith("/") ? path : `/${path}`}`;
  console.log('[API] POST request:', url, 'payload:', payload);
  try {
    const res = await fetch(url, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload),
    });
    console.log('[API] Response status:', res.status, res.statusText);
    const body = await res.json().catch((err) => {
      console.error('[API] JSON parse error:', err);
      return {};
    });
    if (!res.ok) {
      const msg = (body && typeof body.error === "string") ? body.error : `Request failed: ${res.status}`;
      console.error('[API] Request failed:', msg, body);
      throw new Error(msg);
    }
    console.log('[API] Response data:', body);
    return body as T;
  } catch (err) {
    console.error('[API] Fetch error:', err);
    throw err;
  }
}

/** Call once at app init to fail fast if API base is missing. */
export function ensureApiBase(): void {
  getApiBase();
}
