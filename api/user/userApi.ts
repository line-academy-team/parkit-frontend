import { RegisterShopInputType } from "@/schemas/user/registerShopSchema";
import { Shop } from "@/types/shop";
import axiosInstance from "@/api/axiosInstance";

const registerShop = async (
    data: Omit<RegisterShopInputType, "confirmPassword">,
): Promise<Shop> => {
    const response = await axiosInstance.post("/shop/create", data);
    return response.data;
};

export default { registerShop };
