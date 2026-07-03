import { twMerge } from "tailwind-merge";
import { Image, Pressable } from "react-native";
import { router } from "expo-router";

function BackButton() {
    return (
        <Pressable
            onPress={() => router.replace("/")}
            className={twMerge("h-14 w-14 absolute", "items-center justify-center", "left-0")}>
            <Image
                source={require("@/assets/images/register/backBtn.png")}
                resizeMode="contain"
                style={{ width: 16, height: 16 }}
            />
        </Pressable>
    );
}

export default BackButton;
