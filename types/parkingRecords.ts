import { ParkingDiscounts } from "./parkingDiscounts";
import { ParkingSlotItem } from "./parkingSlots";
import { ParkingPayments } from "./parkingPayment";

export interface ParkingRecords {
    id: number;
    plateNumber: string;
    entryTime: string;
    exitTime: string;
    createdAt: string;
    updatedAt: string;
    parkingSlotId: number;
    parkingSlots: Pick<ParkingSlotItem, "id">;
    discounts: Pick<ParkingDiscounts, "id" | "discountMinute"> | null;
    payment: Pick<ParkingPayments, "id">;
}
