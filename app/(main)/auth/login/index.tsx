import { useRouter } from "expo-router";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { LoginInputType, loginSchema } from "../../../../schemas/user/loginShopShema";
import { isAxiosError } from "axios";
import userApi from "../../../../api/user/userApi";
import { shopAuthStore } from "../../../../stores/auth/shopAuthStore";

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

    return <></>;
}

export default AuthLoginPage;
