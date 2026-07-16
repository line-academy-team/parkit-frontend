export const PARKING_STATUS = {
    ALL: "ALL",
    PARKING: "PARKING",
    EXITED: "EXITED",
} as const;

export type ParkingStatus = (typeof PARKING_STATUS)[keyof typeof PARKING_STATUS];
