/*
  Warnings:

  - The primary key for the `Genre` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - The `id` column on the `Genre` table would be dropped and recreated. This will lead to data loss if there is data in the column.
  - You are about to drop the `_GenreToMedia` table. If the table is not empty, all the data it contains will be lost.
  - A unique constraint covering the columns `[imdbId]` on the table `Media` will be added. If there are existing duplicate values, this will fail.
  - A unique constraint covering the columns `[tmdbId]` on the table `Media` will be added. If there are existing duplicate values, this will fail.
  - A unique constraint covering the columns `[igdbId]` on the table `Media` will be added. If there are existing duplicate values, this will fail.

*/
-- DropForeignKey
ALTER TABLE "public"."_GenreToMedia" DROP CONSTRAINT "_GenreToMedia_A_fkey";

-- DropForeignKey
ALTER TABLE "public"."_GenreToMedia" DROP CONSTRAINT "_GenreToMedia_B_fkey";

-- AlterTable
ALTER TABLE "public"."Genre" DROP CONSTRAINT "Genre_pkey",
DROP COLUMN "id",
ADD COLUMN     "id" SERIAL NOT NULL,
ADD CONSTRAINT "Genre_pkey" PRIMARY KEY ("id");

-- AlterTable
ALTER TABLE "public"."Media" ADD COLUMN     "adult" BOOLEAN NOT NULL DEFAULT false,
ADD COLUMN     "budget" BIGINT,
ADD COLUMN     "developers" TEXT,
ADD COLUMN     "genreId" INTEGER,
ADD COLUMN     "nextEpisodeDate" TIMESTAMP(3),
ADD COLUMN     "numberOfEpisodes" INTEGER,
ADD COLUMN     "numberOfSeasons" INTEGER,
ADD COLUMN     "originalLanguage" TEXT,
ADD COLUMN     "originalTitle" TEXT,
ADD COLUMN     "platforms" TEXT,
ADD COLUMN     "popularity" DOUBLE PRECISION,
ADD COLUMN     "publishers" TEXT,
ADD COLUMN     "revenue" BIGINT,
ADD COLUMN     "runtime" INTEGER,
ADD COLUMN     "status" TEXT,
ADD COLUMN     "tagline" TEXT,
ADD COLUMN     "trailerUrl" TEXT,
ADD COLUMN     "voteAverage" DOUBLE PRECISION,
ADD COLUMN     "voteCount" INTEGER NOT NULL DEFAULT 0;

-- DropTable
DROP TABLE "public"."_GenreToMedia";

