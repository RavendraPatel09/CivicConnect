from typing import Optional
from pydantic import BaseModel, EmailStr, Field, computed_field
from ..models.user import UserRole

class Token(BaseModel):
    access_token: str
    token_type: str = "bearer"
    expires_in: int

class TokenPair(BaseModel):
    access_token: str
    refresh_token: str
    token_type: str = "bearer"

class LoginRequest(BaseModel):
    email: EmailStr
    password: str = Field(..., min_length=6)

class RegisterRequest(BaseModel):
    name: str = Field(..., min_length=2, max_length=100)
    email: EmailStr
    password: str = Field(..., min_length=8)
    role: UserRole = UserRole.CITIZEN
    department_id: Optional[str] = None
    department: Optional[str] = None

class RefreshTokenRequest(BaseModel):
    refresh_token: str

class ForgotPasswordRequest(BaseModel):
    email: EmailStr

class ResetPasswordRequest(BaseModel):
    token: str
    new_password: str = Field(..., min_length=8)

class AuthResponse(BaseModel):
    user: "UserResponse"
    tokens: TokenPair

    @property
    def token(self) -> str:
        return self.tokens.access_token

    def model_dump(self, *args, **kwargs):
        d = super().model_dump(*args, **kwargs)
        d["token"] = self.tokens.access_token
        return d

from .user import UserResponse
AuthResponse.model_rebuild()
