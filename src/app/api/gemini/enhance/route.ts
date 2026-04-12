import { NextResponse } from 'next/server';

export async function POST(request: Request) {
  try {
    const body: any = await request.json();

    if (!process.env.GEMINI_API_KEY) {
      return NextResponse.json({ error: 'Gemini API Key bulunamadı' }, { status: 400 });
    }

    if (!body.title) {
      return NextResponse.json({ error: 'Başlık zorunludur' }, { status: 400 });
    }

    const category = body.category || 'Oyunlar';
    let typeDescription = "oyunun/projenin";
    if (category.toLowerCase() === 'videolar' || category.toLowerCase() === 'video') {
      typeDescription = "videonun/serinin";
    } else if (category.toLowerCase() === 'yamalar' || category.toLowerCase() === 'yama') {
      typeDescription = "yamanın/modun";
    }

    const focusKeyword = body.focusKeyword || body.title;
    const currentYear = new Date().getFullYear();

    const prompt = `Aşağıdaki ${typeDescription} başlığı${body.trailer ? ', referans video bağlantısı ' : ''} ve mevcut açıklaması verilmiştir:
Başlık: "${body.title}"
Kategori / Tür: "${category}"${body.trailer ? `\nReferans Video: "${body.trailer}"` : ''}
Mevcut Açıklama: "${body.description || ''}"
Odak Anahtar Kelime: "${focusKeyword}"

Sen profesyonel bir SEO Uzmanı ve İçerik Yazarısın. Görevin, verilen bu bilgiler ışığında aşağıdaki 15 SEO kuralına KESİNLİKLE uyarak muazzam bir çıktı üretmektir:

İÇERİK (description alanı) KURALLARI (Markdown formatında üretilecek):
1. İngilizce/yabancı dilde bir metin varsa Türkçeye çevir. Zaten Türkçeyse sıfırdan harika, akıcı ve doğal bir metin yaz. Makine çevirisi gibi durmamalıdır. İçeriğin "${category}" türünde olduğunu unutma.
3. İçerikte odak anahtar kelimeyi ("${focusKeyword}") sıkça, ancak sırıtmaksızın, doğal biçimde kullan.
4. İçeriğin en başında (ilk paragrafta), odak anahtar kelime KESİNLİKLE geçmelidir.
5. H2, H3, H4 vb. alt başlıklar (Markdown ##, ###) oluşturmalı ve bu başlıklarda da Odak Anahtar Kelimeyi kullanmalısın.
6. Anahtar kelime yoğunluğunu yaklaşık %1 seviyesinde tutmalısın.
7. Asla rastgele, ilgisiz hazır görsel (unsplash vs.) ekleme. Sadece sana verilen orijinal metinde zaten bir görsel varsa onu koru, yoksa GÖRSEL EKLEME.
8. İçerikte alakalı DIŞ KAYNAKLARA (Wikipedia, Steam, vb.) Markdown link ([wiki](https://...)) vermelisin.
9. İçerikte SİTE İÇİ diğer sayfalara (Ana sayfa "/", Haberler "/admin" vb.) bağlantılar vermelisin.
10. "Star Dublaj" ekibimizin ürettiği profesyonel Türkçe dublaj veya yama tecrübesine atıfta bulunarak okuyucuyu kalitemizi test etmeye çağır.

SEO METADATA KURALLARI:
11. SEO Başlığı (seoTitle): KESİNLİKLE Odak Anahtar Kelimeyi içermeli ve 60 karakteri geçmemelidir.
12. SEO Başlığında (seoTitle) dikkat çekici olarak şu anki yılı, yani ${currentYear} yılını kullan (Geçmiş yılları kullanma!).
13. Odak Anahtar Kelimesi SEO başlığının bizzat BAŞINDA (yakınında) bulunmalıdır.
14. SEO başlığını, site başlığı ile uyumlu formatta (Örn: "... - Star Dublaj") oluştur.
15. SEO Meta Açıklaması (seoDesc): Odak Anahtar kelimeyi içermeli ve 150 karakteri geçmemelidir.
16. URL Yapısı (slug): Odak anahtar kelimeyi içeren, sadece küçük harfler ve tire (-) işaretinden oluşan SEO dostu bir slug oluştur.

ÖNEMLİ YASAKLAR:
- Asla ama asla metnin sonuna veya başına "_Bu açıklama 600 kelimeyi aşmaktadır_", "_İşte SEO uyumlu açıklama metni_" gibi kendi düşünceni, meta-yorumunu veya onaylama cümleleri ekleme! Sadece istenen metni ver.

ÇIKTI FORMATI (SADECE JSON DÖNÜLECEKTİR, MAKDOWM/CODE BLOCK TİPLERİ KULLANMA, DOĞRUDAN PARSE EDİLEBİLİR JSON METNİ):
{
  "description": "600+ karakterlik, Markdown formatındaki, HTML içermeyen harika metin...",
  "seoTitle": "seo formatına uygun başlık",
  "seoDesc": "seo meta açıklaması",
  "slug": "seo-dostu-url-slug",
  "tags": ["ilgili", "5", "seo", "etiketi"]
}`;

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
      return NextResponse.json(parsed);
    } else {
      throw new Error("Geçersiz yanıt formatı");
    }
  } catch (error) {
    console.error("Gemini enhancement failed:", error);
    return NextResponse.json({ error: 'Gemini servisi hata verdi' }, { status: 500 });
  }
}
