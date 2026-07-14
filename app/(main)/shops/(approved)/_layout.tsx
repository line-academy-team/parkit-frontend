import { View } from "react-native";
import MainFooter from "@/components/layouts/main/MainFooter";
import { Redirect, Stack, Slot } from "expo-router";
import { shopAuthStore } from "@/stores/auth/shopAuthStore";

const getStatusPath = (status: string) => {
    switch (status) {
        case "PENDING":
            return "/shops/status/pending";

        case "REJECTED":
            return "/shops/status/rejected";

        case "SUSPENDED":
            return "/shops/status/suspended";

        default:
            return "/auth/login";
    }
};

function ShopLayout() {
    const shop = shopAuthStore(state => state.shop);
    console.log(shop);
    if (!shop) {
        return null;
    }

    if (shop.status !== "APPROVED") {
        // @ts-ignore
        return <Redirect href={getStatusPath(shop.status)} />;
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
