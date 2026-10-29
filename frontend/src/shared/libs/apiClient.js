import axios from "axios";

const useMocks = process.env.NODE_ENV === "development" && process.env.REACT_APP_USE_MSW === "true";

const axiosInstance = axios.create({
  baseURL: useMocks ? "" : process.env.REACT_APP_API_URL || "http://localhost:8000/api",
  timeout: 10000,
  withCredentials: false,
});

axiosInstance.interceptors.request.use((config) => {
  const token = localStorage.getItem("access_token");
  if (token) {
    config.headers = config.headers || {};
    config.headers.Authorization = "Bearer " + token;
  }
  const isFormData = config.data instanceof FormData;
  if (isFormData) {
    delete config.headers?.["Content-Type"];
  } else if (config.headers && !config.headers["Content-Type"]) {
    config.headers["Content-Type"] = "application/json";
  }
  return config;
});

axiosInstance.interceptors.response.use(
  (res) => res,
  async (error) => {
    const originalRequest = error.config;
    if (error.response?.status === 401 && !originalRequest._retry) {
      originalRequest._retry = true;
      const refresh = localStorage.getItem("refresh_token");
      if (!refresh) {
        localStorage.removeItem("access_token");
        localStorage.removeItem("refresh_token");
        window.location.href = "/authentication/sign-in";
        return Promise.reject(error);
      }
      try {
        const { data } = await axiosInstance.post("/refresh", { refresh_token: refresh });
        const newAccessToken = data.data.access_token;
        localStorage.setItem("access_token", newAccessToken);
        originalRequest.headers.Authorization = "Bearer " + newAccessToken;
        return axiosInstance(originalRequest);
      } catch (refreshError) {
        localStorage.removeItem("access_token");
        localStorage.removeItem("refresh_token");
        window.location.href = "/authentication/sign-in";
        return Promise.reject(refreshError);
      }
    }
    return Promise.reject(error);
  }
);
export default axiosInstance;
