import { ParkingRecords } from "./parkingRecords";

export interface ParkingSlots {
    id: number;
    spaceNumber: string;
    floor: number;
    createdAt: string;
    updatedAt: string;
    parkingRecords: Pick<ParkingRecords, "id" | "discounts" | "plateNumber" | "entryTime"> | null;
}