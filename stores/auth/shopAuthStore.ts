import { Shops } from "@/types/shop";
import { createJSONStorage, persist } from "zustand/middleware";
import { create } from "zustand";
import { Platform } from "react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";

interface ShopAuthState {
    isHydrated: boolean;
    isLoggedIn: boolean;
    token: string | null;
    shop: Shops | null;

    login: (shop: Shops, token: string) => void;
    logout: VoidFunction;
    setShop: (shop: Shops) => void;
    setHydrated: (value: boolean) => void;
}

const storage =
    Platform.OS === "web"
        ? createJSONStorage(() => localStorage)
        : createJSONStorage(() => AsyncStorage);

export const shopAuthStore = create<ShopAuthState>()(
    persist(
        set => ({
            isHydrated: false,
            isLoggedIn: false,
            token: null,
            shop: null,

            login: (shop, token) =>
                set({
                    isLoggedIn: true,
                    token,
                    shop,
                }),

            logout: () =>
                set({
                    isLoggedIn: false,
                    token: null,
                    shop: null,
                }),

            setShop: shop =>
                set({
                    isLoggedIn: true,
                    shop,
                }),
            setHydrated: value =>
                set({
                    isHydrated: value,
                }),
        }),
        {
            name: "shop-auth-storage",
            storage,
            onRehydrateStorage: () => state => {
                state?.setHydrated(true);
            },
        },
    ),
);
