import { Stack, useRouter } from "expo-router";
import { useEffect, useState } from "react";
import { ActivityIndicator, View } from "react-native";
import { adminAuthStore } from "@/stores/auth/adminAuthStore";

function AdminShopLayout() {
    const { token, logout } = adminAuthStore();
    const [isChecking, setIsChecking] = useState(true);
    const router = useRouter();

    useEffect(() => {
        const checkAdminAuth = async () => {
            try {
                if (!token) {
                    logout();
                    router.replace("/admin/login");
                    return;
                }
            } catch (error) {
                console.log(error);
                logout();
                router.replace("/admin/login");
            } finally {
                setIsChecking(false);
            }
        };

        checkAdminAuth();
    }, [token, logout, router]);

    return (
        <View style={{ flex: 1 }}>
            {/* Stack 구조는 항상 고정으로 유지되어 자식 컴포넌트의 Hook 큐를 깨뜨리지 않습니다 */}
            <Stack
                screenOptions={{
                    headerShown: false,
                    contentStyle: {
                        backgroundColor: "#FFFFFF",
                    },
                }}
            />

            {/* 검사 중일 때만 화면 위에 로딩 뷰를 overlay로 띄웁니다 */}
            {isChecking && (
                <View className="absolute inset-0 items-center justify-center bg-white z-50">
                    <ActivityIndicator size="large" color="#284776" />
                </View>
            )}
        </View>
    );
}

export default AdminShopLayout;
