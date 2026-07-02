import { View } from "react-native";
import { Slot } from "expo-router";

function MainLayout() {
    return (
        <View>
            <View>
                <Slot />
            </View>
        </View>
    );
}

export default MainLayout;
