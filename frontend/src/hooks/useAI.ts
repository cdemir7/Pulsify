import { useState } from "react";
import api from "../api/index";

interface ChatMessage {
  id: number;
  role: "customer" | "ai";
  text: string;
  time: string;
  tracking?: string;
  sentiment?: string;
}

interface ChatResponse {
  reply: string;
  sentiment: string;
  sentiment_confidence: number;
  intent: string;
}

interface SentimentResult {
  sentiment: string;
  confidence: number;
  reason: string;
}

export function useAI() {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const sendMessage = async (
    message: string,
    context?: object
  ): Promise<ChatResponse | null> => {
    setIsLoading(true);
    setError(null);
    try {
      const res = await api.post("/api/ai/chat", { message, context });
      return res.data.data as ChatResponse;
    } catch (err) {
      setError("Yanıt üretilemedi. Lütfen tekrar deneyin.");
      return null;
    } finally {
      setIsLoading(false);
    }
  };

  const analyzeSentiment = async (message: string): Promise<SentimentResult | null> => {
    setIsLoading(true);
    setError(null);
    try {
      const res = await api.post("/api/ai/sentiment", { message });
      return res.data.data as SentimentResult;
    } catch (err) {
      setError("Duygu analizi yapılamadı.");
      return null;
    } finally {
      setIsLoading(false);
    }
  };

  const getDailyReport = async (): Promise<string | null> => {
    setIsLoading(true);
    setError(null);
    try {
      const res = await api.post("/api/ai/report/daily", {});
      return res.data.data.report as string;
    } catch (err) {
      setError("Rapor alınamadı.");
      return null;
    } finally {
      setIsLoading(false);
    }
  };

  const getLoyaltyAnalysis = async (customerId: string) => {
    setIsLoading(true);
    setError(null);
    try {
      const res = await api.get(`/api/ai/loyalty/${customerId}`);
      return res.data.data;
    } catch (err) {
      setError("Sadakat analizi yapılamadı.");
      return null;
    } finally {
      setIsLoading(false);
    }
  };

  const getCargoAlerts = async () => {
    setIsLoading(true);
    setError(null);
    try {
      const res = await api.get("/api/ai/cargo-alerts");
      return res.data.data;
    } catch (err) {
      setError("Kargo uyarıları alınamadı.");
      return null;
    } finally {
      setIsLoading(false);
    }
  };

  const createMessage = (
    role: "customer" | "ai",
    text: string,
    extra?: Partial<ChatMessage>
  ): ChatMessage => ({
    id: Date.now() + Math.random(),
    role,
    text,
    time: new Date().toLocaleTimeString("tr-TR", { hour: "2-digit", minute: "2-digit" }),
    ...extra,
  });

  return {
    isLoading,
    error,
    sendMessage,
    analyzeSentiment,
    getDailyReport,
    getLoyaltyAnalysis,
    getCargoAlerts,
    createMessage,
  };
}