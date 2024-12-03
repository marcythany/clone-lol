'use client'

import { useTranslations } from 'next-intl';
import { Link } from '@/i18n/routing';
import type { User } from '@supabase/supabase-js';

interface HomeContentProps {
  user: User | null;
}

export default function HomeContent({ user }: HomeContentProps) {
  const t = useTranslations('HomePage');

  return (
    <div className="space-y-8">
      <section className="space-y-4">
        <h1 className="text-4xl font-bold text-white">
          {t('title')}
        </h1>
        <p className="text-lg text-gray-400">
          {t('description')}
        </p>
      </section>

      <section className="space-y-4">
        <h2 className="text-2xl font-bold text-white">
          {t('featured')}
        </h2>
        {/* Featured content */}
      </section>

      <section className="space-y-4">
        <h2 className="text-2xl font-bold text-white">
          {t('recent')}
        </h2>
        {/* Recent news */}
      </section>
    </div>
  );
}
