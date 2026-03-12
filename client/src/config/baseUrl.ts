// Build API base URL from env with safe fallbacks (no trailing double colons)
const host = import.meta.env.VITE_API_HOST?.toString().replace(/\/$/, "");
const port = import.meta.env.VITE_API_PORT?.toString().trim();

const baseURL = host
  ? port
    ? `${host}:${port}`
    : host
  : window.location.origin.replace(/\/$/, "");

export default baseURL;
