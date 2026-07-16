import { ParkingDiscounts } from "./parkingDiscounts";
import { ParkingSlots } from "./parkingSlots";
import { ParkingPayments } from "./parkingPayment";

export interface ParkingRecords {
    id: number;
    plateNumber: string;
    entryTime: string;
    exitTime: string;
    createdAt: string;
    updatedAt: string;
    parkingSlotId: number;
    parkingSlots: Pick<ParkingSlots, "id">;
    discounts: Pick<ParkingDiscounts, "id" | "discountMinute" | "shopId"> | null;
    payment: Pick<ParkingPayments, "id">
}
