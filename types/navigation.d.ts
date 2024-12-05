import { Locale } from '@/i18n/routing';
import { NavigationConfig } from 'next-intl/navigation';
import { ComponentProps } from 'react';
import { UrlObject } from 'url';

export type NavigateOptions = {
  locale?: Locale;
};

export type RedirectOptions = NavigateOptions & {
  permanent?: boolean;
};

export type NavigationProps = ComponentProps<'a'> & {
  href: string | UrlObject;
  locale?: Locale;
};

declare module 'next-intl/navigation' {
  export function createNavigation(config: NavigationConfig): {
    Link: React.ForwardRefExoticComponent<NavigationProps>;
    redirect: (href: string, options?: RedirectOptions) => never;
    redirectPath: (path: string, options?: RedirectOptions) => never;
    usePathname: () => string;
    useRouter: () => {
      back: () => void;
      forward: () => void;
      push: (href: string, options?: NavigateOptions) => void;
      replace: (href: string, options?: NavigateOptions) => void;
      prefetch: (href: string) => void;
      refresh: () => void;
    };
    getPathname: (pathname: string, options?: { locale?: Locale }) => string;
  };
}
