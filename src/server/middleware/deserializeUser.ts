import { TRPCError } from "@trpc/server";
import { NextApiRequest, NextApiResponse } from "next";
import { findUniqueTrainer } from "../services/trainer.service";
import redisClient from "../utils/connectRedis";
import { verifyJwt } from "../utils/jwt";

export const deserializeUser = async ({
  req,
  res,
}: {
  req: NextApiRequest;
  res: NextApiResponse;
}) => {
  try {
    // Get the token
    let access_token;
    if (
      req.headers.authorization &&
      req.headers.authorization.startsWith("Bearer")
    ) {
      access_token = req.headers.authorization.split(" ")[1];
    } else if (req.cookies.access_token) {
      access_token = req.cookies.access_token;
    }

    const notAuthenticated = {
      req,
      res,
      trainer: null,
    };

    if (!access_token) {
      return notAuthenticated;
    }

    // Validate Access Token
    const decoded = verifyJwt<{ sub: string }>(
      access_token,
      "accessTokenPublicKey"
    );

    if (!decoded) {
      return notAuthenticated;
    }

    // Check if  trainerhas a valid session
    const session = await redisClient.get(`trainer-${decoded.sub}`);

    if (!session) {
      return notAuthenticated;
    }

    // Check if  trainerstill exist
    const  trainer= await findUniqueTrainer({ id: JSON.parse(session).id });

    if (!trainer) {
      return notAuthenticated;
    }

    return {
      req,
      res,
      trainer: { ...trainer, id: trainer.id },
    };
  } catch (err: any) {
    throw new TRPCError({
      code: "INTERNAL_SERVER_ERROR",
      message: err.message,
    });
  }
};
