import { View, Text, Pressable, Image, TextInput, ScrollView } from "react-native";
import { twMerge } from "tailwind-merge";
import { useEffect, useState } from "react";
import { useLocalSearchParams } from "expo-router";
import type { GetParkingSlotsResponse } from "@/types/parkingSlots";
import ParkingSlotItem from "@/components/parking/ParkingSlotItem";
import userApi from "@/api/user/userApi";

type Floor = 0 | 1 | 2;
type Display = "grid" | "list";

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

function ParkingListPage() {
    const params = useLocalSearchParams<{
        toastMessage?: string;
    }>();

    const [floor, setFloor] = useState<Floor>(0);
    const [display, setDisplay] = useState<Display>("grid");
    const [data, setData] = useState<GetParkingSlotsResponse>();
    const [toastMessage, setToastMessage] = useState<string | null>(null);

    const loadParkingSlots = async () => {
        try {
            const result = await userApi.getParkingSlots();
            console.log(result);
            setData(result);
        } catch (error) {
            console.log(error);
        }
    };

    useEffect(() => {
        void loadParkingSlots();
    }, []);

    useEffect(() => {
        if (!params.toastMessage) {
            return;
        }

        const message = Array.isArray(params.toastMessage)
            ? params.toastMessage[0]
            : params.toastMessage;

        setToastMessage(decodeURIComponent(message));

        const timer = setTimeout(() => {
            setToastMessage(null);
        }, 2500);

        return () => clearTimeout(timer);
    }, [params.toastMessage]);

    const filteredSlots =
        data?.slots.filter(item => {
            if (floor === 0) {
                return true;
            }

            return item.floor === floor;
        }) ?? [];

    return (
        <View className="flex-1 bg-white">
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

            {toastMessage && (
                <View className="absolute bottom-5 left-5 right-5 items-center">
                    <View className="rounded-lg bg-[#4A4A4A] px-4 py-3">
                        <Text className="text-center font-pretendard-medium text-[14px]/[20px] text-white">
                            {toastMessage}
                        </Text>
                    </View>
                </View>
            )}
        </View>
    );
}

export default ParkingListPage;
