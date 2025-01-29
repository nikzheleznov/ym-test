import axios from "axios";
import router from "@/router";

const axiosInstance = axios.create({
  baseURL: import.meta.env.VITE_API_BASE_URL || "https://cinema-api-test.y-media.io/v1",
  timeout: 20000,
});

axiosInstance.defaults.headers.common["Accept"] = "application/json";
axiosInstance.defaults.headers.post["Content-Type"] = "application/json";

axiosInstance.interceptors.request.use(
  (config) => {
    return config;
  },
  (error) => Promise.reject(error)
);

axiosInstance.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.code === "ECONNABORTED" || error.message.includes("timeout")) {
      router.push("/500");
    } else if (error.response) {
      const { status } = error.response;
      switch (status) {
        case 401:
          router.push("/login");
          break;
        case 404:
          router.push("/404");
          break;
        case status >= 500:
          router.push("/500");
          break;
        default:
          break;
      }
    }
    return Promise.reject(error);
  }
);

export default axiosInstance;
