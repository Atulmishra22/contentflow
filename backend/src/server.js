import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import articleRoutes from './routes/articleRoutes.js';
import prisma from './config/database.js';
import { scrapeBeyondChatsArticles } from './services/scraperService.js';
import { enhanceArticlePipeline } from './services/enhancementService.js';

dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;

const corsOptions = {
  origin: process.env.FRONTEND_URL || 'http://localhost:5173',
  credentials: true,
  optionsSuccessStatus: 200
};

app.use(cors(corsOptions));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use('/api/articles', articleRoutes);

app.get('/health', (req, res) => {
  res.json({ status: 'OK', message: 'ContentFlow API is running' });
});

app.use((req, res) => {
  res.status(404).json({ error: 'Route not found' });
});

app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({ error: 'Something went wrong!', message: err.message });
});

async function autoSeed() {
async function autoSeed() {
  try {
    const count = await prisma.article.count();
    if (count === 0) {
      console.log('📦 Database is empty. Auto-seeding...');
      const articles = await scrapeBeyondChatsArticles(5);
      
      if (articles.length > 0) {
        for (const article of articles) {
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
        }
        console.log(`✅ Auto-seeded ${articles.length} articles from BeyondChats`);
        return true;
      } else {
        console.log('⚠️  No articles found during auto-seeding');
      }
    }
    return false;
  } catch (error) {
    console.error('❌ Auto-seed error:', error.message);
    return false;
  }
}

async function autoEnhance() {
  try {
    const unenhancedArticles = await prisma.article.findMany({
      where: {
        isEnhanced: false,
        originalArticleId: null,
      },
    });

    if (unenhancedArticles.length === 0) {
      console.log('✅ All articles are already enhanced');
      return;
    }

    console.log(`\n🤖 Auto-enhancing ${unenhancedArticles.length} articles...`);

    for (const article of unenhancedArticles) {
      try {
        console.log(`\n🔄 Enhancing: "${article.title}"`);
        const result = await enhanceArticlePipeline(article);

        if (result) {
          await prisma.article.update({
            where: { id: article.id },
            data: {
              enhancedContent: result.enhancedContent,
              isEnhanced: true,
              references: JSON.stringify(result.references),
              enhancedAt: new Date(),
              wordCount: result.enhancedContent.split(/\s+/).length,
            },
          });
          console.log(`   ✅ Enhanced successfully`);
        }

        await new Promise(resolve => setTimeout(resolve, 2000));
      } catch (error) {
        console.error(`   ❌ Failed to enhance: ${error.message}`);
      }
    }

    console.log(`\n✅ Auto-enhancement complete!\n`);
  } catch (error) {
    console.error('❌ Auto-enhance error:', error.message);
  }
}

app.listen(PORT, async () => {
  console.log(`🚀 Server running on http://localhost:${PORT}`);
  console.log(`📊 Health check: http://localhost:${PORT}/health`);
  
  const wasSeeded = await autoSeed();
  await autoEnhance();
});
