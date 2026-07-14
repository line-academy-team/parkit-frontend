import { useEffect, useState } from "react";
import { View, Text, ScrollView, Alert, ActivityIndicator, TextInput } from "react-native";
import { useLocalSearchParams, router } from "expo-router";
import { twMerge } from "tailwind-merge";
import Title from "@/components/common/title/Title";
import Button from "@/components/common/button/Button";
import { IoCarOutline } from "react-icons/io5";
import { CiSearch } from "react-icons/ci";
import { isAxiosError } from "axios";
import parkingApi, { SearchCarResponse } from "@/api/anybody/parkingApi";
import BackButton from "@/components/common/button/BackButton";
import formattingUtil from "@/utils/formattingUtil";

const calculateOriginalFee = (parkedMinutes: number) => {
    if (parkedMinutes === 0) return 0;
    if (parkedMinutes <= 30) return 1000;
    const extraMinutes = parkedMinutes - 30;
    const extraPeriods = Math.ceil(extraMinutes / 10);
    const fee = 1000 + extraPeriods * 500;
    return fee > 10000 ? 10000 : fee;
};

export default function CarPaymentScreen() {
    const { plateNumber: paramPlateNumber } = useLocalSearchParams<{ plateNumber?: string }>();

    const [searchQuery, setSearchQuery] = useState("");
    const [carData, setCarData] = useState<SearchCarResponse | null>(null);
    const [isLoading, setIsLoading] = useState(false);
    const [hasSearched, setHasSearched] = useState(false);
    const [isSubmitting, setIsSubmitting] = useState(false);

    useEffect(() => {
        if (paramPlateNumber) {
            setSearchQuery(paramPlateNumber);
            fetchCarData(paramPlateNumber).then(() => {});
        } else {
            setIsLoading(false);
        }
    }, [paramPlateNumber]);

    const fetchCarData = async (plate: string) => {
        setIsLoading(true);
        setCarData(null);
        setHasSearched(true);
        try {
            const result = await parkingApi.searchCar(plate);
            setCarData(result);
        } catch (error) {
            if (isAxiosError(error) && error.response?.status === 404) {
                Alert.alert("조회 실패", "주차된 차량 정보가 없습니다.");
            } else {
                Alert.alert("오류", "데이터를 불러오는 중 문제가 발생했습니다.");
            }
        } finally {
            setIsLoading(false);
        }
    };

    const handleSearch = () => {
        if (searchQuery.trim().length < 4) {
            Alert.alert("알림", "차량 번호를 4자리 이상 입력해주세요.");
            return;
        }
        fetchCarData(searchQuery.trim()).then(() => {});
    };

    const handlePayment = async () => {
        if (!carData) return;

        setIsSubmitting(true);
        try {
            const paymentResult = await parkingApi.payParkingFee(carData.id);

            router.replace({
                pathname: "/car/payment/complete",
                params: {
                    plateNumber: carData.plateNumber,
                    finalFee: paymentResult.finalFee.toString(),
                    createdAt: paymentResult.createdAt,
                    discountMinutes: paymentResult.discountMinutes.toString(),
                },
            });
        } catch (error) {
            if (isAxiosError(error)) {
                if (error.response?.status === 400) {
                    Alert.alert("결제 실패", "이미 정산이 완료되어 출차 대기 중인 차량입니다.");
                } else if (error.response?.status === 404) {
                    Alert.alert("결제 실패", "유효하지 않은 주차 기록입니다.");
                } else {
                    Alert.alert("결제 실패", "정산 처리 중 서버 오류가 발생했습니다.");
                }
            } else {
                Alert.alert("오류", "알 수 없는 에러가 발생했습니다.");
            }
        } finally {
            setIsSubmitting(false);
        }
    };

    // 파생 데이터 계산
    const billableMinutes = carData
        ? Math.max(0, carData.parkedMinutes - carData.discountMinutes)
        : 0;
    const originalFee = carData ? calculateOriginalFee(carData.parkedMinutes) : 0;

    return (
        <View className="flex-1 bg-white">
            <Title title="사전 정산 확인" isCenter>
                <BackButton />
            </Title>

            <ScrollView className="flex-1 px-5" contentContainerStyle={{ paddingBottom: 40 }}>
                {!paramPlateNumber && (
                    <View className="mt-6 mb-2">
                        <Text className="text-lg font-pretendard-bold text-brand-txt-main mb-3">
                            차량 번호 검색
                        </Text>
                        <View className="flex-row gap-2">
                            <View
                                className={twMerge(
                                    "flex-1 flex-row items-center px-4 h-[52px]",
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
                                    editable={!isLoading}
                                />
                            </View>
                            <Button
                                color="navy"
                                variant="contained"
                                shape="square"
                                className="w-[80px] h-[52px] rounded-xl"
                                onPress={handleSearch}
                                disabled={isLoading}>
                                {isLoading ? (
                                    <ActivityIndicator size="small" color="#fff" />
                                ) : (
                                    "조회"
                                )}
                            </Button>
                        </View>
                    </View>
                )}

                {isLoading && !carData && (
                    <View className="py-20 justify-center items-center">
                        <ActivityIndicator size="large" color="#3586FF" />
                    </View>
                )}

                {hasSearched && !carData && !isLoading && (
                    <View className="mt-8 bg-brand-surface rounded-2xl p-10 items-center justify-center">
                        <Text className="text-lg font-pretendard-bold text-brand-txt-main mb-2">
                            조회된 차량이 없습니다
                        </Text>
                        <Text className="text-[15px] font-pretendard-medium text-brand-txt-sub text-center leading-[24px]">
                            차량 번호를 다시 한번 확인해 주세요.
                        </Text>
                    </View>
                )}

                {carData && !isLoading && (
                    <>
                        <View className="mt-6 bg-white border border-brand-primary rounded-2xl p-5 mb-6">
                            <View className="flex-row justify-between items-center">
                                <Text className="text-[15px] font-pretendard-bold text-brand-txt-main">
                                    {carData.location.split("·")[0].trim()} ·{" "}
                                    {carData.location.split("·")[1].replace("주차중", "").trim()}
                                </Text>
                                <Text className="text-[13px] font-pretendard-medium text-brand-primary">
                                    주차 중
                                </Text>
                            </View>

                            <View className="items-center my-6">
                                <IoCarOutline size={36} color="#3586FF" />
                                <Text className="text-[26px] font-pretendard-bold text-brand-txt-main mt-2">
                                    {carData.plateNumber}
                                </Text>
                            </View>

                            <Text className="text-[13px] font-pretendard-medium text-brand-txt-sub">
                                {formattingUtil.formatEntryTime(carData.entryTime)} 입차 -{" "}
                                {formattingUtil.formatDuration(carData.parkedMinutes)}
                            </Text>
                        </View>

                        {/* 2. 정산 내역 영역 */}
                        <Text className="text-[18px] font-pretendard-bold text-brand-txt-main mb-3">
                            정산 내역
                        </Text>
                        <View className="bg-brand-surface rounded-2xl p-5 mb-6">
                            <View className="gap-y-3 mb-5">
                                <View className="flex-row justify-between items-center">
                                    <Text className="text-[15px] font-pretendard-medium text-brand-txt-sub">
                                        총 주차 시간
                                    </Text>
                                    <Text className="text-[15px] font-pretendard-bold text-brand-txt-main">
                                        {formattingUtil.formatDuration(carData.parkedMinutes)}
                                    </Text>
                                </View>
                                <View className="flex-row justify-between items-center">
                                    <Text className="text-[15px] font-pretendard-medium text-brand-txt-sub">
                                        총 할인 시간
                                    </Text>
                                    <Text className="text-[15px] font-pretendard-bold text-brand-txt-main">
                                        {formattingUtil.formatDuration(carData.discountMinutes)}
                                    </Text>
                                </View>
                                <View className="flex-row justify-between items-center">
                                    <Text className="text-[15px] font-pretendard-medium text-brand-txt-sub">
                                        과금 대상 시간
                                    </Text>
                                    <Text className="text-[15px] font-pretendard-bold text-brand-txt-main">
                                        {formattingUtil.formatDuration(billableMinutes)}
                                    </Text>
                                </View>
                            </View>

                            <View className="h-px w-full bg-[#E5E5E5] mb-5" />

                            <View className="gap-y-3">
                                <View className="flex-row justify-between items-center">
                                    <Text className="text-[15px] font-pretendard-medium text-brand-txt-sub">
                                        할인 전 요금
                                    </Text>
                                    <Text className="text-[16px] font-pretendard-bold text-brand-primary">
                                        {formattingUtil.formatCurrency(originalFee)}
                                    </Text>
                                </View>
                                <View className="flex-row justify-between items-center">
                                    <Text className="text-[15px] font-pretendard-medium text-brand-txt-sub">
                                        최종 결제 금액
                                    </Text>
                                    <Text className="text-[18px] font-pretendard-bold text-brand-navy">
                                        {formattingUtil.formatCurrency(carData.expectedFee)}
                                    </Text>
                                </View>
                            </View>
                        </View>

                        {/* 3. 경고 문구 및 결제 버튼 */}
                        <View className="items-center mb-6 px-4">
                            <Text className="text-[13px] font-pretendard-medium text-brand-txt-main text-center leading-[20px]">
                                <Text className="text-brand-danger">⚠️ </Text>
                                정산 완료 시 해당 차량은 출차 처리됩니다.{"\n"}
                                사전 정산 이후 10분 이내로 출차해주세요.
                            </Text>
                        </View>

                        <Button
                            color="navy"
                            variant="contained"
                            shape="fullwidth"
                            onPress={handlePayment}
                            disabled={isSubmitting}>
                            {`${formattingUtil.formatCurrency(carData.expectedFee)} 결제하기`}
                        </Button>
                    </>
                )}
            </ScrollView>
        </View>
    );
}
