import { View } from "react-native";
import { Slot } from "expo-router";

function AdminLayout() {
    return (
        <View className={"flex-1"}>
            <View>
                <Slot />
            </View>
        </View>
    );
}

export default AdminLayout;
