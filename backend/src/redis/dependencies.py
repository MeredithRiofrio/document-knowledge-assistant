from .database import RedisConnection

def get_redis_client():
    client = RedisConnection.get_client()
    try:
        yield client
    finally:
        pass
