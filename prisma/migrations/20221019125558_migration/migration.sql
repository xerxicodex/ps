-- CreateEnum
CREATE TYPE "RoleEnumType" AS ENUM ('admin', 'super_moderator', 'moderator', 'promoter', 'user');

-- CreateEnum
CREATE TYPE "RarityEnumType" AS ENUM ('common', 'uncommon', 'rare', 'legendary', 'mythical');

-- CreateEnum
CREATE TYPE "PokemonColorEnumType" AS ENUM ('colorless', 'shiny', 'dark', 'golden');

-- CreateEnum
CREATE TYPE "PokemonGenderEnumType" AS ENUM ('genderless', 'male', 'female', 'unknown');

-- CreateEnum
CREATE TYPE "RouteLocationEnumType" AS ENUM ('grass', 'water', 'tree');

-- CreateEnum
CREATE TYPE "RewardEnumType" AS ENUM ('item', 'coins', 'pokemon', 'pokemon_exp', 'trainer_exp', 'battle_points');

-- CreateEnum
CREATE TYPE "DifficultyEnumType" AS ENUM ('easy', 'medium', 'hard', 'very_hard', 'master');

-- CreateEnum
CREATE TYPE "MoveCategoryEnumType" AS ENUM ('ohko', 'field_effect', 'force_switch', 'damage', 'damage_and_raise', 'ailment', 'swagger', 'unique', 'damage_and_lower', 'heal', 'damage_and_ailment', 'damage_and_heal', 'whole_field_effect', 'net_good_stats');

-- CreateTable
CREATE TABLE "rewards" (
    "id" SERIAL NOT NULL,
    "reward" "RewardEnumType" DEFAULT 'coins',
    "value" TEXT DEFAULT '100',
    "createdAt" TIMESTAMP(3) DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "rewards_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "items" (
    "id" SERIAL NOT NULL,
    "name" TEXT NOT NULL,
    "rarity" "RarityEnumType" DEFAULT 'common',
    "max_amount" INTEGER,
    "createdAt" TIMESTAMP(3) DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "items_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "badges" (
    "id" SERIAL NOT NULL,
    "name" TEXT NOT NULL,
    "description" TEXT,
    "createdAt" TIMESTAMP(3) DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "badges_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "pokemon" (
    "id" SERIAL NOT NULL,
    "dex_id" INTEGER NOT NULL,
    "name" TEXT,
    "species" TEXT,
    "shiny_locked" BOOLEAN DEFAULT false,
    "generation" INTEGER,
    "description" TEXT DEFAULT 'Nothing is known about this pokemon',
    "type_1" TEXT DEFAULT 'ghost',
    "type_2" TEXT DEFAULT '',
    "hp" INTEGER DEFAULT 0,
    "attack" INTEGER DEFAULT 0,
    "defense" INTEGER DEFAULT 0,
    "special_attack" INTEGER DEFAULT 0,
    "special_defense" INTEGER DEFAULT 0,
    "speed" INTEGER DEFAULT 0,
    "power" INTEGER DEFAULT 0,
    "hp_ev" INTEGER DEFAULT 0,
    "attack_ev" INTEGER DEFAULT 0,
    "defense_ev" INTEGER DEFAULT 0,
    "special_attack_ev" INTEGER DEFAULT 0,
    "special_defense_ev" INTEGER DEFAULT 0,
    "speed_ev" INTEGER DEFAULT 0,
    "base_exp" INTEGER DEFAULT 0,
    "height" INTEGER DEFAULT 12,
    "weight" INTEGER DEFAULT 1,
    "capture_rate" INTEGER DEFAULT 0,
    "base_happiness" INTEGER DEFAULT 0,
    "is_baby" BOOLEAN DEFAULT false,
    "is_legendary" BOOLEAN DEFAULT false,
    "is_mythical" BOOLEAN DEFAULT false,
    "hatch_counter" INTEGER DEFAULT 0,
    "has_gender_differences" BOOLEAN DEFAULT false,
    "forms_switchable" BOOLEAN DEFAULT false,
    "evolves_from" INTEGER,
    "growth_rate" TEXT DEFAULT 'fluctuating',
    "theme_color" TEXT DEFAULT 'black',
    "shape" TEXT DEFAULT 'unknown',
    "createdAt" TIMESTAMP(3) DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "pokemon_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "abilities" (
    "id" SERIAL NOT NULL,
    "name" TEXT,
    "effect" TEXT,
    "createdAt" TIMESTAMP(3) DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "abilities_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "pokemon_abilities" (
    "pokemon_id" INTEGER NOT NULL,
    "ability_id" INTEGER NOT NULL,
    "slot" INTEGER NOT NULL,
    "is_hidden" BOOLEAN NOT NULL,
    "createdAt" TIMESTAMP(3) DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "pokemon_abilities_pkey" PRIMARY KEY ("pokemon_id","ability_id")
);

