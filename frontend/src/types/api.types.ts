// Standart API Response tipi
export interface ApiResponse<T> {
  success: boolean;
  data: T;
  message: string;
  meta?: {
    total: number;
    limit: number;
    skip: number;
  };
}
 
export interface ApiError {
  success: false;
  error: {
    code: string;
    message: string;
    detail?: string;
  };
}
 
// Sipariş tipleri
export type OrderStatus = "pending" | "processing" | "shipped" | "delivered" | "cancelled" | "delayed";
export type CargoStatus = "not_shipped" | "in_transit" | "delayed" | "delivered";
export type Sentiment = "happy" | "neutral" | "angry";
 
export interface Order {
  id: string;
  order_code: string;
  customer_id: string;
  customer_name: string;
  product: string;
  amount: number;
  status: OrderStatus;
  cargo_status: CargoStatus;
  cargo_company?: string;
  tracking_number?: string;
  created_at: string;
  updated_at: string;
  estimated_delivery?: string;
}
 
// Müşteri tipleri
export interface SentimentHistory {
  sentiment: Sentiment;
  date: string;
  message_ref?: string;
}
 
export interface Customer {
  id: string;
  name: string;
  phone: string;
  email?: string;
  loyalty_score: number;
  sentiment: Sentiment;
  sentiment_history: SentimentHistory[];
  last_order_date?: string;
  total_orders: number;
  total_spent: number;
  created_at: string;
}
 
// AI tipleri
export interface SentimentResult {
  sentiment: Sentiment;
  confidence: number;
  reason: string;
}
 
export interface ChatMessage {
  role: "customer" | "ai";
  text: string;
  time: string;
  tracking?: string;
}