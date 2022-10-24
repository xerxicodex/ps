import { TowerChallenge, TowerPokemon, Trainer, TrainerPokemon } from "@prisma/client";
import { randomUUID } from "crypto";
import { BattleStream, getPlayerStreams, Teams } from "./showdown/sim";
import { RandomPlayerAI } from "./showdown/sim/tools/random-player-ai";

export type ITowerBattle = {
    uid: string
    trainer?: Trainer | null
    trainerRoster?: TrainerPokemon[] | null
    challenge?: TowerChallenge | null
    pokemon?: TowerPokemon[] | null
    inputLogs?: string[] | null
    logs?: string[] | null
    currentFloor?: number
    totalFloors?: number
    turn?: number
}

export class TowerBattleEngine {
    protected uid: string = "";
    protected challenge: TowerChallenge | null = null;
    protected pokemon: TowerPokemon[] | null = [];
    protected trainer: Trainer | null = null;
    protected trainerRoster: TrainerPokemon[] | null = [];
    protected inputLogs: string[] | null = [];
    protected logs: string[] | null = [];
    protected turn: number = 0;

    constructor(trainer: Trainer, trainerRoster: TrainerPokemon[], challenge: TowerChallenge) {
        this.uid = randomUUID()
        this.challenge = challenge;
        this.trainer = trainer;
        this.trainerRoster = trainerRoster;
    }

    GetData(): ITowerBattle {
        return {
            uid: this.uid,
            challenge: this.challenge,
            pokemon: this.pokemon,
            trainerRoster: this.trainerRoster,
            inputLogs: this.inputLogs,
            logs: this.logs,
            turn: this.turn
        }
    }

    Start() {
        
        const streams = getPlayerStreams(new BattleStream());

        const spec = {
            formatid: "gen7customgame",
        };
        const p1spec = {
            name: "Bot 1",
            team: Teams.pack(Teams.generate('gen7randombattle')),
        };
        const p2spec = {
            name: "Bot 2",
            team: Teams.pack(Teams.generate('gen7randombattle')),
        };

        const p1 = new RandomPlayerAI(streams.p1);
        const p2 = new RandomPlayerAI(streams.p2);

        console.log("p1 is " + p1.constructor.name);
        console.log("p2 is " + p2.constructor.name);

        void p1.start();
        void p2.start();

        void (async () => {
            for await (const chunk of streams.omniscient) {
                console.log(chunk);
            }
        })();

        void streams.omniscient.write(`>start ${JSON.stringify(spec)}
        >player p1 ${JSON.stringify(p1spec)}
        >player p2 ${JSON.stringify(p2spec)}`);

    }
}