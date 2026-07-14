import { Notice } from "@/types/notice";
export interface DashboardResponse {
    dashboard: {
        currentParked: number;
        emptySpots: number;
        todayDiscountCount: number;
        todayDiscountMinutes: number;
    };
    recentDiscounts: {
        id: number;
        plateNumber: string;
        location: string;
        createdAt: string;
        discount: number;
    }[];
    notice: Pick<Notice, "id" | "title" | "createdAt"> | null;
}
