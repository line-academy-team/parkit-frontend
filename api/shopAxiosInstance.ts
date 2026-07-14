import { create } from "axios";
import { shopAuthStore } from "@/stores/auth/shopAuthStore";

const BASE_URL = process.env.EXPO_PUBLIC_API_BASE_URL || "";

const shopApi = create({
    baseURL: BASE_URL,
    timeout: 3000,
    withCredentials: true,
});

shopApi.interceptors.request.use(config => {
    const token = shopAuthStore.getState().token;

    if (token) {
        config.headers.Authorization = `Bearer ${token}`;
    }

    return config;
});

shopApi.interceptors.response.use(
    response => response,
    error => {
        if (error.response?.status === 401) {
            shopAuthStore.getState().logout();
        }

        return Promise.reject(error);
    },
);

export default shopApi;
