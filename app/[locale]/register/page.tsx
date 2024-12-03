import { useTranslations } from 'next-intl';
import { setRequestLocale } from 'next-intl/server';
import { AuthForm } from '@/components/auth/auth-form';
import type { Locale } from '@/i18n/routingg';

export default function RegisterPage({ params: { locale } }: { params: { locale: Locale } }) {
  setRequestLocale(locale);
  const t = useTranslations('Auth');

  return (
    <div className="flex h-[calc(100vh-theme(spacing.16))] items-center justify-center py-10">
      <div className="w-full max-w-md">
        <h1 className="text-center text-3xl font-bold mb-8">{t('registerButton')}</h1>
        <AuthForm mode="register" />
      </div>
    </div>
  );
}
