from fastapi import APIRouter, HTTPException, Depends, Form, Body
from sqlmodel import Session

from utils.jwt import get_current_user
from utils.validator import Validator
from utils.models import UploadSuccessResponse, DocumentRead, Chunks, Category, Subcategory

from src.sql.crud import SQLCRUD
from src.sql.dependencies import get_session
from src.chroma.crud import VectorCRUD
from src.chroma.dependencies import VectorDBFactory

from chatbot_logic.documentor import Documentor

router = APIRouter(prefix="/api")

@router.put("/categories/{cat_id}", response_model=UploadSuccessResponse)
def update_cat(cat_id: str, category_name: str = Form(None), _ = Depends(get_current_user), session: Session = Depends(get_session)):
    if category_name is None:
        raise HTTPException(status_code=500, detail=f"Ingrese un nuevo nombre para categoría")

    Validator.allowed_string([cat_id], "id")
    Validator.no_item(session, category=cat_id, field="id")

    Validator.allowed_string([category_name], "text")
    Validator.unique_item(session, category=category_name)


    try:
        sql = SQLCRUD(session)
        cat = sql.update_category_name(cat_id, category_name)
        result = Category(
            category_id=cat.id,
            category_name=cat.name
        ).model_dump()

        return UploadSuccessResponse(
            status="success",
            message="Categoría modificada correctamente",
            data=result
        )
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Error al cambiar el nombre de la categoría: {e}")

@router.put("/subcategories/{subcat_id}", response_model=UploadSuccessResponse)
def update_subcat(subcat_id: str, subcategory_name: str = Form(None), _ = Depends(get_current_user), session: Session = Depends(get_session)):
    if subcategory_name is None:
        raise HTTPException(status_code=500, detail=f"Ingrese un nuevo nombre para subcategoría")

    Validator.allowed_string([subcat_id], "id")
    Validator.no_item(session, subcategory=subcat_id, field="id")

    Validator.allowed_string([subcategory_name], "text")
    Validator.unique_item(session, subcategory=subcategory_name)

    try:
        sql = SQLCRUD(session)
        subcat = sql.update_subcategory_name(subcat_id, subcategory_name)
        result = Subcategory(
            subcategory_id=subcat.id,
            subcategory_name=subcat.name,
            category_id=subcat.category.id
        ).model_dump()

        return UploadSuccessResponse(
            status="success",
            message="Subcategoría modificada correctamente",
            data=result
        )
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Error al cambiar el nombre de la subcategoría: {e}")

@router.put("/documents/chunks/{doc_id}", response_model=UploadSuccessResponse)
def update_chunks(doc_id: str, payload: dict = Body(None), _ = Depends(get_current_user), session: Session = Depends(get_session)):

    if payload is None:
        raise HTTPException(status_code=500, detail=f"Ingrese una lista de chunks")


    Validator.allowed_string([doc_id], "id")
    Validator.no_item(session, doc=doc_id, field="id")

    chunks_update = payload["chunks_update"]

    try:
        sql = SQLCRUD(session)
        doc = sql.get_doc("id", doc_id)
        cat_id = doc.subcategory.category.id
        subcat_id = doc.subcategory.id

        chunks = [(d["chunk_id"], d["new_chunk"]) for d in chunks_update]

        chunk_ids, docs = Documentor(chunks, cat_id, subcat_id,
                                     doc_id).create_documents()
        vector = VectorCRUD(VectorDBFactory(), "langchain", cat_id)
        vector.update_vectors(chunk_ids, docs)

        chunks = doc.chunks
        result = DocumentRead(
            doc_id=doc.id,
            chunks_list=[Chunks(
                chunk_id=chunk.id
                ).model_dump()
                for chunk in chunks]
        ).model_dump()

        vector = VectorCRUD(VectorDBFactory(), "chroma")
        texts = vector.get_vectors([item["chunk_id"] for item in result["chunks_list"]], cat_id)

        for chunk, text in zip(result["chunks_list"], texts):
            chunk["chunk_text"] = text

        return UploadSuccessResponse(
            status="success",
            message="Chunks modificados correctamente",
            data=result
        )
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Error al modificar los chunks: {e}")
