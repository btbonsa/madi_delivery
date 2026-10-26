import { router } from "expo-router";
import { Heart } from "lucide-react-native";
import { ScrollView, Text, View } from "react-native";
import RestaurantCard from "../../../components/RestaurantCard";
import { useFavorites } from "../../../contexts/FavoritesContext";
import EmptyState from "../../../components/ui/EmptyState";

export default function FavoritesScreen() {
  const { favorites, isLoaded, toggleFavorite } = useFavorites();

  return (
    <ScrollView
      className="flex-1 bg-[#F8F7F2]"
      contentContainerStyle={{
        flexGrow: 1,
        paddingHorizontal: 20,
        paddingTop: 56,
        paddingBottom: 40,
      }}
    >
      <Text className="font-anaheim text-[27px] font-extrabold font-anaheim-extrabold text-[#17251D]">
        Favorites
      </Text>
      <Text className="font-anaheim mt-1 text-sm text-[#748078]">
        Your favorite local restaurants, all in one place.
      </Text>

      {!isLoaded ? (
        <View className="mt-8 flex-1 items-center justify-center rounded-[26px] border border-[#ECEEE9] bg-white px-7 py-12">
          <Text className="font-anaheim text-sm text-[#748078]">
            Loading your favorites…
          </Text>
        </View>
      ) : favorites.length ? (
        <View className="mt-7">
          {favorites.map((restaurant) => (
            <RestaurantCard
              key={restaurant.id}
              restaurant={restaurant}
              isFavorite
              onToggleFavorite={() => toggleFavorite(restaurant)}
              onPress={() =>
                router.push({
                  pathname: "/(customer)/restaurants/[restaurantId]",
                  params: { restaurantId: restaurant.id },
                })
              }
            />
          ))}
        </View>
      ) : (
        <EmptyState
          icon={<Heart size={32} color="#016938" strokeWidth={1.9} />}
          title="No favorites yet"
          description="Save a restaurant with the heart button and it will be easy to find here."
          actionLabel="Explore restaurants"
          onAction={() => router.navigate("/(customer)/(tabs)")}
        />
      )}
    </ScrollView>
  );
}
