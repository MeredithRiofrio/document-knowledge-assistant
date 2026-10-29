import os
import re

from fastapi import HTTPException
from sqlmodel import Session

from src.sql.crud import SQLCRUD


class Validator:
    @staticmethod
    def allowed_file(filename: str, allowed_extensions: set[str]) -> str:
        _, extension = os.path.splitext(filename)
        extension = extension.lower()
        if not extension in allowed_extensions:
            raise HTTPException(status_code=400, detail="Tipo de archivo no permitido")
        return extension

    @staticmethod
    def allowed_string(texts: list[str], text_type: str) -> None:
        if not all(texts):
            raise HTTPException(status_code=400, detail="Ingrese todos los campos")
        if text_type == "text":
            pattern = r'^[a-zA-Z0-9áéíóúÁÉÍÓÚñÑ](?:[a-zA-Z0-9áéíóúÁÉÍÓÚñÑ ._-]{1,48})[a-zA-Z0-9áéíóúÁÉÍÓÚñÑ]$'
        else:
            pattern = r'^[a-fA-F0-9]{32}$'
        for text in texts:
            if not (3 <= len(text) <= 50 and re.fullmatch(pattern, text)):
                raise HTTPException(status_code=400, detail=f"Nombre {text} no permitido")


    @staticmethod
    def unique_item(session: Session, category: str=None, subcategory: str=None, doc: str=None, field: str="name") -> None:
        sql = SQLCRUD(session)
        if category is not None:
            if sql.get_cat(field, category):
                raise HTTPException(status_code=500, detail=f"{field} {category} ya existe")
        elif subcategory is not None:
            if sql.get_sub(field, subcategory):
                raise HTTPException(status_code=500, detail=f"{field} {subcategory} ya existe")
        elif doc is not None:
            if sql.get_doc(field, doc) and doc is not None:
                raise HTTPException(status_code=500, detail=f"{field} {doc} ya existe")

    @staticmethod
    def no_item(session: Session, category: str=None, subcategory: str=None, doc: str=None, field: str="name") -> None:
        sql = SQLCRUD(session)
        if category is not None:
            if sql.get_cat(field, category) is None:
                raise HTTPException(status_code=500, detail=f"{field} {category} no existe")
        elif subcategory is not None:
            if sql.get_sub(field, subcategory) is None:
                raise HTTPException(status_code=500, detail=f"{field} {subcategory} no existe")
        elif doc is not None:
            if sql.get_doc(field, doc) is None:
                raise HTTPException(status_code=500, detail=f"{field} {doc} no existe")
