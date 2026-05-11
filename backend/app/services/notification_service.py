import os
import httpx
from app.utils.logger import logger
from app.config import settings

class NotificationService:
    @staticmethod
    async def send_telegram_message(text: str, chat_id: str = None) -> bool:
        bot_token = settings.TELEGRAM_BOT_TOKEN
        target_chat_id = chat_id or settings.TELEGRAM_CHAT_ID

        if not bot_token or not target_chat_id:
            logger.error("Telegram credentials missing in environment variables.")
            return False

        url = f"https://api.telegram.org/bot{bot_token}/sendMessage"
        payload = {
            "chat_id": target_chat_id,
            "text": text,
            "parse_mode": "HTML"
        }

        try:
            async with httpx.AsyncClient() as client:
                response = await client.post(url, json=payload, timeout=10.0)
                if response.status_code == 200:
                    logger.info(f"Telegram message sent to {target_chat_id}")
                    return True
                else:
                    logger.error(f"Failed to send Telegram message: {response.text}")
                    return False
        except Exception as e:
            logger.error(f"Telegram API Exception: {str(e)}")
            return False
