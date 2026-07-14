import { Link, useRouter } from "expo-router";
import { Controller, useForm, useWatch } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { LoginInputType, loginSchema } from "@/schemas/user/loginShopSchema";
import { isAxiosError } from "axios";
import { adminAuthStore } from "@/stores/auth/adminAuthStore";
import { KeyboardAvoidingView, Pressable, ScrollView, Text, View } from "react-native";
import { twMerge } from "tailwind-merge";
import BackButton from "@/components/common/button/BackButton";
import InputGroup from "@/components/common/input/InputGroup";
import ErrorMessage from "@/components/common/form/ErrorMessage";
import adminApi from "@/api/admin/adminApi";

function AuthLoginPage() {
    const router = useRouter();
    const { login } = adminAuthStore();

    const {
        control,
        handleSubmit,
        setError,
        formState: { errors, isSubmitting },
    } = useForm({
        resolver: zodResolver(loginSchema),
        mode: "onTouched",
        defaultValues: {
            loginId: "",
            password: "",
        },
    });

    const { loginId, password } = useWatch({
        control,
    });

    const isFilled = Boolean(loginId?.trim() && password?.trim());

    const onSubmit = async (data: LoginInputType) => {
        try {
            const result = await adminApi.loginAdmin(data);

            if (!result.admin && result.token) {
                login(result.admin, result.token);
            }

            router.push("/");
        } catch (error) {
            console.log(error);
            let errorMessage = "로그인 중 오류가 발생했습니다.";

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
                    <View className={"h-6 bg-gray-300 items-center justify-center"}>
                        <Text className={"font-pretendard"}>안드로이드 기본 상단 바 영역</Text>
                    </View>
                    <View
                        className={twMerge(
                            "h-14 relative",
                            "bg-brand-surface",
                            "items-center justify-center",
                        )}>
                        <Text className={"text-2xl font-pretendard-bold"}>관리자 로그인</Text>
                        <BackButton />
                    </View>
                    <View className={"mx-5"}>
                        <View className={"mt-7 mb-2"}>
                            <Text className={"text-brand-navy font-pretendard-bold text-2xl"}>
                                관리자 계정으로 로그인
                            </Text>
                        </View>
                        <Controller
                            control={control}
                            name={"loginId"}
                            render={({ field: { onChange, onBlur, value } }) => {
                                return (
                                    <InputGroup
                                        label={"관리자 아이디"}
                                        placeholder={"아이디를 입력해 주세요"}
                                        onBlur={onBlur}
                                        onChangeText={onChange}
                                        value={value}
                                        infoMessage={"정확한 관리자 아이디를 입력해 주세요."}
                                        errorMessage={errors.loginId?.message}
                                    />
                                );
                            }}
                        />
                        <Controller
                            control={control}
                            name={"password"}
                            render={({ field: { onChange, onBlur, value } }) => {
                                return (
                                    <InputGroup
                                        label={"비밀번호"}
                                        placeholder={"비밀번호를 입력해 주세요."}
                                        onBlur={onBlur}
                                        onChangeText={onChange}
                                        value={value}
                                        infoMessage={"정확한 관리자 비밀번호를 입력해 주세요."}
                                        errorMessage={errors.password?.message}
                                        isPassword
                                    />
                                );
                            }}
                        />

                        {errors.root?.message && (
                            <ErrorMessage>{errors.root?.message}</ErrorMessage>
                        )}

                        <Pressable
                            disabled={!isFilled || isSubmitting}
                            onPress={handleSubmit(onSubmit)}
                            className={twMerge(
                                "mt-5 justify-center items-center h-[52px] bg-brand-surface rounded-xl",
                                isFilled && "bg-brand-navy",
                            )}>
                            <Text
                                className={twMerge(
                                    "text-brand-txt-sub font-pretendard-medium text-xl",
                                    isFilled && "text-brand-bg",
                                )}>
                                로그인
                            </Text>
                        </Pressable>
                    </View>
                </View>
            </ScrollView>
        </KeyboardAvoidingView>
    );
}

export default AuthLoginPage;
