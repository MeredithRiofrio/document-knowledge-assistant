import os
from datetime import datetime

from fastapi import APIRouter, Depends, UploadFile, File, Form, HTTPException
from sqlmodel import Session
from pathlib import Path

from werkzeug.utils import secure_filename

from chatbot_logic.loader import Loader
from chatbot_logic.splitter import CustomSplitter
from chatbot_logic.documentor import Documentor

from utils.validator import Validator
from utils.models import UploadSuccessResponse

from src.sql.crud import SQLCRUD
from src.sql.dependencies import get_session
from src.chroma.crud import VectorCRUD
from src.chroma.dependencies import VectorDBFactory

from utils.hash import hash_password, verify_password
from utils.jwt import create_access_token, create_refresh_token, decode_jwt, get_current_user

from src.mongo.models import User, RefreshRequest
from src.mongo.dependencies import get_database
from src.mongo.crud import UserManager

from dotenv import load_dotenv

load_dotenv()

ALLOWED_EXTENSIONS = {".pdf"}
UPLOAD_FOLDER = Path(os.getenv("DOCS_DIRECTORY"))
UPLOAD_FOLDER.mkdir(parents=True, exist_ok=True)

router = APIRouter(prefix="/api")


@router.post("/categories", response_model=UploadSuccessResponse)
def create_category(
    category_name: str = Form(...),
    _ = Depends(get_current_user),
    session: Session = Depends(get_session),
):
    name = category_name.strip()
    if not 3 <= len(name) <= 50:
        raise HTTPException(status_code=422, detail="Category name must contain 3 to 50 characters.")
    Validator.allowed_string([name], "text")
    sql = SQLCRUD(session)
    if sql.get_cat("name", name):
        raise HTTPException(status_code=409, detail="Ya existe una categoría con ese nombre.")
    category = sql.create_category(name)
    return UploadSuccessResponse(
        status="success",
        message="Categoría creada correctamente",
        data={"category_id": category.id, "category_name": category.name, "subcategory_count": 0},
    )


@router.post("/subcategories", response_model=UploadSuccessResponse)
def create_subcategory(
    subcategory_name: str = Form(...),
    category_id: str = Form(...),
    _ = Depends(get_current_user),
    session: Session = Depends(get_session),
):
    name = subcategory_name.strip()
    if not 3 <= len(name) <= 50:
        raise HTTPException(status_code=422, detail="Subcategory name must contain 3 to 50 characters.")
    Validator.allowed_string([category_id], "id")
    Validator.allowed_string([name], "text")
    sql = SQLCRUD(session)
    category = sql.get_cat("id", category_id)
    if category is None:
        raise HTTPException(status_code=404, detail="No se encontró la categoría seleccionada.")
    if any(item.name.casefold() == name.casefold() for item in sql.get_subs_by_cat_id(category_id)):
        raise HTTPException(status_code=409, detail="Ya existe una subcategoría con ese nombre.")
    subcategory = sql.create_subcategory(category_id, name)
    return UploadSuccessResponse(
        status="success",
        message="Subcategoría creada correctamente",
        data={
            "subcategory_id": subcategory.id,
            "subcategory_name": subcategory.name,
            "category_id": subcategory.category_id,
            "document_count": 0,
        },
    )

