import axios from "axios";

/**
 * Shared Axios instance for talking to the bsuc-server REST API.
 * Base URL comes from NEXT_PUBLIC_API_URL (see .env.example).
 *
 * withCredentials is required so the httpOnly session cookie set by the API is
 * stored and sent back on subsequent requests.
 */
export const api = axios.create({
  baseURL: process.env.NEXT_PUBLIC_API_URL ?? "http://localhost:5000/api",
  headers: { "Content-Type": "application/json" },
  withCredentials: true,
});

/** Shape of an error response from the API. */
export type ApiError = {
  error: string;
  code?: string;
  /** Per-field validation messages, keyed by field name. */
  fields?: Record<string, string>;
};

/** Normalises an unknown thrown value into an ApiError. */
export function toApiError(err: unknown): ApiError {
  if (axios.isAxiosError(err)) {
    const data = err.response?.data as ApiError | undefined;
    if (data?.error) return data;
    return {
      error: err.code === "ERR_NETWORK"
        ? "Could not reach the server. Please try again."
        : "Something went wrong. Please try again.",
    };
  }
  return { error: "Something went wrong. Please try again." };
}
