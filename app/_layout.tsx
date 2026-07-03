import { Slot } from "expo-router";
import "../styles/global.css";
import { useThemeStore } from "@/stores/theme/useThemeStore";
import { SafeAreaProvider, SafeAreaView } from "react-native-safe-area-context";
import { StatusBar } from "expo-status-bar";

export default function RootLayout() {
    const { theme } = useThemeStore();

    return (
        <SafeAreaProvider>
            <StatusBar
                style={
                    theme === "navy" || theme === "primary" || theme === "danger" ? "light" : "dark"
                }
            />

            <SafeAreaView className={"flex-1 bg-background-default"}>
                <Slot />
            </SafeAreaView>
        </SafeAreaProvider>
    );
}
