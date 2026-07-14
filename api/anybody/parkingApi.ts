import axiosInstance from "@/api/axiosInstance";

export interface SearchCarResponse {
    id: number;
    plateNumber: string;
    entryTime: string;
    parkedMinutes: number;
    discountMinutes: number;
    expectedFee: number;
    location: string;
}

export interface PaymentResponse {
    id: number;
    parkingRecordId: number;
    parkedMinutes: number;
    discountMinutes: number;
    originalFee: number;
    finalFee: number;
    createdAt: string;
}

const searchCar = async (plateNumber: string): Promise<SearchCarResponse> => {
    const response = await axiosInstance.get("/parkingRecord/search", {
        params: { plateNumber },
    });
    return response.data.data;
};

const payParkingFee = async (parkingRecordId: number): Promise<PaymentResponse> => {
    const response = await axiosInstance.post("/parkingPayment/pay", {
        parkingRecordId,
    });
    return response.data.data;
};

export default {
    searchCar,
    payParkingFee,
};
