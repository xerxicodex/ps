-- CreateEnum
CREATE TYPE "RoleEnumType" AS ENUM ('admin', 'super_moderator', 'moderator', 'promoter', 'user');

-- CreateEnum
CREATE TYPE "RarityEnumType" AS ENUM ('common', 'uncommon', 'rare', 'legendary', 'mythical');

-- CreateEnum
CREATE TYPE "PokemonColorEnumType" AS ENUM ('colorless', 'shiny', 'dark', 'golden');

-- CreateEnum
CREATE TYPE "PokemonGenderEnumType" AS ENUM ('genderless', 'male', 'female', 'unknown');

-- CreateTable
CREATE TABLE "items" (
    "id" SERIAL NOT NULL,
    "name" TEXT NOT NULL,
    "rarity" "RarityEnumType" DEFAULT 'common',
    "max_amount" INTEGER,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "items_pkey" PRIMARY KEY ("id")
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
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "wild_pokemon_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "dungeons" (
    "id" SERIAL NOT NULL,
    "name" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "dungeons_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "DungeonPokemon" (
    "pokemon_id" INTEGER NOT NULL,
    "dungeon_id" INTEGER NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "DungeonPokemon_pkey" PRIMARY KEY ("pokemon_id","dungeon_id")
);

-- CreateTable
CREATE TABLE "DungeonItem" (
    "item_id" INTEGER NOT NULL,
    "dungeon_id" INTEGER NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "DungeonItem_pkey" PRIMARY KEY ("item_id","dungeon_id")
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
    "password" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "trainers_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "trainer_items" (
    "id" SERIAL NOT NULL,
    "item_id" INTEGER NOT NULL,
    "trainer_id" INTEGER,
    "amount" INTEGER DEFAULT 1,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "trainer_items_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "trainer_pokemon" (
    "id" SERIAL NOT NULL,
    "dex_id" INTEGER NOT NULL,
    "slot" INTEGER DEFAULT 0,
    "color" "PokemonColorEnumType" DEFAULT 'colorless',
    "gender" "PokemonGenderEnumType" DEFAULT 'unknown',
    "level" INTEGER DEFAULT 4,
    "exp" INTEGER DEFAULT 0,
    "trainer_id" INTEGER DEFAULT 1,
    "item_id" INTEGER,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "trainer_pokemon_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "market_pokemon" (
    "id" SERIAL NOT NULL,
    "trainer_pokemon_id" INTEGER NOT NULL,
    "coins" INTEGER NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "market_pokemon_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "market_items" (
    "id" SERIAL NOT NULL,
    "item_id" INTEGER NOT NULL,
    "amount" INTEGER DEFAULT 1,
    "coins" INTEGER NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "market_items_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "trainers_name_key" ON "trainers"("name");

-- AddForeignKey
ALTER TABLE "wild_pokemon" ADD CONSTRAINT "wild_pokemon_item_id_fkey" FOREIGN KEY ("item_id") REFERENCES "items"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "DungeonPokemon" ADD CONSTRAINT "DungeonPokemon_pokemon_id_fkey" FOREIGN KEY ("pokemon_id") REFERENCES "wild_pokemon"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "DungeonPokemon" ADD CONSTRAINT "DungeonPokemon_dungeon_id_fkey" FOREIGN KEY ("dungeon_id") REFERENCES "dungeons"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "DungeonItem" ADD CONSTRAINT "DungeonItem_item_id_fkey" FOREIGN KEY ("item_id") REFERENCES "items"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "DungeonItem" ADD CONSTRAINT "DungeonItem_dungeon_id_fkey" FOREIGN KEY ("dungeon_id") REFERENCES "dungeons"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "trainer_items" ADD CONSTRAINT "trainer_items_item_id_fkey" FOREIGN KEY ("item_id") REFERENCES "items"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "trainer_items" ADD CONSTRAINT "trainer_items_trainer_id_fkey" FOREIGN KEY ("trainer_id") REFERENCES "trainers"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "trainer_pokemon" ADD CONSTRAINT "trainer_pokemon_trainer_id_fkey" FOREIGN KEY ("trainer_id") REFERENCES "trainers"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "trainer_pokemon" ADD CONSTRAINT "trainer_pokemon_item_id_fkey" FOREIGN KEY ("item_id") REFERENCES "items"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "market_pokemon" ADD CONSTRAINT "market_pokemon_trainer_pokemon_id_fkey" FOREIGN KEY ("trainer_pokemon_id") REFERENCES "trainer_pokemon"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "market_items" ADD CONSTRAINT "market_items_item_id_fkey" FOREIGN KEY ("item_id") REFERENCES "trainer_items"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
