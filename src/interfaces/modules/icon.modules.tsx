"use client";
import { ICON_CONFIG } from "@/configs/icon";
import { Icon } from "@iconify/react";
import type React from "react";
import { twMerge } from "tailwind-merge";

export type IconType = keyof typeof ICON_CONFIG;
export const IconType = Object.keys(ICON_CONFIG) as IconType[];

interface AppIconProps {
	icon: IconType;
	className?: string;
}
const AppIcon: React.FC<AppIconProps> = ({ icon, className = "" }) => {
	const iconPath = ICON_CONFIG[icon];
	return (
		<Icon icon={iconPath} className={twMerge("text-foreground", className)} />
	);
};

export default AppIcon;
