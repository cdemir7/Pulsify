import api from "./index";
import { ApiResponse, Customer } from "../types/api.types";
 
export const getCustomers = async (): Promise<Customer[]> => {
  const res = await api.get<ApiResponse<Customer[]>>("/api/customers");
  return res.data.data;
};
 
export const getCustomer = async (id: string): Promise<Customer> => {
  const res = await api.get<ApiResponse<Customer>>(`/api/customers/${id}`);
  return res.data.data;
};
 