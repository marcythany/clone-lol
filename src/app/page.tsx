import { Button } from "@/components/ui/buttonAlt";
import {
	Card,
	CardHeader,
	CardTitle,
	CardContent,
} from "@/components/ui/cardAlt";
import { Icon } from "@/components/ui/icons";
import NewsPage from "./news/page";

export default function HomePage() {
	return (
		<div className="container mx-auto py-8">
			<Card className="max-w-2xl mx-auto">
				<CardHeader>
					<CardTitle>League of Legends</CardTitle>
				</CardHeader>
				<CardContent>
					<div className="grid grid-cols-4 gap-4">
						<a href="#" className="flex flex-col items-center">
							<Icon iconName="House" className="h-8 w-8 text-primary" />
							<span className="text-sm font-medium">Home</span>
						</a>
						<a href="#" className="flex flex-col items-center">
							<Icon iconName="Palette" className="h-8 w-8 text-primary" />
							<span className="text-sm font-medium">Customize</span>
						</a>
						<a href="#" className="flex flex-col items-center">
							<Icon iconName="LayoutGrid" className="h-8 w-8 text-primary" />
							<span className="text-sm font-medium">Game Modes</span>
						</a>
						<a href="#" className="flex flex-col items-center">
							<Icon iconName="Camera" className="h-8 w-8 text-primary" />
							<span className="text-sm font-medium">Champions</span>
						</a>
					</div>
					<div className="mt-6 flex justify-center space-x-4">
						<Button variant="default">Login</Button>
						<Button variant="outline">Register</Button>
					</div>
				</CardContent>
			</Card>
			<main>
				<NewsPage />
			</main>
		</div>
	);
}
