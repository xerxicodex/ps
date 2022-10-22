import { Prisma, Reward, RewardEnumType } from "@prisma/client";

export function RewardValue(reward: Reward) : any {
    let value: any = null;

    if (reward) {
        switch (reward.reward ) {
            case RewardEnumType.pokemon:
                value = JSON.parse(reward.value ?? "{}");
                break;
        
            case RewardEnumType.trainer_exp:
            case RewardEnumType.pokemon_exp:
            case RewardEnumType.battle_points:
            case RewardEnumType.coins:
                value = parseInt(reward.value ?? "0")
                break;
        }
    }

    return value;
}

export function RewardName(reward: Reward) {
    let name = "";

    if (reward) {
        let value = RewardValue(reward);

        switch (reward.reward ) {
            case RewardEnumType.pokemon:
                name = value?.name;
                break;
        
            case RewardEnumType.trainer_exp:
                name = `Trainer EXP`
                break;
            case RewardEnumType.pokemon_exp:
                name = `Pokemon EXP`
                break;
            case RewardEnumType.battle_points:
                name = `Battle Points`
                break;
            case RewardEnumType.coins:
                name = `Coins`
                break;
        }
    }

    return name;
}

export function RewardAmount(reward: Reward) {
    let amount = 0;

    if (reward) {
        let value = RewardValue(reward);

        switch (reward.reward ) {
            case RewardEnumType.pokemon:
                amount = 1;
                break;
        
            case RewardEnumType.trainer_exp:
            case RewardEnumType.pokemon_exp:
            case RewardEnumType.battle_points:
            case RewardEnumType.coins:
                amount = value
                break;
        }
    }

    return amount;
}