-- CreateTable
CREATE TABLE "moves" (
    "id" SERIAL NOT NULL,
    "name" TEXT,
    "type" TEXT,
    "class" TEXT,
    "category" "MoveCategoryEnumType",
    "ailment" TEXT,
    "effect" TEXT,
    "power" INTEGER DEFAULT 1000,
    "pp" INTEGER DEFAULT 1,
    "accuracy" INTEGER DEFAULT 100,
    "priority" INTEGER DEFAULT 0,
    "target" TEXT,
    "contest_type" TEXT,
    "min_hits" INTEGER,
    "max_hits" INTEGER,
    "min_turns" INTEGER,
    "max_turns" INTEGER,
    "drain" INTEGER,
    "healing" INTEGER,
    "crit_rate" INTEGER,
    "ailment_chance" INTEGER,
    "flinch_chance" INTEGER,
    "stat_chance" INTEGER,
    "hp" INTEGER,
    "attack" INTEGER,
    "defense" INTEGER,
    "special_attack" INTEGER,
    "special_defense" INTEGER,
    "speed" INTEGER,
    "createdAt" TIMESTAMP(3) DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "moves_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "pokemon_moves" (
    "pokemon_id" INTEGER NOT NULL,
    "move_id" INTEGER NOT NULL,
    "level" INTEGER DEFAULT 0,
    "method" TEXT DEFAULT 'machine',
    "createdAt" TIMESTAMP(3) DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "pokemon_moves_pkey" PRIMARY KEY ("pokemon_id","move_id")
);

-- CreateTable
CREATE TABLE "routes" (
    "id" SERIAL NOT NULL,
    "name" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "routes_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "route_pokemon" (
    "pokemon_id" INTEGER NOT NULL,
    "route_id" INTEGER NOT NULL,
    "level" INTEGER DEFAULT 5,
    "color" "PokemonColorEnumType" DEFAULT 'colorless',
    "gender" "PokemonGenderEnumType" DEFAULT 'unknown',
    "item_id" INTEGER,
    "location" "RouteLocationEnumType" DEFAULT 'grass',
    "encounter_chance" INTEGER DEFAULT 0,
    "createdAt" TIMESTAMP(3) DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "route_pokemon_pkey" PRIMARY KEY ("pokemon_id","route_id")
);

-- CreateTable
CREATE TABLE "route_items" (
    "item_id" INTEGER NOT NULL,
    "route_id" INTEGER NOT NULL,
    "location" "RouteLocationEnumType" DEFAULT 'grass',
    "encounter_chance" INTEGER DEFAULT 0,
    "createdAt" TIMESTAMP(3) DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "route_items_pkey" PRIMARY KEY ("item_id","route_id")
);

-- CreateTable
CREATE TABLE "npcs" (
    "id" SERIAL NOT NULL,
    "name" VARCHAR(255) NOT NULL,
    "coins" INTEGER DEFAULT 0,
    "createdAt" TIMESTAMP(3) DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "npcs_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "npc_badges" (
    "npc_id" INTEGER NOT NULL,
    "badge_id" INTEGER NOT NULL,
    "createdAt" TIMESTAMP(3) DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "npc_badges_pkey" PRIMARY KEY ("npc_id","badge_id")
);

-- CreateTable
CREATE TABLE "npc_pokemon" (
    "id" SERIAL NOT NULL,
    "npc_id" INTEGER,
    "pokemon_id" INTEGER NOT NULL,
    "slot" INTEGER DEFAULT 1,
    "level" INTEGER DEFAULT 4,
    "item_id" INTEGER,
    "color" "PokemonColorEnumType" DEFAULT 'colorless',
    "gender" "PokemonGenderEnumType" DEFAULT 'unknown',
    "ability" TEXT,
    "move_1" TEXT,
    "move_2" TEXT,
    "move_3" TEXT,
    "move_4" TEXT,
    "createdAt" TIMESTAMP(3) DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "npc_pokemon_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "npc_rewards" (
    "reward_id" INTEGER NOT NULL,
    "npc_id" INTEGER NOT NULL,
    "createdAt" TIMESTAMP(3) DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "npc_rewards_pkey" PRIMARY KEY ("reward_id","npc_id")
);

