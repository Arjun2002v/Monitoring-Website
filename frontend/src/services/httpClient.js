// Single HTTP entry point: base URL, JSON, bearer token and error shape.
const BASE_URL = (import.meta.env.VITE_API_URL || "/api").replace(/\/$/, "");

let getToken = () => null;
let onUnauthorized = () => {};

/** Wired up once by AuthProvider so services stay framework-agnostic. */
export function configureHttpClient({ tokenGetter, unauthorizedHandler }) {
  getToken = tokenGetter;
  onUnauthorized = unauthorizedHandler;
}

export class ApiError extends Error {
  constructor(message, status, body) {
    super(message);
    this.status = status;
    this.body = body;
  }
}

export async function request(path, { method = "GET", body, query, auth = true } = {}) {
  const url = new URL(`${BASE_URL}${path}`, window.location.origin);
  if (query) {
    Object.entries(query).forEach(([key, value]) => {
      if (value !== undefined && value !== null && value !== "") url.searchParams.set(key, value);
    });
  }

  const headers = { Accept: "application/json" };
  if (body !== undefined) headers["Content-Type"] = "application/json";
  const token = auth ? getToken() : null;
  if (token) headers.Authorization = `Bearer ${token}`;

  let res;
  try {
    res = await fetch(url, {
      method,
      headers,
      body: body !== undefined ? JSON.stringify(body) : undefined,
    });
  } catch {
    throw new ApiError("Can't reach the server. Is the API running on port 5001?", 0);
  }

  const data = await res.json().catch(() => ({}));

  if (!res.ok) {
    if (res.status === 401 && auth) onUnauthorized();
    const message =
      typeof data?.message === "string" ? data.message : `Request failed (${res.status})`;
    throw new ApiError(message, res.status, data);
  }
  return data;
}
