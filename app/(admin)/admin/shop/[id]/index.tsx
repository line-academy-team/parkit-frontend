import { useEffect, useState } from "react";
import { useLocalSearchParams } from "expo-router";
import { ScrollView, Text, View, ActivityIndicator, Alert, Pressable } from "react-native";
import { twMerge } from "tailwind-merge";
import { Shops, ShopStatus } from "@/types/shop";
import axiosInstance from "@/api/axiosInstance";
import BackButton from "@/components/common/button/BackButton";
import Button from "@/components/common/button/Button";

type ChangeableShopStatus = "APPROVED" | "REJECTED" | "SUSPENDED" | "PENDING";

interface ShopDetailResponse {
    message: string;
    data: Shops & { shopStatus?: string; status?: string };
}

function AdminShopDetailPage() {
    const { id } = useLocalSearchParams<{ id: string }>();

    const [shop, setShop] = useState<any | null>(null);
    const [loading, setLoading] = useState(true);
    const [selectedStatus, setSelectedStatus] = useState<ChangeableShopStatus>("PENDING");
    const [isUpdating, setIsUpdating] = useState(false);

    const getShopStatus = (targetShop: any): ChangeableShopStatus => {
        return (targetShop?.shopStatus || targetShop?.status || "PENDING") as ChangeableShopStatus;
    };

    useEffect(() => {
        if (!id) return;
        setLoading(true);
        axiosInstance
            .get<ShopDetailResponse>(`/admin/shop/${id}`)
            .then(res => {
                const data = res.data.data;
                setShop(data);
                setSelectedStatus(getShopStatus(data));
            })
            .catch(err => {
                console.error(err);
                Alert.alert("오류", "상점 정보를 불러오지 못했습니다.");
            })
            .finally(() => setLoading(false));
    }, [id]);

    const handleUpdateStatus = async () => {
        if (!shop || !id) return;

        const currentStatus = getShopStatus(shop);
        if (selectedStatus === currentStatus) return;

        setIsUpdating(true);
        try {
            const res = await axiosInstance.put<{ message: string }>(`/admin/shop/${id}`, {
                status: selectedStatus,
            });
            Alert.alert("알림", res.data.message || "상태가 성공적으로 변경되었습니다.");

            setShop({
                ...shop,
                shopStatus: selectedStatus,
                status: selectedStatus,
                reviewedAt: new Date().toISOString(),
            });
        } catch (error) {
            console.error(error);
            Alert.alert("오류", "상태 변경 중 오류가 발생했습니다.");
        } finally {
            setIsUpdating(false);
        }
    };

    if (loading) {
        return (
            <View className="flex-1 justify-center items-center bg-brand-bg">
                <ActivityIndicator size="large" color="#3586FF" />
            </View>
        );
    }

    if (!shop) {
        return (
            <View className="flex-1 justify-center items-center bg-brand-bg p-5">
                <Text className="text-brand-txt-main font-pretendard-medium mb-4">
                    존재하지 않거나 정보를 불러올 수 없는 상점입니다.
                </Text>
                <BackButton />
            </View>
        );
    }

    const isChanged = selectedStatus !== getShopStatus(shop);

    return (
        <ScrollView className="flex-1 bg-brand-bg" contentContainerStyle={{ paddingBottom: 40 }}>
            {/* 상단 타이틀 바 */}
            <View className="h-14 relative bg-brand-surface items-center justify-center">
                <Text className="text-2xl font-pretendard-bold text-brand-navy">
                    상점 정보 조회
                </Text>
                <BackButton />
            </View>

            <View className="mx-5">
                <View className="mt-7 mb-5">
                    <Text className="text-brand-navy font-pretendard-bold text-2xl">
                        상점 상세 및 심사
                    </Text>
                    <Text className="text-brand-txt-sub mt-2 font-pretendard">
                        상점의 고유 정보와 가입 이력을 확인하고{"\n"}주차 정산 권한 등 상태를
                        부여합니다.
                    </Text>
                </View>

                {/* 상점 정보 카드 */}
                <View className="bg-brand-surface p-5 rounded-2xl gap-4 mb-8">
                    <View className="flex-row justify-between items-center border-b border-white/40 pb-3">
                        <Text className="text-brand-txt-sub font-pretendard">상점명</Text>
                        <Text className="font-pretendard-bold text-brand-txt-main text-lg">
                            {shop.name}
                        </Text>
                    </View>
                    <View className="flex-row justify-between items-center border-b border-white/40 pb-3">
                        <Text className="text-brand-txt-sub font-pretendard">상점 아이디</Text>
                        <Text className="font-pretendard-medium text-brand-txt-main">
                            {shop.loginId}
                        </Text>
                    </View>
                    <View className="flex-row justify-between items-center border-b border-white/40 pb-3">
                        <Text className="text-brand-txt-sub font-pretendard">신청 일시</Text>
                        <Text className="font-pretendard text-brand-txt-light text-sm">
                            {new Date(shop.createdAt).toLocaleString()}
                        </Text>
                    </View>
                    {shop.reviewedAt && (
                        <View className="bg-white/60 p-3 rounded-xl mt-1">
                            <Text className="text-xs font-pretendard text-brand-txt-light mb-1">
                                최근 심사 로그
                            </Text>
                            <Text className="text-xs font-pretendard text-brand-txt-main">
                                일시: {new Date(shop.reviewedAt).toLocaleString()}
                            </Text>
                            <Text className="text-xs font-pretendard text-brand-txt-main">
                                심사자 ID: {shop.reviewedBy}
                            </Text>
                        </View>
                    )}
                </View>

                {/* 심사 상태 설정 Buttons */}
                <Text className="text-brand-navy font-pretendard-bold text-lg mb-3">
                    심사 상태 설정
                </Text>
                <View className="flex-row flex-wrap gap-2 mb-8">
                    {Object.values(ShopStatus).map(option => {
                        const isSelected = selectedStatus === option;
                        return (
                            <Pressable
                                key={option}
                                onPress={() => setSelectedStatus(option as ChangeableShopStatus)}
                                style={{ width: "48%" }}
                                className={twMerge(
                                    "py-3.5 items-center justify-center rounded-xl bg-brand-surface border border-transparent",
                                    isSelected && "bg-brand-accent border-brand-warning",
                                )}>
                                <Text
                                    className={twMerge(
                                        "font-medium text-brand-txt-light",
                                        isSelected && "text-brand-navy font-bold",
                                    )}>
                                    {option}
                                </Text>
                            </Pressable>
                        );
                    })}
                </View>

                {/* 적용 버튼 */}
                <Button
                    color="navy"
                    variant={isChanged ? "contained" : "outlined"}
                    size="large"
                    disabled={!isChanged || isUpdating}
                    onPress={handleUpdateStatus}
                    className={twMerge(
                        "h-[52px] w-full rounded-xl mb-12",
                        !isChanged && "bg-brand-surface border-brand-border opacity-50",
                    )}>
                    {isUpdating ? "변경 중..." : "상태 변경 적용"}
                </Button>
            </View>
        </ScrollView>
    );
}

export default AdminShopDetailPage;
