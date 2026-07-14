import { useState } from "react";
import { View, Text, TextInput, ScrollView, Alert } from "react-native";
import { twMerge } from "tailwind-merge";
import Title from "@/components/common/title/Title";
import Button from "@/components/common/button/Button";
import { CiSearch } from "react-icons/ci";
import BackButton from "@/components/common/button/BackButton";
import parkingApi, { SearchCarResponse } from "@/api/anybody/parkingApi";
import { isAxiosError } from "axios";
import formattingUtil from "@/utils/formattingUtil";
import { useRouter } from "expo-router";

export default function CarSearchScreen() {
    const router = useRouter();
    const [searchQuery, setSearchQuery] = useState("");
    const [carData, setCarData] = useState<SearchCarResponse | null>(null);
    const [isLoading, setIsLoading] = useState(false);
    const [isNotFound, setIsNotFound] = useState(false);

    const handleSearch = async () => {
        if (searchQuery.trim().length < 4) {
            Alert.alert("알림", "차량 번호를 4자리 이상 입력해주세요.");
            return;
        }

        setIsLoading(true);
        setCarData(null);
        setIsNotFound(false);

        try {
            const result = await parkingApi.searchCar(searchQuery);
            setCarData(result);
        } catch (error) {
            if (isAxiosError(error)) {
                if (error.response?.status === 404) {
                    Alert.alert("조회 실패", "주차된 차량 정보가 없습니다.");
                    setIsNotFound(true);
                } else if (error.response?.status === 400) {
                    Alert.alert("오류", "올바른 차량 번호를 입력해주세요.");
                } else {
                    Alert.alert("오류", "서버와 통신 중 문제가 발생했습니다.");
                }
            } else {
                Alert.alert("오류", "알 수 없는 에러가 발생했습니다.");
            }
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <View className="flex-1 bg-white">
            <Title title="차량 조회" isCenter>
                <BackButton />
            </Title>

            <ScrollView className="flex-1 px-5" contentContainerStyle={{ paddingBottom: 40 }}>
                <View className="items-center mt-8 mb-8">
                    <Text className="text-xl font-pretendard-bold text-brand-navy mb-3">
                        내 차량을 조회해 보세요
                    </Text>
                    <Text className="text-sm font-pretendard-medium text-brand-txt-sub text-center leading-[22px]">
                        차량 번호를 입력하면{"\n"}
                        현재 주차 정보와 적용된 할인을{"\n"}
                        확인할 수 있습니다.
                    </Text>
                </View>

                <View className="mb-6">
                    <Text className="text-lg font-pretendard-bold text-brand-txt-main mb-3">
                        차량 번호
                    </Text>
                    <View
                        className={twMerge(
                            "flex-row items-center px-4 h-[52px]",
                            "bg-brand-surface rounded-xl border border-transparent",
                            "focus:border-brand-primary focus:bg-brand-bg",
                        )}>
                        <CiSearch size={24} color="#7D7E82" style={{ marginRight: 8 }} />
                        <TextInput
                            className="flex-1 font-pretendard-medium text-[16px] text-brand-txt-main outline-none"
                            placeholder="12가3456"
                            placeholderTextColor="#989899"
                            value={searchQuery}
                            onChangeText={setSearchQuery}
                            onSubmitEditing={handleSearch}
                            returnKeyType="search"
                        />
                    </View>
                </View>

                <Button
                    color="navy"
                    variant="contained"
                    shape="fullwidth"
                    onPress={handleSearch}
                    disabled={isLoading}>
                    차량 조회하기
                </Button>

                {isNotFound && !isLoading && (
                    <View className="mt-8 bg-brand-surface rounded-2xl p-10 items-center justify-center">
                        <Text className="text-lg font-pretendard-bold text-brand-danger mb-2">
                            조회된 차량이 없습니다
                        </Text>
                        <Text className="text-[15px] font-pretendard-medium text-brand-txt-sub text-center leading-[24px]">
                            현재 주차 중인 차량이 아니거나,{"\n"}
                            차량 번호가 잘못 입력되었습니다.{"\n"}
                            번호를 다시 한 번 확인해 주세요.
                        </Text>
                    </View>
                )}

                {carData && !isLoading && (
                    <View className="mt-8 bg-brand-bg border border-brand-primary rounded-2xl p-6">
                        <View className="items-center mb-6">
                            <Text className="text-2xl font-pretendard-bold text-brand-txt-main">
                                {carData.plateNumber}
                            </Text>
                            <Text className="text-sm font-pretendard-medium text-brand-primary mt-1">
                                {carData.location}
                            </Text>
                        </View>

                        <View className="gap-y-4 mb-6">
                            <View className="flex-row justify-between items-center">
                                <Text className="text-[16px] font-pretendard-medium text-brand-txt-sub">
                                    입차 시간
                                </Text>
                                <Text className="text-[16px] font-pretendard-bold text-brand-txt-main">
                                    {formattingUtil.formatEntryTime(carData.entryTime)}
                                </Text>
                            </View>

                            <View className="flex-row justify-between items-center">
                                <Text className="text-[16px] font-pretendard-medium text-brand-txt-sub">
                                    주차 시간
                                </Text>
                                <Text className="text-[16px] font-pretendard-bold text-brand-txt-main">
                                    {formattingUtil.formatDuration(carData.parkedMinutes)}
                                </Text>
                            </View>

                            <View className="flex-row justify-between items-center">
                                <Text className="text-[16px] font-pretendard-medium text-brand-txt-sub">
                                    총 할인 시간
                                </Text>
                                <Text className="text-[16px] font-pretendard-bold text-brand-primary">
                                    {formattingUtil.formatDuration(carData.discountMinutes)}
                                </Text>
                            </View>

                            <View className="flex-row justify-between items-center mt-2">
                                <Text className="text-[16px] font-pretendard-medium text-brand-txt-sub">
                                    예상 결제 금액
                                </Text>
                                <Text className="text-xl font-pretendard-bold text-brand-navy">
                                    {formattingUtil.formatCurrency(carData.expectedFee)}
                                </Text>
                            </View>
                        </View>

                        <Button
                            color="primary"
                            variant="contained"
                            shape="fullwidth"
                            onPress={() => router.push({
                                pathname: "/car/payment",
                                params: { plateNumber: carData.plateNumber }
                            })}>
                            사전 정산하기
                        </Button>
                    </View>
                )}
            </ScrollView>
        </View>
    );
}
