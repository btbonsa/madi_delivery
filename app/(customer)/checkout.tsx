import { useEffect, useRef, useState } from "react";
import {
  ActivityIndicator,
  Pressable,
  ScrollView,
  Text,
  TextInput,
  View,
} from "react-native";
import { router } from "expo-router";
import AsyncStorage from "@react-native-async-storage/async-storage";
import type { Href } from "expo-router";
import { ArrowLeft, Banknote, MapPin, Receipt, ShieldCheck } from "lucide-react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { useAuth } from "../../contexts/AuthContext";
import { useCart } from "../../contexts/CartContext";
import { createDeliveryOrder } from "../../services/orders";

const money = (amount: number) => `ETB ${amount.toFixed(2)}`;
const deliveryFeeEstimate = 50;

export default function CheckoutScreen() {
  const { profile, user } = useAuth();
  const { items, restaurantId, restaurantName, subtotal, clearCart } =
    useCart();
  const [address, setAddress] = useState("");
  const [landmark, setLandmark] = useState("");
  const [phone, setPhone] = useState(profile?.phone ?? "");
  const [notes, setNotes] = useState("");
  const [errorMessage, setErrorMessage] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const submittingRef = useRef(false);

  useEffect(() => {
    if (!user?.id) return;
    let isCurrent = true;
    void AsyncStorage.getItem(`localbite:delivery-address:${user.id}`)
      .then((savedAddress) => {
        if (isCurrent && savedAddress !== null) setAddress(savedAddress);
      })
      .catch(() => undefined);
    return () => {
      isCurrent = false;
    };
  }, [user?.id]);

  if (!items.length) {
    return (
      <SafeAreaView className="flex-1 bg-slate-50 justify-center items-center px-6">
        <View className="items-center justify-center rounded-3xl border border-slate-100 bg-white p-8 shadow-sm max-w-[320px] w-full">
          <Text className="font-anaheim text-base font-extrabold text-slate-900">
            Your cart is empty
          </Text>
          <Text className="font-anaheim mt-1 text-center text-xs text-slate-500">
            Add food items to your cart before proceeding to checkout.
          </Text>
          <Pressable
            className="mt-5 rounded-2xl bg-[#016938] px-5 py-3 active:bg-[#01522c]"
            onPress={() => router.replace("/(customer)/(tabs)")}
          >
            <Text className="font-anaheim text-xs font-bold text-white">
              Browse Restaurants
            </Text>
          </Pressable>
        </View>
      </SafeAreaView>
    );
  }

  const addressValid = address.trim().length >= 5;
  const landmarkValid = landmark.trim().length >= 2;
  const phoneValid = phone.replace(/\D/g, "").length >= 7;
  const canSubmit = Boolean(
    restaurantId &&
      addressValid &&
      landmarkValid &&
      phoneValid &&
      !isSubmitting
  );

  const placeOrder = async () => {
    if (submittingRef.current || !canSubmit || !restaurantId) return;
    submittingRef.current = true;
    setIsSubmitting(true);
    setErrorMessage("");
    try {
      const result = await createDeliveryOrder({
        restaurantId,
        landmark,
        address,
        phone,
        notes,
        items,
      });
      if (result.error || !result.data) {
        setErrorMessage(
          result.error ?? "We couldn’t place your order. Please try again."
        );
        return;
      }
      const order = result.data;
      clearCart();
      const receiptQuery = new URLSearchParams({
        orderNumber: String(order.order_number),
        subtotal: String(order.food_subtotal),
        deliveryFee: String(order.delivery_fee),
        total: String(order.total_amount),
      }).toString();
      router.replace(`/(customer)/order-success?${receiptQuery}` as Href);
    } catch {
      setErrorMessage(
        "We couldn’t confirm whether the order was placed. Check My Orders before submitting again."
      );
    } finally {
      submittingRef.current = false;
      setIsSubmitting(false);
    }
  };

  return (
    <SafeAreaView className="flex-1 bg-slate-50" edges={["top", "bottom"]}>
      {/* Header Bar */}
      <View className="flex-row items-center border-b border-slate-100 bg-white px-4 py-3">
        <Pressable
          accessibilityRole="button"
          accessibilityLabel="Go back"
          className="h-10 w-10 items-center justify-center rounded-xl border border-slate-200 bg-white active:bg-slate-50"
          onPress={() => router.canGoBack() ? router.back() : router.replace("/(customer)/cart" as Href)}
        >
          <ArrowLeft size={18} color="#0F172A" />
        </Pressable>
        <View className="ml-3 flex-1">
          <Text className="font-anaheim text-base font-extrabold text-slate-900">
            Checkout
          </Text>
          <Text className="font-anaheim text-xs text-slate-500" numberOfLines={1}>
            Ordering from {restaurantName}
          </Text>
        </View>
      </View>

      <ScrollView
        keyboardShouldPersistTaps="handled"
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{ paddingBottom: 24 }}
      >
        <View className="px-4 pt-4">
          {/* Delivery Details Form Card */}
          <View className="rounded-3xl border border-slate-100 bg-white p-4 shadow-sm">
            <View className="flex-row items-center mb-1">
              <View className="h-8 w-8 items-center justify-center rounded-lg bg-emerald-50">
                <MapPin size={16} color="#016938" />
              </View>
              <Text className="font-anaheim ml-2.5 text-sm font-extrabold text-slate-900">
                Delivery Details
              </Text>
            </View>

            {/* Address Input */}
            <Text className="font-anaheim mb-1.5 mt-3 text-xs font-semibold text-slate-700">
              Delivery Address *
            </Text>
            <TextInput
              accessibilityLabel="Delivery address"
              className="font-anaheim min-h-[48px] rounded-xl border border-slate-200 bg-slate-50/60 px-3.5 py-2.5 text-xs text-slate-900"
              placeholder="House, street, or neighborhood"
              placeholderTextColor="#94A3B8"
              value={address}
              onChangeText={setAddress}
              multiline
            />

            {/* Landmark Input */}
            <Text className="font-anaheim mb-1.5 mt-3 text-xs font-semibold text-slate-700">
              Nearby Landmark *
            </Text>
            <TextInput
              accessibilityLabel="Nearby landmark"
              className="font-anaheim h-11 rounded-xl border border-slate-200 bg-slate-50/60 px-3.5 text-xs text-slate-900"
              placeholder="A nearby shop, school, or landmark"
              placeholderTextColor="#94A3B8"
              value={landmark}
              onChangeText={setLandmark}
            />

            {/* Phone Input */}
            <Text className="font-anaheim mb-1.5 mt-3 text-xs font-semibold text-slate-700">
              Contact Phone *
            </Text>
            <TextInput
              accessibilityLabel="Contact phone"
              className="font-anaheim h-11 rounded-xl border border-slate-200 bg-slate-50/60 px-3.5 text-xs text-slate-900"
              placeholder="Phone number for delivery update"
              placeholderTextColor="#94A3B8"
              keyboardType="phone-pad"
              value={phone}
              onChangeText={setPhone}
            />

            {/* Notes Input */}
            <Text className="font-anaheim mb-1.5 mt-3 text-xs font-semibold text-slate-700">
              Notes for Restaurant (Optional)
            </Text>
            <TextInput
              accessibilityLabel="Order notes"
              className="font-anaheim min-h-[44px] rounded-xl border border-slate-200 bg-slate-50/60 px-3.5 py-2.5 text-xs text-slate-900"
              placeholder="Any extra cooking or delivery instructions"
              placeholderTextColor="#94A3B8"
              value={notes}
              onChangeText={setNotes}
              multiline
            />

            {/* Validation Hints */}
            {!!address.trim() && !addressValid && (
              <Text className="font-anaheim mt-2 text-xs text-rose-600">
                • Please enter a complete delivery address.
              </Text>
            )}
            {!!landmark.trim() && !landmarkValid && (
              <Text className="font-anaheim mt-1 text-xs text-rose-600">
                • Please enter a nearby landmark.
              </Text>
            )}
            {!!phone.trim() && !phoneValid && (
              <Text className="font-anaheim mt-1 text-xs text-rose-600">
                • Please enter a valid contact phone number.
              </Text>
            )}
          </View>

          {/* Order Summary Card */}
          <View className="mt-4 rounded-3xl border border-slate-100 bg-white p-4 shadow-sm">
            <View className="flex-row items-center mb-1">
              <View className="h-8 w-8 items-center justify-center rounded-lg bg-emerald-50">
                <Receipt size={16} color="#016938" />
              </View>
              <Text className="font-anaheim ml-2.5 text-sm font-extrabold text-slate-900">
                Order Summary
              </Text>
            </View>

            {items.map((item) => (
              <View
                key={item.itemId}
                className="mt-2.5 flex-row items-center justify-between"
              >
                <Text
                  className="font-anaheim flex-1 pr-3 text-xs text-slate-600"
                  numberOfLines={1}
                >
                  {item.quantity} × {item.name}
                </Text>
                <Text className="font-anaheim text-xs font-semibold text-slate-900">
                  {money(item.quantity * item.unitPrice)}
                </Text>
              </View>
            ))}

            <View className="mt-3.5 border-t border-slate-100 pt-3">
              <View className="flex-row items-center justify-between">
                <Text className="font-anaheim text-xs text-slate-500">
                  Food Subtotal
                </Text>
                <Text className="font-anaheim text-xs font-semibold text-slate-800">
                  {money(subtotal)}
                </Text>
              </View>
              <View className="mt-1.5 flex-row items-center justify-between">
                <Text className="font-anaheim text-xs text-slate-500">
                  Delivery Fee (Estimate)
                </Text>
                <Text className="font-anaheim text-xs font-semibold text-slate-800">
                  {money(deliveryFeeEstimate)}
                </Text>
              </View>

              <View className="mt-2.5 flex-row items-center justify-between border-t border-slate-100 pt-2.5">
                <Text className="font-anaheim text-xs font-bold text-slate-900">
                  Estimated Total
                </Text>
                <Text className="font-anaheim text-sm font-extrabold text-[#016938]">
                  {money(subtotal + deliveryFeeEstimate)}
                </Text>
              </View>
            </View>
          </View>

          {/* Payment Method Badge */}
          <View className="mt-4 flex-row items-center rounded-2xl border border-emerald-100 bg-emerald-50/60 p-3.5">
            <Banknote size={18} color="#016938" />
            <View className="ml-3 flex-1">
              <Text className="font-anaheim text-xs font-bold text-slate-900">
                Cash on Delivery
              </Text>
              <Text className="font-anaheim mt-0.5 text-[11px] text-slate-600">
                Pay the delivery rider when your order arrives.
              </Text>
            </View>
            <ShieldCheck size={16} color="#016938" />
          </View>

          {/* Error Message Banner */}
          {!!errorMessage && (
            <View className="mt-4 rounded-xl bg-rose-50 border border-rose-100 p-3">
              <Text
                accessibilityRole="alert"
                className="font-anaheim text-xs text-rose-700 leading-4"
              >
                {errorMessage}
              </Text>
            </View>
          )}
        </View>
      </ScrollView>

      {/* Order button stays above the system navigation safe area. */}
      <View className="border-t border-slate-100 bg-white px-4 py-3 shadow-lg">
        <Pressable
          accessibilityRole="button"
          accessibilityState={{ disabled: !canSubmit, busy: isSubmitting }}
          disabled={!canSubmit}
          className={`h-12 flex-row items-center justify-center rounded-2xl ${
            canSubmit ? "bg-[#016938] active:bg-[#01522c]" : "bg-slate-200"
          }`}
          onPress={() => void placeOrder()}
        >
          {isSubmitting ? (
            <ActivityIndicator color="#FFFFFF" size="small" />
          ) : (
            <Text
              className={`font-anaheim text-sm font-bold ${
                canSubmit ? "text-white" : "text-slate-400"
              }`}
            >
              Place Cash Order
            </Text>
          )}
        </Pressable>

        {!canSubmit && !isSubmitting && (
          <Text className="font-anaheim mt-1.5 text-center text-[10px] text-slate-400">
            Fill address, landmark, and phone to continue
          </Text>
        )}
      </View>
    </SafeAreaView>
  );
}