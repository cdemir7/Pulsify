from typing import Any
from fastapi.responses import JSONResponse


def success(
    data: Any = None,
    message: str = "OK",
    meta: dict = None,
    status: int = 200,
) -> JSONResponse:
    body = {"success": True, "data": data, "message": message}
    if meta:
        body["meta"] = meta
    return JSONResponse(status_code=status, content=body)


def error(
    code: str,
    message: str,
    detail: str = None,
    status: int = 400,
) -> JSONResponse:
    body = {"success": False, "error": {"code": code, "message": message}}
    if detail:
        body["error"]["detail"] = detail
    return JSONResponse(status_code=status, content=body)
