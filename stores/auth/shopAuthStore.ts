import { Shops } from "@/types/shop";
import { createJSONStorage, persist } from "zustand/middleware";
import { create } from "zustand";
import { Platform } from "react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";

interface ShopAuthState {
    isLoggedIn: boolean;
    token: string | null;

    shop: Shops | null;
    login: (shop: Shops, token: string) => void;
    logout: VoidFunction;
}

const storage =
    Platform.OS === "web"
        ? createJSONStorage(() => localStorage)
        : createJSONStorage(() => AsyncStorage);

export const shopAuthStore = create<ShopAuthState>()(
    persist(
        set => ({
            isLoggedIn: false,
            token: null,
            shop: null,
            login: (shop, token) => set({ isLoggedIn: true, token, shop }),
            logout: () => set({ isLoggedIn: false, token: null, shop: null }),
        }),
        { name: "shop-auth-storage", storage },
    ),
);
