import { Link, useRouter } from "expo-router";
import { zodResolver } from "@hookform/resolvers/zod";
import {
    RegisterShopInputType,
    registerShopSchema,
} from "@/schemas/user/registerShopSchema";
import { Controller, useForm, useWatch } from "react-hook-form";
import userApi from "@/api/user/userApi";
import {
    Alert,
    KeyboardAvoidingView,
    Platform,
    Pressable,
    ScrollView,
    Text,
    View,
} from "react-native";
import { isAxiosError } from "axios";
import { twMerge } from "tailwind-merge";
import BackButton from "@/components/common/button/BackButton";
import InputGroup from "@/components/common/input/InputGroup";
import Title from "@/components/common/title/Title";

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
            confirmPassword: "",
            name: "",
        },
    });

    const { loginId, password, name } = useWatch({
        control,
    });

    const isFilled = Boolean(
        loginId?.trim() && password?.trim() && name?.trim() && !errors.confirmPassword,
    );

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
            if (Platform.OS === "web") {
                window.alert("회원가입이 완료되었습니다. 로그인을 진행해주세요.");
                router.push("/");
            } else {
                Alert.alert("가입 완료", "회원가입이 완료되었습니다. 로그인을 진행해주세요", [
                    { text: "확인", onPress: () => router.push("/") },
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
                    <Title title={"상점 등록"} isCenter>
                        <BackButton />
                    </Title>
                    <View className={"mx-5"}>
                        <View className={"mt-7 mb-2"}>
                            <Text className={"text-brand-navy font-pretendard-bold text-2xl"}>
                                상점 정보를 입력해 주세요
                            </Text>
                            <Text className={"text-brand-txt-sub mt-2 font-pretendard"}>
                                등록된 상점은 관리자 승인 후 <br />
                                주차 할인 서비스를 이용할 수 있습니다.
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
                                        infoMessage={"4자 이상 20자 이하로 입력해 주세요."}
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
                                        placeholder={"비밀번호를 입력해 주세요"}
                                        onBlur={onBlur}
                                        onChangeText={onChange}
                                        value={value}
                                        infoMessage={"6자 이상 입력해 주세요."}
                                        errorMessage={errors.password?.message}
                                        isPassword={true}
                                    />
                                );
                            }}
                        />
                        <Controller
                            control={control}
                            name={"confirmPassword"}
                            render={({ field: { onChange, onBlur, value } }) => {
                                return (
                                    <InputGroup
                                        label={"비밀번호 확인"}
                                        placeholder={"비밀번호를 한 번 더 입력해주세요."}
                                        onBlur={onBlur}
                                        onChangeText={onChange}
                                        value={value}
                                        infoMessage={"위와 같은 비밀번호를 입력해주세요."}
                                        errorMessage={errors.confirmPassword?.message}
                                        isPassword={true}
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
                                        placeholder={"상호명을 입력해 주세요"}
                                        onBlur={onBlur}
                                        onChangeText={onChange}
                                        value={value}
                                        infoMessage={"40자 이하로 입력해 주세요."}
                                        errorMessage={errors.name?.message}
                                    />
                                );
                            }}
                        />

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
                                상점 등록
                            </Text>
                        </Pressable>
                    </View>
                    <View className="mt-5 flex-row items-center justify-center gap-2">
                        <Text className="text-brand-txt-sub font-pretendard-semibold">
                            이미 등록하셨나요?
                        </Text>
                        <Link href={"/auth/login"}>
                            <Text className="text-brand-primary font-pretendard-semibold">
                                상점 로그인
                            </Text>
                        </Link>
                    </View>
                </View>
            </ScrollView>
        </KeyboardAvoidingView>
    );
}

export default AuthRegisterPage;
