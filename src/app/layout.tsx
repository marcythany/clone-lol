import type { Metadata } from "next";
import { Inter } from "next/font/google";
import { LanguageProvider } from "@inlang/paraglide-next";
import { languageTag } from "../../paraglide/runtime";
import { ThemeProvider } from "@/components/theme-provider";
import { TailwindIndicator } from "@/components/tailwind-indicator";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
	title: "LOL Client Clone",
	description: "League of Legends Client Replica",
};

export default function RootLayout({
	children,
}: {
	children: React.ReactNode;
}) {
	return (
		<html lang={languageTag()} suppressHydrationWarning>
			<body className={inter.className}>
				<LanguageProvider>
					<ThemeProvider
						attribute="class"
						defaultTheme="system"
						enableSystem
						disableTransitionOnChange
					>
						{children}
						<TailwindIndicator />
					</ThemeProvider>
				</LanguageProvider>
			</body>
		</html>
	);
}
