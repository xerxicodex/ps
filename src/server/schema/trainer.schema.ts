import { TrainerSkinEnumType } from "@prisma/client";
import { object, string, number, TypeOf } from "zod";

export const createTrainerSchema = object({
    username: string().min(1, "Username is required").max(100),
    password: string()
        .min(1, "Password is required")
        .min(7, "Password must 8 or more characters")
        .max(32, "Password must be less than 32 characters"),
    passwordConfirm: string().min(1, "Please confirm your password"),
    starter: number()
    .min(1, "Please select a starter")
    .max(3, "Invalid starter"),
    skin: string().refine((val) => {
        const skin = TrainerSkinEnumType[
            val.toLowerCase() as keyof typeof TrainerSkinEnumType
        ]

        console.log({ val, skin, test: (skin ? true : false) })

        return (skin ? true : false)
    }, "Please select a valid trainer skin")
}).refine((data) => data.password === data.passwordConfirm, {
    path: ["passwordConfirm"],
    message: "Passwords do not match",
});

export const loginTrainerSchema = object({
    username: string({ required_error: "Username is required" }),
    password: string({ required_error: "Password is required" }),
});

export type CreateTrainerInput = TypeOf<typeof createTrainerSchema>;
export type LoginTrainerInput = TypeOf<typeof loginTrainerSchema>;
