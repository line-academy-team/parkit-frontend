import { Text, View } from "react-native";
import { twMerge } from "tailwind-merge";
import { MaterialCommunityIcons, MaterialIcons } from "@expo/vector-icons";

interface Props {
    floor: number;
    parkingSlot: string;
    plateNumber?: string;
    entryTime?: string;
    discountMinute?: number;
    discountCount?: number;
    isMyDiscount?: boolean;
    isGridView?: boolean;
    myShopDiscountMinute?: number;
}

function SlotCard({
    floor,
    parkingSlot,
    plateNumber,
    entryTime,
    discountMinute,
    discountCount,
    isMyDiscount,
    isGridView,
    myShopDiscountMinute,
}: Props) {
    const slotStatus = !!entryTime;

    return (
        <View
            className={twMerge(
                ["p-3", "w-full"],
                "rounded-xl",
                isMyDiscount
                    ? ["border", "border-brand-warning", "bg-brand-accent"]
                    : slotStatus
                      ? ["border", "border-brand-primary", "bg-brand-bg"]
                      : "bg-brand-surface",
            )}>
            <View className="gap-2 justify-center flex-1 w-full">
                <View className={twMerge("flex-row items-center justify-between")}>
                    <View className="flex-row items-center gap-1">
                        <Text
                            className={twMerge(
                                "text-[14px]",
                                slotStatus ? "text-brand-txt-main" : "text-brand-txt-sub",
                            )}>
                            {floor}F{" "}
                        </Text>
                        <MaterialIcons
                            name={"circle"}
                            size={2}
                            className={twMerge(
                                slotStatus ? "text-brand-txt-main" : "text-brand-txt-sub",
                            )}
                        />
                        <Text
                            className={twMerge(
                                "text-[14px]",
                                slotStatus ? "text-brand-txt-main" : "text-brand-txt-sub",
                            )}>
                            {parkingSlot}
                        </Text>
                    </View>

                    {isGridView ? (
                        isMyDiscount && (
                            <View className={twMerge("px-2 py-1.5 bg-brand-warning rounded-xl")}>
                                <Text className="text-brand-txt-main text-[11px] font-pretendard">
                                    내 할인 {myShopDiscountMinute}분
                                </Text>
                            </View>
                        )
                    ) : (
                        <Text
                            className={twMerge(
                                isMyDiscount
                                    ? "text-brand-txt-main font-pretendard-medium"
                                    : "text-brand-txt-sub font-pretendard",
                                "text-[11px]",
                            )}>
                            {isMyDiscount ? (
                                <Text>내 할인 {myShopDiscountMinute}분</Text>
                            ) : discountMinute ? (
                                <Text>총 할인 {discountMinute}분</Text>
                            ) : (
                                "할인 없음"
                            )}
                        </Text>
                    )}
                </View>
            </View>
            <View>
                <View className="justify-center items-center flex-1 w-full">
                    {slotStatus ? (
                        <View className="justify-center items-center">
                            <MaterialCommunityIcons
                                name={"car-outline"}
                                size={32}
                                className={twMerge(
                                    isMyDiscount ? "text-brand-navy" : "text-brand-primary",
                                )}
                            />
                        </View>
                    ) : (
                        <View className="justify-center items-center mt-5">
                            <MaterialIcons
                                name={"local-parking"}
                                size={32}
                                className="text-brand-txt-sub"
                            />
                        </View>
                    )}
                    <Text
                        className={twMerge(
                            "text-base",
                            "font-pretendard-bold",
                            "text-brand-txt-main",
                            !slotStatus && "mb-5",
                        )}>
                        {slotStatus ? plateNumber : "빈 자리"}
                    </Text>
                </View>
                {slotStatus && (
                    <View className="justify-center">
                        <Text className="text-brand-txt-sub text-[13px]">
                            {entryTime.slice(11, 16)} 입차
                        </Text>
                        <Text className="text-brand-txt-sub text-[13px]">
                            {discountMinute
                                ? <Text className="text-brand-navy">할인 ${discountCount}건</Text> +
                                  `(총 ${discountMinute}분`
                                : "할인 없음"}
                        </Text>
                    </View>
                )}
            </View>
        </View>
    );
}

export default SlotCard;
