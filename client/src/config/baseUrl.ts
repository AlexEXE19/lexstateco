// Build API base URL from env with safe fallbacks (no trailing double colons)
const rawHost = import.meta.env.VITE_API_HOST?.toString().trim();
const port = import.meta.env.VITE_API_PORT?.toString().trim();

// Ensure host has protocol; fallback to http:// if missing
const normalizedHost = rawHost
  ? /^https?:\/\//i.test(rawHost)
    ? rawHost.replace(/\/$/, "")
    : `http://${rawHost.replace(/\/$/, "")}`
  : undefined;

const baseURL = normalizedHost
  ? port
    ? `${normalizedHost.replace(/:$/, "")}:${port}`
    : normalizedHost
  : window.location.origin.replace(/\/$/, "");

// console.log("API baseURL:", baseURL);
export default baseURL;