-- CreateTable
CREATE TABLE "gyms" (
    "id" SERIAL NOT NULL,
    "name" VARCHAR(255) NOT NULL,
    "difficulty" "DifficultyEnumType" DEFAULT 'easy',
    "createdAt" TIMESTAMP(3) DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "gyms_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "gym_badges" (
    "gym_id" INTEGER NOT NULL,
    "badge_id" INTEGER NOT NULL,
    "createdAt" TIMESTAMP(3) DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "gym_badges_pkey" PRIMARY KEY ("gym_id","badge_id")
);

-- CreateTable
CREATE TABLE "gym_npcs" (
    "gym_id" INTEGER NOT NULL,
    "npc_id" INTEGER NOT NULL,
    "createdAt" TIMESTAMP(3) DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "gym_npcs_pkey" PRIMARY KEY ("gym_id","npc_id")
);

-- CreateTable
CREATE TABLE "frontiers" (
    "id" SERIAL NOT NULL,
    "name" VARCHAR(255) NOT NULL,
    "difficulty" "DifficultyEnumType" DEFAULT 'easy',
    "createdAt" TIMESTAMP(3) DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "frontiers_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "frontier_badges" (
    "frontier_id" INTEGER NOT NULL,
    "badge_id" INTEGER NOT NULL,
    "createdAt" TIMESTAMP(3) DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "frontier_badges_pkey" PRIMARY KEY ("frontier_id","badge_id")
);

-- CreateTable
CREATE TABLE "frontier_npcs" (
    "frontier_id" INTEGER NOT NULL,
    "npc_id" INTEGER NOT NULL,
    "createdAt" TIMESTAMP(3) DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "frontier_npcs_pkey" PRIMARY KEY ("frontier_id","npc_id")
);

-- CreateTable
CREATE TABLE "towers" (
    "id" SERIAL NOT NULL,
    "name" VARCHAR(255) NOT NULL,
    "difficulty" "DifficultyEnumType" DEFAULT 'easy',
    "exp_boost" INTEGER DEFAULT 1,
    "required_badge_id" INTEGER,
    "required_trainer_level" INTEGER,
    "required_team_level_min" INTEGER,
    "required_team_level_max" INTEGER,
    "createdAt" TIMESTAMP(3) DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "towers_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "tower_badges" (
    "tower_id" INTEGER NOT NULL,
    "badge_id" INTEGER NOT NULL,
    "createdAt" TIMESTAMP(3) DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "tower_badges_pkey" PRIMARY KEY ("tower_id","badge_id")
);

-- CreateTable
CREATE TABLE "tower_pokemon" (
    "id" SERIAL NOT NULL,
    "tower_id" INTEGER,
    "pokemon_id" INTEGER NOT NULL,
    "floor" INTEGER DEFAULT 1,
    "level" INTEGER DEFAULT 4,
    "item_id" INTEGER,
    "color" "PokemonColorEnumType" DEFAULT 'colorless',
    "gender" "PokemonGenderEnumType" DEFAULT 'unknown',
    "ability" TEXT,
    "move_1" TEXT,
    "move_2" TEXT,
    "move_3" TEXT,
    "move_4" TEXT,
    "createdAt" TIMESTAMP(3) DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "tower_pokemon_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "tower_rewards" (
    "tower_id" INTEGER NOT NULL,
    "reward_id" INTEGER NOT NULL,
    "createdAt" TIMESTAMP(3) DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "tower_rewards_pkey" PRIMARY KEY ("tower_id","reward_id")
);

-- CreateTable
CREATE TABLE "trainers" (
    "id" SERIAL NOT NULL,
    "name" VARCHAR(255) NOT NULL,
    "role" "RoleEnumType" DEFAULT 'user',
    "starter" INTEGER DEFAULT 1,
    "level" INTEGER DEFAULT 0,
    "exp" INTEGER DEFAULT 0,
    "coins" INTEGER DEFAULT 0,
    "battle_points" INTEGER DEFAULT 0,
    "password" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "trainers_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "trainer_badges" (
    "trainer_id" INTEGER NOT NULL,
    "badge_id" INTEGER NOT NULL,
    "amount" INTEGER DEFAULT 1,
    "createdAt" TIMESTAMP(3) DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "trainer_badges_pkey" PRIMARY KEY ("trainer_id","badge_id")
);

