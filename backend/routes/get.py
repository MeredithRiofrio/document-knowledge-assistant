from fastapi import APIRouter, HTTPException, Depends
from sqlmodel import Session

from utils.jwt import get_current_user
from utils.validator import Validator
from utils.models import UploadSuccessResponse, DocumentsOut, DocumentRead, DocumentCatSub, CategoriesSubCount, Subcategories, \
    Chunks, Category, Subcategory

from src.sql.crud import SQLCRUD
from src.sql.dependencies import get_session
from src.chroma.crud import VectorCRUD
from src.chroma.dependencies import VectorDBFactory


router = APIRouter(prefix="/api")

@router.get("/documents", response_model=UploadSuccessResponse)
def read_docs(_ = Depends(get_current_user), session: Session = Depends(get_session)):
    try:
        sql = SQLCRUD(session)
        docs = sql.get_docs()
        result = [DocumentsOut(
            doc_id=doc.id,
            doc_name=doc.name,
            upload_date=doc.upload_date,
            subcategory_id=doc.subcategory_id,
            category_id=(
                doc.subcategory.category.id
                if doc.subcategory and doc.subcategory.category
                else None
            )
        )
            for doc in docs
        ]
        return UploadSuccessResponse(
            status="success",
            message="Documentos obtenidas correctamente",
            data=result
        )
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Error al obtener los documentos: {e}")

@router.get("/documents/chunks/{doc_id}", response_model=UploadSuccessResponse)
def read_doc_chunks(doc_id: str, _ = Depends(get_current_user), session: Session = Depends(get_session)):
    Validator.allowed_string([doc_id], "id")
    Validator.no_item(session, doc=doc_id, field="id")
    try:
        sql = SQLCRUD(session)
        doc = sql.get_doc("id", doc_id)
        cat_id = doc.subcategory.category.id
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
            message="Documento obtenido correctamente",
            data=result
        )
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Error al obtener el documento y sus chunks: {e}")

@router.get("/documents/{doc_id}", response_model=UploadSuccessResponse)
def read_doc(doc_id: str, _ = Depends(get_current_user), session: Session = Depends(get_session)):
    Validator.allowed_string([doc_id], "id")
    Validator.no_item(session, doc=doc_id, field="id")
    try:
        sql = SQLCRUD(session)
        doc = sql.get_doc("id", doc_id)
        result = DocumentCatSub(
            doc_id=doc.id,
            doc_name=doc.name,
            category_id=doc.subcategory.category.id,
            subcategory_id=doc.subcategory.id
        ).model_dump()

        return UploadSuccessResponse(
            status="success",
            message="Documento obtenido correctamente",
            data=result
        )
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Error al obtener el documento: {e}")

@router.get("/categories/{cat_id}", response_model=UploadSuccessResponse)
def read_category(cat_id: str, _ = Depends(get_current_user), session: Session = Depends(get_session)):
    Validator.allowed_string([cat_id], "id")
    Validator.no_item(session, category=cat_id, field="id")
    try:
        sql = SQLCRUD(session)
        cat = sql.get_cat("id", cat_id)
        result = Category(
            category_id=cat.id,
            category_name=cat.name
        ).model_dump()

        return UploadSuccessResponse(
            status="success",
            message="Categoría obtenida correctamente",
            data=result
        )
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Error al obtener la categoría: {e}")

@router.get("/subcategories/{subcat_id}", response_model=UploadSuccessResponse)
def read_subcategory(subcat_id: str, _ = Depends(get_current_user), session: Session = Depends(get_session)):
    Validator.allowed_string([subcat_id], "id")
    Validator.no_item(session, subcategory=subcat_id, field="id")
    try:
        sql = SQLCRUD(session)
        subcat = sql.get_sub("id",  subcat_id)
        result = Subcategory(
            subcategory_id=subcat.id,
            subcategory_name=subcat.name,
            category_id=subcat.category.id
        ).model_dump()

        return UploadSuccessResponse(
            status="success",
            message="Subcategoría obtenida correctamente",
            data=result
        )
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Error al obtener la subcategoría: {e}")

@router.get("/categories", response_model=UploadSuccessResponse)
def read_categories(_ = Depends(get_current_user), session: Session = Depends(get_session)):
    try:
        sql = SQLCRUD(session)
        cats = sql.get_cats_sub_count()
        result = [CategoriesSubCount(
            category_id=cat.id,
            category_name=cat.name,
            subcategory_count=cat.subcategory_count
            )
        for cat in cats
        ]
        return UploadSuccessResponse(
            status="success",
            message="Categorías obtenidas correctamente",
            data=result
        )
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Error al obtener las categorías: {e}")

@router.get("/subcategories", response_model=UploadSuccessResponse)
def read_subcategories(_ = Depends(get_current_user), session: Session = Depends(get_session)):
    try:
        sql = SQLCRUD(session)
        subs = sql.get_subs()
        result = [Subcategories(
            subcategory_id=sub.id,
            subcategory_name=sub.name,
            category_id=sub.category.id
            )
        for sub in subs
        ]
        return UploadSuccessResponse(
            status="success",
            message="Subcategorías obtenidas correctamente",
            data=result
        )
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Error al obtener las subcategorías: {e}")
