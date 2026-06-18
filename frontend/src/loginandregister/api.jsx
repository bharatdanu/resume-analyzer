import axios from "axios";
import { toast } from "react-toastify";

export const api = axios.create({
    baseURL: "http://127.0.0.1:8000",
});

const authUrls = ["/gettoken/", "/refresh/", "/register/"];

api.interceptors.request.use((config) => {
    const token = localStorage.getItem("access");
    const isAuthRequest = authUrls.includes(config.url);

    if (token && !isAuthRequest) {
        config.headers.Authorization = `Bearer ${token}`;
    }

    return config;
});

api.interceptors.response.use(
    (response) => response,
    async (error) => {
        const originalRequest = error.config;
        const isAuthRequest = authUrls.includes(originalRequest?.url);

        if (isAuthRequest) {
            return Promise.reject(error);
        }

        if (error.response?.status === 401 && !originalRequest._retry) {
            originalRequest._retry = true;

            try {
                const refresh = localStorage.getItem("refresh");

                const res = await axios.post("http://127.0.0.1:8000/refresh/", {
                    refresh,
                });

                const newAccess = res.data.access;
                localStorage.setItem("access", newAccess);
                originalRequest.headers.Authorization = `Bearer ${newAccess}`;

                return api(originalRequest);
            } catch (err) {
                localStorage.removeItem("access");
                localStorage.removeItem("refresh");

                toast.error("Session expired! Please login again.");

                setTimeout(() => {
                    window.location.pathname = "/";
                }, 1500);

                return new Promise(() => {});
            }
        }

        return Promise.reject(error);
    }
);
