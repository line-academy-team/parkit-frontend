import { Stack, useRouter } from "expo-router";
import { useEffect, useState } from "react";
import { ActivityIndicator, View } from "react-native";
import { shopAuthStore } from "@/stores/auth/shopAuthStore";
import userApi from "@/api/user/userApi";

function ShopsLayout() {
    const { isHydrated, token, setShop, logout } = shopAuthStore();
    const [isChecking, setIsChecking] = useState(true);
    const router = useRouter();

    useEffect(() => {
        if (!isHydrated) {
            return;
        }

        const checkShop = async () => {
            try {
                if (!token) {
                    logout();
                    router.replace("/auth/login");
                }

                const currentShop = await userApi.getMe();
                setShop(currentShop);
            } catch (error) {
                console.log(error);
                logout();
                router.replace("/auth/login");
            } finally {
                setIsChecking(false);
            }
        };

        checkShop().then(() => {});
    }, [isHydrated, token, setShop, logout, router]);

    if (!isHydrated || isChecking) {
        return (
            <View className="flex-1 items-center justify-center">
                <ActivityIndicator />
            </View>
        );
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
