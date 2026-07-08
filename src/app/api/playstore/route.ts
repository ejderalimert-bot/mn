import { NextResponse } from 'next/server';
const gplay = require('google-play-scraper');

export const dynamic = 'force-dynamic';

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const action = searchParams.get('action');

  if (action === 'search') {
    const q = searchParams.get('q');
    if (!q) return NextResponse.json({ error: 'Missing query' }, { status: 400 });

    try {
      const results = await gplay.search({
        term: q,
        num: 15,
        country: 'tr',
        lang: 'tr'
      });

      // Filter and map results to match the frontend expected format
      const items = results.map((item: any) => ({
        id: item.appId,       // Package name acts as the unique ID
        name: item.title,
        tiny_image: item.icon,
        developer: item.developer,
        priceText: item.free ? 'Ücretsiz' : `${item.priceText || 'Ücretli'}`
      }));

      return NextResponse.json({ items });
    } catch (error: any) {
      console.error('PlayStore Search Error:', error.message);
      return NextResponse.json({ error: 'Play Store Search API error' }, { status: 500 });
    }
  }

  if (action === 'details') {
    const appId = searchParams.get('appid');
    if (!appId) return NextResponse.json({ error: 'Missing appid' }, { status: 400 });

    try {
      const details = await gplay.app({
        appId: appId,
        country: 'tr',
        lang: 'tr'
      });

      // Format response to match the Steam client mapper structure
      // e.g. mapping header_image and screenshots
      const formatted = {
        [appId]: {
          data: {
            header_image: details.headerImage || details.icon,
            short_description: details.summary || details.descriptionText || '',
            description: details.description || '',
            screenshots: (details.screenshots || []).map((url: string) => ({ path_full: url }))
          }
        }
      };

      return NextResponse.json(formatted);
    } catch (error: any) {
      console.error('PlayStore Details Error:', error.message);
      return NextResponse.json({ error: 'Play Store Details API error' }, { status: 500 });
    }
  }

  return NextResponse.json({ error: 'Invalid action' }, { status: 400 });
}
