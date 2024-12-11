import * as LucideIcons from "lucide-react";

interface IconProps {
	iconName: keyof typeof LucideIcons;
	iconNode?: React.SVGProps<SVGSVGElement>;
	className?: string;
}

const Icon: React.FC<IconProps> = ({ iconName, iconNode, className }) => {
	const Component = LucideIcons[iconName] as React.FC<
		React.SVGProps<SVGSVGElement>
	>; // Dynamically select the icon component
	return <Component {...iconNode} className={className} />;
};

export { Icon };
