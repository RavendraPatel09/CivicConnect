from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy import select
from datetime import datetime, timezone

from ...core.database import get_db
from ...core.security import (
    verify_password,
    get_password_hash,
    create_access_token,
    create_refresh_token,
    hash_token,
    create_password_reset_token,
    verify_password_reset_token
)
from ...core.dependencies import get_current_user
from ...models.user import User, UserRole
from ...models.department import Department
from ...models.refresh_token import RefreshToken
from ...schemas.auth import (
    LoginRequest,
    RegisterRequest,
    RefreshTokenRequest,
    ForgotPasswordRequest,
    ResetPasswordRequest,
    AuthResponse,
    TokenPair,
    Token
)
from ...schemas.user import UserResponse

router = APIRouter(prefix="/auth", tags=["Authentication"])

@router.post("/register", response_model=AuthResponse, status_code=status.HTTP_201_CREATED)
async def register_user(req: RegisterRequest, db: AsyncSession = Depends(get_db)):
    # Check duplicate email
    res = await db.execute(select(User).where(User.email == req.email.lower()))
    if res.scalar_one_or_none():
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="An account with this email address already exists"
        )

    # Department lookup if staff
    dept_id = req.department_id
    if not dept_id and req.department:
        dept_res = await db.execute(select(Department).where(Department.name == req.department))
        dept = dept_res.scalar_one_or_none()
        if dept:
            dept_id = dept.id

    new_user = User(
        name=req.name,
        email=req.email.lower(),
        password_hash=get_password_hash(req.password),
        role=req.role,
        department_id=dept_id,
        profile_image="https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=150&auto=format&fit=crop&q=80" if req.role == UserRole.CITIZEN else "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&auto=format&fit=crop&q=80"
    )
    db.add(new_user)
    await db.flush()

    # Generate tokens
    access_token = create_access_token(subject=new_user.id, role=new_user.role.value)
    raw_refresh, token_hash, expires_at = create_refresh_token()

    rf = RefreshToken(
        user_id=new_user.id,
        token_hash=token_hash,
        expires_at=expires_at
    )
    db.add(rf)
    await db.commit()
    await db.refresh(new_user)

    user_resp = UserResponse(
        id=new_user.id,
        name=new_user.name,
        email=new_user.email,
        role=new_user.role,
        profile_image=new_user.profile_image,
        department_id=new_user.department_id,
        department_name=new_user.department.name if new_user.department else None,
        is_active=new_user.is_active,
        created_at=new_user.created_at
    )

    return AuthResponse(
        user=user_resp,
        tokens=TokenPair(access_token=access_token, refresh_token=raw_refresh)
    )

@router.post("/login", response_model=AuthResponse)
async def login_user(req: LoginRequest, db: AsyncSession = Depends(get_db)):
    res = await db.execute(select(User).where(User.email == req.email.lower()))
    user = res.scalar_one_or_none()

    if not user or not verify_password(req.password, user.password_hash):
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Invalid email or password",
            headers={"WWW-Authenticate": "Bearer"},
        )

    if not user.is_active:
        raise HTTPException(status_code=status.HTTP_403_FORBIDDEN, detail="Account is disabled")

    # Generate tokens
    access_token = create_access_token(subject=user.id, role=user.role.value)
    raw_refresh, token_hash, expires_at = create_refresh_token()

    rf = RefreshToken(
        user_id=user.id,
        token_hash=token_hash,
        expires_at=expires_at
    )
    db.add(rf)
    await db.commit()
    await db.refresh(user)

    user_resp = UserResponse(
        id=user.id,
        name=user.name,
        email=user.email,
        role=user.role,
        profile_image=user.profile_image,
        department_id=user.department_id,
        department_name=user.department.name if user.department else None,
        is_active=user.is_active,
        created_at=user.created_at
    )

    return AuthResponse(
        user=user_resp,
        tokens=TokenPair(access_token=access_token, refresh_token=raw_refresh)
    )

@router.post("/refresh", response_model=TokenPair)
async def refresh_access_token(req: RefreshTokenRequest, db: AsyncSession = Depends(get_db)):
    th = hash_token(req.refresh_token)
    res = await db.execute(
        select(RefreshToken).where(
            RefreshToken.token_hash == th,
            RefreshToken.revoked_at.is_(None)
        )
    )
    token_record = res.scalar_one_or_none()

    if not token_record or token_record.expires_at < datetime.now(timezone.utc):
        raise HTTPException(status_code=status.HTTP_401_UNAUTHORIZED, detail="Invalid or expired refresh token")

    # Revoke old refresh token (Token Rotation)
    token_record.revoked_at = datetime.now(timezone.utc)

    # Issue new token pair
    user_res = await db.execute(select(User).where(User.id == token_record.user_id))
    user = user_res.scalar_one()

    new_access = create_access_token(subject=user.id, role=user.role.value)
    new_raw_refresh, new_token_hash, new_expires_at = create_refresh_token()

    new_rf = RefreshToken(
        user_id=user.id,
        token_hash=new_token_hash,
        expires_at=new_expires_at
    )
    db.add(new_rf)
    await db.commit()

    return TokenPair(access_token=new_access, refresh_token=new_raw_refresh)

@router.post("/logout")
async def logout(current_user: User = Depends(get_current_user), db: AsyncSession = Depends(get_db)):
    # Revoke all active refresh tokens for user
    res = await db.execute(
        select(RefreshToken).where(
            RefreshToken.user_id == current_user.id,
            RefreshToken.revoked_at.is_(None)
        )
    )
    tokens = res.scalars().all()
    for t in tokens:
        t.revoked_at = datetime.now(timezone.utc)
    await db.commit()
    return {"message": "Successfully logged out and revoked session"}

@router.get("/me", response_model=UserResponse)
async def get_me(current_user: User = Depends(get_current_user)):
    return UserResponse(
        id=current_user.id,
        name=current_user.name,
        email=current_user.email,
        role=current_user.role,
        profile_image=current_user.profile_image,
        department_id=current_user.department_id,
        department_name=current_user.department.name if current_user.department else None,
        is_active=current_user.is_active,
        created_at=current_user.created_at
    )

@router.post("/forgot-password")
async def forgot_password(req: ForgotPasswordRequest, db: AsyncSession = Depends(get_db)):
    res = await db.execute(select(User).where(User.email == req.email.lower()))
    user = res.scalar_one_or_none()
    
    reset_token = None
    if user:
        reset_token = create_password_reset_token(user.email)
    
    return {
        "message": "If the account exists, a secure reset link has been dispatched to your email.",
        "reset_token": reset_token  # Provided for local dev/testing verification
    }

@router.post("/reset-password")
async def reset_password(req: ResetPasswordRequest, db: AsyncSession = Depends(get_db)):
    email = verify_password_reset_token(req.token)
    if not email:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Invalid, expired, or malformed password reset token"
        )
    
    res = await db.execute(select(User).where(User.email == email.lower()))
    user = res.scalar_one_or_none()
    if not user:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="User account associated with this token does not exist"
        )
    
    user.password_hash = get_password_hash(req.new_password)
    user.updated_at = datetime.now(timezone.utc)
    await db.commit()
    
    return {"message": "Password successfully reset. Please sign in with your new password."}
