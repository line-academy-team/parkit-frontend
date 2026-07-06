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
    barText = "안드로이드 기본 상단 바 영역",
    title,
    className,
    isCenter = false,
    children,
}: TitleProps) {
    return (
        <View>
            <View className={"h-6 bg-gray-300 items-center justify-center"}>
                <Text className={"font-pretendard"}>{barText}</Text>
            </View>
            <View
                className={twMerge(
                    "h-14 relative",
                    "bg-brand-surface",
                    isCenter ? "items-center justify-center" : className,
                )}>
                <Text className={"text-2xl font-pretendard-bold"}>{title}</Text>
                {children}
            </View>
        </View>
    );
}

export default Title;