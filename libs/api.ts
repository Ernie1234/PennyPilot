import axios from "axios";

const API_BASE_URL = process.env.EXPO_PUBLIC_API_URL;

// Create a basic axios instance without interceptors
const api = axios.create({
  baseURL: API_BASE_URL,
  timeout: 10000,
  headers: {
    "Content-Type": "application/json",
  },
});

// Create a function that will return an authenticated instance
export const getAuthenticatedApi = async (
  getToken: () => Promise<string | null>
) => {
  // Clone the base instance to avoid mutating the original
  const authenticatedApi = axios.create(api.defaults);

  // Add auth interceptor
  authenticatedApi.interceptors.request.use(async (config) => {
    try {
      const token = await getToken();
      if (token) {
        config.headers.Authorization = `Bearer ${token}`;
      }
    } catch (error) {
      console.error("Failed to get auth token:", error);
    }
    return config;
  });

  // Add error handling interceptor
  authenticatedApi.interceptors.response.use(
    (response) => response,
    (error) => {
      if (error.response) {
        console.error("API Error:", error.response.status, error.response.data);
      } else {
        console.error("Network Error:", error.message);
      }
      return Promise.reject(error);
    }
  );

  return authenticatedApi;
};

export default api;
