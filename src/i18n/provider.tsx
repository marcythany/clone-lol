'use client';

import { NextIntlClientProvider, AbstractIntlMessages } from 'next-intl';
import { PropsWithChildren } from 'react';

type Props = {
  locale: string;
  messages: AbstractIntlMessages;
  timeZone: string;
  now: Date;
};

export function IntlProvider({
  locale,
  messages,
  timeZone,
  now,
  children,
}: PropsWithChildren<Props>) {
  return (
    <NextIntlClientProvider
      locale={locale}
      messages={messages}
      timeZone={timeZone}
      now={now}
      onError={(error) => {
        if (process.env.NODE_ENV === 'development') {
          console.error(error);
        }
      }}
    >
      {children}
    </NextIntlClientProvider>
  );
} 