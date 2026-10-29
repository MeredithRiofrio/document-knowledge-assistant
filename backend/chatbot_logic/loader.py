from langchain_community.document_loaders import PyPDFLoader


class Loader:
    def __init__(self, doc: str):
        self.doc = doc

    def load_pdf(self) -> str:
        try:
            loader = PyPDFLoader(self.doc, mode="single")
            text = loader.load()[0].page_content
            return text
        except Exception as e:
            raise RuntimeError(f"Error al cargar y dividir el PDF: {e}")
