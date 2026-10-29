from typing import Optional
from .database import RedisConnection

class UserStateCache:
    def __init__(self, prefix: str = "user:", cache_ttl: int = 3600):
        self.prefix = prefix
        self.cache_ttl = cache_ttl
        self.r = RedisConnection.get_client()

    def set_user_state(self, user_id, key, value, ttl: Optional[int] = None):
        redis_key = f"{self.prefix}{user_id}"
        self.r.hset(redis_key, key, value)
        self.r.expire(redis_key, ttl or self.cache_ttl)

    def get_user_state(self, user_id):
        return self.r.hgetall(f"{self.prefix}{user_id}")

    def clear_user_state(self, user_id):
        self.r.delete(f"{self.prefix}{user_id}")