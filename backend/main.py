import os
from contextlib import asynccontextmanager

from dotenv import load_dotenv
from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

load_dotenv()

from utils.exc_handlers import register_exception_handlers
from routes.post import router as post_router
from routes.get import router as get_router
from routes.put import router as put_router
from routes.delete import router as delete_router
from src.sql.database import create_db_and_tables
from utils.middleware import register_middlewares


@asynccontextmanager
async def lifespan(app: FastAPI):
    create_db_and_tables()
    yield


app = FastAPI(lifespan=lifespan)
allowed_origins = [
    origin.strip()
    for origin in os.getenv("CORS_ORIGINS", "http://localhost:3000").split(",")
    if origin.strip()
]

app.add_middleware(
    CORSMiddleware,
    allow_origins=allowed_origins,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

register_middlewares(app)
register_exception_handlers(app)
app.include_router(post_router)
app.include_router(get_router)
app.include_router(put_router)
app.include_router(delete_router)

