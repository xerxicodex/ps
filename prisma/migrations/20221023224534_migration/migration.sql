-- AlterTable
ALTER TABLE "items" ADD COLUMN     "alt_name" TEXT;

-- AlterTable
ALTER TABLE "towers" ADD COLUMN     "floors" INTEGER DEFAULT 1;

-- CreateTable
CREATE TABLE "tower_challenges" (
    "id" SERIAL NOT NULL,
    "tower_id" INTEGER NOT NULL,
    "trainer_id" INTEGER NOT NULL,
    "currentFloor" INTEGER DEFAULT 1,
    "totalFloors" INTEGER DEFAULT 1,
    "roster" TEXT NOT NULL,
    "startDate" TIMESTAMP(3) DEFAULT CURRENT_TIMESTAMP,
    "endDate" TIMESTAMP(3),
    "timeTaken" INTEGER,

    CONSTRAINT "tower_challenges_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "tower_challenges" ADD CONSTRAINT "tower_challenges_tower_id_fkey" FOREIGN KEY ("tower_id") REFERENCES "towers"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "tower_challenges" ADD CONSTRAINT "tower_challenges_trainer_id_fkey" FOREIGN KEY ("trainer_id") REFERENCES "trainers"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
