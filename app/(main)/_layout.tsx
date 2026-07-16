import { View } from "react-native";
import { Slot } from "expo-router";

function MainLayout() {
    return (
        <View className={"flex-1"}>
            <Slot />
        </View>
    );
}

export default MainLayout;
