import { create } from "zustand";
import type { Order } from "../types/api.types";
import { getOrders, updateOrder, deleteOrder } from "../api/orders";

interface OrderStore {
  orders: Order[];
  total: number;
  isLoading: boolean;
  error: string | null;
  fetchOrders: (status?: string, limit?: number, skip?: number) => Promise<void>;
  updateOrder: (id: string, data: Partial<Order>) => Promise<void>;
  deleteOrder: (id: string) => Promise<void>;
}

export const useOrderStore = create<OrderStore>((set, get) => ({
  orders: [],
  total: 0,
  isLoading: false,
  error: null,

  fetchOrders: async (status?: string, limit = 20, skip = 0) => {
    set({ isLoading: true, error: null });
    try {
      const { data, meta } = await getOrders(status, limit, skip);
      set({ orders: data, total: meta.total, isLoading: false });
    } catch {
      set({ error: "Siparişler yüklenemedi", isLoading: false });
    }
  },

  updateOrder: async (id: string, data: Partial<Order>) => {
    try {
      const updated = await updateOrder(id, data);
      set({
        orders: get().orders.map((o) => (o.id === id ? updated : o)),
      });
    } catch {
      set({ error: "Sipariş güncellenemedi" });
    }
  },

  deleteOrder: async (id: string) => {
    try {
      await deleteOrder(id);
      set({ orders: get().orders.filter((o) => o.id !== id) });
    } catch {
      set({ error: "Sipariş silinemedi" });
    }
  },
}));
