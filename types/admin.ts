import { Shops } from "./shop";
import { Notice } from "./notice";

export interface Admins {
    id: number;
    loginId: string;
    password: string;
    name: string;
    createdAt: string;
    updatedAt: string;
    shop: Pick<Shops, "id" | "name"> | null;
    notices: Pick<Notice, "id"> | null;
}
