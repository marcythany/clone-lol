'use client';

import { useTranslations, useLocale } from 'next-intl';
import type { User } from '@supabase/supabase-js';
import NewsCarousel from './NewsCarousel';
import NewsGrid from './NewsGrid';
import { NewsItem } from '@/types/news';

// Dados de exemplo - Mova para um arquivo de dados ou API depois
const featuredNews: NewsItem[] = [
  {
    id: '1',
    titleKey: 'news.arcane_s2_title',
    type: 'video',
    imageUrl: 'https://img.youtube.com/vi/8BbNd_LDHDA/maxresdefault.jpg',
    videoUrl: 'https://www.youtube.com/watch?v=8BbNd_LDHDA',
    descriptionKey: 'news.arcane_s2_desc',
    date: '2024-01-10',
    featured: true
  },
  {
    id: '2',
    titleKey: 'news.caitlyn_skin_title',
    type: 'skin',
    imageUrl: 'https://lh3.googleusercontent.com/blogger_img_proxy/AEn0k_vs_opMVXvJLuNUpwW29re0JK1FEAsiyN4a6RFPCv8YQh1474Z-DcKZhnBZM83A_g5iLE-_m24SG2Zw74YDLueK7heKnNYa2SIwBK3yef-KbKjYZZgeIJJk4VvrguOX4bD_bzSeHnshCSJZVed-JLnstgHq38vRchudcDDMVDT6Juw=w919-h516-p-k-no-nu',
    descriptionKey: 'news.caitlyn_skin_desc',
    date: '2024-01-09',
    featured: true
  }
];

const recentNews: NewsItem[] = [
  {
    id: '3',
    titleKey: 'news.the_line_title',
    type: 'video',
    imageUrl: 'https://img.youtube.com/vi/E2Rj2gQAyPA/maxresdefault.jpg',
    videoUrl: 'https://www.youtube.com/watch?v=E2Rj2gQAyPA',
    date: '2024-01-08'
  },
  {
    id: '4',
    titleKey: 'news.zaun_cinematic_title',
    type: 'video',
    imageUrl: 'https://img.youtube.com/vi/Z7YIyP9mLXM/maxresdefault.jpg',
    videoUrl: 'https://www.youtube.com/watch?v=Z7YIyP9mLXM',
    date: '2024-01-07'
  },
  {
    id: '5',
    titleKey: 'news.tocker_trials_title',
    type: 'event',
    imageUrl: 'https://wiki.leagueoflegends.com/en-us/images/Tocker_Star_Guardian_Tier_2.png',
    date: '2024-01-06'
  }
];

interface HomeContentProps {
  user: User | null;
}

export default function HomeContent({ user }: HomeContentProps) {
  const t = useTranslations('HomePage');

  return (
    <div className="h-[calc(100vh-5rem)] overflow-hidden">
      <div className="h-full max-w-7xl mx-auto">
        <div className="h-full flex flex-col gap-2">
          {/* Carrossel de Destaques - 65% da altura */}
          <section className="h-[50%]">
            <h2 className="text-2xl font-bold text-white mb-1">{t('featured')}</h2>
            <div className="h-[calc(100%-2rem)]">
              <NewsCarousel items={featuredNews} />
            </div>
          </section>

          {/* Grade de Notícias Recentes - 35% da altura */}
          <section className="h-[35%]">
            <h2 className="text-2xl font-bold text-white mb-1">{t('recent')}</h2>
            <div className="h-[calc(100%-2rem)]">
              <NewsGrid items={recentNews} />
            </div>
          </section>
        </div>
      </div>
    </div>
  );
}
