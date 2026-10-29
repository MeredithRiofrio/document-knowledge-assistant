from typing import Callable, Awaitable

from fastapi import Request, status, FastAPI
from fastapi.responses import JSONResponse, Response

MAX_CONTENT_LENGTH = 5 * 1024 * 1024

async def limit_payload(request: Request, call_next: Callable[[Request], Awaitable[Response]]) -> Response:
    if cl := request.headers.get("content-length"):
        if int(cl) > MAX_CONTENT_LENGTH:
            return JSONResponse(
                status_code=status.HTTP_413_REQUEST_ENTITY_TOO_LARGE,
                content={"error": "El archivo es demasiado grande. Máximo permitido: 5MB"},
            )
    return await call_next(request)

def register_middlewares(app: FastAPI) -> None:
    app.middleware("http")(limit_payload)