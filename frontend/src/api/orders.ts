import api from "./index";
import type { ApiResponse, Order } from "../types/api.types";

export interface OrdersResponse {
  data: Order[];
  meta: { total: number; limit: number; skip: number };
}

export const getOrders = async (status?: string, limit = 20, skip = 0): Promise<OrdersResponse> => {
  const params: Record<string, unknown> = { limit, skip };
  if (status) params.status = status;
  const res = await api.get<ApiResponse<Order[]>>("/api/orders", { params });
  return { data: res.data.data, meta: res.data.meta! };
};

export const getOrder = async (id: string): Promise<Order> => {
  const res = await api.get<ApiResponse<Order>>(`/api/orders/${id}`);
  return res.data.data;
};

export const createOrder = async (body: Omit<Order, "id" | "created_at" | "updated_at">): Promise<Order> => {
  const res = await api.post<ApiResponse<Order>>("/api/orders", body);
  return res.data.data;
};

export const updateOrder = async (id: string, body: Partial<Order>): Promise<Order> => {
  const res = await api.put<ApiResponse<Order>>(`/api/orders/${id}`, body);
  return res.data.data;
};

export const deleteOrder = async (id: string): Promise<void> => {
  await api.delete(`/api/orders/${id}`);
};
