const { PrismaClient } = require('@prisma/client');
const fs = require('fs');
const path = require('path');

const prisma = new PrismaClient();

async function main() {
  try {
    const pPath = path.join(process.cwd(), 'src/data/projects.json');
    if (fs.existsSync(pPath)) {
      const data = JSON.parse(fs.readFileSync(pPath, 'utf8'));
      for (const p of data) {
        await prisma.project.upsert({
          where: { id: String(p.id) },
          create: {
            id: String(p.id),
            title: p.title || 'Untitled',
            category: p.category || '',
            status: p.status || '',
            description: p.description || '',
            retention: p.retention || '0%',
            views: p.views || '0',
            swiped: p.swiped || '0%',
            stayed: p.stayed || '0%',
            downloads: p.downloads || '0',
            team: p.team || 'Star Dublaj',
            image: p.image || null,
            trailer: p.trailer || null,
            gallery: JSON.stringify(p.gallery || [])
          },
          update: {}
        });
      }
      console.log('Eski projeler yedeğinden veritabanına aktarıldı!');
    }
  } catch (e) {
    console.error(e);
  } finally {
    await prisma.$disconnect();
  }
}

main();
