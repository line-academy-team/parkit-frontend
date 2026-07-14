import { twMerge } from "tailwind-merge";
import { Image, Text, View } from "react-native";

function ShopPendingPage() {
    return (
        <>
            <View className={twMerge("h-14", "bg-brand-surface", "items-center justify-center")}>
                <Text className={"text-2xl font-pretendard-bold"}>상점 상태 확인</Text>
            </View>
            <View className={"mt-[72px] justify-center items-center flex-row"}>
                <Image
                    source={require("@/assets/images/logo.png")}
                    resizeMode="contain"
                    style={{ width: 48, height: 48 }}
                />
                <Text className={"ml-2 font-pretendard-bold text-[36px] text-brand-navy"}>
                    Park:
                </Text>
                <Text className={"font-pretendard-bold text-[36px] text-brand-primary"}>It</Text>
            </View>
            <Text
                className={twMerge(
                    "font-pretendard-bold text-[24px] text-brand-navy text-center",
                    "mt-[26px]",
                )}>
                상점 승인 대기 중입니다
            </Text>
        </>
    );
}

export default ShopPendingPage;
