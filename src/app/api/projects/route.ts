import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export const dynamic = 'force-dynamic';

export async function GET() {
  try {
    const projects = await prisma.project.findMany({ orderBy: { id: 'desc' } });
    const formatted = projects.map((p: any) => ({
      ...p,
      gallery: JSON.parse(p.gallery || '[]'),
      tags: p.tags ? JSON.parse(p.tags) : [],
      audioDemos: p.audioDemos ? JSON.parse(p.audioDemos) : [],
      videoDemos: p.videoDemos ? JSON.parse(p.videoDemos) : []
    }));
    return NextResponse.json(formatted);
  } catch (error) {
    return NextResponse.json([], { status: 200 });
  }
}

export async function POST(request: Request) {
  try {
    const body: any = await request.json();

    // Gemini API Enhancement
    if (process.env.GEMINI_API_KEY && body.title && body.description) {
      try {
        const prompt = `Aşağıdaki oyunun/projenin başlığı ve İngilizce/Başka dilde olabilecek bir tanıtım metni bulunuyor:
Başlık: "${body.title}"
Açıklama: "${body.description}"

GÖREVLER VE KESİN SEO KURALLARI:
1. Çeviri ve Akıcılık: Bu açıklamayı robotik olmayan, kulağa son derece doğal gelen, kaliteli ve heyecan verici bir Türkçe ile yeniden yaz/çevir. Makine çevirisi gibi durmamalıdır.
2. Uzunluk Kuralı: Açıklama metni KESİNLİKLE en az 600 harf (karakter) uzunluğunda olmalıdır. Oyunu daha detaylı, atmosferi hissettirerek genişlet.
3. SEO Anahtar Kelime Kuralı: "${body.title}" kelimesini ve oyunun temasını anahtar kelime olarak kabul et. Başlığı metin içerisinde göze batmayacak, doğal bir şekilde en az 1-2 kez geçir.
4. Sadece ve sadece JSON formatında dön. Başka hiçbir şey yazma. JSON içeriği: { "description": "oluşturduğun 600+ harflik yeni mükemmel türkçe açıklama", "tags": ["seo", "için", "en", "iyi", "5", "etiket"] }`;

        const geminiRes = await fetch(`https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash:generateContent?key=${process.env.GEMINI_API_KEY}`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            contents: [{ parts: [{ text: prompt }] }],
            generationConfig: { responseMimeType: "application/json" }
          })
        });
        const geminiData = await geminiRes.json();
        
        if (geminiData.candidates?.[0]?.content?.parts?.[0]?.text) {
          const parsed = JSON.parse(geminiData.candidates[0].content.parts[0].text);
          if (parsed.description) body.description = parsed.description;
          if (parsed.tags && Array.isArray(parsed.tags)) body.tags = parsed.tags;
        }
      } catch (err) {
        console.error("Gemini enhancement failed:", err);
      }
    }

    const created: any = await prisma.project.create({
      data: {
        id: body.id || Date.now().toString(),
        title: body.title || 'Untitled',
        category: body.category || '',
        status: body.status || '',
        description: body.description || '',
        retention: body.retention || '0%',
        views: body.views || '0',
        swiped: body.swiped || '0%',
        stayed: body.stayed || '0%',
        downloads: body.downloads || '0',
        team: body.team || 'Star Dublaj',
        image: body.image || null,
        image2: body.image2 || null,
        coverImage: body.coverImage || null,
        coverImage2: body.coverImage2 || null,
        trailer: body.trailer || null,
        focusKeyword: body.focusKeyword || null,
        seoTitle: body.seoTitle || null,
        seoDesc: body.seoDesc || null,
        slug: body.slug || null,
        gallery: JSON.stringify(body.gallery || []),
        tags: JSON.stringify(body.tags || []),
        audioDemos: JSON.stringify(body.audioDemos || []),
        videoDemos: JSON.stringify(body.videoDemos || [])
      } as any
    });
    return NextResponse.json({ 
      ...created, 
      gallery: JSON.parse(created.gallery || '[]'), 
      tags: JSON.parse(created.tags || '[]'),
      audioDemos: JSON.parse(created.audioDemos || '[]'),
      videoDemos: JSON.parse(created.videoDemos || '[]')
    });
  } catch (error) {
    return NextResponse.json({ error: 'Failed to save' }, { status: 500 });
  }
}

export async function PUT(request: Request) {
  try {
    const body: any = await request.json();
    const id = body.id;
    const data = { ...body };
    delete data.id;
    delete data.createdAt;
    delete data.updatedAt;
    if (data.gallery && Array.isArray(data.gallery)) data.gallery = JSON.stringify(data.gallery);
    if (data.tags && Array.isArray(data.tags)) data.tags = JSON.stringify(data.tags);
    if (data.audioDemos && Array.isArray(data.audioDemos)) data.audioDemos = JSON.stringify(data.audioDemos);
    if (data.videoDemos && Array.isArray(data.videoDemos)) data.videoDemos = JSON.stringify(data.videoDemos);

    const updated: any = await prisma.project.update({
      where: { id },
      data: data as any
    });
    return NextResponse.json({ 
       ...updated, 
       gallery: JSON.parse(updated.gallery || '[]'),
       tags: updated.tags ? JSON.parse(updated.tags) : [],
       audioDemos: JSON.parse(updated.audioDemos || '[]'),
       videoDemos: JSON.parse(updated.videoDemos || '[]')
    });
  } catch (error) {
    return NextResponse.json({ error: 'Failed to update' }, { status: 500 });
  }
}

export async function DELETE(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const id = searchParams.get('id');
    if (!id) return NextResponse.json({ error: 'No ID' }, { status: 400 });
    await prisma.project.delete({ where: { id } });
    return NextResponse.json({ success: true });
  } catch (error) {
    return NextResponse.json({ error: 'Failed to delete' }, { status: 500 });
  }
}
