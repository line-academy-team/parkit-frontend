import { View, Text, Pressable, Image, ActivityIndicator, Modal } from "react-native";
import { router, useLocalSearchParams } from "expo-router";
import { useEffect, useState } from "react";
import { twMerge } from "tailwind-merge";
import { Ionicons } from "@expo/vector-icons";
import userApi from "@/api/user/userApi";

interface ParkingRecordDetail {
    id: number;
    plateNumber: string;
    entryTime: string;
    exitTime: string | null;
    currentParkingMinutes: number;
    totalDiscountMinutes: number;
    myDiscountMinutes: number;
    parkingSlot: {
        id: number;
        floor: number;
        spaceNumber: string;
    };
}

const discountOptions = [30, 60, 90];

const formatPlateNumber = (plateNumber?: string): string => {
    if (!plateNumber) {
        return "";
    }

    const normalized = plateNumber.replace(/\s+/g, "");

    return normalized.replace(/(.+)(\d{4})$/, "$1 $2");
};

const formatEntryTime = (entryTime?: string): string => {
    if (!entryTime) {
        return "";
    }

    return new Date(entryTime).toLocaleTimeString("ko-KR", {
        hour: "2-digit",
        minute: "2-digit",
        hour12: false,
        timeZone: "Asia/Seoul",
    });
};

const formatParkingDuration = (minutes: number): string => {
    const hours = Math.floor(minutes / 60);
    const remainMinutes = minutes % 60;

    if (hours <= 0) {
        return `${remainMinutes}분`;
    }

    if (remainMinutes <= 0) {
        return `${hours}시간`;
    }

    return `${hours}시간 ${remainMinutes}분`;
};

const getDiscountText = (minutes: number): string => {
    if (minutes <= 0) {
        return "없음";
    }

    return `${minutes}분`;
};

