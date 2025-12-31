import prisma from '../config/database.js';
import { scrapeBeyondChatsArticles } from '../services/scraperService.js';

async function seedArticles() {
  try {
    console.log('🌱 Starting database seeding...\n');

    const existingCount = await prisma.article.count();
    if (existingCount > 0) {
      console.log(`⚠️  Database already has ${existingCount} articles`);
      console.log('   Delete them first if you want to reseed\n');
      return;
    }

    console.log('📡 Scraping BeyondChats blog...');
    const scrapedArticles = await scrapeBeyondChatsArticles(5);

    if (scrapedArticles.length === 0) {
      console.log('❌ No articles scraped from BeyondChats. Exiting...');
      return;
    }

    console.log(`\n💾 Inserting ${scrapedArticles.length} articles into database...`);
    
    for (const article of scrapedArticles) {
      const wordCount = article.content.split(/\s+/).length;
      
      await prisma.article.create({
        data: {
          title: article.title,
          content: article.content,
          author: article.author,
          publishedDate: article.publishedDate,
          sourceUrl: article.sourceUrl,
          wordCount,
          scrapedAt: new Date()
        }
      });
      
      console.log(`   ✅ ${article.title}`);
    }

    console.log(`\n🎉 Successfully seeded ${scrapedArticles.length} articles!\n`);
  } catch (error) {
    console.error('❌ Seeding error:', error);
    throw error;
  } finally {
    await prisma.$disconnect();
  }
}

seedArticles();
