import { ParkingDiscounts } from "./parkingDiscounts";

export interface ParkingRecords {
    id: number;
    plateNumber: string;
    entryTime: string;
    exitTime: string;
    createdAt: string;
    updatedAt: string;
    parkingSlotId: number;
    discounts: Pick<ParkingDiscounts, "id" | "discountMinute"> | null;
}