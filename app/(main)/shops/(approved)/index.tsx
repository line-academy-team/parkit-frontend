import { View, Text, ScrollView, Image, Pressable, Alert, ActivityIndicator } from "react-native";
import { Link} from "expo-router";
import Button from "@/components/common/button/Button";
import { shopAuthStore } from "@/stores/auth/shopAuthStore";
import { IoNotifications, IoCarOutline, IoChevronForward } from "react-icons/io5";
import { DashboardResponse } from "@/types/shopDashboard";
import { useCallback, useEffect, useState } from "react";
import userApi from "@/api/user/userApi";
import formattingUtil from "@/utils/formattingUtil";

export default function ShopMainScreen() {
    const { shop } = shopAuthStore();

    const [dashboardData, setDashboardData] = useState<DashboardResponse | null>(null);
    const [isLoading, setIsLoading] = useState(true);

    const fetchDashboard = useCallback(async () => {
        try {
            setIsLoading(true);
            const data = await userApi.getDashboard();
            setDashboardData(data);
        } catch (error) {
            Alert.alert("오류", "대시보드 데이터를 불러오는 중 문제가 발생했습니다.");
            console.error(error);
        } finally {
            setIsLoading(false);
        }
    }, []);

    useEffect(() => {
        fetchDashboard().then(() => {});
    }, [fetchDashboard]);

    if (isLoading || !dashboardData) {
        return (
            <View className="flex-1 bg-white justify-center items-center">
                <ActivityIndicator size="large" color="#3586FF" />
            </View>
        );
    }

    const { dashboard, recentDiscounts, notice } = dashboardData;

    return (
        <View className="flex-1 bg-white">
            <View className="flex-row justify-between items-center px-5 h-14 bg-white">
                <View className="flex-row items-center gap-1.5">
                    <Image
                        source={require("@/assets/images/logo.png")}
                        style={{ width: 28, height: 28 }}
                        resizeMode="contain"
                        className="rounded-sm"
                    />
                    <Text className="text-2xl font-bold text-brand-navy">Park:</Text>
                    <Text className="text-2xl font-bold text-brand-primary">It</Text>
                </View>
                <Pressable
                    onPress={() => {
                        /* TODO: 알림 페이지 이동 */
                    }}>
                    <IoNotifications size={24} color="#FFB578" /> {/* brand-warning 색상 */}
                </Pressable>
            </View>

            <ScrollView className="flex-1" contentContainerStyle={{ paddingBottom: 40 }}>
                {/* 2. 인사말 및 승인 배지 */}
                <View className="items-center mt-8 mb-10 px-5">
                    <Text className="text-[22px] font-pretendard-bold text-brand-navy text-center">
                        안녕하세요, {shop?.name || "[상점 이름]"}
                    </Text>
                    <Text className="text-[14px] font-pretendard-medium text-brand-txt-sub mt-2">
                        오늘도 편리한 주차 관리를 시작해 보세요.
                    </Text>
                    <View className="mt-4 px-3 py-1 bg-brand-primary rounded-full items-center justify-center">
                        <Text className="text-white text-xs font-pretendard-medium">승인 완료</Text>
                    </View>
                </View>

                <View className="px-5 mb-4">
                    <Text className="text-[16px] font-pretendard-bold text-brand-txt-main mb-3">
                        오늘의 현황
                    </Text>
                    <View className="flex-row gap-3">
                        {/* 현재 주차 현황 */}
                        <View className="flex-1 bg-brand-surface rounded-2xl py-5 items-center justify-center">
                            <Text className="text-[22px] font-pretendard-bold text-brand-navy">
                                {dashboard.currentParked}대
                            </Text>
                            <Text className="text-[14px] font-pretendard-medium text-brand-txt-main mt-1">
                                현재 주차
                            </Text>
                            <Text className="text-[12px] font-pretendard-medium text-brand-txt-sub mt-3">
                                빈자리 {dashboard.emptySpots}대
                            </Text>
                        </View>

                        {/* 오늘의 할인 현황 */}
                        <View className="flex-1 bg-brand-accent rounded-2xl py-5 items-center justify-center">
                            <Text className="text-[22px] font-pretendard-bold text-brand-navy">
                                {dashboard.todayDiscountCount}건
                            </Text>
                            <Text className="text-[14px] font-pretendard-medium text-brand-txt-main mt-1">
                                오늘의 할인
                            </Text>
                            <Text className="text-[13px] font-pretendard-bold text-brand-primary mt-3">
                                총 {dashboard.todayDiscountMinutes}분
                            </Text>
                        </View>
                    </View>
                </View>

                {/* 4. 차량 검색 및 할인 등록 액션 버튼 */}
                <View className="px-5 mb-10">
                    <Button
                        color="navy"
                        variant="contained"
                        shape="fullwidth"
                        onPress={() => {
                            // TODO: 상점용 차량 검색 페이지로 라우팅
                        }}>
                        <View className="flex-row items-center justify-center w-full relative">
                            <IoCarOutline size={20} color="#ffffff" className="mr-2" />
                            <Text className="text-white text-[16px] font-pretendard-bold">
                                차량 검색하고 할인 등록하기
                            </Text>
                            <IoChevronForward size={18} color="#ffffff" className="ml-1" />
                        </View>
                    </Button>
                </View>

                {/* 5. 최근 할인 내역 */}
                <View className="px-5 mb-10">
                    <View className="flex-row justify-between items-end mb-3">
                        <Text className="text-[16px] font-pretendard-bold text-brand-txt-main">
                            최근 할인 내역
                        </Text>
                        <Link href="/shops/(approved)/discount-history" asChild>
                            <Pressable>
                                <Text className="text-[13px] font-pretendard-medium text-brand-primary">
                                    전체보기
                                </Text>
                            </Pressable>
                        </Link>
                    </View>

                    <View className="gap-y-2">
                        {recentDiscounts.map(record => (
                            <View
                                key={record.id}
                                className="bg-brand-surface rounded-xl p-4 flex-row justify-between items-center">
                                <View>
                                    <Text className="text-[16px] font-pretendard-bold text-brand-txt-main">
                                        {record.plateNumber}
                                    </Text>
                                    <Text className="text-[12px] font-pretendard-medium text-brand-txt-sub mt-1">
                                        {record.location} ·{" "}
                                        {formattingUtil.formatEntryTime(record.createdAt)} 등록
                                    </Text>
                                </View>
                                <Text className="text-[16px] font-pretendard-bold text-brand-navy">
                                    {record.discount}분
                                </Text>
                            </View>
                        ))}
                    </View>
                </View>

                <View className="px-5 mb-4">
                    <View className="flex-row justify-between items-end mb-3">
                        <Text className="text-[16px] font-pretendard-bold text-brand-txt-main">
                            공지사항
                        </Text>
                        <Link href="/shops/(approved)/notices" asChild>
                            <Pressable>
                                <Text className="text-[13px] font-pretendard-medium text-brand-primary">
                                    더보기
                                </Text>
                            </Pressable>
                        </Link>
                    </View>

                    {notice ? (
                        <Pressable
                            className="bg-brand-surface rounded-xl p-4 flex-row justify-between items-center"
                            onPress={() => {
                                /* 공지사항 상세 이동 */
                            }}>
                            <View>
                                <Text className="text-[15px] font-pretendard-medium text-brand-txt-main">
                                    {notice.title}
                                </Text>
                                <Text className="text-[12px] font-pretendard-medium text-brand-txt-sub mt-1">
                                    {formattingUtil.formatDate(notice.createdAt)}
                                </Text>
                            </View>
                            <IoChevronForward size={20} color="#989899" />
                        </Pressable>
                    ) : (
                        <View className="bg-brand-surface rounded-xl p-6 items-center justify-center">
                            <Text className="text-[14px] font-pretendard-medium text-brand-txt-sub">
                                등록된 공지사항이 없습니다.
                            </Text>
                        </View>
                    )}
                </View>
            </ScrollView>
        </View>
    );
}
