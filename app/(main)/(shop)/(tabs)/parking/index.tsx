import { View, Text, Pressable, Image, TextInput, ScrollView } from "react-native";
import { twMerge } from "tailwind-merge";
import { useEffect, useState } from "react";
import parkingSlotApi from "@/api/parkingslot/parkingSlotApi";
import type { GetParkingSlotsResponse } from "@/types/parkingSlots";

type Floor = 0 | 1 | 2;
type Display = "grid" | "list";
type ParkingSlot = GetParkingSlotsResponse["slots"][number];

interface ParkingSlotItemProps {
    item: ParkingSlot;
}

const floorFilters: { label: string; value: Floor }[] = [
    {
        label: "전체",
        value: 0,
    },
    {
        label: "1층",
        value: 1,
    },
    {
        label: "2층",
        value: 2,
    },
];

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

function ParkingListPage() {
    const [floor, setFloor] = useState<Floor>(0);
    const [display, setDisplay] = useState<Display>("grid");
    const [data, setData] = useState<GetParkingSlotsResponse>();

    const loadParkingSlots = async () => {
        try {
            const result = await parkingSlotApi.getParkingSlots();

            setData(result);
        } catch (error) {
            console.log(error);
        }
    };

    useEffect(() => {
        loadParkingSlots().then(() => {});
    }, []);

    const filteredSlots =
        data?.slots.filter(item => {
            if (floor === 0) {
                return true;
            }

            return item.floor === floor;
        }) ?? [];

    return (
        <>
            <View className="h-14 flex-row items-center justify-between bg-brand-surface px-5">
                <Text className="font-pretendard-bold text-[24px]/[34px] text-brand-txt-main">
                    주차 현황
                </Text>

                <Pressable onPress={() => void loadParkingSlots()}>
                    <Image
                        source={require("@/assets/images/refresh.png")}
                        resizeMode="contain"
                        style={{
                            width: 24,
                            height: 24,
                        }}
                    />
                </Pressable>
            </View>

            <View className="flex-1 px-5">
                <View className="relative">
                    <TextInput
                        className={twMerge(
                            "mt-5 h-[52px] rounded-2xl py-[15px] pl-[46px]",
                            "bg-brand-surface",
                            "font-pretendard text-[16px]/[22px] text-brand-txt-light",
                        )}
                        placeholder="차량 번호를 검색해 주세요"
                    />

                    <Image
                        source={require("@/assets/images/search.png")}
                        resizeMode="contain"
                        style={{
                            width: 24,
                            height: 24,
                        }}
                        className="absolute left-3 top-[34px]"
                    />
                </View>

                <View className="flex-row items-center justify-between pt-5">
                    <View className="flex-row gap-2">
                        {floorFilters.map(filter => (
                            <Pressable
                                key={filter.value}
                                onPress={() => setFloor(filter.value)}
                                className={twMerge(
                                    "h-9 w-14 items-center justify-center rounded-xl bg-brand-surface px-3.5",
                                    floor === filter.value && "bg-brand-primary",
                                )}>
                                <Text
                                    className={twMerge(
                                        "font-pretendard-medium text-[14px]/[22px] text-brand-txt-light",
                                        floor === filter.value && "text-brand-bg",
                                    )}>
                                    {filter.label}
                                </Text>
                            </Pressable>
                        ))}
                    </View>

                    <View className="flex-row gap-3 bg-brand-surface px-4 py-2">
                        <Pressable onPress={() => setDisplay("grid")}>
                            <Image
                                source={
                                    display === "grid"
                                        ? require("@/assets/images/grid_on.png")
                                        : require("@/assets/images/grid_off.png")
                                }
                                resizeMode="contain"
                                style={{
                                    width: 20,
                                    height: 20,
                                }}
                            />
                        </Pressable>

                        <Pressable onPress={() => setDisplay("list")}>
                            <Image
                                source={
                                    display === "list"
                                        ? require("@/assets/images/list_on.png")
                                        : require("@/assets/images/list_off.png")
                                }
                                resizeMode="contain"
                                style={{
                                    width: 20,
                                    height: 20,
                                }}
                            />
                        </Pressable>
                    </View>
                </View>

                <View className="mt-4 h-5 flex-row items-center">
                    <Text className="font-pretendard">현재 주차 자리 </Text>

                    <Text className="font-pretendard-semibold text-brand-danger">
                        {data?.occupiedCount ?? 0}대{" "}
                    </Text>

                    <Text className="font-pretendard">빈 자리 </Text>

                    <Text className="font-pretendard-semibold text-brand-primary">
                        {data?.emptyCount ?? 0}대
                    </Text>
                </View>

                <ScrollView
                    className="flex-1"
                    showsVerticalScrollIndicator={false}
                    contentContainerStyle={{
                        paddingBottom: 80,
                    }}>
                    <View className="mt-4 w-full flex-row flex-wrap gap-3">
                        {filteredSlots.map(item => (
                            <ParkingSlotItem key={item.id} item={item} />
                        ))}
                    </View>
                </ScrollView>
            </View>
        </>
    );
}

export default ParkingListPage;
