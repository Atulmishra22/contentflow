-- CreateTable
CREATE TABLE "Article" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "title" TEXT NOT NULL,
    "content" TEXT NOT NULL,
    "author" TEXT,
    "publishedDate" DATETIME,
    "sourceUrl" TEXT,
    "isEnhanced" BOOLEAN NOT NULL DEFAULT false,
    "originalArticleId" INTEGER,
    "enhancedArticleId" INTEGER,
    "references" TEXT,
    "scrapedAt" DATETIME,
    "enhancedAt" DATETIME,
    "wordCount" INTEGER,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL
);
