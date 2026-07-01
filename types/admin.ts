import { Shops } from "./shop";
import { Notice } from "./notice";

export interface Admins {
    id: number;
    loginId: string;
    password: string;
    name: string;
    createdAt: string;
    updatedAt: string;
    shopId: number | null;
    shop: Pick<Shops, "id" | "name"> | null;
    noticeId: number | null;
    notices: Pick<Notice, "id"> | null;
}
