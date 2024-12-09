'use client';

import { SocialButtons } from 'components/auth/SocialButtons';
import { Card, CardContent, CardHeader } from 'components/ui/card';
import * as m from '@/paraglide/messages'; // Importando as mensagens do arquivo configurado

export default function LoginPage() {
  // Acessando as traduções diretamente das mensagens importadas
  const loginTitle = m.Auth_login_title;
  const loginSubtitle = m.Auth_login_subtitle;

  return (
    <Card className='mx-auto w-full max-w-md'>
      <CardHeader className='space-y-1'>
        <h1 className='text-center text-2xl font-bold'>{loginTitle}</h1>
        <p className='text-center text-sm text-muted-foreground'>
          {loginSubtitle}
        </p>
      </CardHeader>
      <CardContent>
        <SocialButtons />
      </CardContent>
    </Card>
  );
}
