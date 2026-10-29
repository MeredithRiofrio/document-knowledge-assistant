import os
import redis
from dotenv import load_dotenv

load_dotenv()

class RedisConnection:
    _client: redis.Redis | None = None

    @classmethod
    def get_client(cls) -> redis.Redis:
        if cls._client is None:
            cls._client = redis.Redis(
                host=os.getenv("REDIS_HOST"),
                port=int(os.getenv("REDIS_PORT")),
                username=os.getenv("REDIS_USERNAME"),
                password=os.getenv("REDIS_PASSWORD"),
                decode_responses=True,
            )
        return cls._client