-- CreateTable
CREATE TABLE "trainer_items" (
    "id" SERIAL NOT NULL,
    "trainer_id" INTEGER NOT NULL,
    "item_id" INTEGER NOT NULL,
    "amount" INTEGER DEFAULT 1,
    "createdAt" TIMESTAMP(3) DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "trainer_items_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "trainer_pokemon" (
    "id" SERIAL NOT NULL,
    "trainer_id" INTEGER NOT NULL,
    "pokemon_id" INTEGER NOT NULL,
    "slot" INTEGER DEFAULT 0,
    "level" INTEGER DEFAULT 4,
    "item_id" INTEGER,
    "color" "PokemonColorEnumType" DEFAULT 'colorless',
    "gender" "PokemonGenderEnumType" DEFAULT 'unknown',
    "ability" TEXT,
    "move_1" TEXT,
    "move_2" TEXT,
    "move_3" TEXT,
    "move_4" TEXT,
    "exp" INTEGER DEFAULT 0,
    "createdAt" TIMESTAMP(3) DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "trainer_pokemon_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "market_pokemon" (
    "id" SERIAL NOT NULL,
    "trainer_pokemon_id" INTEGER NOT NULL,
    "coins" INTEGER NOT NULL,
    "createdAt" TIMESTAMP(3) DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "market_pokemon_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "markets" (
    "id" SERIAL NOT NULL,
    "name" VARCHAR(255) NOT NULL,
    "createdAt" TIMESTAMP(3) DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "markets_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "market_items" (
    "market_id" INTEGER NOT NULL,
    "trainer_item_id" INTEGER NOT NULL,
    "amount" INTEGER NOT NULL,
    "coins" INTEGER NOT NULL,
    "createdAt" TIMESTAMP(3) DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "market_items_pkey" PRIMARY KEY ("market_id","trainer_item_id","amount","coins")
);

-- CreateIndex
CREATE UNIQUE INDEX "pokemon_name_key" ON "pokemon"("name");

-- CreateIndex
CREATE UNIQUE INDEX "npcs_name_key" ON "npcs"("name");

-- CreateIndex
CREATE UNIQUE INDEX "gyms_name_key" ON "gyms"("name");

-- CreateIndex
CREATE UNIQUE INDEX "frontiers_name_key" ON "frontiers"("name");

-- CreateIndex
CREATE UNIQUE INDEX "towers_name_key" ON "towers"("name");

-- CreateIndex
CREATE UNIQUE INDEX "trainers_name_key" ON "trainers"("name");

-- CreateIndex
CREATE UNIQUE INDEX "markets_name_key" ON "markets"("name");

