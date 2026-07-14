import { GetParkingSlotsResponse } from "@/types/parkingSlots";
import shopAxiosInstance from "@/api/shopAxiosInstance";

const getParkingSlots = async (): Promise<GetParkingSlotsResponse> => {
    const response = await shopAxiosInstance.get("/parkingSlot");
    return response.data;
};

export default {
    getParkingSlots,
};
