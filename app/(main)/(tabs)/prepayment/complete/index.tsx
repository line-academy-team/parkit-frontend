import { View, Text, ScrollView } from "react-native";
import { useLocalSearchParams, router } from "expo-router";
import Title from "@/components/common/title/Title";
import Button from "@/components/common/button/Button";
import { FiCheck } from "react-icons/fi";
import formattingUtil from "@/utils/formattingUtil";


export default function PaymentCompleteScreen() {
    const { plateNumber, finalFee, createdAt, discountMinutes } = useLocalSearchParams<{
        plateNumber: string;
        finalFee: string;
        createdAt: string;
        discountMinutes: string;
    }>();

    return (
        <View className="flex-1 bg-white">
            <Title title="정산 완료" isCenter />

            <ScrollView className="flex-1 px-5" contentContainerStyle={{ paddingBottom: 40 }}>
                <View className="items-center mt-12 mb-10">
                    <View className="w-20 h-20 bg-brand-primary rounded-full items-center justify-center mb-6">
                        <FiCheck size={40} color="#FFFFFF" strokeWidth={3} />
                    </View>
                    <Text className="text-2xl font-pretendard-bold text-brand-navy mb-4">
                        사전 정산이 완료되었습니다
                    </Text>
                    <Text className="text-[15px] font-pretendard-medium text-brand-txt-sub">
                        {plateNumber} 차량의 출차 처리가 완료되었습니다.
                    </Text>
                </View>

                <View className="bg-brand-surface rounded-2xl p-6 mb-8 gap-y-4">
                    <View className="flex-row justify-between items-center">
                        <Text className="text-[15px] font-pretendard-medium text-brand-txt-sub">
                            결제 금액
                        </Text>
                        <Text className="text-[18px] font-pretendard-bold text-brand-navy">
                            {formattingUtil.formatCurrency(Number(finalFee) || 0)}
                        </Text>
                    </View>

                    <View className="flex-row justify-between items-center">
                        <Text className="text-[15px] font-pretendard-medium text-brand-txt-sub">
                            결제 시각
                        </Text>
                        <Text className="text-[16px] font-pretendard-bold text-brand-txt-main">
                            {formattingUtil.formatEntryTime(createdAt)}
                        </Text>
                    </View>

                    <View className="flex-row justify-between items-center">
                        <Text className="text-[15px] font-pretendard-medium text-brand-txt-sub">
                            총 할인 시간
                        </Text>
                        <Text className="text-[16px] font-pretendard-bold text-brand-txt-main">
                            {formattingUtil.formatDuration(Number(discountMinutes) || 0)}
                        </Text>
                    </View>
                </View>

                {/* 3. 홈으로 돌아가기 버튼 및 푸터 문구 */}
                <Button
                    color="navy"
                    variant="contained"
                    shape="fullwidth"
                    onPress={() => router.replace("/")}>
                    홈으로 돌아가기
                </Button>

                <Text className="text-[13px] font-pretendard-medium text-brand-txt-sub text-center mt-6">
                    Park:It 서비스를 이용해주셔서 감사합니다.
                </Text>
            </ScrollView>
        </View>
    );
}
