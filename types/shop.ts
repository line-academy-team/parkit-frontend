import { Admins } from "./admin";
import { ParkingDiscounts } from "./parkingDiscounts";

export const ShopStatus = {
    PENDING: "PENDING",
    APPROVED: "APPROVED",
    REJECTED: "REJECTED",
    SUSPENDED: "SUSPENDED",
}

export type ShopStatusType = (typeof ShopStatus) [keyof typeof ShopStatus];

export interface Shops {
    id: number;
    loginId: string;
    password: string;
    name: string;
    status: ShopStatusType;
    reviewedBy: number;
    reviewedAt: string;
    createdAt: string;
    updatedAt: string;
    deletedAt: string | null;
    reviewer: Pick<Admins, "id">;
    discounts: Pick<ParkingDiscounts, "id" | "discountMinute"> | null;
}