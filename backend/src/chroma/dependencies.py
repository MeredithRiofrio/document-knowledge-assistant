from typing import TypeAlias, Literal
import os
from .database import ChromaConnection
from .langchain_database import LCChromaConnection
from dotenv import load_dotenv

load_dotenv()

class VectorDBFactory:
    def __init__(self, persist_directory: str = os.getenv("CHROMA_PERSIST_DIRECTORY")):
        self.persist_directory = persist_directory

    def get_client(self, db_type: TypeAlias = Literal["langchain", "chroma"], collection_name: str = "default"):
        if db_type == "langchain":
            return LCChromaConnection(self.persist_directory, collection_name).client()
        elif db_type == "chroma":
            return ChromaConnection(self.persist_directory).client()
        raise ValueError(f"Tipo de base de datos no válido: {db_type}")
