import { ActivityIndicator, ActivityIndicatorProps, View } from "react-native";
import { twMerge } from "tailwind-merge";

interface LoadingIndicatorProps extends ActivityIndicatorProps {
    fullScreen?: boolean;
}

function LoadingIndicator({
    fullScreen,
    size = "large",
    color = "#3586FF",
    className,
    ...props
}: LoadingIndicatorProps) {
    if (fullScreen) {
        return (
            <View
                className={twMerge(
                    ["absolute", "z-50", "inset-0"],
                    ["justify-center", "items-center"],
                    className,
                )}>
                <View className={twMerge(["absolute", "inset-0"], ["bg-brand-bg", "opacity-70"])} />

                <ActivityIndicator size={size} color={color} {...props} />
            </View>
        );
    }

    return (
        <View className={twMerge(["py-10", "justify-center", "items-center"], className)}>
            <ActivityIndicator size={size} color={color} {...props} />
        </View>
    );
}

export default LoadingIndicator;
