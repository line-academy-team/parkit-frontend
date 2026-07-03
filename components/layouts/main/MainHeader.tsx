import React from "react";
import { Pressable, View, Text, Image } from "react-native";
import { Link } from "expo-router";

function MainHeader() {
    return (
        <View className="w-full h-14 bg-brand-surface border-brand-surface">
            <View className={"flex-row gap-2 w-full max-w-5xl mx-auto h-14 px-5 py-3"}>
                <Link href={"/"} asChild>
                    <Pressable className={"flex-row items-center"}>
                        <Image
                            source={require("../../../assets/images/logo.png")}
                            style={{ width: 32, height: 32, marginRight: 8 }}
                            className="rounded-sm"
                            resizeMode="contain"
                        />
                        <Text className="text-2xl font-bold text-brand-navy">Park:</Text>
                        <Text className="text-2xl font-bold text-brand-primary">It</Text>
                    </Pressable>
                </Link>
            </View>
        </View>
    );
}

export default MainHeader;
