import { Text, View } from "react-native";
import { twMerge } from "tailwind-merge";
import Button from "@/components/common/button/Button";
import { IoCarOutline } from "react-icons/io5";
import { LiaDollarSignSolid } from "react-icons/lia";
import { Link, useRouter } from "expo-router";

function HomeScreen() {
    const router = useRouter();

    return (
        <View className="flex-1 h-full bg-white items-center">
            <View className={twMerge(["justify-center"])}>
                <View className={twMerge(["my-6", "mx-18", "items-center"])}>
                    <Text
                        className={twMerge(["font-bold", "text-[26px]/[34px]", "text-brand-navy"])}>
                        주차를 더 편리하게
                    </Text>
                    <Text
                        className={twMerge(["font-bold", "text-[26px]/[34px]", "text-brand-navy"])}>
                        할인부터 정산까지 한 번에
                    </Text>
                    <View className={twMerge(["mt-6"])}>
                        <Text
                            className={twMerge([
                                "font-medium",
                                "text-[14px]/[28px]",
                                "text-brand-txt-sub",
                            ])}>
                            차량 번호로 간편하게 확인해 보세요!
                        </Text>
                    </View>
                </View>
            </View>
            <View className={"flex-row px-5 w-full max-w-5xl gap-3 items-center justify-center"}>
                <Button
                    color={"primary"}
                    variant={"contained"}
                    className={twMerge(["flex-1", "h-[132px]", "bg-brand-primary", "rounded-2xl"])}
                    onPress={() => {}}>
                    <View className={twMerge(["flex-col", "justify-center", "items-center"])}>
                        <IoCarOutline color={"#FFF4A3"} size={32} />
                        <Text className={"text-2xl text-white font-semibold"}>차량 조회</Text>
                    </View>
                </Button>
                <Button
                    color={"primary"}
                    variant={"contained"}
                    className={twMerge(["flex-1", "h-[132px]", "bg-brand-primary", "rounded-2xl"])}
                    onPress={() => {}}>
                    <View className={twMerge(["flex-col", "justify-center", "items-center"])}>
                        <LiaDollarSignSolid color={"#FFF4A3"} size={32} />
                        <Text className={"text-2xl text-white font-semibold"}>사전 정산</Text>
                    </View>
                </Button>
            </View>
            <View
                className={"flex-row mt-[48px] px-5 w-full max-w-5xl items-center justify-center"}>
                <Button
                    color={"navy"}
                    variant={"contained"}
                    className={twMerge(["flex-1", "h-[52px]", "bg-brand-navy", "rounded-2xl"])}
                    onPress={() => router.push("/auth/register")}>
                    <View>
                        <Text className={"text-2xl text-white font-semibold"}>상점 로그인</Text>
                    </View>
                </Button>
            </View>

            <Link href="/auth/register" asChild>
                <View className={twMerge(["flex-row mt-[18px] gap-2"])}>
                    <Text
                        className={twMerge([
                            "font-semibold",
                            "text-[16px]/[28px]",
                            "text-brand-txt-sub",
                        ])}>
                        아직 등록하지 않으셨나요?
                    </Text>
                    <Text
                        className={twMerge([
                            "font-semibold",
                            "text-[16px]/[28px]",
                            "text-brand-primary",
                        ])}>
                        상점 등록
                    </Text>
                </View>
            </Link>
            <View className="w-full max-w-5xl px-5 mt-12">
                <Text className="font-bold text-[20px] text-brand-txt-main mb-4">
                    주차 요금 안내
                </Text>
                <View className="w-full bg-brand-surface rounded-2xl p-6 gap-y-4">
                    <View className="flex-row justify-between items-center">
                        <Text className="font-semibold text-[18px] text-brand-txt-main">
                            기본 30분
                        </Text>
                        <Text className="font-bold text-[18px] text-brand-txt-main">1,000원</Text>
                    </View>

                    <View className="flex-row justify-between items-center">
                        <Text className="font-semibold text-[18px] text-brand-txt-main">
                            추가 10분마다
                        </Text>
                        <Text className="font-bold text-[18px] text-brand-txt-main">500원</Text>
                    </View>
                    <View className="flex-row justify-between items-center">
                        <Text className="font-semibold text-[18px] text-brand-txt-main">
                            하루 최대 금액
                        </Text>
                        <Text className="font-bold text-[18px] text-brand-txt-main">10,000원</Text>
                    </View>
                </View>
                <Text className="text-[14px] text-brand-txt-sub mt-3 pl-1">
                    * 할인 적용 후 최종 금액이 계산됩니다.
                </Text>
            </View>
        </View>
    );
}

export default HomeScreen;
