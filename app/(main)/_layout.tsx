import { View } from "react-native";
import { Slot, usePathname } from "expo-router";
import MainHeader from "@/components/layouts/main/MainHeader";
import MainFooter from "@/components/layouts/main/MainFooter";

function MainLayout() {
    const pathname = usePathname();

    return (
        <View className={"flex-1"}>
            {pathname === "/" && <MainHeader />}
            <View className={"flex-1"}>
                <Slot />
            </View>
            <MainFooter />
        </View>
    );
}

export default MainLayout;
