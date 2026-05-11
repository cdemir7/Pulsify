
import api from "./index";
import { SentimentResult } from "../types/api.types";
 
export const analyzeSentiment = async (message: string): Promise<SentimentResult> => {
  const res = await api.post("/api/ai/sentiment", { message });
  return res.data.data;
};
 
export const sendChatMessage = async (message: string, context?: object): Promise<string> => {
  const res = await api.post("/api/ai/chat", { message, context });
  return res.data.data.reply;
};
 
export const getDailyReport = async (): Promise<string> => {
  const res = await api.post("/api/ai/report/daily", {});
  return res.data.data.report;
};