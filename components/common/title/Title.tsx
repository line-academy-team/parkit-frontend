import { Text, View } from "react-native";
import { twMerge } from "tailwind-merge";
import { PropsWithChildren } from "react";



interface TitleProps extends PropsWithChildren {
    barText?: string;
    title: string;
    className?: string;
    isCenter?: boolean;
}

function Title({
    title,
    isCenter = false,
    className,
    children,
}: TitleProps) {
    return (
        <View className="w-full">
            <View
                className={twMerge(
                    "h-14 relative px-5 flex-row",
                    "bg-brand-surface",
                    isCenter ? "items-center justify-center" : "items-center justify-between",
                    className,
                )}>
                <Text className={twMerge("text-2xl font-pretendard-bold")}>{title}</Text>
                {children}
            </View>
        </View>
    );
}

export default Title;