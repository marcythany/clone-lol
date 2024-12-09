'use client';

import { SocialButtons } from 'components/auth/SocialButtons';
import { Card, CardContent, CardHeader } from 'components/ui/card';
import * as m from '@/paraglide/messages.js';

export default function RegisterPage() {
  return (
    <Card className='mx-auto w-full max-w-md'>
      <CardHeader className='space-y-1'>
        <h1 className='text-center text-2xl font-bold'>
          {m.Auth_register_title()}
        </h1>
        <p className='text-center text-sm text-muted-foreground'>
          {m.Auth_register_subtitle()}
        </p>
      </CardHeader>
      <CardContent>
        <SocialButtons />
      </CardContent>
    </Card>
  );
}
