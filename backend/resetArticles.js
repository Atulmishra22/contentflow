import prisma from './src/config/database.js';

async function resetArticles() {
  const result = await prisma.article.updateMany({
    data: {
      isEnhanced: false,
      enhancedAt: null,
      references: null,
    }
  });
  
  console.log(`✅ Reset ${result.count} articles to re-enhance with better content`);
  await prisma.$disconnect();
}

resetArticles();
