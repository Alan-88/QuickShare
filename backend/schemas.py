from pydantic import BaseModel
from typing import Optional

# 用于创建粘贴的请求模型
class PasteCreateRequest(BaseModel):
    content: str
    expire_hours: int = 0  # 默认永不过期
    max_views: int = 0    # 默认不限次数
    password: Optional[str] = None  # 可选密码

# 用于创建粘贴的响应模型
class PasteCreateResponse(BaseModel):
    share_url: str
    unique_id: str
    expire_hours: int
    max_views: int
    has_password: bool

# 用于验证密码的请求模型
class PasteVerifyRequest(BaseModel):
    password: str

# 用于查看粘贴的响应模型
class PasteViewResponse(BaseModel):
    content: str
