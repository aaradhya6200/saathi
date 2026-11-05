export type ApiResult<T> =
  | { ok: true; data: T }
  | { ok: false; errors: Record<string, string>; error?: string };

/** POST JSON to one of our API routes and normalise the response for forms. */
export async function postJson<T>(url: string, body: unknown): Promise<ApiResult<T>> {
  try {
    const res = await fetch(url, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(body),
    });
    const json = await res.json().catch(() => ({}));
    if (res.ok) return { ok: true, data: json as T };
    return { ok: false, errors: json.errors ?? {}, error: json.error };
  } catch {
    return { ok: false, errors: {}, error: "Couldn’t reach the server. Check your connection and try again." };
  }
}
