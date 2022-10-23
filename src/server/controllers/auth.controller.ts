// [...] Imports
import { TRPCError } from "@trpc/server";
import bcrypt from "bcryptjs";
import { OptionsType } from "cookies-next/lib/types";
import { getCookie, setCookie } from "cookies-next";
import customConfig from "../config/default";
import { Context } from "../createContext";
import { CreateUserInput, LoginUserInput } from "../schema/trainer.schema";
import {
    CreateUser,
    FindUniqueTrainer,
    FindTrainer,
    signTokens,
} from "../services/trainer.service";
import redisClient from "../utils/connectRedis";
import { signJwt, verifyJwt } from "../utils/jwt";
import { CheckTrainerProgress } from "../data/trainer";
import { TrainerSkinEnumType } from "@prisma/client";

// [...] Cookie options
const cookieOptions: OptionsType = {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
};

const accessTokenCookieOptions: OptionsType = {
    ...cookieOptions,
    expires: new Date(
        Date.now() + customConfig.accessTokenExpiresIn * 60 * 1000
    ),
};

const refreshTokenCookieOptions: OptionsType = {
    ...cookieOptions,
    expires: new Date(
        Date.now() + customConfig.refreshTokenExpiresIn * 60 * 1000
    ),
};

// [...] Register trainer
export const registerHandler = async ({
    input,
}: {
    input: CreateUserInput;
}) => {
    try {
        const hashedPassword = await bcrypt.hash(input.password, 12);

        const trainer = await CreateUser({
            name: input.username,
            password: hashedPassword,
            starter: input.starter,
            skin: input.skin.toLowerCase() as keyof typeof TrainerSkinEnumType
        });

        return {
            status: "success",
            data: {
                trainer,
            },
        };
    } catch (err: any) {
        if (err.code === "P2002") {
            throw new TRPCError({
                code: "CONFLICT",
                message: "User already exists",
            });
        }
        throw err;
    }
};

// [...] Login trainer
export const loginHandler = async ({
    input,
    ctx: { req, res },
}: {
    input: LoginUserInput;
    ctx: Context;
}) => {
    try {
        // Get the  trainerfrom the collection
        const trainer = await FindTrainer({ name: input.username });

        // Check if  trainerexist and password is correct
        if (
            !trainer ||
            !(await bcrypt.compare(input.password, trainer.password))
        ) {
            throw new TRPCError({
                code: "BAD_REQUEST",
                message: "Invalid trainername or password",
            });
        }

        // Create the Access and refresh Tokens
        const { access_token, refresh_token } = await signTokens(trainer);

        // Send Access Token in Cookie
        setCookie("access_token", access_token, {
            req,
            res,
            ...accessTokenCookieOptions,
        });
        setCookie("refresh_token", refresh_token, {
            req,
            res,
            ...refreshTokenCookieOptions,
        });
        setCookie("logged_in", "true", {
            req,
            res,
            ...accessTokenCookieOptions,
            httpOnly: false,
        });

        await CheckTrainerProgress(trainer.id);

        console.log(req.cookies);

        // Send Access Token
        return {
            status: "success",
            access_token,
        };
    } catch (err: any) {
        throw err;
    }
};

// [...] Refresh tokens
export const refreshAccessTokenHandler = async ({
    ctx: { req, res },
}: {
    ctx: Context;
}) => {
    try {
        // Get the refresh token from cookie
        const refresh_token = getCookie("refresh_token", {
            req,
            res,
        }) as string;

        const message = "Could not refresh access token";
        if (!refresh_token) {
            throw new TRPCError({ code: "FORBIDDEN", message });
        }

        // Validate the Refresh token
        const decoded = verifyJwt<{ sub: string }>(
            refresh_token,
            "refreshTokenPublicKey"
        );

        if (!decoded) {
            throw new TRPCError({ code: "FORBIDDEN", message });
        }

        // Check if the  trainerhas a valid session
        const session = await redisClient.get(`trainer-${decoded.sub}`);
        if (!session) {
            throw new TRPCError({ code: "FORBIDDEN", message });
        }

        // Check if the  trainerexist
        const trainer = await FindUniqueTrainer({ id: JSON.parse(session).id });

        if (!trainer) {
            throw new TRPCError({ code: "FORBIDDEN", message });
        }

        // Sign new access token
        const access_token = signJwt(
            { sub: trainer.id },
            "accessTokenPrivateKey",
            {
                expiresIn: `${customConfig.accessTokenExpiresIn}m`,
            }
        );

        // Send the access token as cookie
        setCookie("access_token", access_token, {
            req,
            res,
            ...accessTokenCookieOptions,
        });
        setCookie("logged_in", "true", {
            req,
            res,
            ...accessTokenCookieOptions,
            httpOnly: false,
        });

        // Send response
        return {
            status: "success",
            access_token,
        };
    } catch (err: any) {
        throw err;
    }
};

// [...] Logout trainer
const logout = ({ ctx: { req, res } }: { ctx: Context }) => {
    setCookie("access_token", "", { req, res, maxAge: -1 });
    setCookie("refresh_token", "", { req, res, maxAge: -1 });
    setCookie("logged_in", "", { req, res, maxAge: -1 });
};

export const logoutHandler = async ({ ctx }: { ctx: Context }) => {
    try {
        const trainer = ctx.trainer;
        await redisClient.del(`trainer-${trainer?.id}`);
        logout({ ctx });
        return { status: "success" };
    } catch (err: any) {
        throw err;
    }
};
