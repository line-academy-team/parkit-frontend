import { Shops } from "./shop";

export interface ParkingDiscounts {
    id: number;
    discountMinute: number;
    shopId: number;
    createdAt: number;
    updatedAt: number;
    shop: Pick<Shops, "id" | "name">;
}