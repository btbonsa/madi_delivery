import type { ReactNode } from "react";
import { Pressable, Text, View } from "react-native";
import Animated, { FadeInDown, ZoomIn } from "react-native-reanimated";

export default function EmptyState({
  icon,
  title,
  description,
  actionLabel,
  onAction,
}: {
  icon: ReactNode;
  title: string;
  description: string;
  actionLabel?: string;
  onAction?: () => void;
}) {
  return (
    <Animated.View
      entering={FadeInDown.duration(420)}
      className="relative mt-3 items-center overflow-hidden rounded-[28px] border border-[#E8EEE8] bg-white px-6 py-9 shadow-sm"
    >
      <View className="absolute -right-10 -top-12 h-36 w-36 rounded-full bg-[#F1F8F1]" />
      <View className="absolute -bottom-12 -left-8 h-32 w-32 rounded-full bg-[#F7F9F5]" />
      <Animated.View
        entering={ZoomIn.delay(100).duration(420)}
        className="h-[76px] w-[76px] items-center justify-center rounded-[26px] border border-[#DCEFE0] bg-[#EAF5EC]"
      >
        {icon}
      </Animated.View>
      <Text className="font-anaheim mt-5 text-center text-lg font-extrabold font-anaheim-extrabold text-[#17251D]">
        {title}
      </Text>
      <Text className="font-anaheim mt-2 max-w-[270px] text-center text-sm leading-5 text-[#748078]">
        {description}
      </Text>
      {actionLabel && onAction ? (
        <Pressable
          accessibilityRole="button"
          onPress={onAction}
          className="mt-6 min-h-12 flex-row items-center justify-center rounded-2xl bg-[#016938] px-5 active:bg-[#01522C]"
        >
          <Text className="font-anaheim text-sm font-bold font-anaheim-bold text-white">
            {actionLabel}
          </Text>
        </Pressable>
      ) : null}
    </Animated.View>
  );
}
