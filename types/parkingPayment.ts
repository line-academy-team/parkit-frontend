import { ParkingRecords } from "./parkingRecords";

export interface ParkingPayments {
    id: number;
    parkingRecordId: number;
    parkedMinutes: number;
    discountMinutes: number;
    originalFee: number;
    finalFee: number;
    createdAt: string;
    parkingRecord: Pick<ParkingRecords, "id">;
}