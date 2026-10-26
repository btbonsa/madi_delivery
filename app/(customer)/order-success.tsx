import { Pressable, Text, View } from "react-native";
import { router, useLocalSearchParams } from "expo-router";
import { Check, ClipboardList, Utensils } from "lucide-react-native";
import { SafeAreaView } from "react-native-safe-area-context";

const money = (value: string | undefined) => {
  const amount = Number(value);
  return Number.isFinite(amount) ? `ETB ${amount.toFixed(2)}` : "—";
};

export default function OrderSuccessScreen() {
  const params = useLocalSearchParams<{
    orderNumber?: string | string[];
    subtotal?: string | string[];
    deliveryFee?: string | string[];
    total?: string | string[];
  }>();

  const value = (entry: string | string[] | undefined) =>
    Array.isArray(entry) ? entry[0] : entry;
  const orderNumber = value(params.orderNumber);

  return (
    <SafeAreaView className="flex-1 bg-slate-50" edges={["top", "bottom"]}>
      <View className="flex-1 items-center justify-center px-5 py-6">
        {/* Success Icon Badge */}
        <View className="h-20 w-20 items-center justify-center rounded-3xl bg-emerald-100 border border-emerald-200 shadow-xs">
          <Check size={36} color="#016938" strokeWidth={3} />
        </View>

        <Text className="font-anaheim mt-5 text-center text-2xl font-extrabold text-slate-900">
          Order Placed!
        </Text>
        <Text className="font-anaheim mt-1.5 text-center text-xs text-slate-500 max-w-[280px] leading-5">
          Your restaurant has received the order. Pay with cash when it arrives.
        </Text>

        {/* Receipt Card */}
        <View className="mt-6 w-full rounded-3xl border border-slate-100 bg-white p-5 shadow-sm">
          <View className="flex-row items-center justify-between">
            <Text className="font-anaheim text-xs text-slate-500">
              Order Number
            </Text>
            <Text className="font-anaheim text-xs font-extrabold text-slate-900">
              {orderNumber ? `#${orderNumber}` : "—"}
            </Text>
          </View>

          <View className="mt-3.5 flex-row items-center justify-between">
            <Text className="font-anaheim text-xs text-slate-500">Status</Text>
            <View className="rounded-full bg-amber-50 px-2.5 py-0.5 border border-amber-200">
              <Text className="font-anaheim text-[10px] font-bold text-amber-700">
                PENDING
              </Text>
            </View>
          </View>

          <View className="mt-3.5 flex-row items-center justify-between">
            <Text className="font-anaheim text-xs text-slate-500">
              Food Subtotal
            </Text>
            <Text className="font-anaheim text-xs font-semibold text-slate-700">
              {money(value(params.subtotal))}
            </Text>
          </View>

          <View className="mt-2 flex-row items-center justify-between">
            <Text className="font-anaheim text-xs text-slate-500">
              Delivery Fee
            </Text>
            <Text className="font-anaheim text-xs font-semibold text-slate-700">
              {money(value(params.deliveryFee))}
            </Text>
          </View>

          <View className="mt-4 flex-row items-center justify-between border-t border-slate-100 pt-3">
            <Text className="font-anaheim text-xs font-bold text-slate-900">
              Total · Cash Due
            </Text>
            <Text className="font-anaheim text-sm font-extrabold text-[#016938]">
              {money(value(params.total))}
            </Text>
          </View>
        </View>

        {/* Action Buttons */}
        <View className="mt-6 w-full">
          <Pressable
            accessibilityRole="button"
            className="h-12 w-full flex-row items-center justify-center rounded-2xl bg-[#016938] active:bg-[#01522c]"
            onPress={() => router.replace("/(customer)/(tabs)/orders")}
          >
            <ClipboardList size={16} color="#FFFFFF" />
            <Text className="font-anaheim ml-2 text-xs font-bold text-white">
              View My Orders
            </Text>
          </Pressable>

          <Pressable
            accessibilityRole="button"
            className="mt-3 h-12 w-full flex-row items-center justify-center rounded-2xl border border-slate-200 bg-white active:bg-slate-50"
            onPress={() => router.replace("/(customer)/(tabs)")}
          >
            <Utensils size={16} color="#016938" />
            <Text className="font-anaheim ml-2 text-xs font-bold text-[#016938]">
              Continue Browsing
            </Text>
          </Pressable>
        </View>
      </View>
    </SafeAreaView>
  );
}