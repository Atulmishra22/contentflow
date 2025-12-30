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
      console.log('⚠️  No articles scraped. Using sample data...');
      const sampleArticles = [
        {
          title: 'The Future of AI in Customer Service',
          content: 'Artificial Intelligence is revolutionizing how businesses interact with customers. From chatbots to predictive analytics, AI tools are making customer service faster, more efficient, and more personalized than ever before. Companies that embrace these technologies are seeing significant improvements in customer satisfaction and operational efficiency.',
          author: 'BeyondChats Team',
          publishedDate: new Date('2024-01-15'),
          sourceUrl: 'https://beyondchats.com/blogs/ai-customer-service'
        },
        {
          title: 'Building Better Chatbots: A Complete Guide',
          content: 'Creating effective chatbots requires more than just implementing AI. It requires understanding user needs, designing intuitive conversations, and continuously improving based on feedback. This guide covers everything from initial planning to deployment and maintenance of successful chatbot systems.',
          author: 'Tech Team',
          publishedDate: new Date('2024-01-10'),
          sourceUrl: 'https://beyondchats.com/blogs/chatbot-guide'
        },
        {
          title: 'Understanding Natural Language Processing',
          content: 'Natural Language Processing (NLP) is the backbone of modern conversational AI. It enables machines to understand, interpret, and generate human language in ways that are both meaningful and useful. This article explores the key concepts and applications of NLP in business.',
          author: 'BeyondChats Team',
          publishedDate: new Date('2024-01-05'),
          sourceUrl: 'https://beyondchats.com/blogs/nlp-explained'
        },
        {
          title: 'Customer Engagement in the Digital Age',
          content: 'Digital transformation has fundamentally changed how companies engage with customers. Modern consumers expect instant responses, personalized experiences, and seamless omnichannel interactions. Learn how to meet these expectations and build lasting customer relationships.',
          author: 'Marketing Team',
          publishedDate: new Date('2023-12-28'),
          sourceUrl: 'https://beyondchats.com/blogs/digital-engagement'
        },
        {
          title: 'Automation and Efficiency: The Perfect Pair',
          content: 'Business automation is no longer optional—it\'s essential for staying competitive. By automating routine tasks and workflows, companies can free up their teams to focus on high-value work while improving accuracy and speed. Discover the key areas where automation can make the biggest impact.',
          author: 'BeyondChats Team',
          publishedDate: new Date('2023-12-20'),
          sourceUrl: 'https://beyondchats.com/blogs/automation-efficiency'
        }
      ];

      scrapedArticles.push(...sampleArticles);
    }

    // Insert articles into database
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

// Run seeder
seedArticles();
