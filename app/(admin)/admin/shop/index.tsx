import { useEffect, useState } from "react";
import { View, Text, Pressable, ActivityIndicator, Image } from "react-native";
import { useRouter } from "expo-router";
import adminApi from "@/api/admin/adminApi";
import { Shops } from "@/types/shop";
import { FiAlignJustify } from "react-icons/fi";

export default function AdminMainScreen() {
    const router = useRouter();

    const [shops, setShops] = useState<Shops[]>([]);
    const [loading, setLoading] = useState<boolean>(true);

    // DataGrip / DB 백엔드 API로부터 데이터 로드
    useEffect(() => {
        let isMounted = true;

        adminApi
            .getShopList()
            .then(data => {
                if (isMounted) {
                    const list = Array.isArray(data?.list) ? data.list : [];
                    setShops(list);
                }
            })
            .catch(err => {
                console.error("DataGrip DB 조회 에러:", err);
            })
            .finally(() => {
                if (isMounted) {
                    setLoading(false);
                }
            });

        return () => {
            isMounted = false;
        };
    }, []);

    // 날짜 안전 변환
    const safeFormatDate = (dateString?: string) => {
        if (!dateString) return "-";
        try {
            const d = new Date(dateString);
            return isNaN(d.getTime()) ? "-" : d.toLocaleDateString();
        } catch {
            return "-";
        }
    };

    // DB 데이터 기반 실시간 상태 카운팅 (DataGrip 테이블 동기화)
    const pendingCount = (shops || []).filter(s => s?.status === "PENDING").length;
    const approvedCount = (shops || []).filter(s => s?.status === "APPROVED").length;

    return (
        <View className="min-h-screen bg-white">
            {/* Top Header: 상단 양쪽 배치 (justify-between) */}
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
                    <FiAlignJustify size={24} color="#284776" /> {/* brand-warning 색상 */}
                </Pressable>
            </View>

            {/* 메인 중앙 레이아웃 */}
            <View className="max-w-4xl mx-auto w-full px-5 py-8">
                {/* 메인 타이틀 */}
                <View className="items-center mb-8">
                    <Text className="text-2xl font-bold text-[#284776] text-center">
                        관리자 시스템 현황
                    </Text>
                    <Text className="text-sm text-gray-400 mt-1 text-center">
                        제휴 매장 등록 심사 및 주차 할인 현황을 관리합니다
                    </Text>
                </View>

                {/* 대시보드 요약 (클릭 가능한 버튼 카드) */}
                <View className="flex-row gap-4 mb-4">
                    {/* 심사 대기 버튼 카드 */}
                    <Pressable
                        onPress={() => {
                            // 필터링 이동 또는 대기 상점 목록 페이지 연결
                        }}
                        className="flex-1 bg-[#3586FF] p-6 rounded-2xl items-center justify-center shadow-sm active:opacity-90">
                        <Text className="text-white text-sm font-bold opacity-90 mb-1">
                            심사 대기
                        </Text>
                        <Text className="text-3xl font-extrabold text-white">
                            {loading ? "-" : `${pendingCount}건`}
                        </Text>
                    </Pressable>

                    {/* 승인된 상점 버튼 카드 (DB 데이터 자동 표시) */}
                    <Pressable
                        onPress={() => {
                            // 승인된 상점 목록 페이지 연결
                        }}
                        className="flex-1 bg-[#284776] p-6 rounded-2xl items-center justify-center shadow-sm active:opacity-90">
                        <Text className="text-white text-sm font-bold opacity-90 mb-1">
                            승인된 상점
                        </Text>
                        <Text className="text-3xl font-extrabold text-white">
                            {loading ? "-" : `${approvedCount}개`}
                        </Text>
                    </Pressable>
                </View>

                {/* 공지사항 관리 버튼 */}
                <Pressable
                    onPress={() => {}}
                    className="w-full bg-[#284776] py-3.5 rounded-xl items-center justify-center mb-8 shadow-sm active:opacity-90">
                    <Text className="text-white font-bold text-base">공지사항 관리</Text>
                </Pressable>

                {/* 최근 상점 신청 내역 (DB 목록 출력) */}
                <View className="w-full">
                    <View className="flex-row justify-between items-center mb-3">
                        <Text className="text-base font-bold text-gray-800">
                            최근 상점 신청 내역
                        </Text>
                        <Text className="text-xs text-gray-400">총 {(shops || []).length}건</Text>
                    </View>

                    <View className="bg-gray-100 p-5 rounded-2xl">
                        {loading ? (
                            <View className="py-6 items-center justify-center">
                                <ActivityIndicator size="small" color="#3586FF" />
                            </View>
                        ) : !shops || shops.length === 0 ? (
                            <View className="py-6 items-center justify-center">
                                <Text className="text-gray-500 text-sm">
                                    등록된 상점 내역이 없습니다.
                                </Text>
                            </View>
                        ) : (
                            <View className="gap-y-3">
                                {shops.slice(0, 5).map((shop, index) => {
                                    const isPending = shop?.status === "PENDING";
                                    return (
                                        <Pressable
                                            key={shop?.id || index}
                                            onPress={() =>
                                                shop?.id &&
                                                router.push(`/admin/shop/${shop.id}` as any)
                                            }
                                            className="bg-white p-4 rounded-xl flex-row justify-between items-center border border-gray-200 active:bg-gray-50">
                                            <View className="flex-1">
                                                <View className="flex-row items-center gap-2 mb-1">
                                                    <Text className="text-base font-bold text-gray-800">
                                                        {shop?.name || "이름 없음"}
                                                    </Text>
                                                    <View
                                                        className={`px-2 py-0.5 rounded ${
                                                            isPending
                                                                ? "bg-amber-100"
                                                                : "bg-gray-200"
                                                        }`}>
                                                        <Text
                                                            className={`text-[10px] font-bold ${
                                                                isPending
                                                                    ? "text-amber-700"
                                                                    : "text-gray-600"
                                                            }`}>
                                                            {shop?.status || "PENDING"}
                                                        </Text>
                                                    </View>
                                                </View>
                                                <Text className="text-xs text-gray-400">
                                                    아이디: {shop?.loginId || "-"} ·{" "}
                                                    {safeFormatDate(shop?.createdAt)}
                                                </Text>
                                            </View>
                                            <Text className="text-gray-400 font-bold">{">"}</Text>
                                        </Pressable>
                                    );
                                })}
                            </View>
                        )}
                    </View>
                </View>
            </View>
        </View>
    );
}
