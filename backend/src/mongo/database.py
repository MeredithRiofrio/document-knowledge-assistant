import os

from motor.motor_asyncio import AsyncIOMotorClient
from dotenv import load_dotenv

load_dotenv()

class MongoConnection:
    _client: AsyncIOMotorClient | None = None

    @classmethod
    def get_client(cls) -> AsyncIOMotorClient:
        if cls._client is None:
            cls._client = AsyncIOMotorClient(os.getenv("MONGO_URI"))
        return cls._client

    @classmethod
    def get_db(cls):
        client = cls.get_client()
        return client[os.getenv("MONGO_DB_NAME")]