-- AddForeignKey
ALTER TABLE "pokemon_abilities" ADD CONSTRAINT "pokemon_abilities_pokemon_id_fkey" FOREIGN KEY ("pokemon_id") REFERENCES "pokemon"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "pokemon_abilities" ADD CONSTRAINT "pokemon_abilities_ability_id_fkey" FOREIGN KEY ("ability_id") REFERENCES "abilities"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "pokemon_moves" ADD CONSTRAINT "pokemon_moves_pokemon_id_fkey" FOREIGN KEY ("pokemon_id") REFERENCES "pokemon"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "pokemon_moves" ADD CONSTRAINT "pokemon_moves_move_id_fkey" FOREIGN KEY ("move_id") REFERENCES "moves"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "route_pokemon" ADD CONSTRAINT "route_pokemon_pokemon_id_fkey" FOREIGN KEY ("pokemon_id") REFERENCES "pokemon"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "route_pokemon" ADD CONSTRAINT "route_pokemon_route_id_fkey" FOREIGN KEY ("route_id") REFERENCES "routes"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "route_pokemon" ADD CONSTRAINT "route_pokemon_item_id_fkey" FOREIGN KEY ("item_id") REFERENCES "items"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "route_items" ADD CONSTRAINT "route_items_item_id_fkey" FOREIGN KEY ("item_id") REFERENCES "items"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "route_items" ADD CONSTRAINT "route_items_route_id_fkey" FOREIGN KEY ("route_id") REFERENCES "routes"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "npc_badges" ADD CONSTRAINT "npc_badges_npc_id_fkey" FOREIGN KEY ("npc_id") REFERENCES "npcs"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "npc_badges" ADD CONSTRAINT "npc_badges_badge_id_fkey" FOREIGN KEY ("badge_id") REFERENCES "badges"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "npc_pokemon" ADD CONSTRAINT "npc_pokemon_pokemon_id_fkey" FOREIGN KEY ("pokemon_id") REFERENCES "pokemon"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "npc_pokemon" ADD CONSTRAINT "npc_pokemon_npc_id_fkey" FOREIGN KEY ("npc_id") REFERENCES "npcs"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "npc_pokemon" ADD CONSTRAINT "npc_pokemon_item_id_fkey" FOREIGN KEY ("item_id") REFERENCES "items"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "npc_rewards" ADD CONSTRAINT "npc_rewards_reward_id_fkey" FOREIGN KEY ("reward_id") REFERENCES "rewards"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "npc_rewards" ADD CONSTRAINT "npc_rewards_npc_id_fkey" FOREIGN KEY ("npc_id") REFERENCES "npcs"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "gym_badges" ADD CONSTRAINT "gym_badges_gym_id_fkey" FOREIGN KEY ("gym_id") REFERENCES "gyms"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "gym_badges" ADD CONSTRAINT "gym_badges_badge_id_fkey" FOREIGN KEY ("badge_id") REFERENCES "badges"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "gym_npcs" ADD CONSTRAINT "gym_npcs_gym_id_fkey" FOREIGN KEY ("gym_id") REFERENCES "gyms"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "gym_npcs" ADD CONSTRAINT "gym_npcs_npc_id_fkey" FOREIGN KEY ("npc_id") REFERENCES "npcs"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "frontier_badges" ADD CONSTRAINT "frontier_badges_frontier_id_fkey" FOREIGN KEY ("frontier_id") REFERENCES "frontiers"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "frontier_badges" ADD CONSTRAINT "frontier_badges_badge_id_fkey" FOREIGN KEY ("badge_id") REFERENCES "badges"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "frontier_npcs" ADD CONSTRAINT "frontier_npcs_frontier_id_fkey" FOREIGN KEY ("frontier_id") REFERENCES "frontiers"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "frontier_npcs" ADD CONSTRAINT "frontier_npcs_npc_id_fkey" FOREIGN KEY ("npc_id") REFERENCES "npcs"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "tower_badges" ADD CONSTRAINT "tower_badges_tower_id_fkey" FOREIGN KEY ("tower_id") REFERENCES "towers"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "tower_badges" ADD CONSTRAINT "tower_badges_badge_id_fkey" FOREIGN KEY ("badge_id") REFERENCES "badges"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "tower_pokemon" ADD CONSTRAINT "tower_pokemon_tower_id_fkey" FOREIGN KEY ("tower_id") REFERENCES "towers"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "tower_pokemon" ADD CONSTRAINT "tower_pokemon_item_id_fkey" FOREIGN KEY ("item_id") REFERENCES "items"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "tower_pokemon" ADD CONSTRAINT "tower_pokemon_pokemon_id_fkey" FOREIGN KEY ("pokemon_id") REFERENCES "pokemon"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "tower_rewards" ADD CONSTRAINT "tower_rewards_tower_id_fkey" FOREIGN KEY ("tower_id") REFERENCES "towers"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "tower_rewards" ADD CONSTRAINT "tower_rewards_reward_id_fkey" FOREIGN KEY ("reward_id") REFERENCES "rewards"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "trainer_badges" ADD CONSTRAINT "trainer_badges_trainer_id_fkey" FOREIGN KEY ("trainer_id") REFERENCES "trainers"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "trainer_badges" ADD CONSTRAINT "trainer_badges_badge_id_fkey" FOREIGN KEY ("badge_id") REFERENCES "badges"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "trainer_items" ADD CONSTRAINT "trainer_items_trainer_id_fkey" FOREIGN KEY ("trainer_id") REFERENCES "trainers"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "trainer_items" ADD CONSTRAINT "trainer_items_item_id_fkey" FOREIGN KEY ("item_id") REFERENCES "items"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "trainer_pokemon" ADD CONSTRAINT "trainer_pokemon_trainer_id_fkey" FOREIGN KEY ("trainer_id") REFERENCES "trainers"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "trainer_pokemon" ADD CONSTRAINT "trainer_pokemon_item_id_fkey" FOREIGN KEY ("item_id") REFERENCES "items"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "trainer_pokemon" ADD CONSTRAINT "trainer_pokemon_pokemon_id_fkey" FOREIGN KEY ("pokemon_id") REFERENCES "pokemon"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "market_pokemon" ADD CONSTRAINT "market_pokemon_trainer_pokemon_id_fkey" FOREIGN KEY ("trainer_pokemon_id") REFERENCES "trainer_pokemon"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "market_items" ADD CONSTRAINT "market_items_market_id_fkey" FOREIGN KEY ("market_id") REFERENCES "markets"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "market_items" ADD CONSTRAINT "market_items_trainer_item_id_fkey" FOREIGN KEY ("trainer_item_id") REFERENCES "trainer_items"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
