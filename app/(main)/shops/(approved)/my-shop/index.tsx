import { Alert, Modal, Platform, Pressable, Text, View } from "react-native";
import Title from "@/components/common/title/Title";
import { useCallback, useEffect, useState } from "react";
import userApi from "@/api/user/userApi";
import { Shops } from "@/types/shop";
import { useRouter } from "expo-router";
import Button from "@/components/common/button/Button";
import { twMerge } from "tailwind-merge";
import { shopAuthStore } from "@/stores/auth/shopAuthStore";

function MyShopScreen() {
    const router = useRouter();
    const [myShop, setMyShop] = useState<Shops | null>(null);
    const [modalVisible, setModalVisible] = useState(false);
    const { logout } = shopAuthStore();

    const loadMyShop = useCallback(async () => {
        try {
            const result = await userApi.getMe();
            setMyShop(result);
        } catch (error) {
            console.log(error);
            if (Platform.OS === "web") {
                alert("상점 정보를 불러오는 중 오류가 발생했습니다.");
                router.back();
            } else {
                Alert.alert("오류", "상점 정보를 불러오는 중 오류가 발생했습니다.");
                router.back();
            }
        }
    }, [router]);

    useEffect(() => {
        loadMyShop().then(() => {});
    }, []);

    if (!myShop) {
        return (
            <Text className="justify-center items-center text-lg text-brand-txt-sub">
                상점 정보를 불러올 수 없습니다
            </Text>
        );
    }

    const handleLogout = () => {
        logout();
        router.push("/");
    };

    return (
        <View className="flex-1">
            <Title title={"내 상점"} isCenter={false} />

            <View className="px-6 py-7">
                <View className="items-center">
                    <View className="w-full h-40 bg-brand-surface rounded-2xl items-center justify-center gap-1.5 max-w-2xl mb-8">
                        <View className="bg-brand-primary rounded-full w-14 h-14 justify-center items-center mb-1">
                            <Text className="text-brand-bg font-pretendard-semibold text-[16px]">
                                Icon
                            </Text>
                        </View>
                        <Text className="text-brand-navy text-[22px] font-pretendard-bold">
                            [{myShop?.name}]
                        </Text>
                        <Text className="bg-brand-primary px-[10px] py-1 rounded-2xl text-brand-bg text-xs">
                            승인 완료
                        </Text>
                    </View>
                </View>

                <Text className="text-brand-txt-main font-pretendard-semibold text-lg mb-2">
                    상점 정보
                </Text>
                <View className="justify-center bg-brand-surface rounded-2xl py-8 px-16 mb-8">
                    <View className="flex-row justify-between items-center">
                        <View className="items-center gap-5">
                            <Text className="text-[16px] text-brand-txt-light font-pretendard-medium">
                                로그인 아이디
                            </Text>
                            <Text className="text-[16px] text-brand-txt-light font-pretendard-medium">
                                상호명
                            </Text>
                            <Text className="text-[16px] text-brand-txt-light font-pretendard-medium">
                                등록일
                            </Text>
                            <Text className="text-[16px] text-brand-txt-light font-pretendard-medium">
                                승인일
                            </Text>
                        </View>
                        <View className="items-center gap-3">
                            <Text className="text-lg text-brand-txt-light font-pretendard-semibold">
                                {myShop.loginId}
                            </Text>
                            <Text className="text-lg text-brand-txt-main font-pretendard-semibold">
                                {myShop.name}
                            </Text>
                            <Text className="text-lg text-brand-txt-main font-pretendard-semibold">
                                {myShop.createdAt.slice(0, 10)}
                            </Text>
                            <Text className="text-lg text-brand-txt-main font-pretendard-semibold">
                                {myShop.reviewedAt ? myShop.reviewedAt?.slice(0, 10) : "X"}
                            </Text>
                        </View>
                    </View>
                </View>
                <Button
                    variant={"contained"}
                    color={"navy"}
                    className="mb-3"
                    onPress={() => router.push(`/shops/my-shop/edit`)}>
                    <Text className="text-brand-bg font-pretendard-medium text-[20px]">
                        상점 정보 수정
                    </Text>
                </Button>
                <Button
                    variant={"outlined"}
                    color={"primary"}
                    className="bg-brand-bg mb-5"
                    onPress={() => router.push("/shops/my-shop/password")}>
                    <Text className="text-brand-primary font-pretendard-medium text-[20px]">
                        비밀번호 변경
                    </Text>
                </Button>
                <Pressable
                    className="justify-center items-center"
                    onPress={() => setModalVisible(true)}>
                    <Text className="text-brand-txt-light text-[16px] font-pretendard-medium">
                        로그아웃
                    </Text>
                </Pressable>
            </View>

            <Modal
                animationType={"slide"}
                visible={modalVisible}
                onRequestClose={() => setModalVisible(false)}>
                <View className="flex-1 justify-end p-8">
                    <View
                        className={twMerge(
                            "p-8 justify-center items-center gap-5",
                            "border-2 border-brand-primary rounded-2xl bg-brand-bg",
                        )}>
                        <Text className="text-brand-txt-main font-pretendard-bold text-[20px]">
                            로그아웃 하시겠습니까?
                        </Text>
                        <Text className="text-brand-txt-sub text-center text-[16px]">
                            현재 로그인한 상점에서 <br />
                            로그아웃 처리를 진행합니다.
                        </Text>
                        <View className="flex-row w-44 justify-between items-center">
                            <Pressable
                                className={
                                    "bg-brand-surface rounded-xl items-center justify-center p-3"
                                }
                                onPress={() => setModalVisible(false)}>
                                <Text className="text-brand-txt-main font-pretendard-bold text-[16px] text-center">
                                    취소
                                </Text>
                            </Pressable>
                            <Button
                                variant={"contained"}
                                color={"navy"}
                                className="w-[82px] h-12"
                                onPress={handleLogout}>
                                로그아웃
                            </Button>
                        </View>
                    </View>
                </View>
            </Modal>
        </View>
    );
}

export default MyShopScreen;
