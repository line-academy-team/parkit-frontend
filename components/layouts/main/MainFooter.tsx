import { View, Text, Pressable } from "react-native";
import { twMerge } from "tailwind-merge";
import { router, usePathname } from "expo-router";
import { GoHome } from "react-icons/go";
import { IoCarOutline } from "react-icons/io5";
import { LiaDollarSignSolid } from "react-icons/lia";
import { MdOutlineLocalParking } from "react-icons/md";
import { RiCoupon2Line } from "react-icons/ri";
import { LuStore } from "react-icons/lu";
import type { IconType } from "react-icons";

type FooterVariant = "guest" | "shop";

interface MainFooterProps {
    variant: FooterVariant;
}

interface FooterMenu {
    label: string;
    href: string;
    icon: IconType;
    exact?: boolean;
}

const guestMenus: FooterMenu[] = [
    {
        label: "홈",
        href: "/",
        icon: GoHome,
        exact: true,
    },
    {
        label: "차량 조회",
        href: "/vehicle",
        icon: IoCarOutline,
    },
    {
        label: "사전 정산",
        href: "/prepayment",
        icon: LiaDollarSignSolid,
    },
];

const shopMenus: FooterMenu[] = [
    {
        label: "홈",
        href: "/shops",
        icon: GoHome,
        exact: true,
    },
    {
        label: "주차 현황",
        href: "/shops/parking",
        icon: MdOutlineLocalParking,
    },
    {
        label: "할인 내역",
        href: "/shops/discounts",
        icon: RiCoupon2Line,
    },
    {
        label: "내 상점",
        href: "/shops/my-shop",
        icon: LuStore,
    },
];

function MainFooter({ variant }: MainFooterProps) {
    const pathname = usePathname();

    const menus = variant === "shop" ? shopMenus : guestMenus;

    const isActiveMenu = (menu: FooterMenu) => {
        if (menu.exact) {
            return pathname === menu.href;
        }

        return pathname === menu.href || pathname.startsWith(`${menu.href}/`);
    };

    return (
        <View
            className={twMerge(
                "h-16 w-full flex-row border-t border-brand-surface bg-background-paper",
                "z-50",
            )}>
            {menus.map(menu => {
                const Icon = menu.icon;
                const isActive = isActiveMenu(menu);

                return (
                    <Pressable
                        key={menu.href}
                        // @ts-ignore
                        onPress={() => router.push(menu.href)}
                        className="flex-1 items-center justify-center bg-background-paper">
                        <Icon size={24} color={isActive ? "#3586FF" : "#3E3E41"} />

                        <Text
                            className={twMerge(
                                "mt-0.5 font-pretendard-medium text-brand-txt-main",
                                isActive && "font-pretendard-semibold text-brand-primary",
                            )}>
                            {menu.label}
                        </Text>
                    </Pressable>
                );
            })}
        </View>
    );
}

export default MainFooter;
