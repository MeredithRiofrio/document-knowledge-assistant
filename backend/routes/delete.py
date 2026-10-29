from fastapi import APIRouter, HTTPException, Depends, Body
from sqlmodel import Session
from pathlib import Path
import os

from src.chroma.crud import VectorCRUD
from src.chroma.dependencies import VectorDBFactory
from src.sql.crud import SQLCRUD
from utils.jwt import get_current_user
from utils.models import UploadSuccessResponse, Category, Subcategory, Chunks, DocumentRead, DocumentCatSub

from src.sql.dependencies import get_session
from utils.validator import Validator
from dotenv import load_dotenv

load_dotenv()

UPLOAD_FOLDER = Path(os.getenv("DOCS_DIRECTORY"))
UPLOAD_FOLDER.mkdir(parents=True, exist_ok=True)

router = APIRouter(prefix="/api")

@router.delete("/categories/{cat_id}", response_model=UploadSuccessResponse)
async def delete_category(cat_id: str, _ = Depends(get_current_user), session: Session = Depends(get_session)):
    Validator.allowed_string([cat_id], "id")
    Validator.no_item(session, category=cat_id, field="id")

    try:
        sql = SQLCRUD(session)
        cat = sql.delete_category(cat_id)
        for sub in cat.subcategories:
            for doc in sub.documents:
                os.remove(UPLOAD_FOLDER.joinpath(f"{doc.id}.pdf"))

        result = Category(
            category_id=cat.id,
            category_name=cat.name
        ).model_dump()

        vector = VectorCRUD(VectorDBFactory(), "chroma")
        vector.del_collection(cat_id)

        return UploadSuccessResponse(
            status="success",
            message="Categoría eliminada correctamente",
            data=result
        )
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Error al eliminar la categoría: {e}")

@router.delete("/subcategories/{subcat_id}", response_model=UploadSuccessResponse)
def delete_subcategory(subcat_id: str, _ = Depends(get_current_user), session: Session = Depends(get_session)):
    Validator.allowed_string([subcat_id], "id")
    Validator.no_item(session, subcategory=subcat_id, field="id")

    try:
        sql = SQLCRUD(session)
        subcat = sql.delete_subcategory(subcat_id)
        cat_id = subcat.category.id
        result = Subcategory(
            subcategory_id=subcat.id,
            subcategory_name=subcat.name,
            category_id=cat_id
        ).model_dump()

        vector = VectorCRUD(VectorDBFactory(), "chroma")
        vector.del_metadata(cat_id, subcat_id, "subcategory")

        return UploadSuccessResponse(
            status="success",
            message="Subcategoría eliminada correctamente",
            data=result
        )
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Error al eliminar la subcategoría: {e}")

@router.delete("/documents/{doc_id}", response_model=UploadSuccessResponse)
def delete_doc(doc_id: str, _ = Depends(get_current_user), session: Session = Depends(get_session)):
    Validator.allowed_string([doc_id], "id")
    Validator.no_item(session, doc=doc_id, field="id")
    try:
        sql = SQLCRUD(session)
        doc = sql.delete_document(doc_id)
        cat_id = doc.subcategory.category.id
        result = DocumentCatSub(
            doc_id=doc_id,
            doc_name=doc.name,
            category_id=cat_id,
            subcategory_id=doc.subcategory.id
        ).model_dump()

        vector = VectorCRUD(VectorDBFactory(), "chroma")
        vector.del_metadata(cat_id, doc_id, "file")

        os.remove(UPLOAD_FOLDER.joinpath(f"{doc_id}.pdf"))

        return UploadSuccessResponse(
            status="success",
            message="Documento eliminado correctamente",
            data=result
        )
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Error al eliminar el documento: {e}")


@router.delete("/documents/chunks/{doc_id}", response_model=UploadSuccessResponse)
def delete_chunks(doc_id: str, payload: dict = Body(None), _ = Depends(get_current_user), session: Session = Depends(get_session)):
    if payload is None:
        raise HTTPException(status_code=500, detail=f"Ingrese una lista de chunks")

    Validator.allowed_string([doc_id], "id")
    Validator.no_item(session, doc=doc_id, field="id")

    chunks_delete = payload["chunks_delete"]

    try:
        ids = [d["chunk_id"] for d in chunks_delete]
        sql = SQLCRUD(session)
        chunks = sql.delete_chunks(doc_id, ids)

        cat_id = None
        for ch in chunks:
            cat_id = ch.document.subcategory.category.id
            break

        vector = VectorCRUD(VectorDBFactory(), "chroma")
        vector.del_chunks(cat_id, ids)

        result = DocumentRead(
            doc_id=doc_id,
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
            message="Chunks eliminados correctamente",
            data=result
        )
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Error al eliminar los chunks: {e}")
