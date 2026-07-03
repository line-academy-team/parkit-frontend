import { View } from "react-native";
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
            <View
                className={twMerge(
                    [
                        "bg-background-paper",
                        "text-base",
                        "font-semibold",
                        "hover:text-brand-primary",
                    ],
                    ["flex-1", "justify-center", "items-center"],
                    "transition-all",
                )}>
                <GoHome size={24} /> 홈
            </View>
            <View
                className={twMerge(
                    [
                        "bg-background-paper",
                        "text-base",
                        "font-semibold",
                        "hover:text-brand-primary",
                    ],
                    ["flex-1", "justify-center", "items-center"],
                    "transition-all",
                )}>
                <IoCarOutline size={24} /> 차량 조회
            </View>
            <View
                className={twMerge(
                    [
                        "bg-background-paper",
                        "text-base",
                        "font-semibold",
                        "hover:text-brand-primary",
                    ],
                    ["flex-1", "justify-center", "items-center"],
                    "transition-all",
                )}>
                <LiaDollarSignSolid size={24} /> 사전 정산
            </View>
        </View>
    );
}

export default MainFooter;
