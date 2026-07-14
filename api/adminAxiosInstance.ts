import { create } from "axios";
import { adminAuthStore } from "@/stores/auth/adminAuthStore";

const BASE_URL = process.env.EXPO_PUBLIC_API_BASE_URL || "";

const adminApi = create({
    baseURL: BASE_URL,
    timeout: 3000,
    withCredentials: true,
});

adminApi.interceptors.request.use(config => {
    const token = adminAuthStore.getState().token;

    if (token) {
        config.headers.Authorization = `Bearer ${token}`;
    }

    return config;
});

adminApi.interceptors.response.use(
    response => response,
    error => {
        if (error.response?.status === 401) {
            adminAuthStore.getState().logout();
        }

        return Promise.reject(error);
    },
);

export default adminApi;
