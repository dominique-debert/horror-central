-- CreateEnum
CREATE TYPE "public"."Role" AS ENUM ('USER', 'ADMIN');

-- CreateEnum
CREATE TYPE "public"."MediaType" AS ENUM ('MOVIE', 'TV_SHOW', 'GAME');

-- CreateTable
CREATE TABLE "public"."User" (
    "id" TEXT NOT NULL,
    "name" TEXT,
    "email" TEXT NOT NULL,
    "emailVerified" TIMESTAMP(3),
    "image" TEXT,
    "password" TEXT NOT NULL,
    "role" "public"."Role" NOT NULL DEFAULT 'USER',
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "User_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."Media" (
    "id" TEXT NOT NULL,
    "title" TEXT NOT NULL,
    "description" TEXT,
    "type" "public"."MediaType" NOT NULL,
    "releaseDate" TIMESTAMP(3),
    "posterUrl" TEXT,
    "backdropUrl" TEXT,
    "imdbId" TEXT,
    "tmdbId" TEXT,
    "igdbId" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Media_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."Review" (
    "id" TEXT NOT NULL,
    "content" TEXT NOT NULL,
    "rating" INTEGER NOT NULL,
    "userId" TEXT NOT NULL,
    "mediaId" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Review_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."Genre" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,

    CONSTRAINT "Genre_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."Rating" (
    "id" TEXT NOT NULL,
    "score" INTEGER NOT NULL,
    "userId" TEXT NOT NULL,
    "mediaId" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Rating_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."_Watchlist" (
    "A" TEXT NOT NULL,
    "B" TEXT NOT NULL,

    CONSTRAINT "_Watchlist_AB_pkey" PRIMARY KEY ("A","B")
);

-- CreateTable
CREATE TABLE "public"."_GenreToMedia" (
    "A" TEXT NOT NULL,
    "B" TEXT NOT NULL,

    CONSTRAINT "_GenreToMedia_AB_pkey" PRIMARY KEY ("A","B")
);

-- CreateIndex
CREATE UNIQUE INDEX "User_email_key" ON "public"."User"("email");

-- CreateIndex
CREATE UNIQUE INDEX "Review_userId_mediaId_key" ON "public"."Review"("userId", "mediaId");

-- CreateIndex
CREATE UNIQUE INDEX "Genre_name_key" ON "public"."Genre"("name");

-- CreateIndex
CREATE UNIQUE INDEX "Rating_userId_mediaId_key" ON "public"."Rating"("userId", "mediaId");

-- CreateIndex
CREATE INDEX "_Watchlist_B_index" ON "public"."_Watchlist"("B");

-- CreateIndex
CREATE INDEX "_GenreToMedia_B_index" ON "public"."_GenreToMedia"("B");

-- AddForeignKey
ALTER TABLE "public"."Review" ADD CONSTRAINT "Review_userId_fkey" FOREIGN KEY ("userId") REFERENCES "public"."User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."Review" ADD CONSTRAINT "Review_mediaId_fkey" FOREIGN KEY ("mediaId") REFERENCES "public"."Media"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."Rating" ADD CONSTRAINT "Rating_userId_fkey" FOREIGN KEY ("userId") REFERENCES "public"."User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."Rating" ADD CONSTRAINT "Rating_mediaId_fkey" FOREIGN KEY ("mediaId") REFERENCES "public"."Media"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."_Watchlist" ADD CONSTRAINT "_Watchlist_A_fkey" FOREIGN KEY ("A") REFERENCES "public"."Media"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."_Watchlist" ADD CONSTRAINT "_Watchlist_B_fkey" FOREIGN KEY ("B") REFERENCES "public"."User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."_GenreToMedia" ADD CONSTRAINT "_GenreToMedia_A_fkey" FOREIGN KEY ("A") REFERENCES "public"."Genre"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."_GenreToMedia" ADD CONSTRAINT "_GenreToMedia_B_fkey" FOREIGN KEY ("B") REFERENCES "public"."Media"("id") ON DELETE CASCADE ON UPDATE CASCADE;
