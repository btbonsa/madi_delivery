import AsyncStorage from "@react-native-async-storage/async-storage";
import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
} from "react";
import type { PropsWithChildren } from "react";
import type { Restaurant } from "../services/catalog";

type FavoritesContextValue = {
  favorites: Restaurant[];
  isLoaded: boolean;
  isFavorite: (restaurantId: string) => boolean;
  toggleFavorite: (restaurant: Restaurant) => void;
};

const FavoritesContext = createContext<FavoritesContextValue | undefined>(
  undefined,
);

export function FavoritesProvider({
  children,
  storageKey,
}: PropsWithChildren<{ storageKey: string }>) {
  const [favorites, setFavorites] = useState<Restaurant[]>([]);
  const [isLoaded, setIsLoaded] = useState(false);

  useEffect(() => {
    let isCurrent = true;
    setIsLoaded(false);
    void AsyncStorage.getItem(storageKey)
      .then((value) => {
        if (!isCurrent || !value) return;
        const saved = JSON.parse(value) as Restaurant[];
        if (Array.isArray(saved)) setFavorites(saved);
      })
      .catch(() => {})
      .finally(() => {
        if (isCurrent) setIsLoaded(true);
      });
    return () => {
      isCurrent = false;
    };
  }, [storageKey]);

  useEffect(() => {
    if (!isLoaded) return;
    void AsyncStorage.setItem(storageKey, JSON.stringify(favorites)).catch(
      () => {},
    );
  }, [favorites, isLoaded, storageKey]);

  const isFavorite = useCallback(
    (restaurantId: string) =>
      favorites.some((restaurant) => restaurant.id === restaurantId),
    [favorites],
  );

  const toggleFavorite = useCallback((restaurant: Restaurant) => {
    setFavorites((current) =>
      current.some((saved) => saved.id === restaurant.id)
        ? current.filter((saved) => saved.id !== restaurant.id)
        : [...current, restaurant],
    );
  }, []);

  const value = useMemo(
    () => ({ favorites, isLoaded, isFavorite, toggleFavorite }),
    [favorites, isLoaded, isFavorite, toggleFavorite],
  );

  return (
    <FavoritesContext.Provider value={value}>
      {children}
    </FavoritesContext.Provider>
  );
}

export function useFavorites() {
  const context = useContext(FavoritesContext);
  if (!context) {
    throw new Error("useFavorites must be used within FavoritesProvider.");
  }
  return context;
}
