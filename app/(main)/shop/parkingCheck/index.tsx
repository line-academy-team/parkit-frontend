import { useCallback, useEffect, useState } from "react";
import { ParkingSlots } from "@/types/parkingSlots";
import { Link, useLocalSearchParams, usePathname, useRouter } from "expo-router";
import userApi from "@/api/user/userApi";
import { Alert, Platform, Pressable, ScrollView, Text, TextInput, View } from "react-native";
import Title from "@/components/common/title/Title";
import { Ionicons, MaterialIcons } from "@expo/vector-icons";
import { twMerge } from "tailwind-merge";
import Button from "@/components/common/button/Button";
import SlotCard from "@/components/common/card/SlotCard";
import { shopAuthStore } from "@/stores/auth/shopAuthStore";
import LoadingIndicator from "@/components/common/loading/Loading";

function ParkingCheckPage() {
    const router = useRouter();
    const { shop } = shopAuthStore();

    const [originalList, setOriginalList] = useState<ParkingSlots[]>([]);
    const [list, setList] = useState<ParkingSlots[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [keyword, setKeyword] = useState("");
    const [gridView, setGridView] = useState(true);

    const { floor } = useLocalSearchParams<{ floor: string }>();
    const params = useLocalSearchParams();
    const pathname = usePathname();
    const currentFloor = Number(floor);

    console.log("현재 floor:", floor, "현재 keyword:", keyword);

    const loadSlots = useCallback(async () => {
        try {
            setIsLoading(true);
            const result = await userApi.getParkingSlotList(
                floor ? Number(floor) : undefined,
                keyword || undefined,
            );
            setList(result);

            if (!floor && (!keyword || keyword === "")) {
                setOriginalList(result);
            }
        } catch (error) {
            console.log(error);
            const msg = "주차 현황 목록을 불러오는데 실패했습니다.";
            if (Platform.OS === "web") {
                alert(msg);
            } else {
                Alert.alert("오류", msg);
            }
        } finally {
            setIsLoading(false);
        }
    }, [floor, keyword]);

    useEffect(() => {
        loadSlots().then(() => {});
    }, [loadSlots]);

    const totalSlots = list.length;
    const entrySlots = list.filter(item => item.parkingRecords !== null).length;
    const floors =
        originalList.length > 0
            ? [...new Set(originalList.map(item => item.floor))].sort((a, b) => a - b)
            : [1, 2];
    const discountCount = list.filter(item => item.parkingRecords?.discounts !== null).length ?? 0;

    const onSearch = () => {
        const nextParams = { ...params } as Record<string, any>;

        if (!keyword || keyword.trim() === "") {
            delete nextParams.keyword;
        } else {
            nextParams.keyword = keyword.trim();
        }

        router.replace({
            pathname: pathname as any,
            params: nextParams,
        });
    };

    const onChangeView = () => {
        setGridView(!gridView);
    };

    const handleFloor = (floor?: number | undefined) => {
        const nextParams = { ...params };

        if (floor === undefined || floor === null) {
            delete nextParams.floor;
        } else {
            nextParams.floor = String(floor);
        }

        router.replace({
            pathname: pathname as any,
            params: nextParams,
        });
    };

    return (
        <View className="flex-1 w-full">
            <Title title={"주차 현황"} className={"text-brand-txt-main w-full"}>
                <Link
                    href={{
                        pathname: pathname as any,
                        params: params,
                    }}
                    className={"text-brand-txt-main right-5 absolute"}>
                    <Ionicons name={"reload"} size={24} />
                </Link>
            </Title>

            <View className={"flex-1 justify-center items-center p-5"}>
                <View className="flex-1 w-full max-w-3xl">
                    <View
                        className={twMerge(
                            ["flex-row", "items-center", "rounded-2xl"],
                            ["h-14", "px-4", "gap-3", "mb-3"],
                            [keyword ? "bg-brand-bg" : "bg-brand-surface", "hover:bg-brand-bg"],
                        )}>
                        <Ionicons name={"search"} size={24} className={"text-brand-txt-main"} />
                        <TextInput
                            className={twMerge(
                                keyword ? "text-brand-txt-main" : "text-brand-txt-sub",
                                "text-base flex-1",
                            )}
                            placeholder={"차량 번호를 검색해주세요"}
                            value={keyword}
                            onChangeText={setKeyword}

                            returnKeyType="search"
                            onSubmitEditing={onSearch}

                            style={
                                Platform.OS === "web"
                                    ? ({ outlineStyle: "none" } as any)
                                    : undefined
                            }
                        />
                    </View>

                    <View className={twMerge(["flex-row", "justify-between", "items-center"])}>
                        <View className="flex-row items-center gap-2">
                            <Button
                                variant={"contained"}
                                color={"primary"}
                                shape={"badge"}
                                onPress={() => handleFloor()}
                                className={twMerge(currentFloor && "bg-brand-surface")}>
                                <Text
                                    className={twMerge(
                                        "text-[14px] font-pretendard-medium",
                                        currentFloor ? " text-brand-txt-sub" : "text-brand-bg",
                                    )}>
                                    전체
                                </Text>
                            </Button>
                            {floors.map(floor => (
                                <Button
                                    key={floor}
                                    variant={"contained"}
                                    color={"surface"}
                                    shape={"badge"}
                                    onPress={() => handleFloor(floor)}
                                    className={twMerge(
                                        floor === currentFloor && "bg-brand-primary",
                                    )}>
                                    <Text
                                        className={twMerge(
                                            "text-[14px] font-pretendard-medium",
                                            floor === currentFloor
                                                ? "text-brand-bg"
                                                : "text-brand-txt-sub",
                                        )}>
                                        {floor}층
                                    </Text>
                                </Button>
                            ))}
                        </View>

                        <View
                            className={twMerge(
                                ["flex-row", "items-center", "justify-center", "w-[90px]", "h-9"],
                                ["bg-brand-surface", "rounded-xl", "gap-3"],
                            )}>
                            <Pressable onPress={onChangeView} disabled={gridView}>
                                <MaterialIcons
                                    name={"grid-on"}
                                    size={18}
                                    className={
                                        gridView ? "text-brand-primary" : "text-brand-txt-sub"
                                    }
                                />
                            </Pressable>
                            <Pressable onPress={onChangeView} disabled={!gridView}>
                                <MaterialIcons
                                    name={"density-medium"}
                                    size={18}
                                    className="text-brand-txt-main"
                                />
                            </Pressable>
                        </View>
                    </View>
                    {isLoading ? (
                        <LoadingIndicator />
                    ) : (
                        <View className="flex-1 w-full">
                            <Text className="text-brand-txt-main text-base py-3 font-pretendard-medium">
                                현재 주차 자리{" "}
                                <Text className={"text-brand-danger"}>{entrySlots}대</Text> 빈 자리{" "}
                                <Text className={"text-brand-primary"}>
                                    {totalSlots - entrySlots}대
                                </Text>
                            </Text>

                            <ScrollView className="flex-1 w-full">
                                <View
                                    className={twMerge(
                                        "gap-3",
                                        gridView
                                            ? ["flex-row", "flex-wrap", "justify-center"]
                                            : undefined,
                                    )}>
                                    {list.map(item => {
                                        const discountsArray = item.parkingRecords?.discounts;

                                        const totalDiscountMinute =
                                            Array.isArray(discountsArray) &&
                                            discountsArray.reduce(
                                                (sum, d) => sum + (d?.discountMinute ?? 0),
                                                0,
                                            );

                                        const myShopDiscountMinute =
                                            Array.isArray(discountsArray) &&
                                            discountsArray
                                                .filter(d => d.shopId === shop?.id)
                                                .reduce((sum, d) => sum + (d.discountMinute ?? 0), 0);

                                        return (
                                            <Pressable
                                                onPress={() =>
                                                    router.push(
                                                        `/shop/parkingCheck/${item.parkingRecords?.id}`,
                                                    )
                                                }
                                                key={item.id}
                                                className={gridView ? "w-[48%]" : undefined}>
                                                <SlotCard
                                                    floor={item.floor}
                                                    parkingSlot={item.spaceNumber}
                                                    plateNumber={item.parkingRecords?.plateNumber}
                                                    entryTime={item.parkingRecords?.entryTime}
                                                    discountMinute={totalDiscountMinute}
                                                    discountCount={discountCount}
                                                    isMyDiscount={
                                                        !!shop?.id &&
                                                        !!item.parkingRecords?.discounts?.shopId &&
                                                        shop.id ===
                                                            item.parkingRecords.discounts.shopId
                                                    }
                                                    myShopDiscountMinute={myShopDiscountMinute}
                                                    isGridView={gridView}
                                                />
                                            </Pressable>
                                        );
                                    })}
                                </View>
                            </ScrollView>
                        </View>
                    )}
                </View>
            </View>
        </View>
    );
}

export default ParkingCheckPage;
