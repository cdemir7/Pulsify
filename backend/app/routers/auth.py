from fastapi import APIRouter, HTTPException, Depends
from pydantic import BaseModel
import jwt
import bcrypt
from datetime import datetime, timedelta
from app.config import settings
from app.utils.response import success
from app.database import get_db

router = APIRouter()

class LoginRequest(BaseModel):
    username: str
    password: str

@router.post("/login")
async def login(req: LoginRequest):
    db = get_db()
    user = await db["users"].find_one({"username": req.username})
    
    if not user:
        raise HTTPException(status_code=401, detail="Geçersiz e-posta veya şifre.")
        
    # Check password
    if not bcrypt.checkpw(req.password.encode('utf-8'), user["password"].encode('utf-8')):
        raise HTTPException(status_code=401, detail="Geçersiz e-posta veya şifre.")

    # Create token (expires in 24 hours)
    expiration = datetime.utcnow() + timedelta(hours=24)
    token_data = {
        "sub": req.username,
        "role": user.get("role", "admin"),
        "exp": expiration
    }
    token = jwt.encode(token_data, settings.SECRET_KEY, algorithm="HS256")
    
    return success({
        "access_token": token,
        "token_type": "bearer",
        "user": {
            "username": req.username,
            "role": user.get("role", "admin")
        }
    }, "Giriş başarılı.")
