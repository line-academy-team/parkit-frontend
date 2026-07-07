import { shopAuthStore } from "@/stores/auth/shopAuthStore";
import { useRouter } from "expo-router";
import { Image, ScrollView, Text, View } from "react-native";
import Title from "@/components/common/title/Title";
import parkingIcon from "@/assets/images/parking.png";
import { twMerge } from "tailwind-merge";
import Button from "@/components/common/button/Button";

function ShopStatusPage() {
    const logout = shopAuthStore(state => state.logout);
    const router = useRouter();

    const shop = shopAuthStore(state => state.shop);

    if (!shop) {
        return null;
    }

    const onLogout = () => {
        logout();
        router.push("/");
    };

    const statusPress = () => {
        if (shop?.status === "PENDING") {
            router.push("/shop/status");
        } else {
            router.push("/");
        }
    };

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

                    <Text
                        className={twMerge(
                            "font-pretendard-bold mt-7 text-2xl",
                            shop?.status === "REJECTED" ? "text-brand-danger" : "text-brand-navy",
                        )}>
                        {shop?.status === "PENDING"
                            ? "상점 승인 대기 중입니다"
                            : shop?.status === "REJECTED"
                              ? "상점 등록이 거절되었습니다"
                              : "서비스 이용이 정지되었습니다"}
                    </Text>

                    <Text
                        className={twMerge("text-brand-txt-sub mt-3 text-center ", [
                            "font-pretendard",
                            "text-[15px]",
                            "leading-[22px]",
                            "tracking-wider",
                        ])}>
                        {shop?.status === "PENDING"
                            ? "관리자가 등록하신 상점 정보를 검토하고 있습니다.\n승인이 완료된 후 서비스를 이용할 수 있습니다."
                            : shop?.status === "REJECTED"
                              ? "등록하신 상점 정보를 승인할 수 없습니다.\n자세한 내용은 관리자에게 문의해주세요."
                              : "현재 계정으로 주차 할인 서비스를 이용할 수 없습니다.\n자세한 내용은 관리자에게 문의해 주세요."}
                    </Text>

                    <View
                        className={twMerge(
                            ["w-[372px]", "items-center", "justify-center", "mt-7"],
                            "rounded-xl",
                            shop?.status === "PENDING"
                                ? "bg-brand-accent"
                                : shop?.status === "REJECTED"
                                  ? "bg-brand-danger"
                                  : "bg-brand-surface",
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
                                {shop?.status === "PENDING"
                                    ? "승인 대기"
                                    : shop?.status === "REJECTED"
                                      ? "승인 거절"
                                      : "이용 정지"}
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
                                    "text-brand-txt-main font-pretendard-medium mr-2.5",
                                    "p-4 text-[15px]",
                                )}>
                                {shop?.createdAt &&
                                    new Date(shop.createdAt).toLocaleString().slice(0, 10)}
                            </Text>
                        </View>
                    </View>

                    <Button
                        variant={"contained"}
                        color={"navy"}
                        className={"mt-7"}
                        onPress={statusPress}>
                        {shop?.status === "PENDING" ? "승인 상태 다시 확인하기" : "메인으로"}
                    </Button>
                    <Button variant={"text"} onPress={onLogout} className={"mt-1"}>
                        로그아웃
                    </Button>
                </View>
            </View>
        </ScrollView>
    );
}

export default ShopStatusPage;
