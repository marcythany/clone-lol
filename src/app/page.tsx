// src/app/page.tsx
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import * as m from "@/paraglide/messages";

export default function HomePage() {
	return (
		<div className="container mx-auto px-4 py-8">
			<Card className="max-w-2xl mx-auto">
				<CardHeader>
					<CardTitle className="text-3xl font-bold text-center">
						{m.homePageTitle()}
					</CardTitle>
				</CardHeader>
				<CardContent className="space-y-6">
					<p className="text-center text-muted-foreground">
						{m.homePageDescription()}
					</p>

					<div className="flex justify-center space-x-4">
						<Button variant="default">{m.loginButton()}</Button>
						<Button variant="outline">{m.registerButton()}</Button>
					</div>
				</CardContent>
			</Card>
		</div>
	);
}
