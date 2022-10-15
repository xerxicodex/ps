import { User } from "@prisma/client";
import { NextApiRequest, NextApiResponse } from "next";

interface IContext {
  req: NextApiRequest;
  res: NextApiResponse;
  user?: User
}

export function createContext({
  req,
  res,
}: IContext) {
  return { } as unknown as IContext;
}

export type Context = ReturnType<typeof createContext>;
