import { Link, useRouter } from "expo-router";
import { Controller, useForm, useWatch } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { LoginInputType, loginSchema } from "@/schemas/user/loginShopShema";
import { isAxiosError } from "axios";
import userApi from "@/api/user/userApi";
import { shopAuthStore } from "@/stores/auth/shopAuthStore";
import { KeyboardAvoidingView, Pressable, ScrollView, Text, View } from "react-native";
import { twMerge } from "tailwind-merge";
import BackButton from "@/components/common/button/BackButton";
import InputGroup from "@/components/common/input/InputGroup";
import ErrorMessage from "@/components/common/form/ErrorMessage";
import Title from "@/components/common/title/Title";

function AuthLoginPage() {
    const router = useRouter();
    const { login } = shopAuthStore();

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
            const result = await userApi.loginShop(data);

            if (result.shop && result.token) {
                login(result.shop, result.token);
            }

            console.log(shopAuthStore.getState());

            if (result.shop.status === "APPROVED") {
                router.push("/");
            } else {
                router.push("/shop/status");
            }
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
                    <Title title={"상점 로그인"} isCenter>
                        <BackButton />
                    </Title>
                    <View className={"mx-5"}>
                        <View className={"mt-7 mb-2"}>
                            <Text className={"text-brand-navy font-pretendard-bold text-2xl"}>
                                상점 계정으로 로그인
                            </Text>
                            <Text className={"text-brand-text-sub mt-2 font-pretendard"}>
                                승인된 상점만 주차 할인 서비스를 <br />
                                이용할 수 있습니다.
                            </Text>
                        </View>
                        <Controller
                            control={control}
                            name={"loginId"}
                            render={({ field: { onChange, onBlur, value } }) => {
                                return (
                                    <InputGroup
                                        label={"상점 아이디"}
                                        placeholder={"아이디를 입력해 주세요"}
                                        onBlur={onBlur}
                                        onChangeText={onChange}
                                        value={value}
                                        infoMessage={"정확한 상점 아이디를 입력해 주세요."}
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
                                        infoMessage={"정확한 상점 비밀번호를 입력해 주세요."}
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
                    <View className={"mt-5 flex-row items-center justify-center gap-2"}>
                        <Text className={"text-brand-txt-sub font-pretendard-semibold"}>
                            아직 등록하지 않으셨나요?
                        </Text>
                        <Link href={"/auth/register"}>
                            <Text className={"text-brand-primary font-pretendard-semibold"}>
                                상점 등록
                            </Text>
                        </Link>
                    </View>
                </View>
            </ScrollView>
        </KeyboardAvoidingView>
    );
}

export default AuthLoginPage;
