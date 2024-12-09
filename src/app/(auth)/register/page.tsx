'use client';

import { SocialButtons } from 'components/auth/SocialButtons';
import { Card, CardContent, CardHeader } from 'components/ui/card';
import { useTranslations } from 'next-intl';

export default function RegisterPage() {
  const t = useTranslations('Auth');

  return (
    <Card className='mx-auto w-full max-w-md'>
      <CardHeader className='space-y-1'>
        <h1 className='text-center text-2xl font-bold'>
          {t('register.title')}
        </h1>
        <p className='text-center text-sm text-muted-foreground'>
          {t('register.subtitle')}
        </p>
      </CardHeader>
      <CardContent>
        <SocialButtons />
      </CardContent>
    </Card>
  );
}
