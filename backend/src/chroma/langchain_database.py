import torch
from langchain_chroma import Chroma as LCChroma
from langchain_huggingface import HuggingFaceEmbeddings


class LCChromaConnection:
    _instance = None
    _client = None

    def __new__(cls, persist_directory: str, collection: str):
        if cls._instance is None:
            model_name = "embaas/sentence-transformers-multilingual-e5-large"
            device = {'device': 'cuda'} if torch.cuda.is_available() else {'device': 'cpu'}

            embeddings = HuggingFaceEmbeddings(
                model_name=model_name,
                model_kwargs=device
            )

            cls._client = LCChroma(
                collection_name=collection,
                embedding_function=embeddings,
                persist_directory=persist_directory
            )

            cls._instance = super().__new__(cls)
        return cls._instance

    def client(self):
        return self._client
