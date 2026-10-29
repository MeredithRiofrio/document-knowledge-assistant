class UserManager:
    def __init__(self, db):
        self.collection = db["users"]

    async def create_user(self, data: dict):
        result = await self.collection.insert_one(data)
        return str(result.inserted_id)

    async def get_user(self, query: dict, projection: dict | None = None):
        return await self.collection.find_one(query, projection)
