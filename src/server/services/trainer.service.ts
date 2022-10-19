import { Prisma, Trainer } from "@prisma/client";
import customConfig from "../config/default";
import redisClient from "../utils/connectRedis";
import { signJwt } from "../utils/jwt";
import { prisma } from "../utils/prisma";

export const createUser = async (input: Prisma.TrainerCreateInput) => {
    return (await prisma.trainer.create({
        data: input,
    })) as Trainer;
};

export const findUser = async (
    where: Partial<Prisma.TrainerWhereInput>,
    select?: Prisma.TrainerSelect
) => {
    return (await prisma.trainer.findFirst({
        where,
        select,
    })) as Trainer;
};

export const findUniqueTrainer = async (
    where: Prisma.TrainerWhereUniqueInput,
    select?: Prisma.TrainerSelect
) => {
    return (await prisma.trainer.findUnique({
        where,
        select,
    })) as Trainer;
};

export const updateUser = async (
    where: Partial<Prisma.TrainerWhereUniqueInput>,
    data: Prisma.TrainerUpdateInput,
    select?: Prisma.TrainerSelect
) => {
    return (await prisma.trainer.update({ where, data, select })) as Trainer;
};

export const signTokens = async (trainer: Prisma.TrainerWhereUniqueInput) => {
    // 1. Create Session
    redisClient.set(`trainer-${trainer.id}`, JSON.stringify(trainer), {
        EX: customConfig.redisCacheExpiresIn * 60,
    });

    // 2. Create Access and Refresh tokens
    const access_token = signJwt({ sub: trainer.id }, "accessTokenPrivateKey", {
        expiresIn: `${customConfig.accessTokenExpiresIn}m`,
    });

    const refresh_token = signJwt(
        { sub: trainer.id },
        "refreshTokenPrivateKey",
        {
            expiresIn: `${customConfig.refreshTokenExpiresIn}m`,
        }
    );

    return { access_token, refresh_token };
};
