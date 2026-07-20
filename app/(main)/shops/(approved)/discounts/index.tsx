import React, { useEffect, useState, useCallback } from "react";
import { View, Text, TextInput, Pressable, ScrollView, RefreshControl } from "react-native";
import { MaterialIcons } from "@expo/vector-icons";
import { twMerge } from "tailwind-merge";
import Title from "@/components/common/title/Title";
import LoadingIndicator from "@/components/common/loading/Loading";
import userApi from "@/api/user/userApi";
import type { DiscountHistoryItem, DiscountHistorySummary } from "@/types/discountHistory";
import formattingUtil from "@/utils/formattingUtil";
import { PARKING_STATUS, ParkingStatus } from "@/types/parkingStatus";
import MainFooter from "@/components/layouts/main/MainFooter";

function DiscountHistoryScreen() {
    const [summary, setSummary] = useState<DiscountHistorySummary>({ count: 0, totalMinutes: 0 });
    const [historyList, setHistoryList] = useState<DiscountHistoryItem[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [isRefreshing, setIsRefreshing] = useState(false);

    const [searchQuery, setSearchQuery] = useState("");
    const [currentStatus, setCurrentStatus] = useState<ParkingStatus>(PARKING_STATUS.ALL);

    const fetchHistoryData = useCallback(
        async (showLoading = true) => {
            if (showLoading) setIsLoading(true);
            try {
                const data = await userApi.getDiscountHistory({
                    plateNumber: searchQuery || undefined,
                    status: currentStatus,
                });
                setSummary(data.todaySummary);
                setHistoryList(data.history);
            } catch (error) {
                console.error("할인 내역을 불러오는 중 오류 발생:", error);
            } finally {
                setIsLoading(false);
                setIsRefreshing(false);
            }
        },
        [searchQuery, currentStatus],
    );

    useEffect(() => {
        fetchHistoryData(true).then(() => {});
    }, [fetchHistoryData]);

    const handleRefresh = () => {
        setIsRefreshing(true);
        fetchHistoryData(false).then(() => {});
    };

    const handleHeaderRefresh = () => {
        fetchHistoryData(true).then(() => {});
    };

    const groupHistoryByDate = (items: DiscountHistoryItem[]) => {
        const groups: { [key: string]: DiscountHistoryItem[] } = {};
        items.forEach(item => {
            const dateStr = formattingUtil.formatDate(item.createdAt);
            if (!groups[dateStr]) {
                groups[dateStr] = [];
            }
            groups[dateStr].push(item);
        });
        return groups;
    };

    const groupedHistory = groupHistoryByDate(historyList);

    return (
        <View className="flex-1">
            <Title title="할인 내역" isCenter={false}>
                <Pressable onPress={handleHeaderRefresh} className="p-2">
                    <MaterialIcons name="refresh" size={24} color="#3E3E41" />
                </Pressable>
            </Title>

            <ScrollView
                className="flex-1 px-5"
                showsVerticalScrollIndicator={false}
                refreshControl={
                    <RefreshControl refreshing={isRefreshing} onRefresh={handleRefresh} />
                }>
                <View className="mt-5 flex-row items-center bg-brand-surface rounded-xl px-4 py-3 border border-brand-border">
                    <MaterialIcons name="search" size={20} color="#989899" className="mr-2" />
                    <TextInput
                        className="flex-1 font-pretendard text-brand-txt-main p-0 text-sm"
                        placeholder="차량 번호를 입력해 주세요"
                        placeholderTextColor="#989899"
                        value={searchQuery}
                        onChangeText={setSearchQuery}
                    />
                </View>

                <View className="flex-row gap-2 mt-4">
                    {(Object.keys(PARKING_STATUS) as Array<keyof typeof PARKING_STATUS>).map(
                        key => {
                            const statusValue = PARKING_STATUS[key];
                            const isActive = currentStatus === statusValue;

                            let label = "전체";
                            if (statusValue === PARKING_STATUS.PARKING) label = "주차 중";
                            if (statusValue === PARKING_STATUS.EXITED) label = "출차 완료";

                            return (
                                <Pressable
                                    key={statusValue}
                                    onPress={() => setCurrentStatus(statusValue)}
                                    className={twMerge(
                                        "px-4 py-2 rounded-full",
                                        isActive ? "bg-brand-primary" : "bg-brand-surface",
                                    )}>
                                    <Text
                                        className={twMerge(
                                            "font-pretendard-medium text-xs",
                                            isActive ? "text-brand-bg" : "text-brand-txt-sub",
                                        )}>
                                        {label}
                                    </Text>
                                </Pressable>
                            );
                        },
                    )}
                </View>

                <Text className="font-pretendard-semibold text-brand-txt-main text-base mt-6 mb-3">
                    오늘 등록한 할인
                </Text>
                <View className="flex-row gap-3">
                    <View className="flex-1 bg-brand-surface rounded-2xl p-5 items-center justify-center">
                        <Text className="text-2xl font-pretendard-bold text-brand-navy">
                            {summary.count}건
                        </Text>
                        <Text className="text-xs font-pretendard text-brand-txt-sub mt-1">
                            할인 차량
                        </Text>
                    </View>
                    <View className="flex-1 bg-brand-surface rounded-2xl p-5 items-center justify-center">
                        <Text className="text-2xl font-pretendard-bold text-brand-navy">
                            {summary.totalMinutes}분
                        </Text>
                        <Text className="text-xs font-pretendard text-brand-txt-sub mt-1">
                            총 할인 시간
                        </Text>
                    </View>
                </View>

                {isLoading ? (
                    <LoadingIndicator />
                ) : historyList.length === 0 ? (
                    <View className="py-16 items-center justify-center">
                        <Text className="font-pretendard text-brand-txt-sub text-sm">
                            할인 내역이 존재하지 않습니다.
                        </Text>
                    </View>
                ) : (
                    <View className="mt-6 mb-8">
                        {Object.keys(groupedHistory).map(dateStr => (
                            <View key={dateStr} className="mb-6">
                                {/* 날짜 헤더 */}
                                <Text className="font-pretendard-medium text-brand-txt-light text-sm mb-3">
                                    {dateStr}
                                </Text>

                                <View className="flex-row flex-wrap justify-between">
                                    {groupedHistory[dateStr].map(item => (
                                        <View key={item.id} className="w-[48%] mb-3">
                                            <View className="border border-brand-primary bg-brand-bg rounded-2xl p-4 h-[145px] justify-between">
                                                <View>
                                                    <View className="flex-row items-center justify-between">
                                                        <Text className="font-pretendard-bold text-brand-txt-main text-base">
                                                            {item.plateNumber}
                                                        </Text>
                                                        <View
                                                            className={twMerge(
                                                                "px-2 py-0.5 rounded-md",
                                                                item.isOccupied
                                                                    ? "bg-brand-primary"
                                                                    : "bg-brand-border",
                                                            )}>
                                                            <Text className="text-[10px] font-pretendard-medium text-white">
                                                                {item.isOccupied
                                                                    ? "주차 중"
                                                                    : "출차 완료"}
                                                            </Text>
                                                        </View>
                                                    </View>
                                                    <Text className="font-pretendard text-xs text-brand-txt-sub mt-1">
                                                        {item.floor}F · {item.spaceNumber}
                                                    </Text>
                                                </View>

                                                <View className="border-t border-brand-surface pt-2">
                                                    <View className="flex-row justify-between items-center">
                                                        <Text className="font-pretendard text-xs text-brand-txt-sub">
                                                            내 할인
                                                        </Text>
                                                        <Text className="font-pretendard-semibold text-brand-navy text-sm">
                                                            {item.myDiscountMinutes}분
                                                        </Text>
                                                    </View>
                                                    <View className="flex-row justify-between items-center mt-1">
                                                        <Text className="font-pretendard text-xs text-brand-txt-sub">
                                                            등록 시각
                                                        </Text>
                                                        <Text className="font-pretendard text-xs text-brand-txt-main">
                                                            {new Date(
                                                                item.createdAt,
                                                            ).toLocaleTimeString("ko-KR", {
                                                                hour: "2-digit",
                                                                minute: "2-digit",
                                                                hour12: false,
                                                            })}
                                                        </Text>
                                                    </View>
                                                </View>
                                            </View>
                                        </View>
                                    ))}
                                </View>
                            </View>
                        ))}
                    </View>
                )}
            </ScrollView>

            <MainFooter variant="shop" />
        </View>
    );
}

export default DiscountHistoryScreen;
