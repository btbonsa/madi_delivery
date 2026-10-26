import { useCallback, useState } from "react";
import {
  ActivityIndicator,
  Pressable,
  ScrollView,
  Text,
  View,
} from "react-native";
import { router, useFocusEffect } from "expo-router";
import { ClipboardList, RefreshCw } from "lucide-react-native";
import EmptyState from "../../../components/ui/EmptyState";
import ConnectionState from "../../../components/ui/ConnectionState";
import { useAuth } from "../../../contexts/AuthContext";
import { loadCustomerOrders } from "../../../services/orders";
import type { CustomerOrder } from "../../../services/orders";

const money = (value: number | string) => `ETB ${Number(value).toFixed(2)}`;
const label = (value: string) =>
  value
    .replace(/_/g, " ")
    .replace(/\b\w/g, (character) => character.toUpperCase());

export default function OrdersScreen() {
  const { user } = useAuth();
  const [orders, setOrders] = useState<CustomerOrder[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [errorMessage, setErrorMessage] = useState("");

  const load = useCallback(async () => {
    if (!user) {
      setOrders([]);
      setIsLoading(false);
      return;
    }
    setIsLoading(true);
    setErrorMessage("");
    try {
      const result = await loadCustomerOrders(user.id);
      if (result.error) setErrorMessage(result.error);
      else setOrders(result.data ?? []);
    } catch {
      setErrorMessage(
        "We couldn’t load your orders. Check your connection and try again.",
      );
    } finally {
      setIsLoading(false);
    }
  }, [user]);

  // Refresh when the orders tab receives focus, including after returning from the order receipt.
  useFocusEffect(
    useCallback(() => {
      void load();
    }, [load]),
  );

  return (
    <View className="flex-1 bg-[#F8F7F2]">
      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{ flexGrow: 1, paddingBottom: 28 }}
      >
        <View className="flex-1 px-5 pb-5 pt-14">
          <Text className="font-anaheim text-[27px] font-extrabold font-anaheim-extrabold text-[#17251D]">
            My orders
          </Text>
          <Text className="font-anaheim mt-1 text-sm text-[#748078]">
            Track current orders and revisit past favorites.
          </Text>

          {isLoading ? (
            <View className="mt-8 items-center rounded-[26px] border border-[#ECEEE9] bg-white px-7 py-12">
              <ActivityIndicator color="#016938" />
              <Text className="font-anaheim mt-3 text-sm text-[#748078]">
                Loading your orders…
              </Text>
            </View>
          ) : errorMessage ? (
            <ConnectionState
              title="Your orders couldn't load"
              description={errorMessage}
              onRetry={() => void load()}
            />
          ) : orders.length ? (
            <View className="mt-6">
              {orders.map((order) => (
                <View
                  key={order.id}
                  className="mb-3 rounded-[22px] border border-[#ECEEE9] bg-white p-4"
                >
                  <View className="flex-row items-start justify-between">
                    <View>
                      <Text className="font-anaheim text-base font-extrabold font-anaheim-extrabold text-[#17251D]">
                        Order #{order.order_number}
                      </Text>
                      <Text className="font-anaheim mt-1 text-xs text-[#839087]">
                        {new Date(order.created_at).toLocaleString()}
                      </Text>
                    </View>
                    <Text className="font-anaheim rounded-full bg-[#FFF2D8] px-3 py-1 text-xs font-bold font-anaheim-bold text-[#8A5A00]">
                      {label(order.status)}
                    </Text>
                  </View>
                  <View className="mt-4 flex-row items-center justify-between border-t border-[#F0F1EE] pt-3">
                    <Text className="font-anaheim text-xs text-[#748078]">
                      {label(order.payment_method)} ·{" "}
                      {label(order.payment_status)}
                    </Text>
                    <Text className="font-anaheim text-base font-extrabold font-anaheim-extrabold text-[#016938]">
                      {money(order.total_amount)}
                    </Text>
                  </View>
                </View>
              ))}
              <Pressable
                className="mt-2 flex-row items-center justify-center self-center rounded-xl bg-[#EAF2EB] px-4 py-3"
                onPress={() => void load()}
              >
                <RefreshCw size={15} color="#016938" />
                <Text className="font-anaheim ml-2 text-sm font-semibold font-anaheim-semibold text-[#016938]">
                  Refresh orders
                </Text>
              </Pressable>
            </View>
          ) : (
            <EmptyState
              icon={<ClipboardList size={34} color="#016938" />}
              title="No orders yet"
              description="When you order from a Holeta restaurant, your order and delivery status will show up here."
              actionLabel="Explore restaurants"
              onAction={() => router.navigate("/(customer)/(tabs)")}
            />
          )}
        </View>
      </ScrollView>
    </View>
  );
}
