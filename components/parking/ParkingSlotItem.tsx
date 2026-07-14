import { View, Text, Image } from "react-native";
import { twMerge } from "tailwind-merge";
import type { GetParkingSlotsResponse } from "@/types/parkingSlots";

type ParkingSlot = GetParkingSlotsResponse["slots"][number];

interface ParkingSlotItemProps {
    item: ParkingSlot;
}

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

function ParkingSlotItem({ item }: ParkingSlotItemProps) {
    const parkingRecord = item.parkingRecord;
    const isOccupied = parkingRecord !== null;

    // TODO: 내 할인 상태 추가하기
    return (
        <View
            className={twMerge(
                "h-[140px] w-[180px] rounded-xl p-3",
                isOccupied ? "border-2 border-brand-primary bg-brand-bg" : "bg-brand-surface",
            )}>
            <Text className="font-pretendard-medium text-sm text-brand-txt-main">
                {item.floor}F ㆍ {item.spaceNumber}
            </Text>

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
                        {formatPlateNumber(parkingRecord.plateNumber)}
                    </Text>

                    <Text className="mt-3 font-pretendard text-brand-txt-light">
                        {formatEntryTime(parkingRecord.entryTime)} 입차
                    </Text>

                    <Text className="mt-1.5 font-pretendard-bold text-[12px] text-brand-txt-sub">
                        할인 없음
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
        </View>
    );
}

export default ParkingSlotItem;
