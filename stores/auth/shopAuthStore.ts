import { AuthState, storage } from "./adminAuthStore";
import { Shops } from "../../types/shop";
import { createStore } from "zustand/vanilla";
import { persist } from "zustand/middleware/persist";

interface ShopAuthStore extends AuthState {
    shop: Shops | null;
    login: (shop: Shops, token: string) => void;
    logout: VoidFunction;
}

export const ShopAuthStore = createStore<ShopAuthStore>()(
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