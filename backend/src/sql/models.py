import uuid
from typing import Optional
from sqlmodel import SQLModel, Field, Relationship, UniqueConstraint


class Category(SQLModel, table=True):
    id: str = Field(default_factory=lambda: uuid.uuid4().hex, primary_key=True)
    name: str = Field(index=True, unique=True, nullable=False)
    subcategories: list["Subcategory"] = Relationship(back_populates="category", cascade_delete=True)

class Subcategory(SQLModel, table=True):
    __table_args__ = (
        UniqueConstraint("category_id", "name", name="uq_subcategory_category_name"),
    )
    id: str = Field(default_factory=lambda: uuid.uuid4().hex, primary_key=True)
    name: str = Field(index=True, nullable=False)
    category_id: str = Field(foreign_key="category.id", ondelete="CASCADE")
    category: Optional[Category] = Relationship(back_populates="subcategories")
    documents: list["Document"] = Relationship(back_populates="subcategory", cascade_delete=True)

class Document(SQLModel, table=True):
    __table_args__ = (
        UniqueConstraint("subcategory_id", "name", name="uq_document_subcategory_name"),
    )
    id: str = Field(default_factory=lambda: uuid.uuid4().hex, primary_key=True)
    name: str = Field(index=True, nullable=False)
    upload_date: str = Field(nullable=False)
    subcategory_id: str = Field(foreign_key="subcategory.id", ondelete="CASCADE")
    subcategory: Optional[Subcategory] = Relationship(back_populates="documents")
    chunks: list["Chunk"] = Relationship(back_populates="document", cascade_delete=True)

class Chunk(SQLModel, table=True):
    id: str = Field(default_factory=lambda: uuid.uuid4().hex, primary_key=True)
    document_id: str = Field(foreign_key="document.id", ondelete="CASCADE")
    document: Optional[Document] = Relationship(back_populates="chunks")
