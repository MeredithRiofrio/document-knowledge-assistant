from typing import Optional, Any

from fastapi import UploadFile, File, Form
from pydantic import BaseModel

class DocumentsOut(BaseModel):
    doc_id: str
    doc_name: str
    upload_date: str
    subcategory_id: str
    category_id: str | None

class ChunkRead(BaseModel):
    chunk_id: str

class DocumentRead(BaseModel):
    doc_id: str
    chunks_list: list

class DocumentCatSub(BaseModel):
    doc_id: str
    doc_name: str
    category_id: str
    subcategory_id: str

class Category(BaseModel):
    category_id: str
    category_name: str

class Subcategory(BaseModel):
    subcategory_id: str
    subcategory_name: str
    category_id: str

class CategoriesSubCount(BaseModel):
    category_id: str
    category_name: str
    subcategory_count: int

class Chunks(BaseModel):
    chunk_id: Any

class Categories(BaseModel):
    category_id: str
    category_name: str

class Subcategories(BaseModel):
    subcategory_id: str
    subcategory_name: str
    category_id: str

class UploadSuccessResponse(BaseModel):
    status: str
    message: str
    data: dict | list | str

class DelUploadSuccessResponse(BaseModel):
    status: str
    message: str
    data: dict | list | str