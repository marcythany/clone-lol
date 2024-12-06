"use client"

import { useTranslations } from 'next-intl'
import { useState } from "react"
import { Shield, Trophy, History, Settings } from "lucide-react"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Badge } from "@/components/ui/badge"
import { Separator } from "@/components/ui/separator"

export default function ProfilePage() {
  const t = useTranslations('Profile')
  const [activeTab, setActiveTab] = useState("overview")

  return (
    <div className="container mx-auto p-6">
      <Card className="mb-8">
        <CardContent className="pt-6">
          <div className="flex items-start gap-6">
            <Avatar className="w-24 h-24">
              <AvatarImage src="/placeholder-avatar.jpg" alt="@username" />
              <AvatarFallback>UN</AvatarFallback>
            </Avatar>
            <div className="flex-1">
              <div className="flex justify-between items-start">
                <div>
                  <h1 className="text-2xl font-bold">Username</h1>
                  <p className="text-muted-foreground">{t('level', { level: 30 })}</p>
                </div>
                <Button variant="outline">{t('editProfile')}</Button>
              </div>
              <div className="flex gap-2 mt-4">
                <Badge variant="secondary">
                  <Trophy className="w-3 h-3 mr-1" />
                  Platina IV
                </Badge>
                <Badge variant="secondary">
                  <Shield className="w-3 h-3 mr-1" />
                  Suporte
                </Badge>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      <Tabs value={activeTab} onValueChange={setActiveTab}>
        <TabsList>
          {Object.entries(t.raw('tabs')).map(([key, value]) => (
            <TabsTrigger 
              key={key} 
              value={key} 
              className="flex items-center gap-2"
            >
              {key === 'overview' && <Trophy className="w-4 h-4" />}
              {key === 'history' && <History className="w-4 h-4" />}
              {key === 'settings' && <Settings className="w-4 h-4" />}
              {value as string}
            </TabsTrigger>
          ))}
        </TabsList>

        <TabsContent value="overview">
          <Card>
            <CardHeader>
              <h2 className="text-xl font-semibold">{t('stats.title')}</h2>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div>
                  <h3 className="font-semibold mb-2">{t('stats.winrate')}</h3>
                  <div className="text-2xl font-bold">54% <span className="text-sm text-muted-foreground">(123/104)</span></div>
                </div>
                <div>
                  <h3 className="font-semibold mb-2">{t('stats.kda')}</h3>
                  <div className="text-2xl font-bold">3.2</div>
                </div>
                <div>
                  <h3 className="font-semibold mb-2">{t('stats.mostPlayed')}</h3>
                  <div className="text-2xl font-bold">Lux</div>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="history">
          <Card>
            <CardContent className="pt-6">
              <div className="text-center text-muted-foreground">
                Histórico de partidas em breve...
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="settings">
          <Card>
            <CardContent className="pt-6">
              <div className="text-center text-muted-foreground">
                Configurações em breve...
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  )
} 