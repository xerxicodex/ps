import { Trainer } from "@prisma/client";
import { NextApiRequest, NextApiResponse } from "next";

export interface IContext {
    req: NextApiRequest;
    res: NextApiResponse;
    trainer?: Trainer;
    limit?: number,
    page?: number
}

export function createContext({ req, res, trainer, limit, page }: IContext) {
    return { req, res, trainer, limit, page };
}

export type Context = ReturnType<typeof createContext>;
