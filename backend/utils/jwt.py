import os
from datetime import datetime, timedelta, timezone

from fastapi import Depends, HTTPException
from fastapi.security import OAuth2PasswordBearer
from jose import jwt

ALGORITHM = "HS256"
ACCESS_EXPIRE_MIN = 100
REFRESH_EXPIRE_DAYS = 7


def _secret_key() -> str:
    secret = os.getenv("JWT_SECRET_KEY")
    if not secret:
        raise RuntimeError("JWT_SECRET_KEY debe configurarse en el entorno")
    if len(secret.encode("utf-8")) < 32:
        raise RuntimeError("JWT_SECRET_KEY debe tener al menos 32 bytes")
    return secret


def create_access_token(data: dict):
    to_encode = data.copy()
    to_encode["exp"] = datetime.now(timezone.utc) + timedelta(minutes=ACCESS_EXPIRE_MIN)
    return jwt.encode(to_encode, _secret_key(), algorithm=ALGORITHM)


def create_refresh_token(data: dict):
    to_encode = data.copy()
    to_encode["exp"] = datetime.now(timezone.utc) + timedelta(days=REFRESH_EXPIRE_DAYS)
    to_encode["type"] = "refresh"
    return jwt.encode(to_encode, _secret_key(), algorithm=ALGORITHM)


def decode_jwt(token: str):
    return jwt.decode(token, _secret_key(), algorithms=[ALGORITHM])


oauth2_scheme = OAuth2PasswordBearer(tokenUrl="/login")


def get_current_user(token: str = Depends(oauth2_scheme)):
    try:
        payload = decode_jwt(token)
        user_id = payload.get("sub")
    except Exception:
        raise HTTPException(401, "Token inválido o expirado")
    return user_id

