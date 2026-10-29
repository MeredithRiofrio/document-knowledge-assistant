from typing import Dict
from langchain.chains.retrieval_qa.base import RetrievalQA
from langchain_google_genai import ChatGoogleGenerativeAI
from dotenv import load_dotenv
from langchain_openai import ChatOpenAI
import os

from src.chroma.crud import VectorCRUD
from src.chroma.dependencies import VectorDBFactory


class QAChain:
    def __init__(self, cat_id: str, subcat_id: str):
        self.cat_id = cat_id
        self.subcat_id = subcat_id
        load_dotenv()
        self.llm = self._initialize_llm()
        self.retriever = self._initialize_retriever()
        self.retrieval = self._initialize_retrieval_chain()

    def _initialize_llm(self):
        return ChatGoogleGenerativeAI(
            google_api_key=os.getenv("GOOGLE_API_KEY"),
            model="gemini-2.5-flash",
            temperature=0.1,
            max_output_tokens=8192,
            top_k=10,
            top_p=0.95,
            model_kwargs={
                "language":"es"
            }
        )
        # return ChatOpenAI(
        #     model="gpt-4o",
        #     temperature=0,
        #     max_tokens=None,
        #     timeout=None,
        #     max_retries=2,
        #     api_key=os.getenv("OPENAI_API_KEY"),
        #     # base_url="...",
        #     # organization="...",
        #     # other params...
        # )

    def _initialize_retriever(self):
        vector = VectorCRUD(VectorDBFactory(), "langchain", self.cat_id)
        client = vector.get_client()
        retriever = client.as_retriever(
            search_kwargs={
                "k": 5,
                "filter": {"subcategory": self.subcat_id}
            }
        )
        return retriever

    def _initialize_retrieval_chain(self):
        return RetrievalQA.from_chain_type(
            llm=self.llm,
            chain_type="stuff",
            retriever=self.retriever,
            return_source_documents=True
        )

    def get_retrieval_qa(self):
        return self.retrieval
