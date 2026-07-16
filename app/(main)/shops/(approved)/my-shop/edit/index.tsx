import { shopAuthStore } from "@/stores/auth/shopAuthStore";
import { Controller, useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { UpdateShopInputType, updateShopSchema } from "@/schemas/user/updateShopSchema";
import { useEffect, useState } from "react";
import userApi from "@/api/user/userApi";
import { Alert, KeyboardAvoidingView, Platform, ScrollView, Text, View } from "react-native";
import { isAxiosError } from "axios";
import { useRouter } from "expo-router";
import Title from "@/components/common/title/Title";
import BackButton from "@/components/common/button/BackButton";
import InputGroup from "@/components/common/input/InputGroup";
import ErrorMessage from "@/components/common/form/ErrorMessage";
import Button from "@/components/common/button/Button";

function UpdateMyShopPage() {
    const router = useRouter();
    const [loginId, setLoginId] = useState("");

    const {
        control,
        handleSubmit,
        reset,
        setError,
        formState: { errors, isSubmitting },
    } = useForm({
        resolver: zodResolver(updateShopSchema),
        mode: "onBlur",
        defaultValues: {
            loginId: "",
            name: "",
        },
    });

    useEffect(() => {
        const loadName = async () => {
            try {
                const result = await userApi.getMe();
                setLoginId(result.loginId);
                reset({
                    loginId: result.loginId,
                    name: result.name,
                });
            } catch (error) {
                console.log(error);
                if (Platform.OS === "web") {
                    alert("상점 정보 수정 중 오류가 발생하였습니다.");
                    router.back();
                } else {
                    Alert.alert("오류", "상점 정보 수정 중 오류가 발생하였습니다.", [
                        { text: "확인", onPress: () => router.back() },
                    ]);
                }
            }
        };

        loadName().then(() => {});
    }, [reset, router]);

    const onSubmit = async (data: UpdateShopInputType) => {
        try {
            const result = await userApi.updateShop(data);
            if (Platform.OS === "web") {
                alert("상점 정보가 성공적으로 수정 되었습니다.");
                router.back();
            } else {
                Alert.alert("성공", "상점 정보가 성공적으로 수정 되었습니다.", [
                    { text: "확인", onPress: () => router.back() },
                ]);
            }
            shopAuthStore.setState({ shop: result });
        } catch (error) {
            console.log(error);
            let errorMessage = "상점 정보 수정 중 오류가 발생했습니다.";

            if (isAxiosError(error)) {
                errorMessage = error.response?.data?.message || errorMessage;
            } else if (error instanceof Error) {
                errorMessage = error.message;
            }

            setError("root", { message: errorMessage });
        }
    };

    return (
        <KeyboardAvoidingView>
            <ScrollView>
                <View>
                    <Title title={"상점 정보 수정"} isCenter className="mb-5">
                        <BackButton />
                    </Title>

                    <View className="px-5">
                        <View className="mb-5">
                            <Controller
                                control={control}
                                name={"loginId"}
                                render={({ field: { onChange, onBlur, value } }) => {
                                    return (
                                        <InputGroup
                                            label={"로그인 아이디"}
                                            placeholder={`${loginId}`}
                                            onBlur={onBlur}
                                            onChangeText={onChange}
                                            value={value}
                                            infoMessage={"수정할 수 없는 정보입니다."}
                                            editable={false}
                                            selectTextOnFocus={false}
                                        />
                                    );
                                }}
                            />
                            <Controller
                                control={control}
                                name={"name"}
                                render={({ field: { onChange, onBlur, value } }) => {
                                    return (
                                        <InputGroup
                                            label={"상호명"}
                                            placeholder={"변경할 상호명을 입력해주세요."}
                                            onBlur={onBlur}
                                            onChangeText={onChange}
                                            value={value}
                                            infoMessage={"40자 이하로 입력해주세요."}
                                            errorMessage={errors.name?.message}
                                        />
                                    );
                                }}
                            />
                        </View>

                        {errors.root?.message && <ErrorMessage>{errors.root.message}</ErrorMessage>}

                        <Button
                            variant={"contained"}
                            color={"navy"}
                            onPress={handleSubmit(onSubmit)}
                            disabled={isSubmitting}>
                            <Text className="text-brand-bg text-xl font-pretendard-semibold">
                                수정 완료
                            </Text>
                        </Button>
                    </View>
                </View>
            </ScrollView>
        </KeyboardAvoidingView>
    );
}

export default UpdateMyShopPage;
