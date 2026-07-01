import { Admins } from "./admin";

export interface Notice {
    id: number;
    title: string;
    content: string;
    adminId: number;
    admin: Pick<Admins, "id">;
    createdAt: string;
    updatedAt: string;
}