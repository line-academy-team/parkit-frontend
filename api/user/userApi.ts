import { RegisterShopInputType } from "../../schemas/user/registerShopSchema";
import { Shops } from "../../types/shop";
import axiosInstance from "../../api/axiosInstance";
import { LoginInputType } from "../../schemas/user/loginShopSchema";
import shopAxiosInstance from "@/api/shopAxiosInstance";
import { GetParkingSlotsResponse } from "@/types/parkingSlots";
import {
    UpsertParkingDiscountRequest,
    UpsertParkingDiscountResponse,
} from "@/schemas/parkingDiscount/upsertParkingDiscountSchema";

export interface ParkingRecordDetail {
    id: number;
    plateNumber: string;
    entryTime: string;
    exitTime: string | null;
    currentParkingMinutes: number;
    totalDiscountMinutes: number;
    myDiscountMinutes: number;
    parkingSlot: {
        id: number;
        floor: number;
        spaceNumber: string;
    };
}

const registerShop = async (
    data: Omit<RegisterShopInputType, "confirmPassword">,
): Promise<Shops> => {
    const response = await axiosInstance.post("/shop/create", data);
    return response.data;
};

const loginShop = async (data: LoginInputType): Promise<{ shop: Shops; token: string }> => {
    const response = await axiosInstance.post("/shop/login", data);
    return response.data.data;
};

const getMe = async (): Promise<Shops> => {
    const response = await shopAxiosInstance.get("/shop/me", {
        headers: {
            "Cache-Control": "no-cache",
        },
    });

    return response.data.data;
};

const getParkingSlots = async (): Promise<GetParkingSlotsResponse> => {
    const response = await shopAxiosInstance.get("/parkingSlot");
    return response.data;
};

const upsertParkingDiscount = async (
    body: UpsertParkingDiscountRequest,
): Promise<UpsertParkingDiscountResponse> => {
    const response = await shopAxiosInstance.put("/parkingDiscount", body);

    return response.data.data;
};

const getParkingRecordById = async (parkingRecordId: number): Promise<ParkingRecordDetail> => {
    const response = await shopAxiosInstance.get(`/parkingRecord/${parkingRecordId}`);

    return response.data.data;
};

export default {
    registerShop,
    loginShop,
    getMe,
    getParkingSlots,
    getParkingRecordById,
    upsertParkingDiscount,
};
