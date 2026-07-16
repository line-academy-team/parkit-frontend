import { z } from "zod";

export const updateShopPasswordSchema = z
    .object({
        prevPassword: z.string().min(1, "현재 비밀번호를 입력해 주세요."),
        password: z.string().min(6, "6자 이상 입력해 주세요."),
        confirmPassword: z.string().min(6, "비밀번호를 한 번 더 입력해 주세요."),
    })
    .refine(data => data.password === data.confirmPassword, {
        message: "비밀번호 확인이 일치하지 않습니다.",
        path: ["confirmPassword"],
    });

export type UpdatePasswordInputType = z.infer<typeof updateShopPasswordSchema>;
