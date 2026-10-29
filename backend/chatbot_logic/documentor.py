from langchain_core.documents import Document


class Documentor:
    def __init__(self, chunks: list[tuple[str, str]], category: str, subcategory: str, file: str):
        self.chunks = chunks
        self.category = category
        self.file = file
        self.subcategory = subcategory

    def create_documents(self) -> tuple[list[str],list[Document]]:
        meta_info = {
            "file": self.file,
            "category": self.category,
            "subcategory": self.subcategory
        }
        documents = []
        chunk_ids = []
        for chunk_id, chunk in self.chunks:
            document = Document(
                page_content=chunk,
                metadata=meta_info,
            id=chunk_id)
            documents.append(document)
            chunk_ids.append(chunk_id)
        return chunk_ids, documents
