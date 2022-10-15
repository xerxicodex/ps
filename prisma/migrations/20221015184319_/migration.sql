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
CREATE TYPE "DifficultyEnumType" AS ENUM ('easy', 'medium', 'hard', 'expert', 'master');

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
    "createdAt" TIMESTAMP(3) DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "badges_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "wild_pokemon" (
    "id" SERIAL NOT NULL,
    "category" "RarityEnumType" DEFAULT 'common',
    "dex_id" INTEGER NOT NULL,
    "color" "PokemonColorEnumType" DEFAULT 'colorless',
    "gender" "PokemonGenderEnumType" DEFAULT 'unknown',
    "level" INTEGER DEFAULT 4,
    "exp" INTEGER DEFAULT 0,
    "item_id" INTEGER,
    "encounter_chance" INTEGER DEFAULT 0,
    "createdAt" TIMESTAMP(3) DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "wild_pokemon_pkey" PRIMARY KEY ("id")
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
CREATE TABLE "RoutePokemon" (
    "pokemon_id" INTEGER NOT NULL,
    "route_id" INTEGER NOT NULL,
    "location" "RouteLocationEnumType" DEFAULT 'grass',
    "createdAt" TIMESTAMP(3) DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "RoutePokemon_pkey" PRIMARY KEY ("pokemon_id","route_id")
);

-- CreateTable
CREATE TABLE "RouteItem" (
    "item_id" INTEGER NOT NULL,
    "route_id" INTEGER NOT NULL,
    "location" "RouteLocationEnumType" DEFAULT 'grass',
    "createdAt" TIMESTAMP(3) DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "RouteItem_pkey" PRIMARY KEY ("item_id","route_id")
);

-- CreateTable
CREATE TABLE "npcs" (
    "id" SERIAL NOT NULL,
    "name" VARCHAR(255) NOT NULL,
    "coins" INTEGER DEFAULT 0,
    "badge_id" INTEGER,
    "createdAt" TIMESTAMP(3) DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "npcs_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "npc_pokemon" (
    "id" SERIAL NOT NULL,
    "npc_id" INTEGER,
    "dex_id" INTEGER NOT NULL,
    "slot" INTEGER DEFAULT 1,
    "level" INTEGER DEFAULT 4,
    "item_id" INTEGER,
    "color" "PokemonColorEnumType" DEFAULT 'colorless',
    "gender" "PokemonGenderEnumType" DEFAULT 'unknown',
    "ability" TEXT NOT NULL,
    "move_1" TEXT NOT NULL,
    "move_2" TEXT NOT NULL,
    "move_3" TEXT NOT NULL,
    "move_4" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "npc_pokemon_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "NPCReward" (
    "reward_id" INTEGER NOT NULL,
    "npc_id" INTEGER NOT NULL,
    "createdAt" TIMESTAMP(3) DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "NPCReward_pkey" PRIMARY KEY ("reward_id","npc_id")
);

