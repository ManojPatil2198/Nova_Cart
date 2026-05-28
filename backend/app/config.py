from pydantic_settings import BaseSettings, SettingsConfigDict

class Settings(BaseSettings):
   DATABASE_URL: str = "postgresql+asyncpg://postgres:Manoj1606%40@localhost:5432/novacart"   
   JWT_SECRET: str = "super-secret-key-change-in-production-123456"
   ALGORITHM: str = "HS256"
   ACCESS_TOKEN_EXPIRE_MINUTES: int = 1440
   MAIL_USERNAME: str = ""
   MAIL_PASSWORD: str = ""
   MAIL_FROM: str = ""
   MAIL_PORT: int = 587
   MAIL_SERVER: str = "smtp.gmail.com"
   MAIL_FROM_NAME: str = "Nova Cart"

   model_config = SettingsConfigDict(env_file=".env", env_file_encoding="utf-8")

settings = Settings()
