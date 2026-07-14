import { View } from "react-native";
import { Slot } from "expo-router";
import MainFooter from "@/components/layouts/main/MainFooter";

function GuestLayout() {
    return (
        <View className={"flex-1"}>
            <View className={"flex-1"}>
                <Slot />
            </View>
            <MainFooter variant={"guest"} />
        </View>
    );
}

export default GuestLayout;
