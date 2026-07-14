export interface UpsertParkingDiscountRequest {
    parkingRecordId: number;
    discountMinutes: number;
}

export interface UpsertParkingDiscountResponse {
    id: number;
    shopId: number;
    parkingRecordId: number;
    discountMinutes: number;
    createdAt: string;
    updatedAt: string;
    totalDiscountMinutes: number;
    myDiscountMinutes: number;
}
