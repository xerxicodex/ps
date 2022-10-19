import { TRPCError } from "@trpc/server";
import type { Context } from "../createContext";

export const getMeHandler = ({ ctx }: { ctx: Context }) => {
    try {
        const trainer = ctx.trainer;
        return {
            status: "success",
            data: {
                trainer,
            },
        };
    } catch (err: any) {
        throw new TRPCError({
            code: "INTERNAL_SERVER_ERROR",
            message: err.message,
        });
    }
};
