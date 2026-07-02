import { useRouter } from "expo-router";
import { zodResolver } from "@hookform/resolvers/zod";
import { RegisterShopInputType, registerShopSchema } from "../../../../schemas/user/registerShopSchema";
import { Controller, useForm } from "react-hook-form";
import userApi from "../../../../api/user/userApi";
import {
    Alert,
    Image,
    KeyboardAvoidingView,
    Platform,
    Pressable,
    ScrollView,
    Text,
    TextInput,
    View,
} from "react-native";
import { isAxiosError } from "axios";
import { twMerge } from "tailwind-merge";

function AuthRegisterPage() {
    const router = useRouter();

    const {
        control,
        handleSubmit,
        setError,
        formState: { errors, isSubmitting },
    } = useForm({
        resolver: zodResolver(registerShopSchema),
        mode: "onTouched",
        defaultValues: {
            loginId: "",
            password: "",
            name: "",
        },
    });

    const onSubmit = async (data: RegisterShopInputType) => {
        try {
            const { confirmPassword, ...submitData } = data;

            await userApi.registerShop(submitData);

            if (Platform.OS === "web") {
                window.alert("회원가입이 완료되었습니다. 로그인을 진행해주세요.");
                router.push("/auth/login");
            } else {
                Alert.alert("가입 완료", "회원가입이 완료되었습니다. 로그인을 진행해주세요", [
                    { text: "확인", onPress: () => router.push("/auth/login") },
                ]);
            }
        } catch (error) {
            console.log(error);
            let errorMessage = "회원가입 중 오류가 발생했습니다.";

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
                        <Text>안드로이드 기본 상단 바 영역</Text>
                    </View>
                    <View
                        className={twMerge(
                            "h-14 relative",
                            "bg-brand-surface",
                            "items-center justify-center",
                        )}>
                        <Text className={"text-2xl font-bold"}>상점 등록</Text>
                        <View
                            className={twMerge(
                                "h-14 w-14 absolute",
                                "items-center justify-center",
                                "left-0",
                            )}>
                            <Image
                                source={require("@/assets/images/register/backBtn.png")}
                                resizeMode="contain"
                                className="absolute"
                                style={{
                                    width: 16,
                                    height: 16,
                                }}
                            />
                        </View>
                    </View>
                    <Text>회원가입</Text>
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
                    <Controller
                        control={control}
                        name={"confirmPassword"}
                        render={({ field: { onChange, onBlur, value } }) => {
                            return (
                                <>
                                    <Text>비밀번호 확인</Text>
                                    <TextInput
                                        placeholder={"6자 이상 입력해주세요"}
                                        secureTextEntry={true}
                                        onBlur={onBlur}
                                        onChangeText={onChange}
                                        value={value}
                                    />
                                    {errors.confirmPassword?.message && (
                                        <Text>{errors.confirmPassword.message}</Text>
                                    )}
                                </>
                            );
                        }}
                    />
                    <Controller
                        control={control}
                        name={"name"}
                        render={({ field: { onChange, onBlur, value } }) => {
                            return (
                                <>
                                    <Text>상호명</Text>
                                    <TextInput
                                        placeholder={"상호명을 입력해주세요"}
                                        onBlur={onBlur}
                                        onChangeText={onChange}
                                        value={value}
                                    />
                                    {errors.name?.message && <Text>{errors.name.message}</Text>}
                                </>
                            );
                        }}
                    />
                    <Pressable disabled={isSubmitting} onPress={handleSubmit(onSubmit)}>
                        <Text>회원가입</Text>
                    </Pressable>
                </View>
            </ScrollView>
        </KeyboardAvoidingView>
    );
}

export default AuthRegisterPage;
