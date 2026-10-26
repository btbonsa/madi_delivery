import { useEffect } from "react";
import { Image } from "expo-image";
import { Pressable, Text, View } from "react-native";
import { Bike, Heart, MapPin, UtensilsCrossed } from "lucide-react-native";
import Animated, {
  useAnimatedStyle,
  useSharedValue,
  withSpring,
  withSequence,
  withTiming,
} from "react-native-reanimated";
import type { Restaurant } from "../services/catalog";

type Props = {
  restaurant: Restaurant;
  onPress: () => void;
  isFavorite?: boolean;
  onToggleFavorite?: () => void;
};

const AnimatedPressable = Animated.createAnimatedComponent(Pressable);

export default function RestaurantCard({
  restaurant,
  onPress,
  isFavorite = false,
  onToggleFavorite,
}: Props) {
  const address = [restaurant.address, restaurant.landmark]
    .filter(Boolean)
    .join(" · ");

  const cardScale = useSharedValue(1);

  // Heart animation
  const heartScale = useSharedValue(1);
  const heartProgress = useSharedValue(isFavorite ? 1 : 0);

  useEffect(() => {
    heartProgress.value = withSpring(isFavorite ? 1 : 0, {
      damping: 12,
      stiffness: 180,
    });

    if (isFavorite) {
      heartScale.value = withSequence(
        withSpring(1.2, { damping: 8, stiffness: 300 }),
        withSpring(1, { damping: 12, stiffness: 200 }),
      );
    } else {
      heartScale.value = withSpring(1);
    }
  }, [heartProgress, heartScale, isFavorite]);

  const cardStyle = useAnimatedStyle(() => ({
    transform: [{ scale: cardScale.value }],
  }));

  const heartStyle = useAnimatedStyle(() => ({
    transform: [{ scale: heartScale.value }],
  }));

  // Soft pulse for the open indicator
  const pulse = useSharedValue(1);

  useEffect(() => {
    if (restaurant.is_open) {
      pulse.value = withSequence(
        withTiming(1.15, { duration: 900 }),
        withTiming(1, { duration: 900 }),
      );
      // loop gently
      const interval = setInterval(() => {
        pulse.value = withSequence(
          withTiming(1.15, { duration: 900 }),
          withTiming(1, { duration: 900 }),
        );
      }, 2200);
      return () => clearInterval(interval);
    } else {
      pulse.value = withTiming(1);
    }
  }, [pulse, restaurant.is_open]);

  const pulseStyle = useAnimatedStyle(() => ({
    transform: [{ scale: pulse.value }],
    opacity: restaurant.is_open ? 1 : 0.7,
  }));

  return (
    <View className="relative mb-1 w-full">
      <AnimatedPressable
        accessibilityRole="button"
        accessibilityLabel={`Open ${restaurant.name} restaurant, ${
          restaurant.is_open ? "open" : "closed"
        }`}
        onPress={onPress}
        onPressIn={() => {
          cardScale.set(withSpring(0.975, {
            damping: 16,
            stiffness: 280,
          }));
        }}
        onPressOut={() => {
          cardScale.set(withSpring(1, {
            damping: 16,
            stiffness: 280,
          }));
        }}
        style={cardStyle}
        className="w-full flex-row items-center rounded-2xl bg-white p-1"
      >
        {/* ── Thumbnail ─────────────────────────────────────────────────── */}
        <View className="h-28 w-28 shrink-0 overflow-hidden rounded-2xl bg-emerald-50">
          {restaurant.image_url ? (
            <Image
              source={{ uri: restaurant.image_url }}
              contentFit="cover"
              transition={220}
              style={{ width: "100%", height: "100%" }}
            />
          ) : (
            <View className="h-full w-full items-center justify-center bg-emerald-50">
              <View className="h-10 w-10 items-center justify-center rounded-xl bg-white shadow-sm">
                <UtensilsCrossed size={18} color="#016938" strokeWidth={1.9} />
              </View>
              <Text className="font-anaheim mt-1.5 text-[8px] font-extrabold tracking-widest text-[#016938]">
                HOLETA
              </Text>
            </View>
          )}

          {/* subtle bottom gradient overlay for depth */}
          <View className="absolute bottom-0 left-0 right-0 h-8 bg-gradient-to-t from-black/10 to-transparent" />
        </View>

        {/* ── Info ──────────────────────────────────────────────────────── */}
        <View className="ml-3.5 min-w-0 flex-1 justify-center py-0.5 pr-1">
          {/* Name + Status */}
          <View className="flex-row items-center justify-between gap-2">
            <Text
              numberOfLines={1}
              className="font-anaheim flex-1 text-[15px] font-extrabold text-slate-900 tracking-tight"
            >
              {restaurant.name}
            </Text>

            <View
              className={`flex-row items-center rounded-full px-2 py-0.5 ${
                restaurant.is_open ? "bg-emerald-50" : "bg-slate-100"
              }`}
            >
              <Animated.View
                style={pulseStyle}
                className={`mr-1.5 h-1.5 w-1.5 rounded-full ${
                  restaurant.is_open ? "bg-[#016938]" : "bg-slate-400"
                }`}
              />
              <Text
                className={`font-anaheim text-[9px] font-bold tracking-wider ${
                  restaurant.is_open ? "text-[#016938]" : "text-slate-500"
                }`}
              >
                {restaurant.is_open ? "OPEN" : "CLOSED"}
              </Text>
            </View>
          </View>

          {/* Description */}
          {!!restaurant.description && (
            <Text
              numberOfLines={1}
              className="font-anaheim mt-1 text-[12px] text-slate-500 leading-4"
            >
              {restaurant.description}
            </Text>
          )}

          {/* Tags */}
          <View className="mt-2.5 flex-row flex-wrap items-center gap-1.5">
            <View className="flex-row items-center rounded-lg bg-slate-50 px-2 py-1 border border-slate-100">
              <MapPin size={11} color="#64748B" strokeWidth={2.2} />
              <Text
                numberOfLines={1}
                className="font-anaheim ml-1 max-w-[120px] text-[10px] font-semibold text-slate-600"
              >
                {address || "Holeta"}
              </Text>
            </View>

            <View className="flex-row items-center rounded-lg bg-slate-50 px-2 py-1 border border-slate-100">
              <Bike size={11} color="#64748B" strokeWidth={2.2} />
              <Text className="font-anaheim ml-1 text-[10px] font-semibold text-slate-600">
                Delivery
              </Text>
            </View>
          </View>
        </View>
      </AnimatedPressable>

      {/* ── Favorite Button ─────────────────────────────────────────────── */}
      {onToggleFavorite && (
        <AnimatedPressable
          accessibilityRole="button"
          accessibilityLabel={`${isFavorite ? "Remove" : "Add"} ${restaurant.name} ${
            isFavorite ? "from" : "to"
          } favorites`}
          accessibilityState={{ selected: isFavorite }}
          hitSlop={10}
          onPress={onToggleFavorite}
          style={heartStyle}
          className="absolute left-[70px] top-1.5 h-8 w-8 items-center justify-center rounded-full bg-white shadow-md shadow-slate-300/50 border border-slate-100"
        >
          <Heart
            size={16}
            color={isFavorite ? "#E5484D" : "#94A3B8"}
            fill={isFavorite ? "#E5484D" : "transparent"}
            strokeWidth={2.2}
          />
        </AnimatedPressable>
      )}
    </View>
  );
}