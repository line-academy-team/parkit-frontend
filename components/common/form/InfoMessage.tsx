import { View, Text } from "react-native";

interface InfoMessageProps {
    children: string;
}

function InfoMessage({ children }: InfoMessageProps) {
    return (
        <View className={"mt-1.5"}>
            <Text className={"text-brand-light text-sm font-medium"}>{children}</Text>
        </View>
    );
}

export default InfoMessage;
