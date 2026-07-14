import { View } from "react-native";
import MainFooter from "@/components/layouts/main/MainFooter";
import { Redirect, Slot } from "expo-router";
import { shopAuthStore } from "@/stores/auth/shopAuthStore";

function ShopLayout() {
    const { shop } = shopAuthStore();
    if (!shop) {
        return null;
    }

    if (shop.status !== "APPROVED") {
        return <Redirect href="/shops/status" />;
    }

    return (
        <View className={"flex-1"}>
            <View className={"flex-1"}>
                <Slot />
            </View>
            <MainFooter variant={"shop"} />
        </View>
    );
}

export default ShopLayout;
