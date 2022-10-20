import { Trainer } from "@prisma/client";
import { NextApiRequest, NextApiResponse } from "next";

interface IContext {
    req: NextApiRequest;
    res: NextApiResponse;
    trainer?: Trainer;
}

export function createContext({ req, res, trainer }: IContext) {
    return { req, res, trainer };
}

export type Context = ReturnType<typeof createContext>;
