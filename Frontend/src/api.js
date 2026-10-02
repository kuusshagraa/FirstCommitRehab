import { auth } from "./firebase.js";

const apiBaseUrl = (import.meta.env.VITE_API_BASE_URL || "http://localhost:3000").replace(/\/$/, "");

export async function apiRequest(path, options = {}) {
  if (!auth?.currentUser) {
    throw new Error("Sign in before requesting Rehab AI data.");
  }

  const token = await auth.currentUser.getIdToken();
  const response = await fetch(`${apiBaseUrl}${path.startsWith("/") ? path : `/${path}`}`, {
    ...options,
    headers: {
      "Content-Type": "application/json",
      ...options.headers,
      Authorization: `Bearer ${token}`,
    },
  });

  const payload = await response.json().catch(() => null);
  if (!response.ok) {
    throw new Error(payload?.error?.message || `Rehab AI API request failed (${response.status}).`);
  }
  return payload;
}
