from fastapi import Request, HTTPException
from fastapi.exceptions import RequestValidationError, ResponseValidationError
from starlette.exceptions import HTTPException as StarletteHTTPException
from fastapi.responses import JSONResponse, Response
import fastapi


def register_exception_handlers(app: fastapi.FastAPI) -> None:
    @app.exception_handler(StarletteHTTPException)
    async def http_exception_handler(request: Request, exc: StarletteHTTPException) -> Response:
        return JSONResponse(status_code=exc.status_code, content={
            "status": "error",
            "message": exc.detail,
            "code": exc.status_code
        })

    @app.exception_handler(RequestValidationError)
    async def request_validation_exception_handler(request: Request, exc: RequestValidationError) -> Response:
        return JSONResponse(status_code=422, content={
            "status": "error",
            "message": f"Campos faltantes o mal enviados: {exc.args[0][0]["msg"]}",
            "code": 422
        })
