const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function clean() {
  const allProjects = await prisma.project.findMany({ orderBy: { id: 'desc' } });
  
  const seen = new Set();
  let deletedCount = 0;
  
  for (const p of allProjects) {
    if (seen.has(p.title)) {
      await prisma.project.delete({ where: { id: p.id } });
      deletedCount++;
    } else {
      seen.add(p.title);
    }
  }
  
  console.log("TEMIZLIK TAMAMLANDI! Silinen kopya sayisi: " + deletedCount);
}

clean().catch(e => console.error(e)).finally(() => prisma.$disconnect());
