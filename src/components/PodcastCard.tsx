'use client';

import { Tooltip } from 'react-tooltip';
import 'react-tooltip/dist/react-tooltip.css';

export interface Podcast {
  id: string;
  name: string;
  release_date: string;
  description: string;
  images: { url: string; height: number; width: number }[];
  external_urls: { spotify: string };
}

interface PodcastCardProps {
  podcast: Podcast;
}

export default function PodcastCard({ podcast }: PodcastCardProps) {
  const imageUrl = podcast.images.length > 0 ? podcast.images[0].url : '';

  const formattedDate = podcast.release_date
    ? podcast.release_date.split('-').reverse().join('-')
    : '';

  return (
    <>
      <a
        href={podcast.external_urls.spotify}
      target="_blank"
      rel="noopener noreferrer"
      className="group flex flex-col bg-white/5 border border-white/10 rounded-2xl overflow-hidden hover:bg-white/10 transition-all duration-300 hover:-translate-y-2 hover:shadow-2xl hover:shadow-green-500/20 backdrop-blur-sm h-full"
    >
      <div className="relative aspect-square w-full overflow-hidden bg-black/50">
        {imageUrl ? (
          // eslint-disable-next-line @next/next/no-img-element
          <img
            src={imageUrl}
            alt={podcast.name}
            className="object-cover w-full h-full group-hover:scale-105 transition-transform duration-500"
          />
        ) : (
          <div className="w-full h-full flex items-center justify-center text-gray-500">
            No Image
          </div>
        )}
      </div>
      <div className="p-6 flex flex-col flex-grow">
        <h3
          className="text-xl font-bold text-white line-clamp-1 group-hover:text-green-400 transition-colors"
          data-tooltip-id={`tooltip-${podcast.id}`}
          data-tooltip-content={podcast.name}
        >
          {podcast.name}
        </h3>
        <p className="text-sm font-medium text-green-500/80 mt-1 line-clamp-1">
          {formattedDate}
        </p>
        <p
          className="text-sm text-gray-400 mt-4 line-clamp-3 leading-relaxed flex-grow"
          data-tooltip-id={`tooltip-${podcast.id}`}
          data-tooltip-content={podcast.description}
        >
          {podcast.description}
        </p>
      </div>
      </a>
      <Tooltip
        id={`tooltip-${podcast.id}`}
        className="z-[9999] max-w-sm !bg-zinc-800 !text-gray-200 !rounded-xl !shadow-2xl !p-4 !text-sm leading-relaxed"
        style={{ opacity: 1 }}
        place="top"
        positionStrategy="fixed"
      />
    </>
  );
}
