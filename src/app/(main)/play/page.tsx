"use client"

import { useState } from "react"
import { Gamepad2, Users, Trophy } from "lucide-react"
import { Card, CardContent, CardHeader } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Button } from "@/components/ui/button"
import { Separator } from "@/components/ui/separator"

const gameModes = [
  {
    id: "normal",
    name: "Normal",
    description: "Jogue partidas casuais 5v5",
    icon: <Gamepad2 className="w-4 h-4" />,
    disabled: false,
  },
  {
    id: "ranked",
    name: "Ranqueada",
    description: "Compita em partidas classificatórias",
    icon: <Trophy className="w-4 h-4" />,
    disabled: false,
  },
  {
    id: "custom",
    name: "Personalizada",
    description: "Crie sua própria partida",
    icon: <Users className="w-4 h-4" />,
    disabled: false,
  },
]

export default function PlayPage() {
  const [selectedMode, setSelectedMode] = useState("normal")

  return (
    <div className="container mx-auto p-6">
      <h1 className="text-3xl font-bold mb-6">Jogar</h1>
      
      <Tabs defaultValue="normal" value={selectedMode} onValueChange={setSelectedMode}>
        <TabsList className="grid w-full grid-cols-3 mb-8">
          {gameModes.map((mode) => (
            <TabsTrigger
              key={mode.id}
              value={mode.id}
              disabled={mode.disabled}
              className="flex items-center gap-2"
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
                <div className="flex items-center gap-2">
                  {mode.icon}
                  <h2 className="text-2xl font-semibold">{mode.name}</h2>
                </div>
                <p className="text-muted-foreground">{mode.description}</p>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="flex justify-between items-center">
                    <div>
                      <h3 className="font-semibold">Fila Estimada</h3>
                      <p className="text-sm text-muted-foreground">~3 min</p>
                    </div>
                    <Button size="lg">
                      Entrar na Fila
                    </Button>
                  </div>
                  <Separator />
                  <div>
                    <h3 className="font-semibold mb-2">Jogadores Online</h3>
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <p className="text-sm text-muted-foreground">Na Fila</p>
                        <p className="text-xl font-semibold">1,234</p>
                      </div>
                      <div>
                        <p className="text-sm text-muted-foreground">Em Partida</p>
                        <p className="text-xl font-semibold">12,345</p>
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
  )
} 