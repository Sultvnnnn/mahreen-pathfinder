from datetime import datetime
from pydantic import BaseModel, ConfigDict


class ProgramResponse(BaseModel):
    model_config = ConfigDict(from_attributes=True)

    id: str
    title: str
    category: str
    description: str
    tags: list[str]
    cta_text: str
    cta_link: str
    created_at: datetime
