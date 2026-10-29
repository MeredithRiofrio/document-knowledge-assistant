from pydantic import BaseModel, EmailStr


class User(BaseModel):
    id: str | None = None
    email: EmailStr
    password: str

class RefreshRequest(BaseModel):
    refresh_token: str