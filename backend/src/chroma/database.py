import chromadb


class ChromaConnection:
    _instance = None
    _client = None

    def __new__(cls, persist_directory: str):
        if cls._instance is None:
            cls._client = chromadb.PersistentClient(path=persist_directory)
            cls._instance = super().__new__(cls)
        return cls._instance

    def client(self):
        return self._client
