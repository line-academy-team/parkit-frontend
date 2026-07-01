import { Admins } from "../../types/admin";
import { Platform } from "react-native";
import { createJSONStorage, persist } from "zustand/middleware/persist";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { createStore } from "zustand/vanilla";

export type AuthState = {
    isLoggedIn: boolean;
    token: string | null;
};

interface AdminAuthState extends AuthState {
    admin: Admins | null;
    login: (admin: Admins, token: string) => void;
    logout: VoidFunction;
}

export const storage =
    Platform.OS === "web"
        ? createJSONStorage(() => localStorage)
        : createJSONStorage(() => AsyncStorage);

export const AdminAuthStore = createStore<AdminAuthState>()(
    persist(
        set => ({
            isLoggedIn: false,
            token: null,
            admin: null,
            login: (admin, token) => set({ isLoggedIn: true, token, admin }),
            logout: () => set({ isLoggedIn: false, token: null, admin: null }),
        }),
        { name: "admin-auth-storage", storage},
    ),
);