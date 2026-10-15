'use client';

import { useState } from 'react';
import { Podcast as PodcastIcon } from 'lucide-react';
import SearchForm from '@/components/SearchForm';
import PodcastCard, { Podcast } from '@/components/PodcastCard';

export default function Home() {
  const [podcasts, setPodcasts] = useState<Podcast[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  const [hasSearched, setHasSearched] = useState(false);

  const handleSearch = async (query: string) => {
    setIsLoading(true);
    setError('');
    setHasSearched(true);

    try {
      const res = await fetch(`/api/spotify/search?q=${encodeURIComponent(query)}`);

      if (!res.ok) {
        throw new Error('Failed to fetch episodes');
      }

      const data = await res.json();

      if (data.items) {
        // API returns a list of episodes in `items`
        setPodcasts(data.items.filter(Boolean));
      } else {
        setPodcasts([]);
      }
    } catch (err) {
      console.error(err);
      setError(
        'An error occurred while searching for episodes. Please ensure you have configured SPOTIFY_SHOW_ID and Spotify credentials in .env.local.',
      );
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#050505] text-white relative overflow-hidden font-sans">
      {/* Dynamic Background Gradients */}
      <div className="absolute top-0 -left-1/4 w-[800px] h-[800px] bg-green-500/10 rounded-full blur-[120px] opacity-70 pointer-events-none" />
      <div className="absolute bottom-0 -right-1/4 w-[600px] h-[600px] bg-emerald-700/10 rounded-full blur-[120px] opacity-50 pointer-events-none" />
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-full h-[500px] bg-gray-500/5 rounded-full blur-[100px] pointer-events-none" />

      <main className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-12 pb-24 min-h-screen flex flex-col">
        {/* Header Section */}
        <div
          className={`transition-all duration-700 ease-in-out flex flex-col items-center ${hasSearched ? 'mt-8 mb-16' : 'mt-[15vh] mb-0'}`}
        >
          <div className="flex flex-col items-center justify-center animate-in fade-in slide-in-from-bottom-8 duration-700">
            <div className="w-20 h-20 mb-8 bg-gradient-to-br from-green-400 to-green-600 rounded-2xl flex items-center justify-center shadow-2xl shadow-green-500/30 transform -rotate-12 hover:rotate-0 transition-transform duration-500 text-black">
              <PodcastIcon className="w-10 h-10" />
            </div>
            <h1 className="text-5xl sm:text-7xl font-extrabold tracking-tight text-transparent bg-clip-text bg-gradient-to-br from-white via-white to-gray-500 mb-6 text-center">
              Hoy Trasnoche Search
            </h1>
            <p className="text-lg sm:text-xl text-gray-400 max-w-2xl text-center mb-12 leading-relaxed">
              A ver si encuentro el episodio de hoy trasnoche en base a la descripción... 
            </p>
          </div>

          <div className="w-full animate-in fade-in slide-in-from-bottom-10 duration-700 delay-150 fill-mode-both">
            <SearchForm onSearch={handleSearch} isLoading={isLoading} />
          </div>
        </div>

        {/* Error State */}
        {error && (
          <div className="bg-red-500/10 border border-red-500/20 text-red-400 px-6 py-4 rounded-2xl max-w-2xl mx-auto text-center w-full animate-in fade-in zoom-in duration-300">
            {error}
          </div>
        )}

        {/* Results Section */}
        <div
          className={`transition-all duration-700 ease-in-out transform ${hasSearched && !isLoading && !error ? 'translate-y-0 opacity-100' : 'translate-y-8 opacity-0 hidden'}`}
        >
          {podcasts.length === 0 ? (
            <div className="text-center text-gray-400 mt-16 bg-white/5 border border-white/10 rounded-3xl p-16 max-w-2xl mx-auto backdrop-blur-sm">
              <PodcastIcon className="w-16 h-16 mx-auto mb-6 text-gray-600" />
              <p className="text-2xl font-semibold text-white mb-2">No episodes found</p>
              <p className="text-gray-400">
                Try adjusting your search terms or checking your spelling.
              </p>
            </div>
          ) : (
            <div>
              <div className="flex items-center justify-between mb-8 border-b border-white/10 pb-6">
                <h2 className="text-3xl font-bold flex items-center gap-4">
                  Results
                  <span className="text-sm font-semibold bg-green-500/20 text-green-400 px-4 py-1.5 rounded-full border border-green-500/20">
                    {podcasts.length} episodes
                  </span>
                </h2>
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8">
                {podcasts.map((podcast, index) => (
                  <div
                    key={podcast.id}
                    className="animate-in fade-in zoom-in-95 duration-500 fill-mode-both"
                    style={{ animationDelay: `${index * 50}ms` }}
                  >
                    <PodcastCard podcast={podcast} />
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      </main>
    </div>
  );
}