-- CreateTable
CREATE TABLE "towers" (
    "id" SERIAL NOT NULL,
    "name" VARCHAR(255) NOT NULL,
    "difficulty" "DifficultyEnumType" DEFAULT 'easy',
    "badge_id" INTEGER,
    "createdAt" TIMESTAMP(3) DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "towers_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "tower_pokemon" (
    "id" SERIAL NOT NULL,
    "tower_id" INTEGER,
    "dex_id" INTEGER NOT NULL,
    "level" INTEGER DEFAULT 4,
    "item_id" INTEGER,
    "color" "PokemonColorEnumType" DEFAULT 'colorless',
    "gender" "PokemonGenderEnumType" DEFAULT 'unknown',
    "ability" TEXT NOT NULL,
    "move_1" TEXT NOT NULL,
    "move_2" TEXT NOT NULL,
    "move_3" TEXT NOT NULL,
    "move_4" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "tower_pokemon_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "TowerReward" (
    "reward_id" INTEGER NOT NULL,
    "tower_id" INTEGER NOT NULL,
    "createdAt" TIMESTAMP(3) DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "TowerReward_pkey" PRIMARY KEY ("reward_id","tower_id")
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
CREATE TABLE "trainer_items" (
    "id" SERIAL NOT NULL,
    "item_id" INTEGER NOT NULL,
    "trainer_id" INTEGER,
    "amount" INTEGER DEFAULT 1,
    "createdAt" TIMESTAMP(3) DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "trainer_items_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "trainer_pokemon" (
    "id" SERIAL NOT NULL,
    "trainer_id" INTEGER NOT NULL,
    "dex_id" INTEGER NOT NULL,
    "slot" INTEGER DEFAULT 0,
    "level" INTEGER DEFAULT 4,
    "item_id" INTEGER,
    "color" "PokemonColorEnumType" DEFAULT 'colorless',
    "gender" "PokemonGenderEnumType" DEFAULT 'unknown',
    "ability" TEXT NOT NULL,
    "move_1" TEXT NOT NULL,
    "move_2" TEXT NOT NULL,
    "move_3" TEXT NOT NULL,
    "move_4" TEXT NOT NULL,
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
CREATE TABLE "market_items" (
    "id" SERIAL NOT NULL,
    "item_id" INTEGER NOT NULL,
    "amount" INTEGER DEFAULT 1,
    "coins" INTEGER NOT NULL,
    "createdAt" TIMESTAMP(3) DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "market_items_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "npcs_name_key" ON "npcs"("name");

-- CreateIndex
CREATE UNIQUE INDEX "towers_name_key" ON "towers"("name");

-- CreateIndex
CREATE UNIQUE INDEX "trainers_name_key" ON "trainers"("name");

-- AddForeignKey
ALTER TABLE "wild_pokemon" ADD CONSTRAINT "wild_pokemon_item_id_fkey" FOREIGN KEY ("item_id") REFERENCES "items"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "RoutePokemon" ADD CONSTRAINT "RoutePokemon_pokemon_id_fkey" FOREIGN KEY ("pokemon_id") REFERENCES "wild_pokemon"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "RoutePokemon" ADD CONSTRAINT "RoutePokemon_route_id_fkey" FOREIGN KEY ("route_id") REFERENCES "routes"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "RouteItem" ADD CONSTRAINT "RouteItem_item_id_fkey" FOREIGN KEY ("item_id") REFERENCES "items"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "RouteItem" ADD CONSTRAINT "RouteItem_route_id_fkey" FOREIGN KEY ("route_id") REFERENCES "routes"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "npcs" ADD CONSTRAINT "npcs_badge_id_fkey" FOREIGN KEY ("badge_id") REFERENCES "badges"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "npc_pokemon" ADD CONSTRAINT "npc_pokemon_npc_id_fkey" FOREIGN KEY ("npc_id") REFERENCES "npcs"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "npc_pokemon" ADD CONSTRAINT "npc_pokemon_item_id_fkey" FOREIGN KEY ("item_id") REFERENCES "items"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "NPCReward" ADD CONSTRAINT "NPCReward_reward_id_fkey" FOREIGN KEY ("reward_id") REFERENCES "rewards"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "NPCReward" ADD CONSTRAINT "NPCReward_npc_id_fkey" FOREIGN KEY ("npc_id") REFERENCES "npcs"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "towers" ADD CONSTRAINT "towers_badge_id_fkey" FOREIGN KEY ("badge_id") REFERENCES "badges"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "tower_pokemon" ADD CONSTRAINT "tower_pokemon_tower_id_fkey" FOREIGN KEY ("tower_id") REFERENCES "towers"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "tower_pokemon" ADD CONSTRAINT "tower_pokemon_item_id_fkey" FOREIGN KEY ("item_id") REFERENCES "items"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "TowerReward" ADD CONSTRAINT "TowerReward_reward_id_fkey" FOREIGN KEY ("reward_id") REFERENCES "rewards"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "TowerReward" ADD CONSTRAINT "TowerReward_tower_id_fkey" FOREIGN KEY ("tower_id") REFERENCES "towers"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "trainer_items" ADD CONSTRAINT "trainer_items_trainer_id_fkey" FOREIGN KEY ("trainer_id") REFERENCES "trainers"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "trainer_items" ADD CONSTRAINT "trainer_items_item_id_fkey" FOREIGN KEY ("item_id") REFERENCES "items"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "trainer_pokemon" ADD CONSTRAINT "trainer_pokemon_trainer_id_fkey" FOREIGN KEY ("trainer_id") REFERENCES "trainers"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "trainer_pokemon" ADD CONSTRAINT "trainer_pokemon_item_id_fkey" FOREIGN KEY ("item_id") REFERENCES "items"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "market_pokemon" ADD CONSTRAINT "market_pokemon_trainer_pokemon_id_fkey" FOREIGN KEY ("trainer_pokemon_id") REFERENCES "trainer_pokemon"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "market_items" ADD CONSTRAINT "market_items_item_id_fkey" FOREIGN KEY ("item_id") REFERENCES "trainer_items"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
