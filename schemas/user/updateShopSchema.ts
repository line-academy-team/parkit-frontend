import { z } from "zod";

export const updateShopSchema = z.object({
    loginId: z.string().optional(),
    name: z.string()
        .min(1, "변경할 상호명을 입력해주세요.")
        .max(40, "40자 이하로 입력해주세요."),
});

export type UpdateShopInputType = z.infer<typeof updateShopSchema>;
