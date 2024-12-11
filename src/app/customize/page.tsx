// src/app/customize/page.tsx
import { Button } from "@/components/ui/button";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Icon } from "@/components/ui/icons";

export default function CustomizePage() {
	return (
		<div className="container mx-auto py-8">
			<Card className="max-w-2xl mx-auto">
				<CardHeader>
					<CardTitle>Customize Identity</CardTitle>
				</CardHeader>
				<CardContent>
					<div className="grid grid-cols-5 gap-4">
						<a href="#" className="flex flex-col items-center">
							<Icon iconName="Palette" className="h-8 w-8 text-primary" />
							<span className="text-sm font-medium">Icons</span>
						</a>
						<a href="#" className="flex flex-col items-center">
							<Icon iconName="BringToFront" className="h-8 w-8 text-primary" />
							<span className="text-sm font-medium">Borders</span>
						</a>
						<a href="#" className="flex flex-col items-center">
							<Icon iconName="Target" className="h-8 w-8 text-primary" />
							<span className="text-sm font-medium">Tokens</span>
						</a>
						<a href="#" className="flex flex-col items-center">
							<Icon iconName="Crown" className="h-8 w-8 text-primary" />
							<span className="text-sm font-medium">Titles</span>
						</a>
						<a href="#" className="flex flex-col items-center">
							<Icon iconName="Award" className="h-8 w-8 text-primary" />
							<span className="text-sm font-medium">Banners</span>
						</a>
					</div>
					<div className="mt-6 flex justify-center space-x-4">
						<Button variant="default">Search</Button>
						<Button variant="outline">Filter</Button>
					</div>
				</CardContent>
			</Card>
		</div>
	);
}
