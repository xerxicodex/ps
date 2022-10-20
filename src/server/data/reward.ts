import { RewardEnumType } from "@prisma/client";
import {
    GetTrainerById,
    GiveTrainerBattlePoints,
    GiveTrainerCoins,
    GiveTrainerExp,
    GiveTrainerItem,
    GiveTrainerMainPokemonEXP,
    GiveTrainerPokemon,
    GiveTrainerPokemonEXP,
    GiveTrainerRewardPokemon,
} from "./trainer";

export async function GetRewardById(id: number) {
    return await prisma.reward.findFirst({ where: { id } });
}

export async function GetReward(reward: RewardEnumType) {
    return await prisma.reward.findFirst({ where: { reward } });
}

export async function GiveRewardToTrainer(
    reward_id: number,
    trainer_id: number
): Promise<any> {
    const reward = await GetRewardById(reward_id);

    if (reward) {
        const trainer = await GetTrainerById(trainer_id);

        if (trainer) {
            let func: any = {
                [RewardEnumType.item]: GiveTrainerItem,
                [RewardEnumType.coins]: GiveTrainerCoins,
                [RewardEnumType.pokemon]: (x: any, y: any) =>
                    GiveTrainerRewardPokemon(
                        trainer.id,
                        reward.value as string
                    ),
                [RewardEnumType.pokemon_exp]: GiveTrainerMainPokemonEXP,
                [RewardEnumType.trainer_exp]: GiveTrainerExp,
                [RewardEnumType.battle_points]: GiveTrainerBattlePoints,
            }[reward.reward as string];

            if (func) {
                await func(trainer.id, parseInt(reward.value ?? "0"));
            }
        }
    }
}
