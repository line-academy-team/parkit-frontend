export const ShopStatus = {
    PENDING: "PENDING",
    APPROVED: "APPROVED",
    REJECTED: "REJECTED",
    SUSPENDED: "SUSPENDED",
};

export type ShopStatusType = (typeof ShopStatus) [keyof typeof ShopStatus];

export interface Shops {
    id: number;
    loginId: string;
    name: string;
    shopStatus: ShopStatusType;
    reviewedBy: number | null;
    reviewedAt: string | null;
    createdAt: string;
    updatedAt: string;
    deletedAt: string | null;
}