import os

import jwt
from dotenv import load_dotenv
from fastapi import Depends, HTTPException, status
from fastapi.security import HTTPBearer, HTTPAuthorizationCredentials
from jwt import PyJWKClient

load_dotenv()

bearer_scheme = HTTPBearer(auto_error=False)
_jwk_client: PyJWKClient | None = None


def get_jwk_client() -> PyJWKClient:
    global _jwk_client
    if _jwk_client is None:
        supabase_jwks_url = os.getenv("SUPABASE_JWKS_URL")
        if not supabase_jwks_url:
            raise RuntimeError("SUPABASE_JWKS_URL is missing in environment variables")
        _jwk_client = PyJWKClient(supabase_jwks_url)
    return _jwk_client


def get_current_user(
    credentials: HTTPAuthorizationCredentials | None = Depends(bearer_scheme),
):
    if credentials is None:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Token tidak ditemukan",
        )

    token = credentials.credentials

    try:
        signing_key = get_jwk_client().get_signing_key_from_jwt(token)

        payload = jwt.decode(
            token,
            signing_key.key,
            algorithms=["ES256"],
            audience="authenticated",
        )
    except jwt.InvalidTokenError as error:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail=f"Token tidak valid: {str(error)}",
        )

    return {
        "id": payload.get("sub"),
        "email": payload.get("email"),
    }