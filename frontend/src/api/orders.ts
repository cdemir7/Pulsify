import api from "./index";
import { ApiResponse, Order } from "../types/api.types";
 
export const getOrders = async (status?: string): Promise<Order[]> => {
  const params = status ? { status } : {};
  const res = await api.get<ApiResponse<Order[]>>("/api/orders", { params });
  return res.data.data;
};
 
export const getOrder = async (id: string): Promise<Order> => {
  const res = await api.get<ApiResponse<Order>>(`/api/orders/${id}`);
  return res.data.data;
};
 