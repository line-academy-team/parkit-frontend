import axiosInstance from "@/api/axiosInstance";
import { GetParkingSlotsResponse } from "@/types/parkingSlots";

const getParkingSlots = async (): Promise<GetParkingSlotsResponse> => {
    const response = await axiosInstance.get("/parkingSlot");
    return response.data;
};

export default {
    getParkingSlots,
};
