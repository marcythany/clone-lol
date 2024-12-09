'use client';

import { useTranslations } from 'next-intl';
import { useState } from 'react';
import { Gamepad2, Users, Trophy } from 'lucide-react';
import { Card, CardContent, CardHeader } from 'components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from 'components/ui/tabs';
import { Button } from 'components/ui/button';
import { Separator } from 'components/ui/separator';

export default function PlayPage() {
  const t = useTranslations('Game.play');
  const [selectedMode, setSelectedMode] = useState('normal');

  const gameModes = [
    {
      id: 'normal',
      name: t('modes.normal.name'),
      description: t('modes.normal.description'),
      icon: <Gamepad2 className='h-4 w-4' />,
    },
    {
      id: 'ranked',
      name: t('modes.ranked.name'),
      description: t('modes.ranked.description'),
      icon: <Trophy className='h-4 w-4' />,
    },
    {
      id: 'custom',
      name: t('modes.custom.name'),
      description: t('modes.custom.description'),
      icon: <Users className='h-4 w-4' />,
    },
  ];

  return (
    <div className='container mx-auto p-6'>
      <h1 className='mb-6 text-3xl font-bold'>{t('title')}</h1>

      <Tabs
        defaultValue='normal'
        value={selectedMode}
        onValueChange={setSelectedMode}
      >
        <TabsList className='mb-8 grid w-full grid-cols-3'>
          {gameModes.map((mode) => (
            <TabsTrigger
              key={mode.id}
              value={mode.id}
              className='flex items-center gap-2'
            >
              {mode.icon}
              {mode.name}
            </TabsTrigger>
          ))}
        </TabsList>

        {gameModes.map((mode) => (
          <TabsContent key={mode.id} value={mode.id}>
            <Card>
              <CardHeader>
                <div className='flex items-center gap-2'>
                  {mode.icon}
                  <h2 className='text-2xl font-semibold'>{mode.name}</h2>
                </div>
                <p className='text-muted-foreground'>{mode.description}</p>
              </CardHeader>
              <CardContent>
                <div className='space-y-4'>
                  <div className='flex items-center justify-between'>
                    <div>
                      <h3 className='font-semibold'>{t('queue.estimated')}</h3>
                      <p className='text-sm text-muted-foreground'>~3 min</p>
                    </div>
                    <Button size='lg'>{t('queue.join')}</Button>
                  </div>
                  <Separator />
                  <div>
                    <h3 className='mb-2 font-semibold'>
                      {t('queue.players.title')}
                    </h3>
                    <div className='grid grid-cols-2 gap-4'>
                      <div>
                        <p className='text-sm text-muted-foreground'>
                          {t('queue.players.inQueue')}
                        </p>
                        <p className='text-xl font-semibold'>1,234</p>
                      </div>
                      <div>
                        <p className='text-sm text-muted-foreground'>
                          {t('queue.players.inGame')}
                        </p>
                        <p className='text-xl font-semibold'>12,345</p>
                      </div>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        ))}
      </Tabs>
    </div>
  );
}
