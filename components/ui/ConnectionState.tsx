import { Pressable, Text, View } from "react-native";
import { RefreshCw, WifiOff } from "lucide-react-native";
import Animated, { FadeInDown, ZoomIn } from "react-native-reanimated";

export default function ConnectionState({
  title = "You're offline",
  description = "We couldn't reach the internet just now. Check your connection and try again.",
  onRetry,
  retryLabel = "Try again",
}: {
  title?: string;
  description?: string;
  onRetry: () => void;
  retryLabel?: string;
}) {
  return (
    <Animated.View
      entering={FadeInDown.duration(420)}
      className="relative mt-3 items-center overflow-hidden rounded-[28px] border border-[#F0E7D7] bg-white px-6 py-9 shadow-sm"
    >
      <View className="absolute -right-10 -top-12 h-36 w-36 rounded-full bg-[#FFF8E9]" />
      <View className="absolute -bottom-12 -left-8 h-32 w-32 rounded-full bg-[#F8F5EF]" />
      <Animated.View
        entering={ZoomIn.delay(100).duration(420)}
        className="h-[76px] w-[76px] items-center justify-center rounded-[26px] border border-[#F3E2BC] bg-[#FFF5DE]"
      >
        <WifiOff size={32} color="#A66A08" strokeWidth={1.8} />
      </Animated.View>
      <Text className="font-anaheim mt-5 text-center text-lg font-extrabold font-anaheim-extrabold text-[#17251D]">
        {title}
      </Text>
      <Text
        accessibilityRole="alert"
        className="font-anaheim mt-2 max-w-[280px] text-center text-sm leading-5 text-[#748078]"
      >
        {description}
      </Text>
      <Pressable
        accessibilityRole="button"
        onPress={onRetry}
        className="mt-6 min-h-12 flex-row items-center justify-center rounded-2xl bg-[#016938] px-5 active:bg-[#01522C]"
      >
        <RefreshCw size={16} color="#FFFFFF" />
        <Text className="font-anaheim ml-2 text-sm font-bold font-anaheim-bold text-white">
          {retryLabel}
        </Text>
      </Pressable>
    </Animated.View>
  );
}
