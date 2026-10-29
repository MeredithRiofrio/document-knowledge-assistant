from datetime import datetime
from typing import Type, TypeVar, Sequence, Any, Optional

from sqlalchemy.orm import selectinload
from sqlmodel import Session, select, SQLModel
from sqlalchemy import func

from .models import Category, Subcategory, Document, Chunk

ModelType = TypeVar("ModelType", bound=SQLModel)

class SQLCRUD:
    def __init__(self, session: Session):
        self.session = session

    def _commit(self, instance: ModelType) -> ModelType:
        self.session.add(instance)
        self.session.commit()
        self.session.refresh(instance)
        return instance

    def _commit_del(self, instance: ModelType) -> ModelType:
        self.session.delete(instance)
        self.session.commit()
        return instance

    def create_all(self, category: str, subcategory: str, doc: str) -> tuple[str, str, str]:
        cat = Category(name=category)
        cat = self._commit(cat)
        sub = Subcategory(name=subcategory, category_id=cat.id)
        sub = self._commit(sub)
        document = Document(
            name=doc,
            upload_date=datetime.now().isoformat(),
            subcategory_id=sub.id
        )
        document = self._commit(document)
        return cat.id, sub.id, document.id

    def create_category(self, name: str) -> Category:
        return self._commit(Category(name=name))

    def create_subcategory(self, category_id: str, name: str) -> Subcategory:
        return self._commit(Subcategory(name=name, category_id=category_id))


    def create_sub_doc(self, cat_id: str, sub_name: str, doc_name: str) -> tuple[str, str]:
        sub = Subcategory(name=sub_name, category_id=cat_id)
        sub = self._commit(sub)
        sub_id = sub.id
        return sub_id, self.create_doc(sub_id, doc_name)

    def create_doc(self, sub_id: str, doc_name: str) -> str:
        doc = Document(name=doc_name, upload_date=datetime.now().isoformat(), subcategory_id=sub_id)
        doc = self._commit(doc)
        return doc.id

    def create_chunk(self, chunk_id: str, doc_id: str) -> None:
        chunk = Chunk(id=chunk_id, document_id=doc_id)
        self._commit(chunk)


    def _read_all(self, obj: Type[ModelType]) -> Sequence[ModelType]:
        stmt = select(obj)
        return self.session.exec(stmt).all()

    def _read_one(self, obj: Type[ModelType], value: Any, field) -> Optional[ModelType]:
        stmt = select(obj).where(getattr(obj, field) == value)
        return self.session.exec(stmt).first()

    def get_cats_sub_count(self) -> Sequence[Category]:
        statement = (
            select(Category.id, Category.name, func.count(Subcategory.id).label("subcategory_count"))
            .join(Subcategory, Category.id == Subcategory.category_id, isouter=True)
            .group_by(Category.id, Category.name)
        )
        return self.session.exec(statement).all()

    def get_cats(self) -> Sequence[Category]:
        return self._read_all(Category)

    def get_subs_by_cat_id(self, cat_id: str) -> Sequence[Subcategory]:
        statement = select(Subcategory).where(Subcategory.category_id == cat_id)
        subcategories = self.session.exec(statement).all()
        return subcategories

    def get_subs(self) -> Sequence[Subcategory]:
        return self._read_all(Subcategory)

    def get_docs(self) -> Sequence[Document]:
        return self._read_all(Document)

    def get_cat(self, field: str, category: str) -> Optional[Category]:
        return self._read_one(Category, category, field)

    def get_sub(self, field: str, subcategory: str) -> Optional[Subcategory]:
        return self._read_one(Subcategory, subcategory, field)

    def get_doc(self, field: str, doc: str) -> Optional[Document]:
        return self._read_one(Document, doc, field)

    def update_category_name(self, category_id: str, new_name: str) -> Optional[Category]:
        statement = select(Category).where(Category.id == category_id)
        category = self.session.exec(statement).first()
        category.name = new_name
        self._commit(category)
        return category

    def update_subcategory_name(self, subcategory_id: str, new_name: str) -> Optional[Subcategory]:
        statement = select(Subcategory).where(Subcategory.id == subcategory_id)
        subcategory = self.session.exec(statement).first()
        subcategory.name = new_name
        self._commit(subcategory)
        return subcategory

    def delete_category(self, category_id: str) -> Optional[Category]:
        statement = select(Category).where(Category.id == category_id)
        category = self.session.exec(statement).first()
        self._commit_del(category)
        return category

    def delete_subcategory(self, subcategory_id: str) -> Optional[Subcategory]:
        statement = (
            select(Subcategory)
            .where(Subcategory.id == subcategory_id)
            .options(selectinload(Subcategory.category))
        )
        subcategory = self.session.exec(statement).first()
        self._commit_del(subcategory)
        return subcategory

    def delete_document(self, document_id: str) -> Optional[Subcategory]:
        statement = (
            select(Document)
            .where(Document.id == document_id)
            .options(selectinload(Document.subcategory)
                .selectinload(Subcategory.category)
            )
        )
        document = self.session.exec(statement).first()
        self._commit_del(document)
        return document

    def delete_chunks(self, doc_id: str, chunk_ids: list[str]) -> Sequence[Chunk]:
        statement = (
            select(Chunk)
            .where(Chunk.document_id == doc_id)
            .where(Chunk.id.in_(chunk_ids))
            .options(
                selectinload(Chunk.document)
                .selectinload(Document.subcategory)
                .selectinload(Subcategory.category)
            )
        )
        chunks = self.session.exec(statement).all()
        for ch in chunks:
            self.session.delete(ch)
        self.session.commit()
        return chunks
