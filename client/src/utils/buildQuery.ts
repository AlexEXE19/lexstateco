export const buildQuery = (params: Record<string, string>) => {
  return Object.entries(params)
    .filter(([, val]) => val)
    .map(([key, val]) => `${key}=${encodeURIComponent(val)}`)
    .join("&");
};
