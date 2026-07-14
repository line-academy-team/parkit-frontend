export interface ParkingRecordSummary {
    id: number;
    plateNumber: string;
    entryTime: string;
    discountCount: number;
    totalDiscountMinutes: number;
    myDiscountMinutes: number;
}

export interface ParkingSlotItem {
    id: number;
    floor: number;
    spaceNumber: string;
    isOccupied: boolean;
    parkingRecord: ParkingRecordSummary | null;
}

export interface GetParkingSlotsResponse {
    totalCount: number;
    occupiedCount: number;
    emptyCount: number;
    slots: ParkingSlotItem[];
}
