import os

import jwt
from dotenv import load_dotenv
from fastapi import Depends, HTTPException, status
from fastapi.security import HTTPBearer, HTTPAuthorizationCredentials
from jwt import PyJWKClient

load_dotenv()

SUPABASE_JWKS_URL = os.getenv("SUPABASE_JWKS_URL")
if not SUPABASE_JWKS_URL:
    raise RuntimeError("SUPABASE_JWKS_URL is missing in environment variables")

bearer_scheme = HTTPBearer(auto_error=False)

jwk_client = PyJWKClient(SUPABASE_JWKS_URL)


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
        signing_key = jwk_client.get_signing_key_from_jwt(token)

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