import axios from "axios";

/**
 * Shared Axios instance for talking to the bsuc-server REST API.
 * Base URL comes from NEXT_PUBLIC_API_URL (see .env.example).
 */
export const api = axios.create({
  baseURL: process.env.NEXT_PUBLIC_API_URL ?? "http://localhost:5000/api",
  headers: { "Content-Type": "application/json" },
});
