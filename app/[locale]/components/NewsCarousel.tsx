'use client';

import { useState } from 'react';
import Image from 'next/image';
import { motion, AnimatePresence } from 'framer-motion';
import { ChevronLeft, ChevronRight, Play } from 'lucide-react';
import { NewsItem } from '@/types/news';
import { cn } from '@/lib/utils';
import { useTranslations } from 'next-intl';

interface NewsCarouselProps {
  items: NewsItem[];
}

export default function NewsCarousel({ items }: NewsCarouselProps) {
  const [currentIndex, setCurrentIndex] = useState(0);
  const t = useTranslations('HomePage');

  const nextSlide = () => {
    setCurrentIndex((prev) => (prev === items.length - 1 ? 0 : prev + 1));
  };

  const prevSlide = () => {
    setCurrentIndex((prev) => (prev === 0 ? items.length - 1 : prev - 1));
  };

  return (
    <div className="relative h-full rounded-xl overflow-hidden bento-item group">
      <AnimatePresence mode="wait">
        <motion.div
          key={currentIndex}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.5 }}
          className="relative w-full h-full cursor-pointer"
          onClick={() => items[currentIndex].videoUrl && window.open(items[currentIndex].videoUrl, '_blank')}
        >
          <div className="relative w-full h-full overflow-hidden">
            <Image
              src={items[currentIndex].imageUrl}
              alt={t(items[currentIndex].titleKey)}
              fill
              sizes="100vw"
              className="object-cover object-top group-hover:scale-105 transition-transform duration-500"
              priority
            />
          </div>
          <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/30 to-transparent" />
          
          {items[currentIndex].videoUrl && (
            <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-300">
              <div className="w-16 h-16 rounded-full glass-effect flex items-center justify-center group-hover:bg-[#C89B3C] transition-colors">
                <Play className="w-8 h-8 text-white" />
              </div>
            </div>
          )}

          <div className="absolute bottom-0 left-0 right-0 glass-effect backdrop-blur-sm bg-opacity-30">
            <div className="p-4 max-w-screen-xl mx-auto">
              <div className="flex items-center gap-2 mb-1">
                <div className="glass-effect text-xs text-[#C89B3C] uppercase px-2 py-1 rounded-full">
                  {t(`newsType.${items[currentIndex].type}`)}
                </div>
              </div>
              <h2 className="text-xl md:text-2xl font-bold text-white mb-1">
                {t(items[currentIndex].titleKey)}
              </h2>
              {items[currentIndex].descriptionKey && (
                <p className="text-sm text-gray-200 line-clamp-2">
                  {t(items[currentIndex].descriptionKey)}
                </p>
              )}
            </div>
          </div>
        </motion.div>
      </AnimatePresence>

      <button
        onClick={prevSlide}
        className="absolute left-4 top-1/2 -translate-y-1/2 glass-effect p-2 rounded-full hover:scale-110 transition-transform"
        aria-label={t('previous')}
      >
        <ChevronLeft className="w-6 h-6 text-white" />
      </button>

      <button
        onClick={nextSlide}
        className="absolute right-4 top-1/2 -translate-y-1/2 glass-effect p-2 rounded-full hover:scale-110 transition-transform"
        aria-label={t('next')}
      >
        <ChevronRight className="w-6 h-6 text-white" />
      </button>

      <div className="absolute bottom-16 left-1/2 -translate-x-1/2 flex gap-2">
        {items.map((_, index) => (
          <button
            key={index}
            onClick={() => setCurrentIndex(index)}
            className={cn(
              'w-2 h-2 rounded-full transition-all',
              'glass-effect hover:scale-125',
              index === currentIndex ? 'w-4 bg-white' : 'bg-white/50'
            )}
            aria-label={t('goToSlide', { number: index + 1 })}
          />
        ))}
      </div>
    </div>
  );
}
