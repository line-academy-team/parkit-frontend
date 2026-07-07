import { Pressable, PressableProps, Text } from "react-native";
import {
    BUTTON_SIZE_STYLE,
    StyleColorType,
    StyleShapeType,
    StyleSizeType,
    StyleVariantType,
} from "@/types/style";
import { twMerge } from "tailwind-merge";

interface Props extends PressableProps {
    color?: StyleColorType;
    variant?: StyleVariantType;
    size?: StyleSizeType;
    shape?: StyleShapeType;
}

function Button({
    color = "primary",
    variant = "contained",
    size = "medium",
    shape = "fullwidth",
    className,
    children,
    ...props
}: Props) {
    const getVariantClasses = () => {
        switch (variant) {
            case "contained":
                return `bg-brand-${color}`;
            case "outlined":
                return `border border-brand-${color} bg-transparent hover:bg-brand-surface`;
            case "text":
                return `bg-transparent hover:bg-brand-surface`;
            case "icon":
                return `rounded-full p-2 hover:bg-brand-surface`;
        }
    };

    const getTextColorClasses = () => {
        if (variant === "contained") {
            return `text-brand-bg`;
        } else if (variant === "text") {
            return `text-brand-txt-sub`;
        }
        return `text-brand-${color}`;
    };
    const getShapeClasses = () => {
        switch (shape) {
            case "fullwidth":
                return `w-full h-[52px]`;
            case "square":
                return "w-45 h-33";
        }
    };

    return (
        <Pressable
            className={twMerge(
                "flex justify-center items-center rounded-xl font-bold",
                BUTTON_SIZE_STYLE[size],
                getVariantClasses(),
                getTextColorClasses(),
                getShapeClasses(),
                "hover:brightness-90",
                className,
            )}
            {...props}>
            {typeof children === "string" ? (
                <Text
                    className={twMerge(
                        "font-pretendard-medium text-sm",
                        getTextColorClasses(),
                        size === "small"
                            ? "font-pretendard text-sm"
                            : size === "large"
                              ? "font-pretendard-semibold text-xl"
                              : "font-pretendard-medium text-[16px]",
                    )}>
                    {children}
                </Text>
            ) : (
                children
            )}
        </Pressable>
    );
}

export default Button;
