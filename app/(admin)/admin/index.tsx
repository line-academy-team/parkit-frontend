import { useEffect, useState } from "react";
import { useRouter } from "expo-router";
import { ScrollView, Text, View, ActivityIndicator, Pressable } from "react-native";
import axiosInstance from "@/api/axiosInstance";
import { Shops } from "@/types/shop";
import BackButton from "@/components/common/button/BackButton";

interface ShopListResponse {
    message: string;
    data: {
        total: number;
        list: Shops[];
    };
}

function AdminDashboardPage() {
    const router = useRouter();
    const [shops, setShops] = useState<Shops[]>([]);
    const [total, setTotal] = useState(0);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        axiosInstance
            .get<ShopListResponse>("/admin/shops")
            .then(res => {
                setShops(res.data.data.list);
                setTotal(res.data.data.total);
            })
            .catch(err => console.error(err))
            .finally(() => setLoading(false));
    }, []);

    const getStatusStyle = (status: Shops["shopStatus"]) => {
        switch (status) {
            case "APPROVED":
                return { bg: "bg-brand-primary/10", text: "text-brand-primary" };
            case "PENDING":
                return { bg: "bg-brand-warning/10", text: "text-brand-warning" };
            case "REJECTED":
                return { bg: "bg-brand-danger/10", text: "text-brand-danger" };
            default:
                return { bg: "bg-brand-surface", text: "text-brand-txt-sub" };
        }
    };

    if (loading) {
        return (
            <View className="flex-1 justify-center items-center bg-brand-bg">
                <ActivityIndicator size="large" color="#3586FF" />
            </View>
        );
    }

    return (
        <ScrollView className="bg-brand-bg">
            <View className="h-14 relative bg-brand-surface items-center justify-center">
                <Text className="text-2xl font-pretendard-bold text-brand-navy">
                    관리자 대시보드
                </Text>
                <BackButton />
            </View>

            <View className="mx-5">
                <View className="mt-7 mb-4">
                    <Text className="text-brand-navy font-pretendard-bold text-2xl">
                        상점 목록 관리
                    </Text>
                    <Text className="text-brand-txt-sub mt-2 font-pretendard">
                        등록 신청된 상점 목록을 심사하고{"\n"}상태를 변경할 수 있습니다.
                    </Text>
                </View>

                <View className="mb-4 bg-brand-surface py-2 px-4 rounded-xl self-start">
                    <Text className="text-brand-navy font-pretendard-semibold text-sm">
                        총 상점 {total}개
                    </Text>
                </View>

                <View className="gap-3 mb-10">
                    {shops.map(shop => {
                        const badgeStyle = getStatusStyle(shop.shopStatus);
                        return (
                            <Pressable
                                key={shop.id}
                                onPress={() => router.push(`/admin/shop/${shop.id}`)}
                                className="p-5 bg-white border border-brand-border rounded-2xl active:opacity-70 shadow-sm">
                                <View className="flex-row justify-between items-center mb-2">
                                    <Text className="text-xl font-pretendard-bold text-brand-txt-main">
                                        {shop.name}
                                    </Text>
                                    <View className={`px-2.5 py-1 rounded-lg ${badgeStyle.bg}`}>
                                        <Text
                                            className={`text-xs font-pretendard-bold ${badgeStyle.text}`}>
                                            {shop.shopStatus}
                                        </Text>
                                    </View>
                                </View>
                                <Text className="text-sm font-pretendard text-brand-txt-sub">
                                    아이디: {shop.loginId}
                                </Text>
                                <Text className="text-xs font-pretendard text-brand-txt-light mt-3">
                                    신청일시: {new Date(shop.createdAt).toLocaleDateString()}
                                </Text>
                            </Pressable>
                        );
                    })}
                </View>
            </View>
        </ScrollView>
    );
}

export default AdminDashboardPage;
