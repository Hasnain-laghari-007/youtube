import axios from "axios";

const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL,
  withCredentials: true,
});

let refreshPromise = null;

api.interceptors.response.use(
  (response) => response,

  async function (error) {
    const originalRequest = error.config;
    const isRefreshCall = originalRequest?.url?.includes(
      "/refresh-access-token",
    );

    if (
      error.response?.status === 401 &&
      !originalRequest._retry &&
      !isRefreshCall
    ) {
      originalRequest._retry = true;

      try {
        // if refreshPromise is null then make a request
        if (!refreshPromise) {
          refreshPromise = api
            .post("/users/refresh-access-token")
            .finally(() => {
              refreshPromise = null;
            });
        }
        await refreshPromise;
      } catch (refreshError) {
        return Promise.reject(refreshError);
      }

      return api(originalRequest);
    }

    return Promise.reject(error);
  },
);
export { api };
