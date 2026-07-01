import { z } from "zod";

export const registerShopSchema = z
    .object({
        loginId: z.string().min(4, "아이디는 4자 이상 입력해주세요."),
        password: z.string().min(6, "비밀번호는 6자 이상 입력해주세요."),
        confirmPassword: z.string().min(6, "비밀번호 확인을 입력해주세요."),
        name: z.string().min(1, "상호명을 정확히 입력해주세요."),
    })
    .refine(data => data.password === data.confirmPassword, {
        path: ["passwordConfirm"],
        message: "비밀번호가 일치하지 않습니다.",
    });

export type RegisterShopInputType = z.infer<typeof registerShopSchema>;
