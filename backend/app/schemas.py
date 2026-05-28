from pydantic import BaseModel, EmailStr, Field
from typing import List, Optional
from datetime import datetime

# --- Token Schemas ---
class Token(BaseModel):
    access_token: str
    token_type: str


class TokenData(BaseModel):
    email: Optional[str] = None
    is_admin: bool = False


# --- Password Reset Schemas ---
class ForgotPasswordRequest(BaseModel):
    email: EmailStr


class ResetPasswordRequest(BaseModel):
    token: str
    new_password: str
    confirm_password: str


# --- User Schemas ---
class UserBase(BaseModel):
    email: EmailStr
    full_name: str


class UserCreate(UserBase):
    password: str


class UserResponse(UserBase):
    id: str
    is_admin: bool
    created_at: datetime

    class Config:
        from_attributes = True


# --- Product Schemas ---
class ProductBase(BaseModel):
    name: str
    description: str
    price: float = Field(gt=0)
    stock: int = Field(ge=0)
    image_url: str
    category: str


class ProductCreate(ProductBase):
    pass


class ProductUpdate(BaseModel):
    name: Optional[str] = None
    description: Optional[str] = None
    price: Optional[float] = Field(None, gt=0)
    stock: Optional[int] = Field(None, ge=0)
    image_url: Optional[str] = None
    category: Optional[str] = None


class ProductResponse(ProductBase):
    id: str

    class Config:
        from_attributes = True


# --- Cart Schemas ---
class CartItemCreate(BaseModel):
    product_id: str
    quantity: int = Field(gt=0)


class CartItemResponse(BaseModel):
    id: str
    product_id: str
    quantity: int
    product: ProductResponse

    class Config:
        from_attributes = True


# --- Order Schemas ---
class OrderItemResponse(BaseModel):
    id: str
    product_id: str
    quantity: int
    price: float
    product: ProductResponse

    class Config:
        from_attributes = True


class OrderResponse(BaseModel):
    id: str
    user_id: str
    total_amount: float
    status: str
    created_at: datetime
    items: List[OrderItemResponse]
    shipping_address: Optional[str] = None
    customer_phone: Optional[str] = None
    customer_name: Optional[str] = None
    payment_method: Optional[str] = None

    class Config:
        from_attributes = True


class OrderStatusUpdate(BaseModel):
    status: str


# --- Checkout Request ---
class CheckoutRequest(BaseModel):
    shipping_address: str
    phone: str
    full_name: str
    payment_method: str = "card"  # card | cod | upi | wallet