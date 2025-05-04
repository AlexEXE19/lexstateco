// Generate prefix URL with hostname and port for working with the API
const baseURL = `${import.meta.env.VITE_API_HOST}:${
  import.meta.env.VITE_API_PORT
}`;
export default baseURL;
