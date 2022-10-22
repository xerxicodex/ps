/*
  Warnings:

  - The values [stat_boosts,effort_drop,other,in_a_pinch,picky_healing,type_protection,baking_only,collectibles,evolution,spelunking,held_items,choice,effort_training,bad_held_items,training,plates,species_specific,type_enhancement,event_items,gameplay,plot_advancement,unused,loot,all_mail,vitamins,healing,pp_recovery,revival,status_cures,special_balls,standard_balls,dex_completion,scarves,all_machines,flutes,apricorn_balls,apricorn_box,data_cards,jewels,miracle_shooter,mega_stones,memories,species_candies,catching_bonus,dynamax_crystals,nature_mints,curry_ingredients] on the enum `ItemCategoryEnumType` will be removed. If these variants are still used in the database, this will fail.

*/
-- AlterEnum
BEGIN;
CREATE TYPE "ItemCategoryEnumType_new" AS ENUM ('fossil', 'gem', 'hm', 'hold_item', 'incense', 'key_item', 'mail', 'medicine', 'mega_stone', 'memory', 'mint', 'mulch', 'other_item', 'partner_gift', 'petal', 'plate', 'poke_candy', 'roto', 'scarf', 'shard', 'storage', 'tm', 'tr', 'valuable_item', 'wonder_launcher', 'z_crystals', 'apricorn', 'av_candy', 'ball', 'battle_item', 'berry', 'curry_ingredient', 'etc', 'ev_item', 'evo_item', 'exp_candy', 'flute');
ALTER TABLE "items" ALTER COLUMN "category" TYPE "ItemCategoryEnumType_new" USING ("category"::text::"ItemCategoryEnumType_new");
ALTER TYPE "ItemCategoryEnumType" RENAME TO "ItemCategoryEnumType_old";
ALTER TYPE "ItemCategoryEnumType_new" RENAME TO "ItemCategoryEnumType";
DROP TYPE "ItemCategoryEnumType_old";
COMMIT;

-- AlterEnum
-- This migration adds more than one value to an enum.
-- With PostgreSQL versions 11 and earlier, this is not possible
-- in a single migration. This can be worked around by creating
-- multiple migrations, each migration adding only one value to
-- the enum.


ALTER TYPE "TrainerSkinEnumType" ADD VALUE 'green';
ALTER TYPE "TrainerSkinEnumType" ADD VALUE 'yellow';
