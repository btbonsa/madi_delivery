import { Pressable, ScrollView, Text, View } from "react-native";
import { router } from "expo-router";
import type { Href } from "expo-router";
import {
  ArrowLeft,
  ChevronRight,
  Minus,
  Plus,
  ShoppingBag,
  Trash2,
} from "lucide-react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { useCart } from "../../contexts/CartContext";

const money = (amount: number) => `ETB ${amount.toFixed(2)}`;

export default function CartScreen() {
  const { items, subtotal, setQuantity, removeItem } = useCart();

  return (
    <SafeAreaView className="flex-1 bg-slate-50" edges={["top", "bottom"]}>
      {/* Header Bar */}
      <View className="flex-row items-center border-b border-slate-100 bg-white px-4 py-3">
        <Pressable
          accessibilityRole="button"
          accessibilityLabel="Go back"
          className="h-10 w-10 items-center justify-center rounded-xl border border-slate-200 bg-white active:bg-slate-50"
          onPress={() => router.canGoBack() ? router.back() : router.replace("/(customer)/(tabs)" as Href)}
        >
          <ArrowLeft size={18} color="#0F172A" />
        </Pressable>
        <View className="ml-3 flex-1">
          <Text className="font-anaheim text-base font-extrabold text-slate-900">
            Your Cart
          </Text>
          <Text className="font-anaheim text-xs text-slate-500" numberOfLines={1}>
            {items[0]?.restaurantName ?? "Review your selected food"}
          </Text>
        </View>
      </View>

      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{ flexGrow: 1, paddingBottom: 24 }}
      >
        <View className="px-4 pt-4">
          {!items.length ? (
            /* Empty Cart View */
            <View className="mt-12 items-center justify-center rounded-3xl border border-slate-100 bg-white px-6 py-12 shadow-sm">
              <View className="h-20 w-20 items-center justify-center rounded-full bg-emerald-50">
                <ShoppingBag size={36} color="#016938" />
              </View>
              <Text className="font-anaheim mt-5 text-lg font-extrabold text-slate-900">
                Your cart is empty
              </Text>
              <Text className="font-anaheim mt-1.5 text-center text-xs leading-5 text-slate-500 max-w-[240px]">
                Browse Holeta restaurants and add your favorite dishes to get started.
              </Text>
              <Pressable
                accessibilityRole="button"
                className="mt-6 rounded-2xl bg-[#016938] px-6 py-3.5 active:bg-[#01522c]"
                onPress={() => router.replace("/(customer)/(tabs)")}
              >
                <Text className="font-anaheim text-xs font-bold text-white tracking-wide">
                  Explore Restaurants
                </Text>
              </Pressable>
            </View>
          ) : (
            <>
              {/* Cart Items List */}
              <View className="rounded-3xl border border-slate-100 bg-white shadow-sm overflow-hidden">
                {items.map((item, index) => (
                  <View
                    key={item.itemId}
                    className={`p-4 ${
                      index ? "border-t border-slate-100" : ""
                    }`}
                  >
                    <View className="flex-row items-start justify-between">
                      <View className="flex-1 pr-3">
                        <Text className="font-anaheim text-sm font-bold text-slate-900">
                          {item.name}
                        </Text>
                        {!!item.description && (
                          <Text
                            numberOfLines={2}
                            className="font-anaheim mt-0.5 text-xs text-slate-500"
                          >
                            {item.description}
                          </Text>
                        )}
                        <Text className="font-anaheim mt-1.5 text-xs font-semibold text-slate-600">
                          {money(item.unitPrice)} each
                        </Text>
                      </View>

                      {/* Remove Button */}
                      <Pressable
                        accessibilityRole="button"
                        accessibilityLabel={`Remove ${item.name}`}
                        className="h-8 w-8 items-center justify-center rounded-xl bg-rose-50 active:bg-rose-100"
                        onPress={() => removeItem(item.itemId)}
                      >
                        <Trash2 size={15} color="#E11D48" />
                      </Pressable>
                    </View>

                    {/* Quantity Stepper & Item Total */}
                    <View className="mt-3.5 flex-row items-center justify-between border-t border-slate-50 pt-3">
                      <View className="flex-row items-center rounded-xl border border-slate-200 bg-slate-50/80">
                        <Pressable
                          accessibilityRole="button"
                          accessibilityLabel={`Decrease ${item.name} quantity`}
                          className="h-8 w-9 items-center justify-center active:bg-slate-200/50 rounded-l-xl"
                          onPress={() =>
                            setQuantity(item.itemId, item.quantity - 1)
                          }
                        >
                          <Minus size={14} color="#016938" />
                        </Pressable>
                        <Text className="font-anaheim min-w-[32px] text-center text-xs font-bold text-slate-900">
                          {item.quantity}
                        </Text>
                        <Pressable
                          accessibilityRole="button"
                          accessibilityLabel={`Increase ${item.name} quantity`}
                          className="h-8 w-9 items-center justify-center active:bg-slate-200/50 rounded-r-xl"
                          onPress={() =>
                            setQuantity(item.itemId, item.quantity + 1)
                          }
                        >
                          <Plus size={14} color="#016938" />
                        </Pressable>
                      </View>

                      <Text className="font-anaheim text-sm font-extrabold text-[#016938]">
                        {money(item.unitPrice * item.quantity)}
                      </Text>
                    </View>
                  </View>
                ))}
              </View>

              {/* Delivery Note Card */}
              <View className="mt-4 rounded-2xl border border-slate-100 bg-white p-4 shadow-sm">
                <Text className="font-anaheim text-xs text-slate-500 leading-5">
                  💡 Delivery fee will be confirmed by the restaurant during order setup.
                </Text>
              </View>
            </>
          )}
        </View>
      </ScrollView>

      {/* Checkout footer stays above the system navigation safe area. */}
      {items.length > 0 && (
        <View className="border-t border-slate-100 bg-white px-5 py-3 shadow-lg">
          <View className="flex-row items-center justify-between mb-3">
            <Text className="font-anaheim text-xs font-semibold uppercase tracking-wider text-slate-400">
              Total Subtotal
            </Text>
            <Text className="font-anaheim text-base font-extrabold text-slate-900">
              {money(subtotal)}
            </Text>
          </View>

          <Pressable
            accessibilityRole="button"
            className="h-12 flex-row items-center justify-center rounded-2xl bg-[#016938] active:bg-[#01522c]"
            onPress={() => router.push("/(customer)/checkout" as Href)}
          >
            <Text className="font-anaheim text-sm font-bold text-white mr-1.5">
              Continue to Checkout
            </Text>
            <ChevronRight size={16} color="#FFFFFF" />
          </Pressable>
        </View>
      )}
    </SafeAreaView>
  );
}