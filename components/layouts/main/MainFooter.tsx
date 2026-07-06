import { View, Text, Pressable } from "react-native";
import { twMerge } from "tailwind-merge";
import { GoHome } from "react-icons/go";
import { IoCarOutline } from "react-icons/io5";
import { LiaDollarSignSolid } from "react-icons/lia";

function MainFooter() {
    return (
        <View
            className={twMerge(
                ["bg-background-paper", "border-t", "border-brand-surface"],
                ["w-full", "h-16", "flex-row", "z-50"],
            )}>
            <Pressable
                className={twMerge(
                    ["bg-background-paper", "text-base", "font-semibold", "group"],
                    ["flex-1", "justify-center", "items-center"],
                    "transition-all",
                )}>
                <GoHome size={24} className="group-hover:text-brand-primary" />
                <Text className="group-hover:text-brand-primary">홈</Text>
            </Pressable>
            <Pressable
                className={twMerge(
                    ["bg-background-paper", "text-base", "font-semibold", "group"],
                    ["flex-1", "justify-center", "items-center"],
                    "transition-all",
                )}>
                <IoCarOutline size={24} className="group-hover:text-brand-primary" />
                <Text className="group-hover:text-brand-primary">차량 조회</Text>
            </Pressable>
            <Pressable
                className={twMerge(
                    ["bg-background-paper", "text-base", "font-semibold", "group"],
                    ["flex-1", "justify-center", "items-center"],
                    "transition-all",
                )}>
                <LiaDollarSignSolid size={24} className="group-hover:text-brand-primary" />
                <Text className="group-hover:text-brand-primary">사전 정산</Text>
            </Pressable>
        </View>
    );
}

export default MainFooter;
