import asyncio
import json
import re
import google.generativeai as genai

from app.config import settings
from app.utils.logger import logger

genai.configure(api_key=settings.GEMINI_API_KEY)
model = genai.GenerativeModel("gemini-2.5-flash")

import time

def _parse_json(text: str) -> dict:
    try:
        # Markdown code block varsa temizle
        cleaned = re.sub(r"```(?:json)?\s*|\s*```", "", text).strip()
        return json.loads(cleaned)
    except json.JSONDecodeError as e:
        logger.warning(f"Gemini JSON parse hatasi: {e} | Yanit: {text[:200]}")
        return {}
    
async def _call_with_retry(func, *args, max_retries=3, **kwargs):
    for attempt in range(max_retries):
        try:
            return await asyncio.to_thread(func, *args, **kwargs)
        except Exception as e:
            if "429" in str(e) and attempt < max_retries - 1:
                wait_time = (attempt + 1) * 20
                logger.warning(f"Rate limit, {wait_time}s bekleniyor... (deneme {attempt + 1}/{max_retries})")
                await asyncio.sleep(wait_time)
            else:
                raise
    raise Exception("Max retry aşıldı")


class AIService:

    @staticmethod
    async def analyze_sentiment(message: str) -> dict:
        prompt = f"""
Asagidaki musteri mesajinin duygu durumunu analiz et.
Yalnizca JSON formatinda yanit ver, baska hicbir sey yazma:
{{"sentiment": "happy|neutral|angry", "confidence": 0.0-1.0, "reason": "kisa aciklama"}}

Mesaj: {message}
"""
        response = await _call_with_retry(model.generate_content, prompt)
        result = _parse_json(response.text)
        if "sentiment" not in result:
            result = {"sentiment": "neutral", "confidence": 0.5, "reason": "analiz yapilamadi"}
        return result

    @staticmethod
    async def classify_intent(message: str) -> dict:
        prompt = f"""
Musteri mesajinin niyetini belirle.
Yalnizca JSON formatinda yanit ver, baska hicbir sey yazma:
{{"intent": "order_query|cargo_query|complaint|other", "entities": {{}}}}

Mesaj: {message}
"""
        response = await _call_with_retry(model.generate_content, prompt)
        result = _parse_json(response.text)
        if "intent" not in result:
            result = {"intent": "other", "entities": {}}
        return result

    @staticmethod
    async def generate_daily_report(data: dict) -> str:
        prompt = f"""
Asagidaki operasyon verilerine gore Turkce gunluk ozet rapor uret.
Riskli durumlari vurgula. Net ve profesyonel ol. Markdown kullanma.

Veri: {json.dumps(data, ensure_ascii=False)}
"""
        response = await _call_with_retry(model.generate_content, prompt)
        return response.text

    @staticmethod
    async def chat(message: str, context: dict = None) -> str:
        ctx = f"\nBaglam: {json.dumps(context, ensure_ascii=False)}" if context else ""
        prompt = f"""
Sen Pulsify platformunun Turkce konusan AI asistanisin.
KOBİ musterilerinin siparis, kargo ve urun sorularini yanıtliyorsun.
Kisa, net ve profesyonel cevap ver.{ctx}

Musteri mesaji: {message}
"""
        response = await _call_with_retry(model.generate_content, prompt)
        return response.text
