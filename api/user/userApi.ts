import { RegisterShopInputType } from "@/schemas/user/registerShopSchema";
import { Shops } from "@/types/shop";
import axiosInstance from "@/api/axiosInstance";
import { LoginInputType } from "@/schemas/user/loginShopShema";

const registerShop = async (
    data: Omit<RegisterShopInputType, "confirmPassword">,
): Promise<Shops> => {
    const response = await axiosInstance.post("/shop/create", data);
    return response.data;
};

const loginShop = async (data: LoginInputType): Promise<{ shop: Shops, token: string }> => {
    const response = await axiosInstance.post("/shop/login", data);
    return response.data.data;
};

const getShop= async () => {
    const response = await axiosInstance.get("/shop/me", {
        headers: {
            "Cache-Control": "no-cache",
        },
    });
    return response.data.data;
}

export default {
    registerShop,
    loginShop,
    getShop,
};
