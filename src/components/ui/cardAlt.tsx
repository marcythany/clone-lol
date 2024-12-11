import { cn } from "@/lib/utils";
import React from "react";

const Card = React.forwardRef<
	HTMLDivElement,
	React.HTMLAttributes<HTMLDivElement>
>(({ className, ...props }, ref) => (
	<div
		className={cn("rounded-lg border bg-background p-6 shadow-sm", className)}
		{...props}
	/>
));

const CardHeader = React.forwardRef<
	HTMLDivElement,
	React.HTMLAttributes<HTMLDivElement>
>(({ className, ...props }, ref) => (
	<div
		className={cn("flex flex-col space-y-1.5 text-center", className)}
		{...props}
	/>
));

const CardTitle = React.forwardRef<
	HTMLDivElement,
	React.HTMLAttributes<HTMLDivElement>
>(({ className, ...props }, ref) => (
	<h3 className={cn("text-2xl font-bold", className)} {...props} />
));

const CardContent = React.forwardRef<
	HTMLDivElement,
	React.HTMLAttributes<HTMLDivElement>
>(({ className, ...props }, ref) => (
	<div className={cn("mt-6", className)} {...props} />
));

export { Card, CardHeader, CardTitle, CardContent };
