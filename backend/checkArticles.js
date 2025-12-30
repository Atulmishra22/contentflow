import prisma from './src/config/database.js';

async function checkArticles() {
  const articles = await prisma.article.findMany({
    select: {
      id: true,
      title: true,
      isEnhanced: true,
      wordCount: true,
      content: true,
    }
  });
  
  console.log('\n📊 Current Articles in Database:\n');
  articles.forEach(article => {
    console.log(`ID: ${article.id}`);
    console.log(`Title: ${article.title}`);
    console.log(`Enhanced: ${article.isEnhanced}`);
    console.log(`Word Count: ${article.wordCount}`);
    console.log(`Content Length: ${article.content.length} characters`);
    console.log(`Content Preview: ${article.content.substring(0, 200)}...`);
    console.log('---\n');
  });
  
  await prisma.$disconnect();
}

checkArticles();
