import { Shops } from "./shop";
import { ParkingRecords } from "./parkingRecords";

export interface ParkingDiscounts {
    id: number;
    discountMinute: number;
    shopId: number;
    createdAt: number;
    updatedAt: number;
    shop: Pick<Shops, "id" | "name">;
    parkingRecords: Pick<ParkingRecords, "id">;
}