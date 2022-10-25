import { PokemonColorEnumType, TowerChallenge, TowerPokemon, Trainer, TrainerPokemon } from "@prisma/client";
import { randomUUID } from "crypto";
import { BattleStreams, RandomPlayerAI, Teams, PokemonSet} from '@pkmn/sim';
import {TeamGenerators} from '@pkmn/randoms';
import {Battle, Pokemon} from '@pkmn/client';
import {Generations} from '@pkmn/data';
import { Dex } from '@pkmn/dex';
import {Protocol} from '@pkmn/protocol';
import {LogFormatter} from '@pkmn/view';
import { PokemonNameShowdownPatch } from "../utils/pokemon";

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
    protected currentFloor: number = 0;
    protected totalFloors: number = 0;
    protected turn: number = 0;

    constructor(trainer: Trainer, trainerRoster: TrainerPokemon[], challenge: TowerChallenge) {
        this.uid = randomUUID()
        this.challenge = challenge;
        this.trainer = trainer;
        this.trainerRoster = trainerRoster;
        this.currentFloor = 1;
        this.totalFloors = 5;
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

    async Start() {
        const towerPokemon = await prisma.towerPokemon.findMany({ where: { tower_id: this.challenge?.tower_id, floor: this.currentFloor }, include: { pokemon: true, item: true } });

        const battle = new Battle(new Generations(Dex));

        const formatter = new LogFormatter(0 /* perspective */, battle);

        Teams.setGeneratorFactory(TeamGenerators);

        const streams = BattleStreams.getPlayerStreams(new BattleStreams.BattleStream());
        const spec = {formatid: 'gen8customgame'};
        
        const team1: PokemonSet[] = [];

        towerPokemon.forEach((tp) => {
            team1.push({
                name: tp.pokemon.name,
                species: PokemonNameShowdownPatch(tp.pokemon.name ?? "missingno"),
                gender: tp.gender,
                shiny: tp.color !== PokemonColorEnumType.colorless,
                moves: [tp.move_1, tp.move_2, tp.move_3, tp.move_4],
                ability: tp.ability,
                item: tp.item?.name,
                level:tp.level
              } as PokemonSet)

            //   console.log(tp.pokemon.name);

              if (tp.pokemon.name == 'eiscueice') {
                console.log(team1[team1.length - 1])
              }
        })

        const team2: PokemonSet[] = [];
        team2.push({
            name: 'Mewtwo',
            species: 'Mewtwo',
            gender: '',
            shiny: false,
            moves: [ 'bravebird', 'protect', 'quickattack', 'facade' ],
            ability: 'Guts',
            item: 'Flame Orb',
            level: 84000
          } as PokemonSet)
        // console.log({ team1pkm1: team1[0] })
        const p1spec = {name: 'Bot 1', team: Teams.pack(team1)};
        const p2spec = {name: 'Bot 2', team: Teams.pack(team2)};

        // console.log(p1spec.team)
        
        const p1 = new RandomPlayerAI(streams.p1);
        const p2 = new RandomPlayerAI(streams.p2);
        
        void p1.start();
        void p2.start();
        
        let serverLive = false;

        const chunks: any = [];

        const logs: string[] = [];
        
        void (async () => {
            serverLive = true;
            for await (const chunk of streams.omniscient) {
                // console.log(chunk);
                for (const line of chunk.split('\n')) {
                    battle.add(line);
                }

                battle.update();

                Array.from(Protocol.parse(chunk)).forEach(({ args, kwArgs }) => {
                    // NOTE: must come *before* handler
                    const formatted = formatter.formatText(args, kwArgs);
                    if (formatted) process.stdout.write(formatted);
                    console.log(chunk);
                    logs.push(formatted);
                    battle.add(args, kwArgs);
                    const { details, level } = battle.p2.active[0] as Pokemon ?? {}
                    // console.log({ details, level })
                })

                chunks.push(chunk);
            }
            serverLive = false;
        })();
        
        void streams.omniscient.write(`>start ${JSON.stringify(spec)}`)
        void streams.omniscient.write(`>player p1 ${JSON.stringify(p1spec)}`)
        void streams.omniscient.write(`>player p2 ${JSON.stringify(p2spec)}`)

        let safty = 10;

        while(serverLive && safty > 0) {
           if (JSON.stringify(chunks).indexOf("|teampreview") != -1) {
            void streams.omniscient.write(`>p2 move 1`);
           }
            safty--;
        }

        // console.log(p1)

        // void streams.p1.write('switch 1')
        // void p2.choose('switch')

        // console.log("test", streams.omniscient.buf)

    }
}