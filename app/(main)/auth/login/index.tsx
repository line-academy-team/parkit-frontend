import { useRouter } from "expo-router";
import { Controller, useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { LoginInputType, loginSchema } from "../../../../schemas/user/loginShopShema";
import { isAxiosError } from "axios";
import userApi from "../../../../api/user/userApi";
import { shopAuthStore } from "../../../../stores/auth/shopAuthStore";
import { KeyboardAvoidingView, Pressable, ScrollView, Text, TextInput, View } from "react-native";

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

    const onSubmit = async (data: LoginInputType) => {
        try {
            const result = await userApi.loginShop(data);

            if (!result.shop && result.token) {
                login(result.shop, result.token);
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
    }

    return (
        <KeyboardAvoidingView>
            <ScrollView>
                <View>
                    <Text>로그인</Text>
                    <Controller
                        control={control}
                        name={"loginId"}
                        render={({ field: { onChange, onBlur, value } }) => {
                            return (
                                <>
                                    <Text>아이디</Text>
                                    <TextInput
                                        placeholder={"4자 이상 입력해주세요"}
                                        onBlur={onBlur}
                                        onChangeText={onChange}
                                        value={value}
                                    />
                                    {errors.loginId?.message && (
                                        <Text>{errors.loginId.message}</Text>
                                    )}
                                </>
                            );
                        }}
                    />
                    <Controller
                        control={control}
                        name={"password"}
                        render={({ field: { onChange, onBlur, value } }) => {
                            return (
                                <>
                                    <Text>비밀번호</Text>
                                    <TextInput
                                        placeholder={"6자 이상 입력해주세요"}
                                        secureTextEntry={true}
                                        onBlur={onBlur}
                                        onChangeText={onChange}
                                        value={value}
                                    />
                                    {errors.password?.message && (
                                        <Text>{errors.password.message}</Text>
                                    )}
                                </>
                            );
                        }}
                    />
                    <Pressable disabled={isSubmitting} onPress={handleSubmit(onSubmit)}>
                        <Text>로그인</Text>
                    </Pressable>
                </View>
            </ScrollView>
        </KeyboardAvoidingView>
    );
}

export default AuthLoginPage;
