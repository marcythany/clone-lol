// src/app/game-modes/page.tsx
import { Button } from "@/components/ui/button";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Icon } from "@/components/ui/icons";

export default function GameModesPage() {
	return (
		<div className="container mx-auto py-8">
			<Card className="max-w-2xl mx-auto">
				<CardHeader>
					<CardTitle>Game Modes</CardTitle>
				</CardHeader>
				<CardContent>
					<div className="grid grid-cols-3 gap-4">
						<a href="#" className="flex flex-col items-center">
							<Icon iconName="LayoutGrid" className="h-8 w-8 text-primary" />
							<span className="text-sm font-medium">Summoner's Rift</span>
							<p className="text-muted-foreground text-sm">5v5 team fights</p>
						</a>
						<a href="#" className="flex flex-col items-center">
							<Icon iconName="PieChart" className="h-8 w-8 text-primary" />
							<span className="text-sm font-medium">ARAM</span>
							<p className="text-muted-foreground text-sm">
								All Random, All Mid
							</p>
						</a>
						<a href="#" className="flex flex-col items-center">
							<Icon iconName="TrophyIcon" className="h-8 w-8 text-primary" />
							<span className="text-sm font-medium">Teamfight Tactics</span>
							<p className="text-muted-foreground text-sm">Auto Chess</p>
						</a>
					</div>
					<div className="mt-6 flex justify-center space-x-4">
						<Button variant="default">Quickplay</Button>
						<Button variant="outline">Draft Pick</Button>
						<Button variant="outline">Ranked Solo/Duo</Button>
						<Button variant="outline">Ranked Flex</Button>
					</div>
				</CardContent>
			</Card>
		</div>
	);
}
