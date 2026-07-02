export const ShopStatus = {
    PENDING: "PENDING",
    APPROVED: "APPROVED",
    REJECTED: "REJECTED",
    SUSPENDED: "SUSPENDED",
};

export type ShopStatusType = (typeof ShopStatus) [keyof typeof ShopStatus];

export interface Shop {
    id: number;
    loginId: string;
    name: string;
    shopStatus: ShopStatusType;
    reviewedBy: number;
    reviewedAt: string;
    createdAt: string;
    updatedAt: string;
    deletedAt: string | null;
}