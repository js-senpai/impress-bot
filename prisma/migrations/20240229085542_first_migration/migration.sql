-- CreateTable
CREATE TABLE "user" (
    "id" TEXT NOT NULL,
    "telegramId" INTEGER NOT NULL,
    "login" TEXT,
    "firstName" TEXT,
    "lastName" TEXT,
    "isAdmin" BOOLEAN DEFAULT false,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "user_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "welcomeText" (
    "id" TEXT NOT NULL,
    "text" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "welcomeText_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "welcomeVideos" (
    "id" TEXT NOT NULL,
    "fileName" TEXT NOT NULL,
    "uniqueName" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "welcomeVideos_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "user_telegramId_key" ON "user"("telegramId");

-- CreateIndex
CREATE INDEX "user_telegramId_idx" ON "user"("telegramId");

-- CreateIndex
CREATE UNIQUE INDEX "welcomeVideos_fileName_key" ON "welcomeVideos"("fileName");

-- CreateIndex
CREATE UNIQUE INDEX "welcomeVideos_uniqueName_key" ON "welcomeVideos"("uniqueName");
