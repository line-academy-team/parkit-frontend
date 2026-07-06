import { View } from "react-native";
import { Slot } from "expo-router";

function AdminLayout() {
    return (
        <View>
            <View>
                <Slot />
            </View>
        </View>
    );
}

export default AdminLayout;
