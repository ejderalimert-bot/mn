import { NextResponse } from 'next/server';

export const dynamic = 'force-dynamic';

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const action = searchParams.get('action');

  if (action === 'search') {
    const q = searchParams.get('q');
    if (!q) return NextResponse.json({ error: 'Missing query' }, { status: 400 });

    try {
      const res = await fetch(`https://store.steampowered.com/api/storesearch/?term=${encodeURIComponent(q)}&l=turkish&cc=TR`, {
        headers: {
          'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36',
          'Accept': 'application/json'
        }
      });
      if (!res.ok) {
        throw new Error(`Steam API responded with status: ${res.status}`);
      }
      const data = await res.json();
      return NextResponse.json(data);
    } catch (error: any) {
      console.error('Steam Search API Error:', error.message);
      return NextResponse.json({ error: 'Steam API error' }, { status: 500 });
    }
  }

  if (action === 'details') {
    const appid = searchParams.get('appid');
    if (!appid) return NextResponse.json({ error: 'Missing appid' }, { status: 400 });

    try {
      const res = await fetch(`https://store.steampowered.com/api/appdetails?appids=${appid}&l=turkish`, {
        headers: {
          'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36',
          'Accept': 'application/json'
        }
      });
      if (!res.ok) {
        throw new Error(`Steam API responded with status: ${res.status}`);
      }
      const data = await res.json();
      return NextResponse.json(data);
    } catch (error: any) {
      console.error('Steam Details API Error:', error.message);
      return NextResponse.json({ error: 'Steam API error' }, { status: 500 });
    }
  }

  return NextResponse.json({ error: 'Invalid action' }, { status: 400 });
}
