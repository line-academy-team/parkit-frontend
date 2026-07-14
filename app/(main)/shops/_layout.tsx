import { Redirect, Stack } from "expo-router";
import { useEffect, useState } from "react";
import { ActivityIndicator, View } from "react-native";
import { shopAuthStore } from "@/stores/auth/shopAuthStore";
import userApi from "@/api/user/userApi";

function ShopsLayout() {
    const isHydrated = shopAuthStore(state => state.isHydrated);
    const token = shopAuthStore(state => state.token);
    const shop = shopAuthStore(state => state.shop);
    const setShop = shopAuthStore(state => state.setShop);
    const logout = shopAuthStore(state => state.logout);

    const [isChecking, setIsChecking] = useState(true);

    useEffect(() => {
        if (!isHydrated) {
            return;
        }

        const checkShop = async () => {
            try {
                if (!token) {
                    logout();
                    console.log(1);
                    return;
                }

                const currentShop = await userApi.getMe();
                console.log(currentShop);
                setShop(currentShop);
            } catch (error) {
                logout();
            } finally {
                setIsChecking(false);
            }
        };

        checkShop().then(() => {});
    }, [isHydrated, token, setShop, logout]);

    if (!isHydrated || isChecking) {
        return (
            <View className="flex-1 items-center justify-center">
                <ActivityIndicator />
            </View>
        );
    }

    if (!token || !shop) {
        return <Redirect href="/auth/login" />;
    }

    return (
        <Stack
            screenOptions={{
                headerShown: false,
                contentStyle: {
                    backgroundColor: "#FFFFFF",
                },
            }}
        />
    );
}

export default ShopsLayout;
