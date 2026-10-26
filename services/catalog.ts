import { supabase } from "../lib/supabase";

export type Restaurant = {
  id: string;
  name: string;
  description: string | null;
  phone: string | null;
  address: string | null;
  landmark: string | null;
  image_url: string | null;
  is_approved: boolean;
  is_open: boolean;
};

export type MenuCategory = {
  id: string;
  restaurant_id: string;
  name: string;
  created_at: string;
};

export type MenuItem = {
  id: string;
  restaurant_id: string;
  category_id: string | null;
  name: string;
  description: string | null;
  price: number | string;
  image_url: string | null;
  is_available: boolean;
  created_at: string;
};

export type DataResult<T> = { data: T; error: string | null };

const restaurantFields =
  "id, name, description, phone, address, landmark, image_url, is_approved, is_open";
const categoryFields = "id, restaurant_id, name, created_at";
const menuItemFields =
  "id, restaurant_id, category_id, name, description, price, image_url, is_available, created_at";

function unavailableMessage() {
  return "Supabase is not configured. Add the project URL and publishable key, then restart the app.";
}

export async function loadHoletaRestaurants(): Promise<
  DataResult<Restaurant[]>
> {
  if (!supabase) return { data: [], error: unavailableMessage() };
  const { data, error } = await supabase
    .from("restaurants")
    .select(restaurantFields)
    .eq("is_approved", true)
    .order("name");
  return { data: (data ?? []) as Restaurant[], error: error?.message ?? null };
}

export async function loadHoletaRestaurant(
  restaurantId: string,
): Promise<DataResult<Restaurant | null>> {
  if (!supabase) return { data: null, error: unavailableMessage() };
  const { data, error } = await supabase
    .from("restaurants")
    .select(restaurantFields)
    .eq("id", restaurantId)
    .eq("is_approved", true)
    .maybeSingle();
  return { data: data as Restaurant | null, error: error?.message ?? null };
}

export async function loadRestaurantMenu(
  restaurantId: string,
): Promise<DataResult<{ categories: MenuCategory[]; items: MenuItem[] }>> {
  if (!supabase)
    return { data: { categories: [], items: [] }, error: unavailableMessage() };
  const [categoriesResult, itemsResult] = await Promise.all([
    supabase
      .from("menu_categories")
      .select(categoryFields)
      .eq("restaurant_id", restaurantId)
      .order("created_at"),
    supabase
      .from("menu_items")
      .select(menuItemFields)
      .eq("restaurant_id", restaurantId)
      .eq("is_available", true)
      .order("created_at"),
  ]);
  if (categoriesResult.error) {
    return {
      data: { categories: [], items: [] },
      error: categoriesResult.error.message,
    };
  }
  if (itemsResult.error) {
    return {
      data: { categories: [], items: [] },
      error: itemsResult.error.message,
    };
  }
  return {
    data: {
      categories: (categoriesResult.data ?? []) as MenuCategory[],
      items: (itemsResult.data ?? []) as MenuItem[],
    },
    error: null,
  };
}
