import prisma from './src/config/database.js';

async function deleteDuplicates() {
  const result = await prisma.article.deleteMany({
    where: {
      id: {
        gte: 6
      }
    }
  });
  
  console.log(`✅ Deleted ${result.count} duplicate articles`);
  await prisma.$disconnect();
}

deleteDuplicates();
