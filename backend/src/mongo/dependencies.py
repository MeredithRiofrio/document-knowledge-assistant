from .database import MongoConnection

async def get_database():
    db = MongoConnection.get_db()
    try:
        yield db
    finally:
        pass