function ParkingRecordDetailPage() {
    const params = useLocalSearchParams<{
        parkingRecordId: string;
    }>();

    const parkingRecordId = Number(params.parkingRecordId);

    const [parkingRecord, setParkingRecord] = useState<ParkingRecordDetail | null>(null);
    const [selectedMinutes, setSelectedMinutes] = useState(60);
    const [isLoading, setIsLoading] = useState(true);
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [isConfirmModalVisible, setIsConfirmModalVisible] = useState(false);

    const loadParkingRecord = async () => {
        try {
            setIsLoading(true);

            const result = await userApi.getParkingRecordById(parkingRecordId);

            setParkingRecord(result);

            if (result.myDiscountMinutes > 0) {
                setSelectedMinutes(result.myDiscountMinutes);
            }
        } catch (error) {
            console.log(error);
            setParkingRecord(null);
        } finally {
            setIsLoading(false);
        }
    };

    useEffect(() => {
        if (Number.isNaN(parkingRecordId)) {
            setIsLoading(false);
            return;
        }

        void loadParkingRecord();
    }, [parkingRecordId]);

    const totalDiscountMinutes = parkingRecord?.totalDiscountMinutes ?? 0;
    const myDiscountMinutes = parkingRecord?.myDiscountMinutes ?? 0;
    const hasMyDiscount = myDiscountMinutes > 0;

    const handleOpenConfirmModal = () => {
        if (!parkingRecord) {
            return;
        }

        setIsConfirmModalVisible(true);
    };

    const handleSubmitDiscount = async () => {
        if (!parkingRecord) {
            return;
        }

        const previousMyDiscountMinutes = myDiscountMinutes;

        try {
            setIsSubmitting(true);

            await userApi.upsertParkingDiscount({
                parkingRecordId: parkingRecord.id,
                discountMinutes: selectedMinutes,
            });

            const toastMessage =
                previousMyDiscountMinutes > 0
                    ? `할인 시간이 ${previousMyDiscountMinutes}분에서 ${selectedMinutes}분으로 변경되었습니다.`
                    : `${selectedMinutes}분 할인이 적용되었습니다.`;

            setIsConfirmModalVisible(false);

            router.replace(`/shops/parking?toastMessage=${encodeURIComponent(toastMessage)}`);
        } catch (error) {
            console.log(error);
        } finally {
            setIsSubmitting(false);
        }
    };

    if (isLoading) {
        return (
            <View className="flex-1 items-center justify-center bg-white">
                <ActivityIndicator />
            </View>
        );
    }

    if (!parkingRecord) {
        return (
            <View className="flex-1 bg-white">
                <View className="h-14 flex-row items-center bg-brand-surface px-5">
                    <Pressable onPress={() => router.back()}>
                        <Ionicons name="arrow-back" size={24} color="#3E3E41" />
                    </Pressable>

                    <Text className="flex-1 text-center font-pretendard-bold text-[22px]/[30px] text-brand-txt-main">
                        차량 상세
                    </Text>

                    <View className="w-6" />
                </View>

                <View className="flex-1 items-center justify-center px-5">
                    <Text className="font-pretendard-semibold text-[18px]/[26px] text-brand-txt-main">
                        차량 정보를 찾을 수 없습니다.
                    </Text>

                    <Pressable
                        onPress={() => router.back()}
                        className="mt-6 h-[52px] w-full items-center justify-center rounded-lg bg-[#284776]">
                        <Text className="font-pretendard-bold text-[16px]/[24px] text-white">
                            돌아가기
                        </Text>
                    </Pressable>
                </View>
            </View>
        );
    }

    return (
        <View className="flex-1 bg-white">
            <View className="h-14 flex-row items-center bg-brand-surface px-5">
                <Pressable onPress={() => router.back()}>
                    <Ionicons name="arrow-back" size={24} color="#3E3E41" />
                </Pressable>

                <Text className="flex-1 text-center font-pretendard-bold text-[22px]/[30px] text-brand-txt-main">
                    차량 상세
                </Text>

                <View className="w-6" />
            </View>

            <View className="flex-1 px-5 pt-6">
                <View
                    className={twMerge(
                        "h-[160px] rounded-xl border p-3",
                        hasMyDiscount
                            ? "border-[#FFB578] bg-brand-highlight"
                            : "border-brand-primary bg-white",
                    )}>
                    <View className="flex-row items-center justify-between">
                        <Text className="font-pretendard-medium text-[14px]/[22px] text-brand-txt-main">
                            {parkingRecord.parkingSlot.floor}F ㆍ{" "}
                            {parkingRecord.parkingSlot.spaceNumber}
                        </Text>

                        {hasMyDiscount ? (
                            <View className="rounded-full bg-[#FFB578] px-2.5 py-1">
                                <Text className="font-pretendard-semibold text-[10px]/[14px] text-[#284776]">
                                    내 할인 {myDiscountMinutes}분
                                </Text>
                            </View>
                        ) : (
                            <Text className="font-pretendard-semibold text-[12px]/[18px] text-brand-primary">
                                주차 중
                            </Text>
                        )}
                    </View>

                    <Image
                        source={require("@/assets/images/car.png")}
                        resizeMode="contain"
                        style={{
                            width: 34,
                            height: 34,
                        }}
                        className="mt-4 self-center"
                    />

                    <Text className="mt-1 text-center font-pretendard-bold text-[20px]/[28px] text-brand-txt-main">
                        {formatPlateNumber(parkingRecord.plateNumber)}
                    </Text>

                    <Text className="mt-3 font-pretendard text-[12px]/[18px] text-brand-txt-light">
                        {formatEntryTime(parkingRecord.entryTime)} 입차 · 할인{" "}
                        {totalDiscountMinutes > 0 ? `${totalDiscountMinutes}분` : "없음"}
                    </Text>
                </View>

                <Text className="mt-4 font-pretendard-semibold text-[16px]/[24px] text-brand-txt-main">
                    주차 정보
                </Text>

                <View className="mt-3 rounded-xl bg-brand-surface px-7 py-3">
                    <View className="flex-row justify-between py-1">
                        <Text className="font-pretendard text-[14px]/[22px] text-brand-txt-light">
                            입차 시간
                        </Text>

                        <Text className="font-pretendard-bold text-[16px]/[24px] text-brand-txt-main">
                            {formatEntryTime(parkingRecord.entryTime)}
                        </Text>
                    </View>

                    <View className="flex-row justify-between py-1">
                        <Text className="font-pretendard text-[14px]/[22px] text-brand-txt-light">
                            현재 주차 시간
                        </Text>

                        <Text className="font-pretendard-bold text-[16px]/[24px] text-brand-txt-main">
                            {formatParkingDuration(parkingRecord.currentParkingMinutes)}
                        </Text>
                    </View>

                    <View className="flex-row justify-between py-1">
                        <Text className="font-pretendard text-[14px]/[22px] text-brand-txt-light">
                            총 할인 시간
                        </Text>

                        <Text className="font-pretendard-bold text-[16px]/[24px] text-brand-txt-main">
                            {getDiscountText(totalDiscountMinutes)}
                        </Text>
                    </View>

                    <View className="flex-row justify-between py-1">
                        <Text className="font-pretendard text-[14px]/[22px] text-brand-txt-light">
                            내 상점 할인
                        </Text>

                        <Text className="font-pretendard-bold text-[16px]/[24px] text-brand-txt-main">
                            {getDiscountText(myDiscountMinutes)}
                        </Text>
                    </View>
                </View>

                <Text className="mt-5 font-pretendard-semibold text-[16px]/[24px] text-brand-txt-main">
                    {hasMyDiscount ? "할인 시간 변경" : "할인 시간 선택"}
                </Text>

                <Text className="mt-1 font-pretendard text-[12px]/[18px] text-brand-txt-light">
                    {hasMyDiscount
                        ? `현재 적용된 할인은 ${myDiscountMinutes}분입니다.`
                        : "적용할 할인 시간을 선택해 주세요."}
                </Text>

                <View className="mt-3 flex-row gap-3">
                    {discountOptions.map(minutes => {
                        const isSelected = selectedMinutes === minutes;

                        return (
                            <Pressable
                                key={minutes}
                                onPress={() => setSelectedMinutes(minutes)}
                                className={twMerge(
                                    "h-[44px] flex-1 items-center justify-center rounded-lg bg-brand-surface",
                                    isSelected && "bg-brand-primary",
                                )}>
                                <Text
                                    className={twMerge(
                                        "font-pretendard-semibold text-[14px]/[22px] text-brand-txt-light",
                                        isSelected && "text-white",
                                    )}>
                                    {minutes}분
                                </Text>
                            </Pressable>
                        );
                    })}
                </View>

                <Pressable
                    onPress={handleOpenConfirmModal}
                    disabled={isSubmitting}
                    className={twMerge(
                        "mt-5 h-[52px] items-center justify-center rounded-lg bg-[#284776]",
                        isSubmitting && "opacity-60",
                    )}>
                    <Text className="font-pretendard-bold text-[16px]/[24px] text-white">
                        {hasMyDiscount ? "할인 수정하기" : "할인 적용하기"}
                    </Text>
                </Pressable>
            </View>

            <Modal
                visible={isConfirmModalVisible}
                transparent
                animationType="fade"
                onRequestClose={() => setIsConfirmModalVisible(false)}>
                <View className="flex-1 items-center justify-center bg-black/20 px-5">
                    <View className="w-full rounded-xl border border-brand-primary bg-white px-5 py-6">
                        <Text className="text-center font-pretendard-bold text-[18px]/[26px] text-brand-txt-main">
                            {hasMyDiscount ? "할인을 변경할까요?" : "할인을 적용할까요?"}
                        </Text>

                        <Text className="mt-4 text-center font-pretendard-medium text-[14px]/[22px] text-brand-txt-light">
                            {hasMyDiscount
                                ? `기존 ${myDiscountMinutes}분 할인을\n${selectedMinutes}분으로 변경합니다.`
                                : `${formatPlateNumber(
                                      parkingRecord.plateNumber,
                                  )} 차량에\n${selectedMinutes}분 할인을 적용합니다.`}
                        </Text>

                        <View className="mt-6 flex-row justify-center gap-8">
                            <Pressable
                                onPress={() => setIsConfirmModalVisible(false)}
                                disabled={isSubmitting}
                                className="h-11 min-w-[58px] items-center justify-center rounded-lg bg-brand-surface px-4">
                                <Text className="font-pretendard-bold text-[14px]/[22px] text-brand-txt-main">
                                    취소
                                </Text>
                            </Pressable>

                            <Pressable
                                onPress={handleSubmitDiscount}
                                disabled={isSubmitting}
                                className={twMerge(
                                    "h-11 min-w-[82px] items-center justify-center rounded-lg bg-[#284776] px-4",
                                    isSubmitting && "opacity-60",
                                )}>
                                <Text className="font-pretendard-bold text-[14px]/[22px] text-white">
                                    {isSubmitting
                                        ? "처리 중"
                                        : hasMyDiscount
                                          ? "변경하기"
                                          : "적용하기"}
                                </Text>
                            </Pressable>
                        </View>
                    </View>
                </View>
            </Modal>
        </View>
    );
}

export default ParkingRecordDetailPage;
