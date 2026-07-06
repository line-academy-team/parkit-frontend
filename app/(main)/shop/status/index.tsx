import { shopAuthStore } from "@/stores/auth/shopAuthStore";
import { useRouter } from "expo-router";
import { Alert, Image, Platform, Pressable, ScrollView, Text, View } from "react-native";
import Title from "@/components/common/title/Title";
import parkingIcon from "@/assets/images/parking.png";
import { twMerge } from "tailwind-merge";
import { useEffect, useState } from "react";
import userApi from "@/api/user/userApi";
import { Shops } from "@/types/shop";

function ShopStatusPage() {
    const { logout } = shopAuthStore();
    const router = useRouter();
    const [shop, setShop] = useState<Shops>();

    useEffect(() => {
        const loadShop =  async () => {
            try {
                const result = await userApi.getShop();
                setShop(result);
            } catch (error) {
                console.log(error);
                const msg = "상점 정보를 불러오는데 실패했습니다.";
                if (Platform.OS === "web") {
                    alert(msg);
                    router.push("/auth/login");
                } else {
                    Alert.alert("오류", msg);
                    router.push("/auth/login");
                }
            }
        }
    }, [router]);

    return (
        <ScrollView>
            <View>
                <Title title={"상점 상태 확인"} isCenter />

                <View className="items-center justify-center m-auto">
                    <View className="flex-row items-center mt-24 gap-2">
                        <Image
                            source={parkingIcon}
                            style={{ width: 48, height: 48 }}
                            resizeMode="contain"
                        />
                        <Text className="text-4xl font-pretendard-bold text-brand-navy">
                            Park:<Text className="text-brand-primary">It</Text>
                        </Text>
                    </View>
                    <Text className="text-brand-navy font-pretendard-bold mt-7 text-2xl">
                        상점 승인 대기 중입니다
                    </Text>
                    <Text
                        className={twMerge("text-brand-txt-sub mt-3 text-center ", [
                            "font-pretendard",
                            "text-[15px]",
                            "leading-[22px]",
                            "tracking-normal",
                        ])}>
                        관리자가 등록하신 상점 정보를 검토하고 있습니다. <br />
                        승인이 완료된 수 서비스를 이용할 수 있습니다.
                    </Text>

                    <View
                        className={twMerge(
                            ["w-[372px]", "items-center", "justify-center", "mt-7"],
                            ["bg-brand-accent", "rounded-xl"],
                        )}>
                        <View className="justify-between flex-row w-full">
                            <Text
                                className={twMerge(
                                    "text-brand-txt-main font-pretendard-medium",
                                    "p-4 text-[15px]",
                                )}>
                                현재 상태
                            </Text>
                            <Text
                                className={twMerge(
                                    "text-brand-txt-main font-pretendard-medium mr-5",
                                    "p-4 text-[15px]",
                                )}>
                                승인 대기
                            </Text>
                        </View>
                        <View className="justify-between flex-row w-full">
                            <Text
                                className={twMerge(
                                    "text-brand-txt-main font-pretendard-medium",
                                    "p-4 text-[15px]",
                                )}>
                                신청일
                            </Text>
                            <Text
                                className={twMerge(
                                    "text-brand-txt-main font-pretendard-medium",
                                    "p-4 text-[15px]",
                                )}>
                                2026.07.03
                            </Text>
                        </View>
                    </View>
                    <Pressable
                        onPress={() => router.push("/")}
                        className="mt-7 justify-center items-center h-[52px] bg-brand-navy rounded-xl w-full">
                        <Text className="text-brand-bg font-pretendard-semibold text-[16px]">승인상태 다시 확인하기</Text>
                    </Pressable>
                    <Pressable onPress={logout} className={"mt-2 justify-center items-center h-[52px] rounded-xl w-full"}>
                        <Text className="text-brand-txt-sub font-pretendard-semibold text-[16px]">로그아웃</Text>
                    </Pressable>
                </View>
            </View>
        </ScrollView>
    );
}

export default ShopStatusPage;
