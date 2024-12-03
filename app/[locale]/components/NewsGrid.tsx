'use client';

import Image from 'next/image';
import { Play } from 'lucide-react';
import { NewsItem } from '@/types/news';
import { cn } from '@/lib/utils';
import { useTranslations } from 'next-intl';

interface NewsGridProps {
  items: NewsItem[];
}

export default function NewsGrid({ items }: NewsGridProps) {
  const t = useTranslations('HomePage');

  return (
    <div className="h-full grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
      {items.map((item) => (
        <div
          key={item.id}
          className="relative aspect-video overflow-hidden rounded-lg glass-effect group cursor-pointer"
          onClick={() => item.videoUrl && window.open(item.videoUrl, '_blank')}
        >
          <div className="relative w-full h-full overflow-hidden">
            <Image
              src={item.imageUrl}
              alt={t(item.titleKey)}
              fill
              sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
              className="object-cover group-hover:scale-105 transition-transform duration-500"
            />
          </div>
          <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/30 to-transparent" />
          
          {item.type === 'video' && (
            <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-300">
              <div className="w-12 h-12 rounded-full glass-effect flex items-center justify-center group-hover:bg-[#C89B3C] transition-colors">
                <Play className="w-6 h-6 text-white" />
              </div>
            </div>
          )}

          <div className="absolute bottom-0 left-0 right-0 p-4">
            <div className="glass-effect text-xs text-[#C89B3C] uppercase mb-1 inline-block px-2 py-1 rounded-full">
              {t(`newsType.${item.type}`)}
            </div>
            <h3 className="text-white font-medium line-clamp-2">
              {t(item.titleKey)}
            </h3>
          </div>
        </div>
      ))}
    </div>
  );
}
