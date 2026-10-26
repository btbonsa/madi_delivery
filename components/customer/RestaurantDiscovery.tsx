import { useCallback, useEffect, useMemo, useState } from "react";
import {
  ActivityIndicator,
  Keyboard,
  Pressable,
  RefreshControl,
  ScrollView,
  Text,
  TextInput,
  View,
} from "react-native";
import { router } from "expo-router";
import type { Href } from "expo-router";
import {
  Bike,
  MapPin,
  Search,
  ShoppingBag,
  UtensilsCrossed,
  X,
} from "lucide-react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import Animated, { FadeInDown } from "react-native-reanimated";
import BrandLogo from "../BrandLogo";
import RestaurantCard from "../RestaurantCard";
import EmptyState from "../ui/EmptyState";
import ConnectionState from "../ui/ConnectionState";
import { useFavorites } from "../../contexts/FavoritesContext";
import { loadHoletaRestaurants } from "../../services/catalog";
import type { Restaurant } from "../../services/catalog";

type Mode = "home" | "search";

export default function RestaurantDiscovery({ mode = "home" }: { mode?: Mode }) {
  const [restaurants, setRestaurants] = useState<Restaurant[]>([]);
  const [query, setQuery] = useState("");
  const [isLoading, setIsLoading] = useState(true);
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");
  const { isFavorite, toggleFavorite } = useFavorites();

  const fetchRestaurants = useCallback(() => loadHoletaRestaurants(), []);

  const load = useCallback(async (refresh = false) => {
    if (refresh) setIsRefreshing(true);
    else setIsLoading(true);
    setErrorMessage("");
    try {
      const result = await fetchRestaurants();
      if (result.error) {
        setErrorMessage(
          "We couldn’t load restaurants. Check your connection and try again.",
        );
      } else {
        setRestaurants(result.data);
      }
    } catch {
      setErrorMessage(
        "We couldn’t load restaurants. Check your connection and try again.",
      );
    } finally {
      if (refresh) setIsRefreshing(false);
      else setIsLoading(false);
    }
  }, [fetchRestaurants]);

  useEffect(() => {
    let isCurrent = true;
    void fetchRestaurants()
      .then((result) => {
        if (!isCurrent) return;
        if (result.error) {
          setErrorMessage(
            "We couldn’t load restaurants. Check your connection and try again.",
          );
        } else {
          setRestaurants(result.data);
        }
      })
      .catch(() => {
        if (isCurrent) {
          setErrorMessage(
            "We couldn’t load restaurants. Check your connection and try again.",
          );
        }
      })
      .finally(() => {
        if (isCurrent) setIsLoading(false);
      });
    return () => {
      isCurrent = false;
    };
  }, [fetchRestaurants]);

  const results = useMemo(() => {
    const value = query.trim().toLowerCase();
    if (!value) return restaurants;
    return restaurants.filter((restaurant) =>
      [
        restaurant.name,
        restaurant.description,
        restaurant.address,
        restaurant.landmark,
      ]
        .filter(Boolean)
        .join(" ")
        .toLowerCase()
        .includes(value),
    );
  }, [restaurants, query]);

  return (
    <SafeAreaView className="flex-1 bg-white" edges={["top"]}>
      <View className="z-10 border-b border-slate-100 bg-white px-4 pb-3 pt-2">
        {mode === "home" ? (
          <>
            <View className="flex-row items-center justify-between">
              <View className="flex-row items-center">
                <BrandLogo size={36} />
                <View className="ml-2.5">
                  <Text className="font-anaheim text-base font-extrabold font-anaheim-extrabold tracking-tight text-[#17251D]">
                    LocalBite
                  </Text>
                  <Text className="font-anaheim text-[8px] font-bold font-anaheim-bold tracking-widest text-[#839087]">
                    LOCAL FOOD, DELIVERED
                  </Text>
                </View>
              </View>
              <View className="flex-row items-center gap-2">
                <Pressable
                  accessibilityRole="button"
                  accessibilityLabel="Search restaurants"
                  className="h-10 w-10 items-center justify-center rounded-xl border border-slate-200 bg-white active:bg-slate-50"
                  onPress={() => router.navigate("/(customer)/(tabs)/search" as Href)}
                >
                  <Search size={18} color="#016938" />
                </Pressable>
                <Pressable
                  accessibilityRole="button"
                  accessibilityLabel="Open shopping cart"
                  className="h-10 w-10 items-center justify-center rounded-xl border border-slate-200 bg-white active:bg-slate-50"
                  onPress={() => router.push("/(customer)/cart" as Href)}
                >
                  <ShoppingBag size={18} color="#121222" />
                </Pressable>
              </View>
            </View>
            <View className="mt-2.5 flex-row items-center rounded-xl bg-[#F5F8F5] px-3 py-2">
              <View className="h-7 w-7 items-center justify-center rounded-lg bg-[#E4F0E7]">
                <MapPin size={15} color="#17b86d" />
              </View>
              <View className="ml-2.5">
                <Text className="font-anaheim text-[8px] font-bold font-anaheim-bold tracking-wider text-[#839087]">
                  DELIVERING TO
                </Text>
                <Text className="font-anaheim text-xs font-bold font-anaheim-bold text-[#17251D]">
                  Holeta, Ethiopia
                </Text>
              </View>
            </View>
          </>
        ) : (
          <View className="h-11 flex-row items-center rounded-xl border border-slate-200 bg-[#F8FAF8] px-3">
            <Search size={16} color="#39ca86" />
            <TextInput
              autoFocus
              className="font-anaheim ml-2 flex-1 py-1 text-sm text-[#17251D]"
              placeholder="Search restaurants or neighborhoods"
              placeholderTextColor="#839087"
              value={query}
              onChangeText={setQuery}
              returnKeyType="search"
              onSubmitEditing={() => Keyboard.dismiss()}
            />
            {!!query && (
              <Pressable
                accessibilityRole="button"
                accessibilityLabel="Clear search"
                onPress={() => setQuery("")}
                className="p-1"
              >
                <X size={16} color="#839087" />
              </Pressable>
            )}
          </View>
        )}
      </View>

      <ScrollView
        refreshControl={
          <RefreshControl
            refreshing={isRefreshing}
            onRefresh={() => void load(true)}
            tintColor="#016938"
            colors={["#016938"]}
          />
        }
        onTouchStart={() => {
          if (mode === "search") Keyboard.dismiss();
        }}
        keyboardShouldPersistTaps="handled"
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{ paddingBottom: 32 }}
      >
        <View className="px-4 pt-1">
          {mode === "home" ? (
            <>
              <View className="mt-3 overflow-hidden rounded-2xl bg-green-600 p-4 shadow-sm">
                <View className="absolute -right-6 -top-8 h-32 w-32 rounded-full bg-white/10" />
                <View className="flex-row items-center justify-between">
                  <View className="flex-1 pr-2">
                    <View className="self-start rounded-full bg-white/15 px-2.5 py-1">
                      <Text className="font-anaheim text-[8px] font-extrabold font-anaheim-extrabold tracking-wider text-white">
                        LOCAL BITES, CLOSE BY
                      </Text>
                    </View>
                    <Text className="font-anaheim mt-2 text-lg font-extrabold font-anaheim-extrabold leading-6 text-white">
                      Holeta is on the menu.
                    </Text>
                    <Text className="font-anaheim mt-1 text-xs text-white/80">
                      Discover restaurants serving your neighborhood.
                    </Text>
                  </View>
                  <View className="h-16 w-16 items-center justify-center rounded-2xl bg-white/15">
                    <UtensilsCrossed size={28} color="#FFFFFF" strokeWidth={1.7} />
                  </View>
                </View>
                <View className="mt-3 flex-row items-center border-t border-white/15 pt-2.5">
                  <Bike size={14} color="#FFFFFF" />
                  <Text className="font-anaheim ml-2 text-[11px] font-medium font-anaheim-medium text-white/90">
                    Local delivery made simple
                  </Text>
                </View>
              </View>
              <View className="mb-2 mt-5 flex-row items-baseline justify-between px-0.5">
                <View>
                  <Text className="font-anaheim text-base font-extrabold font-anaheim-extrabold text-[#121222]">
                    Restaurants near you
                  </Text>
                  <Text className="font-anaheim text-xs text-[#858592]">
                    Approved spots across Holeta
                  </Text>
                </View>
                {!isLoading && !errorMessage && (
                  <Text className="font-anaheim text-xs font-bold font-anaheim-bold text-[#016938]">
                    {results.length} Available
                  </Text>
                )}
              </View>
            </>
          ) : (
            !isLoading &&
            !errorMessage && (
              <Text className="font-anaheim mb-2 mt-3 px-0.5 text-xs font-semibold font-anaheim-semibold text-[#858592]">
                {results.length} {results.length === 1 ? "restaurant found" : "restaurants found"}
              </Text>
            )
          )}

          <View className="mt-1">
            {isLoading ? (
              <View className="items-center rounded-2xl border border-slate-200 bg-[#F8FAF8] px-5 py-8">
                <ActivityIndicator color="#016938" />
                <Text className="font-anaheim mt-2.5 text-xs font-medium font-anaheim-medium text-slate-500">
                  Finding local restaurants…
                </Text>
              </View>
            ) : errorMessage ? (
              <ConnectionState
                title="Restaurants couldn't load"
                description={errorMessage}
                onRetry={() => void load()}
              />
            ) : results.length ? (
              results.map((restaurant, index) => (
                <Animated.View
                  key={restaurant.id}
                  entering={FadeInDown.delay(Math.min(index, 7) * 45).duration(320)}
                >
                  <RestaurantCard
                    restaurant={restaurant}
                    isFavorite={isFavorite(restaurant.id)}
                    onToggleFavorite={() => toggleFavorite(restaurant)}
                    onPress={() =>
                      router.push({
                        pathname: "/(customer)/restaurants/[restaurantId]",
                        params: { restaurantId: restaurant.id },
                      })
                    }
                  />
                </Animated.View>
              ))
            ) : (
              <EmptyState
                icon={<UtensilsCrossed size={22} color="#016938" />}
                title={query ? "No matches yet" : "No restaurants listed yet"}
                description={
                  query
                    ? "Try another restaurant name or neighborhood."
                    : "Approved Holeta restaurants will show here when available."
                }
              />
            )}
          </View>

          {!isLoading && !errorMessage && results.length > 0 && (
            <View className="mt-3 flex-row items-center justify-center rounded-xl border border-slate-100 bg-[#F8FAF8] px-4 py-3">
              <Bike size={15} color="#016938" />
              <Text className="font-anaheim ml-2 text-xs font-medium font-anaheim-medium text-slate-600">
                Fresh local food, delivered simply.
              </Text>
            </View>
          )}
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}
