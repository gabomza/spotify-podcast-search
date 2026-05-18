export const SPOTIFY_CLIENT_ID = process.env.CLIENT_ID || '';
export const SPOTIFY_CLIENT_SECRET = process.env.CLIENT_SECRET || '';
export const SPOTIFY_SHOW_ID = process.env.SPOTIFY_SHOW_ID || '';

export const getSpotifyToken = async () => {
  if (!SPOTIFY_CLIENT_ID || !SPOTIFY_CLIENT_SECRET) {
    console.error('Spotify credentials are not configured in environment variables.');
    return null;
  }

  const response = await fetch('https://accounts.spotify.com/api/token', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/x-www-form-urlencoded',
      Authorization: `Basic ${Buffer.from(`${SPOTIFY_CLIENT_ID}:${SPOTIFY_CLIENT_SECRET}`).toString(
        'base64',
      )}`,
    },
    body: 'grant_type=client_credentials',
    cache: 'no-store', // Token is valid for a short time
  });

  if (!response.ok) {
    console.error('Failed to get Spotify token', await response.text());
    return null;
  }

  const data = await response.json();
  return data.access_token;
};