-- CreateTable
CREATE TABLE "public"."ListItem" (
    "id" TEXT NOT NULL,
    "mediaId" TEXT NOT NULL,
    "listId" TEXT NOT NULL,
    "addedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "position" INTEGER NOT NULL,
    "notes" TEXT,

    CONSTRAINT "ListItem_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."Cast" (
    "id" TEXT NOT NULL,
    "mediaId" TEXT NOT NULL,
    "personId" TEXT NOT NULL,
    "character" TEXT,
    "order" INTEGER,

    CONSTRAINT "Cast_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."Crew" (
    "id" TEXT NOT NULL,
    "mediaId" TEXT NOT NULL,
    "personId" TEXT NOT NULL,
    "job" TEXT NOT NULL,
    "department" TEXT,

    CONSTRAINT "Crew_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."Person" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "biography" TEXT,
    "birthday" TIMESTAMP(3),
    "deathday" TIMESTAMP(3),
    "gender" INTEGER,
    "placeOfBirth" TEXT,
    "profilePath" TEXT,
    "imdbId" TEXT,
    "tmdbId" TEXT,

    CONSTRAINT "Person_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."Video" (
    "id" TEXT NOT NULL,
    "mediaId" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "key" TEXT NOT NULL,
    "site" TEXT NOT NULL,
    "size" INTEGER,
    "type" TEXT,
    "official" BOOLEAN NOT NULL DEFAULT false,
    "publishedAt" TIMESTAMP(3),

    CONSTRAINT "Video_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."MediaImage" (
    "id" TEXT NOT NULL,
    "mediaId" TEXT NOT NULL,
    "filePath" TEXT NOT NULL,
    "aspectRatio" DOUBLE PRECISION NOT NULL,
    "height" INTEGER NOT NULL,
    "width" INTEGER NOT NULL,
    "voteAverage" DOUBLE PRECISION,
    "voteCount" INTEGER NOT NULL DEFAULT 0,
    "mediaType" TEXT,

    CONSTRAINT "MediaImage_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."List" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "List_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."_MediaGenres" (
    "A" INTEGER NOT NULL,
    "B" TEXT NOT NULL,

    CONSTRAINT "_MediaGenres_AB_pkey" PRIMARY KEY ("A","B")
);

-- CreateIndex
CREATE UNIQUE INDEX "ListItem_mediaId_listId_key" ON "public"."ListItem"("mediaId", "listId");

-- CreateIndex
CREATE UNIQUE INDEX "Cast_mediaId_personId_character_key" ON "public"."Cast"("mediaId", "personId", "character");

-- CreateIndex
CREATE UNIQUE INDEX "Crew_mediaId_personId_job_key" ON "public"."Crew"("mediaId", "personId", "job");

-- CreateIndex
CREATE UNIQUE INDEX "Person_imdbId_key" ON "public"."Person"("imdbId");

-- CreateIndex
CREATE UNIQUE INDEX "Person_tmdbId_key" ON "public"."Person"("tmdbId");

-- CreateIndex
CREATE INDEX "_MediaGenres_B_index" ON "public"."_MediaGenres"("B");

-- CreateIndex
CREATE UNIQUE INDEX "Media_imdbId_key" ON "public"."Media"("imdbId");

-- CreateIndex
CREATE UNIQUE INDEX "Media_tmdbId_key" ON "public"."Media"("tmdbId");

-- CreateIndex
CREATE UNIQUE INDEX "Media_igdbId_key" ON "public"."Media"("igdbId");

-- AddForeignKey
ALTER TABLE "public"."Media" ADD CONSTRAINT "Media_genreId_fkey" FOREIGN KEY ("genreId") REFERENCES "public"."Genre"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."ListItem" ADD CONSTRAINT "ListItem_mediaId_fkey" FOREIGN KEY ("mediaId") REFERENCES "public"."Media"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."ListItem" ADD CONSTRAINT "ListItem_listId_fkey" FOREIGN KEY ("listId") REFERENCES "public"."List"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."Cast" ADD CONSTRAINT "Cast_mediaId_fkey" FOREIGN KEY ("mediaId") REFERENCES "public"."Media"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."Cast" ADD CONSTRAINT "Cast_personId_fkey" FOREIGN KEY ("personId") REFERENCES "public"."Person"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."Crew" ADD CONSTRAINT "Crew_mediaId_fkey" FOREIGN KEY ("mediaId") REFERENCES "public"."Media"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."Crew" ADD CONSTRAINT "Crew_personId_fkey" FOREIGN KEY ("personId") REFERENCES "public"."Person"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."Video" ADD CONSTRAINT "Video_mediaId_fkey" FOREIGN KEY ("mediaId") REFERENCES "public"."Media"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."MediaImage" ADD CONSTRAINT "MediaImage_mediaId_fkey" FOREIGN KEY ("mediaId") REFERENCES "public"."Media"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."List" ADD CONSTRAINT "List_userId_fkey" FOREIGN KEY ("userId") REFERENCES "public"."User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."_MediaGenres" ADD CONSTRAINT "_MediaGenres_A_fkey" FOREIGN KEY ("A") REFERENCES "public"."Genre"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."_MediaGenres" ADD CONSTRAINT "_MediaGenres_B_fkey" FOREIGN KEY ("B") REFERENCES "public"."Media"("id") ON DELETE CASCADE ON UPDATE CASCADE;
