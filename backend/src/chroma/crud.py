from langchain_core.documents import Document
from .dependencies import VectorDBFactory


class VectorCRUD:
    def __init__(self, factory: VectorDBFactory, db_type: str, collection_name: str="default"):
        self.client = factory.get_client(db_type=db_type, collection_name=collection_name)

    def add_vectors(self, docs: list[Document]) -> None:
        self.client.add_documents(docs)

    def get_vectors(self, ids: list[str], coll_name: str) -> list[str]:
        collection = self.client.get_collection(coll_name)
        docs = collection.get(ids, include=["documents"])
        return docs["documents"]

    def update_vectors(self, ids: list[str], docs: list[Document]) -> None:
        self.client.update_documents(ids, docs)

    def del_collection(self, coll_name: str) -> None:
        self.client.delete_collection(coll_name)

    def del_metadata(self, coll_name: str, field_id: str, field: str) -> None:
        collection = self.client.get_collection(coll_name)
        collection.delete(
            where={field: field_id}
        )

    def del_chunks(self, coll_name: str, ids: list[str]) -> None:
        collection = self.client.get_collection(coll_name)
        collection.delete(ids=ids)

    def get_client(self):
        return self.client