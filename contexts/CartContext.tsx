import {
  createContext,
  useCallback,
  useContext,
  useMemo,
  useState,
} from "react";
import type { PropsWithChildren } from "react";
import type { MenuItem, Restaurant } from "../services/catalog";

export type CartLine = {
  itemId: string;
  restaurantId: string;
  restaurantName: string;
  name: string;
  description: string | null;
  imageUrl: string | null;
  unitPrice: number;
  quantity: number;
};

type AddItemResult = { added: boolean; currentRestaurantName?: string };
type CartContextValue = {
  restaurantId: string | null;
  restaurantName: string | null;
  items: CartLine[];
  itemCount: number;
  subtotal: number;
  addItem: (
    restaurant: Restaurant,
    item: MenuItem,
    quantity: number,
  ) => AddItemResult;
  replaceWithItem: (
    restaurant: Restaurant,
    item: MenuItem,
    quantity: number,
  ) => void;
  setQuantity: (itemId: string, quantity: number) => void;
  removeItem: (itemId: string) => void;
  clearCart: () => void;
};

const CartContext = createContext<CartContextValue | undefined>(undefined);

export function CartProvider({ children }: PropsWithChildren) {
  const [items, setItems] = useState<CartLine[]>([]);

  const toLine = (
    restaurant: Restaurant,
    item: MenuItem,
    quantity: number,
  ): CartLine => ({
    itemId: item.id,
    restaurantId: restaurant.id,
    restaurantName: restaurant.name,
    name: item.name,
    description: item.description,
    imageUrl: item.image_url,
    unitPrice: Number(item.price),
    quantity: Math.min(99, Math.max(1, Math.floor(quantity))),
  });

  const addItem = useCallback(
    (
      restaurant: Restaurant,
      item: MenuItem,
      quantity: number,
    ): AddItemResult => {
      const existingRestaurant = items[0]?.restaurantId;
      if (existingRestaurant && existingRestaurant !== restaurant.id) {
        return { added: false, currentRestaurantName: items[0].restaurantName };
      }
      const line = toLine(restaurant, item, quantity);
      setItems((current) => {
        const existing = current.find((entry) => entry.itemId === item.id);
        return existing
          ? current.map((entry) =>
              entry.itemId === item.id
                ? {
                    ...entry,
                    quantity: Math.min(99, entry.quantity + line.quantity),
                  }
                : entry,
            )
          : [...current, line];
      });
      return { added: true };
    },
    [items],
  );

  const replaceWithItem = useCallback(
    (restaurant: Restaurant, item: MenuItem, quantity: number) => {
      setItems([toLine(restaurant, item, quantity)]);
    },
    [],
  );

  const setQuantity = useCallback((itemId: string, quantity: number) => {
    setItems((current) =>
      quantity <= 0
        ? current.filter((entry) => entry.itemId !== itemId)
        : current.map((entry) =>
            entry.itemId === itemId
              ? { ...entry, quantity: Math.min(99, Math.floor(quantity)) }
              : entry,
          ),
    );
  }, []);

  const removeItem = useCallback(
    (itemId: string) =>
      setItems((current) => current.filter((entry) => entry.itemId !== itemId)),
    [],
  );
  const clearCart = useCallback(() => setItems([]), []);
  const itemCount = items.reduce((sum, item) => sum + item.quantity, 0);
  const subtotal = items.reduce(
    (sum, item) => sum + item.unitPrice * item.quantity,
    0,
  );

  const value = useMemo<CartContextValue>(
    () => ({
      restaurantId: items[0]?.restaurantId ?? null,
      restaurantName: items[0]?.restaurantName ?? null,
      items,
      itemCount,
      subtotal,
      addItem,
      replaceWithItem,
      setQuantity,
      removeItem,
      clearCart,
    }),
    [
      items,
      itemCount,
      subtotal,
      addItem,
      replaceWithItem,
      setQuantity,
      removeItem,
      clearCart,
    ],
  );

  return <CartContext.Provider value={value}>{children}</CartContext.Provider>;
}

export function useCart() {
  const context = useContext(CartContext);
  if (!context) throw new Error("useCart must be used within CartProvider.");
  return context;
}
