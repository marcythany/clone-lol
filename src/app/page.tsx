// Importações necessárias
import { Button } from 'components/ui/button';
import { ArrowRight } from 'lucide-react';
import * as m from '@/paraglide/messages.js';
import { Link } from '@/lib/i18n';

export default function HomePage() {
  return (
    <div className='flex min-h-screen flex-col'>
      <section className='relative flex flex-col items-center justify-center overflow-hidden py-32 text-center'>
        <div className='relative z-10 mx-auto max-w-5xl px-6'>
          {/* Título principal */}
          <h1 className='mb-6 text-4xl font-extrabold tracking-tight sm:text-5xl md:text-6xl'>
            {m.hero_title()}
          </h1>

          {/* Descrição */}
          <p className='mb-8 text-lg text-muted-foreground sm:text-xl'>
            {m.hero_description()}
          </p>

          {/* Botões com links */}
          <div className='flex flex-col gap-4 sm:flex-row sm:justify-center'>
            <Button size='lg'>
              <Link href='/register'>
                {m.hero_register()}
                <ArrowRight className='ml-2 h-4 w-4' />
              </Link>
            </Button>
            <Button variant='outline' size='lg'>
              <Link href='/login'>{m.hero_login()}</Link>
            </Button>
          </div>
        </div>
      </section>
    </div>
  );
}
