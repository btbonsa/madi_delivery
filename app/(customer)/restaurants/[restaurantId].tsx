import { useCallback, useEffect, useMemo, useState } from "react";
import {
  ActivityIndicator,
  Alert,
  Pressable,
  ScrollView,
  Text,
  View,
} from "react-native";
import { Image } from "expo-image";
import { router, useLocalSearchParams } from "expo-router";
import type { Href } from "expo-router";
import {
  ArrowLeft,
  Bike,
  MapPin,
  Minus,
  Phone,
  Plus,
  ShoppingBag,
} from "lucide-react-native";
import {
  loadHoletaRestaurant,
  loadRestaurantMenu,
} from "../../../services/catalog";
import type {
  MenuCategory,
  MenuItem,
  Restaurant,
} from "../../../services/catalog";
import { useCart } from "../../../contexts/CartContext";
import { SafeAreaView } from "react-native-safe-area-context";
import EmptyState from "../../../components/ui/EmptyState";
import ConnectionState from "../../../components/ui/ConnectionState";

export default function RestaurantDetailsScreen() {
  const { restaurantId } = useLocalSearchParams<{
    restaurantId: string | string[];
  }>();
  const id = Array.isArray(restaurantId) ? restaurantId[0] : restaurantId;
  const [restaurant, setRestaurant] = useState<Restaurant | null>(null);
  const [selectedQuantities, setSelectedQuantities] = useState<
    Record<string, number>
  >({});
  const { addItem, replaceWithItem, itemCount } = useCart();
  const [categories, setCategories] = useState<MenuCategory[]>([]);
  const [items, setItems] = useState<MenuItem[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [errorMessage, setErrorMessage] = useState("");

  const fetchRestaurant = useCallback(async () => {
    if (!id) throw new Error("The restaurant link is incomplete.");
    const [restaurantResult, menuResult] = await Promise.all([
      loadHoletaRestaurant(id),
      loadRestaurantMenu(id),
    ]);
    if (restaurantResult.error || menuResult.error) {
      throw new Error(
        "We couldn’t load this restaurant’s menu. Check your connection and try again.",
      );
    }
    return {
      restaurant: restaurantResult.data,
      categories: menuResult.data.categories,
      items: menuResult.data.items,
    };
  }, [id]);

  const load = useCallback(async () => {
    setIsLoading(true);
    setErrorMessage("");
    try {
      const result = await fetchRestaurant();
      setRestaurant(result.restaurant);
      setCategories(result.categories);
      setItems(result.items);
    } catch (error) {
      setErrorMessage(
        error instanceof Error
          ? error.message
          : "We couldn’t load this restaurant. Check your connection and try again.",
      );
    } finally {
      setIsLoading(false);
    }
  }, [fetchRestaurant]);

  useEffect(() => {
    let isCurrent = true;
    void fetchRestaurant()
      .then((result) => {
        if (!isCurrent) return;
        setRestaurant(result.restaurant);
        setCategories(result.categories);
        setItems(result.items);
      })
      .catch((error: unknown) => {
        if (!isCurrent) return;
        setErrorMessage(
          error instanceof Error
            ? error.message
            : "We couldn’t load this restaurant. Check your connection and try again.",
        );
      })
      .finally(() => {
        if (isCurrent) setIsLoading(false);
      });
    return () => {
      isCurrent = false;
    };
  }, [fetchRestaurant]);

  const categoryItems = useMemo(
    () =>
      categories.map((category) => ({
        category,
        items: items.filter((item) => item.category_id === category.id),
      })),
    [categories, items],
  );
  const uncategorizedItems = items.filter(
    (item) =>
      !item.category_id ||
      !categories.some((category) => category.id === item.category_id),
  );
  const deliveryAddress = restaurant
    ? [restaurant.address, restaurant.landmark].filter(Boolean).join(" · ")
    : "";

  if (isLoading) {
    return (
      <SafeAreaView
        className="flex-1 items-center justify-center bg-white"
        edges={["top", "bottom"]}
      >
        <ActivityIndicator size="large" color="#016938" />
        <Text className="font-anaheim mt-3 text-sm text-[#858592]">
          Loading restaurant menu…
        </Text>
      </SafeAreaView>
    );
  }

  if (errorMessage) {
    return (
      <SafeAreaView
        className="flex-1 justify-center bg-[#F8F7F2] px-5"
        edges={["top", "bottom"]}
      >
        <ConnectionState
          title="Menu couldn't load"
          description={errorMessage}
          onRetry={() => void load()}
        />
        <Pressable
          className="mt-4 self-center rounded-xl border border-[#E9E9EF] bg-white px-5 py-3"
          onPress={() => router.canGoBack() ? router.back() : router.replace("/(customer)/(tabs)" as Href)}
        >
          <Text className="font-anaheim font-bold font-anaheim-bold text-[#016938]">
            Go back
          </Text>
        </Pressable>
      </SafeAreaView>
    );
  }

  if (!restaurant) {
    return (
      <SafeAreaView
        className="flex-1 justify-center bg-[#F8F7F2] px-5"
        edges={["top", "bottom"]}
      >
        <EmptyState
          icon={<ShoppingBag size={30} color="#016938" />}
          title="Restaurant not found"
          description="This restaurant may no longer be listed. Head back to browse available restaurants."
          actionLabel="Go back"
          onAction={() => router.canGoBack() ? router.back() : router.replace("/(customer)/(tabs)" as Href)}
        />
      </SafeAreaView>
    );
  }

  const addToCart = (item: MenuItem) => {
    if (!restaurant.is_open) {
      Alert.alert(
        "Restaurant is closed",
        "You can browse the menu, but this restaurant is not accepting orders right now.",
      );
      return;
    }
    const quantity = selectedQuantities[item.id] ?? 1;
    const result = addItem(restaurant, item, quantity);
    if (result.added) {
      Alert.alert(
        "Added to cart",
        `${quantity} × ${item.name} added to your cart.`,
      );
      setSelectedQuantities((current) => ({ ...current, [item.id]: 1 }));
      return;
    }
    Alert.alert(
      "One restaurant per order",
      `Your cart has items from ${result.currentRestaurantName}. Replace that cart with items from ${restaurant.name}?`,
      [
        { text: "Keep current cart", style: "cancel" },
        {
          text: "Replace cart",
          style: "destructive",
          onPress: () => replaceWithItem(restaurant, item, quantity),
        },
      ],
    );
  };

  const renderItem = (item: MenuItem) => {
    const quantity = selectedQuantities[item.id] ?? 1;
    return (
      <View
        key={item.id}
        className="flex-row items-center border-t border-[#E9E9EF] py-4"
      >
        <View className="mr-3 h-[66px] w-[66px] items-center justify-center overflow-hidden rounded-2xl bg-[#F0F0F4]">
          {item.image_url ? (
            <Image
              source={{ uri: item.image_url }}
              contentFit="cover"
              style={{ width: "100%", height: "100%" }}
            />
          ) : (
            <Text className="font-anaheim text-[34px]">🍽️</Text>
          )}
        </View>
        <View className="flex-1 pr-2">
          <Text className="font-anaheim text-sm font-bold font-anaheim-bold text-[#121222]">
            {item.name}
          </Text>
          {!!item.description && (
            <Text className="font-anaheim mt-1 text-xs leading-4 text-[#656575]">
              {item.description}
            </Text>
          )}
          <Text className="font-anaheim mt-2 text-sm font-extrabold font-anaheim-extrabold text-[#016938]">
            ETB {Number(item.price).toFixed(2)}
          </Text>
        </View>
        <View className="items-end">
          <View className="flex-row items-center rounded-lg border border-[#E9E9EF] bg-white">
            <Pressable
              accessibilityRole="button"
              accessibilityLabel={`Decrease ${item.name} quantity`}
              className="h-8 w-8 items-center justify-center"
              onPress={() =>
                setSelectedQuantities((current) => ({
                  ...current,
                  [item.id]: Math.max(1, quantity - 1),
                }))
              }
            >
              <Minus size={13} color="#016938" />
            </Pressable>
            <Text className="font-anaheim min-w-[22px] text-center text-xs font-bold font-anaheim-bold text-[#121222]">
              {quantity}
            </Text>
            <Pressable
              accessibilityRole="button"
              accessibilityLabel={`Increase ${item.name} quantity`}
              className="h-8 w-8 items-center justify-center"
              onPress={() =>
                setSelectedQuantities((current) => ({
                  ...current,
                  [item.id]: Math.min(99, quantity + 1),
                }))
              }
            >
              <Plus size={13} color="#016938" />
            </Pressable>
          </View>
          <Pressable
            accessibilityRole="button"
            disabled={!restaurant.is_open}
            className={`mt-2 flex-row items-center rounded-lg px-2.5 py-2 ${restaurant.is_open ? "bg-[#016938]" : "bg-[#A0AAA3]"}`}
            onPress={() => addToCart(item)}
          >
            <Plus size={14} color="#FFFFFF" />
            <Text className="font-anaheim ml-1 text-[10px] font-bold font-anaheim-bold text-white">
              Add
            </Text>
          </Pressable>
        </View>
      </View>
    );
  };

  return (
    <SafeAreaView className="flex-1 bg-white" edges={["top", "bottom"]}>
      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{ paddingBottom: 36 }}
      >
        <View className="px-5 pb-5 pt-4">
          <Pressable
            accessibilityRole="button"
            accessibilityLabel="Go back to restaurants"
            className="mb-4 h-10 w-10 items-center justify-center rounded-xl border border-[#E9E9EF] bg-white"
            onPress={() => router.canGoBack() ? router.back() : router.replace("/(customer)/(tabs)" as Href)}
          >
            <ArrowLeft size={19} color="#121222" />
          </Pressable>
          <View className="h-[220px] items-center justify-center overflow-hidden rounded-[24px] bg-[#252729]">
            {restaurant.image_url ? (
              <Image
                source={{ uri: restaurant.image_url }}
                contentFit="cover"
                style={{ width: "100%", height: "100%" }}
              />
            ) : (
              <Text className="font-anaheim text-[82px]">🍲</Text>
            )}
            <View className="absolute bottom-3 left-3 rounded-full bg-[#101112]/90 px-3 py-1.5">
              <Text
                className={
                  "font-anaheim " +
                  `text-[10px] font-extrabold font-anaheim-extrabold ${restaurant.is_open ? "text-[#55B97D]" : "text-[#A6A8AA]"}`
                }
              >
                {restaurant.is_open ? "OPEN" : "CLOSED"}
              </Text>
            </View>
          </View>
          <View className="mt-5">
            <Text className="font-anaheim text-[25px] font-extrabold font-anaheim-extrabold text-[#121222]">
              {restaurant.name}
            </Text>
            {!!restaurant.description && (
              <Text className="font-anaheim mt-1 text-sm leading-5 text-[#656575]">
                {restaurant.description}
              </Text>
            )}
          </View>
          <View className="mt-5 rounded-2xl border border-[#303234] bg-[#1B1C1E] p-4">
            <View className="flex-row items-start">
              <MapPin size={16} color="#55B97D" style={{ marginTop: 2 }} />
              <View className="ml-2 flex-1">
                <Text className="font-anaheim text-[10px] font-bold font-anaheim-bold text-[#96989B]">
                  RESTAURANT LOCATION
                </Text>
                <Text className="font-anaheim mt-1 text-xs leading-5 text-white">
                  {deliveryAddress || "Holeta"}
                </Text>
              </View>
            </View>
            {!!restaurant.phone && (
              <View className="mt-3 flex-row items-center">
                <Phone size={15} color="#55B97D" />
                <Text className="font-anaheim ml-2 text-xs text-white">
                  {restaurant.phone}
                </Text>
              </View>
            )}
            <View className="mt-3 flex-row items-center">
              <Bike size={16} color="#55B97D" />
              <Text className="font-anaheim ml-2 text-xs text-[#C2C4C6]">
                Delivery availability:{" "}
                {restaurant.is_open ? "currently open" : "currently closed"}
              </Text>
            </View>
          </View>

          <View className="mt-8 flex-row items-end justify-between">
            <View>
              <Text className="font-anaheim text-lg font-extrabold font-anaheim-extrabold text-white">
                Menu
              </Text>
              <Text className="font-anaheim mt-1 text-xs text-[#96989B]">
                Available dishes · Prices in ETB
              </Text>
            </View>
            <View className="flex-row items-center">
              <Text className="font-anaheim text-xs font-semibold font-anaheim-semibold text-[#55B97D]">
                {items.length} items
              </Text>
              {itemCount > 0 && (
                <Pressable
                  accessibilityRole="button"
                  className="ml-3 flex-row items-center rounded-xl bg-[#016938] px-3 py-2"
                  onPress={() => router.push("/(customer)/cart" as Href)}
                >
                  <ShoppingBag size={14} color="#FFFFFF" />
                  <Text className="font-anaheim ml-1.5 text-xs font-bold font-anaheim-bold text-white">
                    Cart ({itemCount})
                  </Text>
                </Pressable>
              )}
            </View>
          </View>

          {!items.length ? (
            <View className="mt-4 items-center rounded-2xl border border-[#E9E9EF] bg-white px-5 py-8">
              <Text className="font-anaheim text-sm font-semibold font-anaheim-semibold text-[#121222]">
                Menu coming soon
              </Text>
              <Text className="font-anaheim mt-1 text-center text-xs leading-5 text-[#858592]">
                This restaurant has no available food items right now.
              </Text>
            </View>
          ) : (
            <View className="mt-4">
              {categoryItems.map(({ category, items: categoryMenuItems }) =>
                categoryMenuItems.length ? (
                  <View
                    key={category.id}
                    className="mb-5 rounded-[22px] border border-[#E9E9EF] bg-white px-4"
                  >
                    <Text className="font-anaheim pb-2 pt-4 text-base font-extrabold font-anaheim-extrabold text-[#121222]">
                      {category.name}
                    </Text>
                    {categoryMenuItems.map(renderItem)}
                  </View>
                ) : null,
              )}
              {uncategorizedItems.length > 0 && (
                <View className="mb-5 rounded-[22px] border border-[#E9E9EF] bg-white px-4">
                  <Text className="font-anaheim pb-2 pt-4 text-base font-extrabold font-anaheim-extrabold text-[#121222]">
                    {categories.length ? "Other items" : "Menu items"}
                  </Text>
                  {uncategorizedItems.map(renderItem)}
                </View>
              )}
            </View>
          )}
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}
