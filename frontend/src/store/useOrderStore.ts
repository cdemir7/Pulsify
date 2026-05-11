import { create } from "zustand";
import { Order } from "../types/api.types";
import { getOrders } from "../api/orders";
 
interface OrderStore {
  orders: Order[];
  isLoading: boolean;
  error: string | null;
  fetchOrders: (status?: string) => Promise<void>;
}
 
export const useOrderStore = create<OrderStore>((set) => ({
  orders: [],
  isLoading: false,
  error: null,
 
  fetchOrders: async (status?: string) => {
    set({ isLoading: true, error: null });
    try {
      const orders = await getOrders(status);
      set({ orders, isLoading: false });
    } catch (err) {
      set({ error: "Siparişler yüklenemedi", isLoading: false });
    }
  },
}));