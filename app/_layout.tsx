import "../styles/global.css";

import { Slot } from "expo-router";
import { useFonts } from "expo-font";
import * as SplashScreen from "expo-splash-screen";
import { useEffect } from "react";
import { useThemeStore } from "@/stores/theme/useThemeStore";
import { SafeAreaProvider, SafeAreaView } from "react-native-safe-area-context";
import { StatusBar } from "expo-status-bar";
SplashScreen.preventAutoHideAsync().then(() => {});
export default function RootLayout() {

    const { theme } = useThemeStore();

    const [fontsLoaded, fontError] = useFonts({
        "Pretendard-Thin": require("@/assets/fonts/Pretendard-Thin.otf"),
        "Pretendard-ExtraLight": require("@/assets/fonts/Pretendard-ExtraLight.otf"),
        "Pretendard-Light": require("@/assets/fonts/Pretendard-Light.otf"),
        "Pretendard-Regular": require("@/assets/fonts/Pretendard-Regular.otf"),
        "Pretendard-Medium": require("@/assets/fonts/Pretendard-Medium.otf"),
        "Pretendard-SemiBold": require("@/assets/fonts/Pretendard-SemiBold.otf"),
        "Pretendard-Bold": require("@/assets/fonts/Pretendard-Bold.otf"),
        "Pretendard-ExtraBold": require("@/assets/fonts/Pretendard-ExtraBold.otf"),
        "Pretendard-Black": require("@/assets/fonts/Pretendard-Black.otf"),
    });

    // 기본 폰트 -> 적용할 폰트로 바뀌는 현상 막기
    useEffect(() => {
        if (fontsLoaded || fontError) {
            SplashScreen.hideAsync().then(() => {});
        }
    }, [fontsLoaded, fontError]);

    if (!fontsLoaded && !fontError) {
        return null;
    }


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
