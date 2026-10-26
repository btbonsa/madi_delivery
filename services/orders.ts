import { supabase } from "../lib/supabase";
import type { CartLine } from "../contexts/CartContext";

export type PlacedOrder = {
  order_id: string;
  order_number: number;
  food_subtotal: number | string;
  delivery_fee: number | string;
  total_amount: number | string;
};

export type CustomerOrder = {
  id: string;
  order_number: number;
  restaurant_id: string;
  food_subtotal: number | string;
  delivery_fee: number | string;
  total_amount: number | string;
  payment_method: string;
  payment_status: string;
  status: string;
  created_at: string;
};

export type PlaceOrderInput = {
  restaurantId: string;
  landmark: string;
  address: string;
  phone: string;
  notes: string;
  items: CartLine[];
};

export type OrderResult<T> = { data: T | null; error: string | null };

function friendlyOrderError(message: string) {
  const lower = message.toLowerCase();
  if (lower.includes("sign in") || lower.includes("active customer"))
    return "Your customer session is no longer active. Sign in again before placing your order.";
  if (lower.includes("restaurant is unavailable"))
    return "This restaurant just closed or is unavailable. Refresh the restaurant and try again later.";
  if (lower.includes("menu item is unavailable"))
    return "One of your selected items is no longer available. Review your cart and try again.";
  if (lower.includes("delivery landmark is required"))
    return "Enter a delivery landmark to help the rider find you.";
  if (lower.includes("customer phone number is required"))
    return "Enter a phone number for delivery contact.";
  if (lower.includes("permission denied") || lower.includes("not authorized"))
    return "Supabase denied order placement. Check that authenticated users can execute create_delivery_order.";
  return message || "We couldn’t place your order. Please try again.";
}

export async function createDeliveryOrder(
  input: PlaceOrderInput,
): Promise<OrderResult<PlacedOrder>> {
  if (!supabase) return { data: null, error: "Supabase is not configured." };
  if (!input.items.length || input.items.length > 50)
    return {
      data: null,
      error: "Your cart must contain between 1 and 50 different items.",
    };
  if (input.items.some((item) => item.quantity < 1 || item.quantity > 99))
    return {
      data: null,
      error: "Each item quantity must be between 1 and 99.",
    };

  const { data, error } = await supabase.rpc("create_delivery_order", {
    p_restaurant_id: input.restaurantId,
    p_delivery_landmark: input.landmark.trim(),
    p_delivery_address: input.address.trim(),
    p_customer_phone: input.phone.trim(),
    p_notes: input.notes.trim(),
    p_items: input.items.map((item) => ({
      menu_item_id: item.itemId,
      quantity: item.quantity,
    })),
  });

  if (error) return { data: null, error: friendlyOrderError(error.message) };
  const row = Array.isArray(data) ? data[0] : data;
  if (!row?.order_id || row.order_number == null) {
    return {
      data: null,
      error:
        "The order was submitted, but Supabase returned an incomplete order receipt. Check My Orders before retrying.",
    };
  }
  return { data: row as PlacedOrder, error: null };
}

export async function loadCustomerOrders(
  customerId: string,
): Promise<OrderResult<CustomerOrder[]>> {
  if (!supabase) return { data: [], error: "Supabase is not configured." };
  const { data, error } = await supabase
    .from("orders")
    .select(
      "id, order_number, restaurant_id, food_subtotal, delivery_fee, total_amount, payment_method, payment_status, status, created_at",
    )
    .eq("customer_id", customerId)
    .order("created_at", { ascending: false });
  if (error) {
    return {
      data: null,
      error:
        "We couldn’t load your orders. Check your connection and try again.",
    };
  }
  return { data: (data ?? []) as CustomerOrder[], error: null };
}
