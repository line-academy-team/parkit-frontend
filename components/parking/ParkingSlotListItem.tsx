import { View, Text, Image, Pressable } from "react-native";
import { twMerge } from "tailwind-merge";
import type { GetParkingSlotsResponse } from "@/types/parkingSlots";
import { router } from "expo-router";
import formattingUtil from "@/utils/formattingUtil";

type ParkingSlot = GetParkingSlotsResponse["slots"][number];

interface ParkingSlotGridItemProps {
    item: ParkingSlot;
}

function ParkingSlotGridItem({ item }: ParkingSlotGridItemProps) {
    const parkingRecord = item.parkingRecord;
    const isOccupied = parkingRecord !== null;

    const discountCount = parkingRecord?.discountCount ?? 0;
    const totalDiscountMinutes = parkingRecord?.totalDiscountMinutes ?? 0;
    const myDiscountMinutes = parkingRecord?.myDiscountMinutes ?? 0;

    const hasMyDiscount = myDiscountMinutes > 0;
    const hasAnyDiscount = totalDiscountMinutes > 0;

    const cardStyle = isOccupied
        ? hasAnyDiscount
            ? "border-2 border-[#FFB578] bg-brand-highlight"
            : "border-2 border-brand-primary bg-brand-bg"
        : "bg-brand-surface";

    const handlePress = () => {
        if (!parkingRecord) {
            return;
        }

        router.push(`/shops/parking/${parkingRecord.id}`);
    };

    return (
        <Pressable
            onPress={handlePress}
            disabled={!isOccupied}
            className={twMerge("h-[140px] w-[180px] rounded-xl p-3", cardStyle)}>
            <View className="flex-row items-start justify-between">
                <Text className="font-pretendard-medium text-sm text-brand-txt-main">
                    {item.floor}F ㆍ {item.spaceNumber}
                </Text>

                {hasMyDiscount && (
                    <View className="rounded-full bg-[#FFB578] px-2 py-1">
                        <Text className="font-pretendard-bold text-[10px]/[14px] text-[#284776]">
                            내 할인 {myDiscountMinutes}분
                        </Text>
                    </View>
                )}
            </View>

            {isOccupied ? (
                <>
                    <Image
                        source={require("@/assets/images/car.png")}
                        resizeMode="contain"
                        style={{
                            width: 28,
                            height: 28,
                        }}
                        className="self-center"
                    />

                    <Text className="text-center font-pretendard-bold text-brand-txt-main">
                        {formattingUtil.formatPlateNumber(parkingRecord.plateNumber)}
                    </Text>

                    <Text className="mt-3 font-pretendard text-brand-txt-light">
                        {formattingUtil.formatEntryTime(parkingRecord.entryTime)} 입차
                    </Text>

                    <Text
                        className={twMerge(
                            "mt-1.5 font-pretendard-bold text-[12px]",
                            hasAnyDiscount ? "text-brand-primary" : "text-brand-txt-sub",
                        )}>
                        {hasAnyDiscount
                            ? `할인 ${discountCount}건 (총 ${totalDiscountMinutes}분)`
                            : "할인 없음"}
                    </Text>
                </>
            ) : (
                <>
                    <Image
                        source={require("@/assets/images/parking.png")}
                        resizeMode="contain"
                        style={{
                            width: 28,
                            height: 28,
                        }}
                        className="mt-3 self-center"
                    />

                    <Text className="self-center font-pretendard-bold">빈 자리</Text>
                </>
            )}
        </Pressable>
    );
}

export default ParkingSlotGridItem;