@router.post("/documents", response_model=UploadSuccessResponse)
async def upload_file(
    category_id: str = Form(None),
    category_name: str = Form(None),
    subcategory_id: str = Form(None),
    subcategory_name: str = Form(None),
    file: UploadFile = File(...),
    _ = Depends(get_current_user),
    session: Session = Depends(get_session)
):
    cat_id = category_id
    subcat_id = subcategory_id
    doc_id = None
    cat_name = category_name
    subcat_name = subcategory_name
    file = file
    sql = SQLCRUD(session)

    original_filename = (file.filename or "").strip()
    if (
        not original_filename
        or len(original_filename) > 255
        or any(ord(character) < 32 for character in original_filename)
    ):
        raise HTTPException(status_code=400, detail="El nombre del archivo no es válido.")

    ext = Validator.allowed_file(original_filename, ALLOWED_EXTENSIONS)
    Validator.unique_item(session, doc=original_filename)

    try:
        match (cat_id, subcat_id, cat_name, subcat_name):
            case (_, _, cat_name, subcat_name) if cat_name is not None and subcat_name is not None:
                Validator.allowed_string([category_name, subcategory_name], "text")
                Validator.unique_item(
                    session,
                    category=category_name,
                    subcategory=subcategory_name,
                    doc=original_filename,
                )

                cat_id, subcat_id, doc_id = sql.create_all(
                    category_name, subcategory_name, original_filename
                )

            case (cat_id, subcat_id, _, _) if cat_id is not None and subcat_id is not None:

                Validator.allowed_string([category_id, subcategory_id], "id")
                Validator.unique_item(session, doc=original_filename)
                subcat = sql.get_sub("id", subcat_id)
                if subcat.category_id != cat_id:
                    raise HTTPException(status_code=500,
                                        detail=f"La Subcategoría {subcat_id} no pertenece a la Categoría {cat_id}")

                cat = sql.get_cat("id", cat_id)
                cat_id = cat.id
                subcat_id = subcat.id

                doc_id = sql.create_doc(subcat_id, original_filename)

            case (cat_id, _, _, subcat_name) if cat_id is not None and subcat_name is not None:
                Validator.allowed_string([category_id], "id")
                Validator.allowed_string([subcategory_name], "text")

                subcat_id, doc_id = sql.create_sub_doc(cat_id, subcat_name, original_filename)

            case _:
                raise HTTPException(
                    status_code=400,
                    detail="Debes enviar (category_name y subcategory_name) "
                           "o (category_id y subcategory_id) o (category_id y subcategory_name)."
                )


        filename = secure_filename(f"{doc_id}{ext}")

        filepath = UPLOAD_FOLDER / filename

        with filepath.open("wb") as buffer:
            buffer.write(await file.read())

        doc_text = Loader(str(filepath)).load_pdf()
        chunks = CustomSplitter(doc_text).split_text()
        chunk_ids, docs = Documentor(chunks, cat_id, subcat_id,
                                     doc_id).create_documents()

        for chunk_id in chunk_ids:
            sql = SQLCRUD(session)
            sql.create_chunk(chunk_id, doc_id)

        vector = VectorCRUD(VectorDBFactory(), "langchain", cat_id)
        vector.add_vectors(docs)

        session.close()

        return UploadSuccessResponse(
            status="success",
            message="Archivo procesado correctamente",
            data={"doc_id": doc_id,
                "doc_name": original_filename,
                "category_id": cat_id,
                "subcategory_id": subcat_id,
                "upload_date": datetime.now().isoformat(),
                }
        )

    except HTTPException:
        raise

    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Error al guardar el archivo: {e}")


@router.post("/register", response_model=UploadSuccessResponse)
async def register(data: User, db = Depends(get_database)):
    mongo = UserManager(db)
    exists = await mongo.get_user({"email": data.email})
    if exists:
        raise HTTPException(400, "Email ya registrado")

    hashed = hash_password(data.password)

    new_user = {
        "email": data.email,
        "password": hashed
    }

    result = await mongo.create_user(new_user)

    return UploadSuccessResponse(
        status="success",
        message="Usuario registrado correctamente",
        data={"id": result}
    )


@router.post("/login", response_model=UploadSuccessResponse)
async def login(credentials: User, db = Depends(get_database)):
    mongo = UserManager(db)
    user = await mongo.get_user({"email": credentials.email})
    if not user:
        raise HTTPException(400, "Usuario no encontrado")

    if not verify_password(credentials.password, user["password"]):
        raise HTTPException(400, "Contraseña incorrecta")

    access = create_access_token({"sub": str(user["_id"])})
    refresh = create_refresh_token({"sub": str(user["_id"])})

    return UploadSuccessResponse(
        status="success",
        message="Login correcto",
        data={
            "access_token": access,
            "refresh_token": refresh,
            "token_type": "bearer"
        }
    )


@router.post("/refresh", response_model=UploadSuccessResponse)
async def refresh_token(body: RefreshRequest):
    try:
        payload = decode_jwt(body.refresh_token)
        if payload.get("type") != "refresh":
            raise Exception("Invalid type")
    except:
        raise HTTPException(401, "Refresh token inválido")

    new_access = create_access_token({"sub": payload["sub"]})

    return UploadSuccessResponse(
        status="success",
        message="Refresh correcto",
        data={"access_token": new_access}
    )

