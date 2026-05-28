from fastapi_mail import FastMail, MessageSchema
from app.mail import conf
from datetime import timedelta
from fastapi import APIRouter, Depends, HTTPException, status
from fastapi.security import OAuth2PasswordRequestForm
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy.future import select

from app.database import get_db
from app.models import User
from app.schemas import UserCreate, UserResponse, Token, ForgotPasswordRequest, ResetPasswordRequest
from app.auth import get_password_hash, verify_password, create_access_token, settings, create_reset_password_token, verify_reset_password_token

router = APIRouter(prefix="/auth", tags=["auth"])

@router.post("/register", response_model=UserResponse, status_code=status.HTTP_201_CREATED)
async def register(user_in: UserCreate, db: AsyncSession = Depends(get_db)):
    # Check if user already exists
    result = await db.execute(select(User).filter(User.email == user_in.email))
    existing_user = result.scalars().first()
    if existing_user:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Email already registered"
        )

    # Create new user
    new_user = User(
        email=user_in.email,
        hashed_password=get_password_hash(user_in.password),
        full_name=user_in.full_name,
        is_admin=False
    )
    db.add(new_user)
    await db.commit()
    await db.refresh(new_user)
    return new_user

@router.post("/token", response_model=Token)
async def login_for_access_token(
    form_data: OAuth2PasswordRequestForm = Depends(),
    db: AsyncSession = Depends(get_db)
):
    result = await db.execute(select(User).filter(User.email == form_data.username))
    user = result.scalars().first()
    if not user or not verify_password(form_data.password, user.hashed_password):
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Incorrect email or password",
            headers={"WWW-Authenticate": "Bearer"},
        )

    access_token_expires = timedelta(minutes=settings.ACCESS_TOKEN_EXPIRE_MINUTES)
    access_token = create_access_token(
        data={"sub": user.email, "is_admin": user.is_admin},
        expires_delta=access_token_expires
    )
    return {"access_token": access_token, "token_type": "bearer"}

@router.post("/forgot-password", status_code=status.HTTP_200_OK)
async def forgot_password(req: ForgotPasswordRequest, db: AsyncSession = Depends(get_db)):
    result = await db.execute(select(User).filter(User.email == req.email))
    user = result.scalars().first()
    
    if not user:
        # We don't want to leak user existence, just return success anyway
        return {"message": "If an account with that email exists, we have sent a password reset link.", "reset_token": None}
    
    token = create_reset_password_token(email=user.email)

    reset_link = f"http://localhost:3000/reset-password?token={token}"

    html = f"""
    <h2>Nova Cart Password Reset</h2>
    <p>Click the link below to reset your password:</p>
    <a href="{reset_link}">{reset_link}</a>
    """

    message = MessageSchema(
            subject="Nova Cart Password Reset",
            recipients=[user.email],
            body=html,
            subtype="html"
        )

    fm = FastMail(conf)
    await fm.send_message(message)

    return {
        "message": "If an account with that email exists, we have sent a password reset link."
    }   

@router.post("/reset-password", status_code=status.HTTP_200_OK)
async def reset_password(req: ResetPasswordRequest, db: AsyncSession = Depends(get_db)):
    if req.new_password != req.confirm_password:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Passwords do not match."
        )

    email = verify_reset_password_token(req.token)
    if not email:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Invalid or expired reset token."
        )

    result = await db.execute(select(User).filter(User.email == email))
    user = result.scalars().first()
    
    if not user:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Invalid or expired reset token."
        )
    
    user.hashed_password = get_password_hash(req.new_password)
    db.add(user)
    await db.commit()

    return {"message": "Password successfully reset. You can now log in."}
