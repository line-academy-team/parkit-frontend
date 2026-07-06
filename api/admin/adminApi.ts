import { LoginInputType } from "@/schemas/user/loginShopShema";
import { Admins } from "@/types/admin";
import axiosInstance from "@/api/axiosInstance";
import { Shops } from "@/types/shop";

const loginAdmin = async (data: LoginInputType): Promise<{ admin: Admins; token: string }> => {
    const response = await axiosInstance.post("/admin/login", data);
    return response.data.data;
};

const getShopList = async (): Promise<{ total: string; list: Shops[] }> => {
    const response = await axiosInstance.get("/admin/shops");
    return response.data.data;
};

const getShopById = async (shopId: string): Promise<Shops[]> => {
    const response = await axiosInstance.get(`/admin/shop/${shopId}`);
    return response.data.data;
};

export default {
    loginAdmin,
    getShopList,
    getShopById,
};
