import { ParkingStatus } from "@/types/parkingStatus";

export interface DiscountHistoryParams {
    plateNumber?: string;
    status?: ParkingStatus;
}

export interface DiscountHistorySummary {
    count: number;
    totalMinutes: number;
}

export interface DiscountHistoryItem {
    id: number;
    plateNumber: string;
    floor: number;
    spaceNumber: string;
    myDiscountMinutes: number;
    createdAt: string;
    isOccupied: boolean;
}

export interface GetDiscountHistoryResponse {
    todaySummary: DiscountHistorySummary;
    history: DiscountHistoryItem[];
}
