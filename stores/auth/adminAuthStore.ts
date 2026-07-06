import { Admins } from "../../types/admin";
import { Platform } from "react-native";
import { createJSONStorage, persist } from "zustand/middleware";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { create } from "zustand";

interface AdminAuthState {
    isLoggedIn: boolean;
    token: string | null;
    admin: Admins | null;

    login: (admin: Admins, token: string) => void;
    logout: VoidFunction;
}

export const storage =
    Platform.OS === "web"
        ? createJSONStorage(() => localStorage)
        : createJSONStorage(() => AsyncStorage);

export const adminAuthStore = create<AdminAuthState>()(
    persist(
        set => ({
            isLoggedIn: false,
            token: null,
            admin: null,
            login: (admin, token) => set({ isLoggedIn: true, token, admin }),
            logout: () => set({ isLoggedIn: false, token: null, admin: null }),
        }),
        { name: "admin-auth-storage", storage },
    ),
);