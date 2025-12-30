import prisma from '../config/database.js';
import { enhanceArticlePipeline } from '../services/enhancementService.js';

async function main() {
  console.log('🚀 Starting Article Enhancement Pipeline\n');

  try {
    // Get all original articles (non-enhanced)
    const articles = await prisma.article.findMany({
      where: {
        isEnhanced: false,
        originalArticleId: null,
      },
    });

    console.log(`📚 Found ${articles.length} articles to enhance\n`);

    if (articles.length === 0) {
      console.log('✅ No articles need enhancement');
      return;
    }

    let successCount = 0;
    let failCount = 0;

    for (const article of articles) {
      try {
        const result = await enhanceArticlePipeline(article);

        if (!result) {
          failCount++;
          continue;
        }

        // Create enhanced version
        const enhancedArticle = await prisma.article.create({
          data: {
            title: article.title,
            content: result.enhancedContent,
            author: article.author,
            publishedDate: article.publishedDate,
            sourceUrl: article.sourceUrl,
            isEnhanced: true,
            originalArticleId: article.id,
            references: JSON.stringify(result.references),
            enhancedAt: new Date(),
            wordCount: result.enhancedContent.split(/\s+/).length,
          },
        });

        // Update original article to reference enhanced version
        await prisma.article.update({
          where: { id: article.id },
          data: {
            enhancedArticleId: enhancedArticle.id,
          },
        });

        successCount++;
        console.log(`   💾 Saved enhanced version (ID: ${enhancedArticle.id})\n`);

        // Rate limiting - wait 2 seconds between articles
        await new Promise(resolve => setTimeout(resolve, 2000));
      } catch (error) {
        console.error(`   ❌ Failed to enhance article ${article.id}:`, error.message);
        failCount++;
      }
    }

    console.log('\n📊 Enhancement Summary:');
    console.log(`   ✅ Successfully enhanced: ${successCount}`);
    console.log(`   ❌ Failed: ${failCount}`);
    console.log(`   📝 Total processed: ${articles.length}`);
  } catch (error) {
    console.error('💥 Fatal error:', error);
    process.exit(1);
  } finally {
    await prisma.$disconnect();
  }
}

main()
  .then(() => {
    console.log('\n🎉 Enhancement pipeline completed!');
    process.exit(0);
  })
  .catch((error) => {
    console.error('💥 Unexpected error:', error);
    process.exit(1);
  });
