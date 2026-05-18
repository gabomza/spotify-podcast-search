/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable @typescript-eslint/no-unused-vars */
import { NextResponse } from 'next/server';
import { getSpotifyToken, SPOTIFY_SHOW_ID } from '@/config/spotify';

// Helper to fetch all episodes, capping at 10 pages (500 episodes) to be safe with timeouts
async function fetchAllEpisodes(token: string, showId: string) {
  let allEpisodes: any[] = [];
  let nextUrl: string | null = `https://api.spotify.com/v1/shows/${showId}/episodes?limit=50`;
  
  let pages = 0;
  while (nextUrl && pages < 10) {
    const res: any = await fetch(nextUrl, {
      method: 'GET',
      headers: { Authorization: `Bearer ${token}` },
      // Cache this request for 1 hour so frequent searches don't spam the API
      next: { revalidate: 3600 } 
    });
    
    if (!res.ok) {
      console.error('Failed to fetch episodes', await res.text());
      break;
    }
    
    const data: any = await res.json();
    if (data.items) {
      allEpisodes = allEpisodes.concat(data.items);
    }
    nextUrl = data.next;
    pages++;
  }
  
  return allEpisodes;
}

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const query = searchParams.get('q');
  
  if (!SPOTIFY_SHOW_ID) {
    return NextResponse.json({ error: 'SPOTIFY_SHOW_ID is not configured in .env.local' }, { status: 500 });
  }

  const token = await getSpotifyToken();

  if (!token) {
    return NextResponse.json({ error: 'Failed to authenticate with Spotify' }, { status: 500 });
  }

  try {
    // We get all episodes (cached heavily by Next.js)
    const episodes = await fetchAllEpisodes(token, SPOTIFY_SHOW_ID);
    
    let filteredEpisodes = episodes;
    if (query) {
      const lowerQuery = query.toLowerCase();
      // Filter in memory matching both name and description
      filteredEpisodes = episodes.filter((ep: any) => 
        (ep.name && ep.name.toLowerCase().includes(lowerQuery)) || 
        (ep.description && ep.description.toLowerCase().includes(lowerQuery))
      );
    }

    return NextResponse.json({ items: filteredEpisodes });
  } catch (_error) {
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}
