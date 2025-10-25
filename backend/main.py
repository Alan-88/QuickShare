from fastapi import FastAPI, HTTPException, Depends
from fastapi.middleware.cors import CORSMiddleware
from fastapi.staticfiles import StaticFiles
from sqlalchemy.orm import Session
from typing import Optional
import os

from database import engine, SessionLocal, Base
from models import Paste
from schemas import PasteCreateRequest, PasteCreateResponse, PasteViewResponse
from utils import encrypt_text, decrypt_text, generate_unique_id

# 创建数据库表
Base.metadata.create_all(bind=engine)

# 创建FastAPI应用
app = FastAPI(
    title="QuickShare API",
    description="阅后即焚文本分享服务",
    version="1.0.0"
)

# 配置CORS
app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:5173", "http://127.0.0.1:5173", "http://localhost:8000"],  # Vite开发服务器和生产环境
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# 数据库依赖
def get_db():
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()

# --- API Routes ---

@app.get("/api")
async def api_info():
    """API信息"""
    return {
        "message": "QuickShare API",
        "version": "1.0.0",
        "docs": "/docs"
    }

@app.post("/api/create", response_model=PasteCreateResponse)
async def create_paste(request: PasteCreateRequest, db: Session = Depends(get_db)):
    """
    创建新的文本分享
    """
    try:
        # ... (rest of the function is the same)
        if not request.content.strip():
            raise HTTPException(status_code=400, detail="内容不能为空")
        
        if request.expire_hours < 0:
            raise HTTPException(status_code=400, detail="过期时间不能为负数")
        
        if request.max_views < 0:
            raise HTTPException(status_code=400, detail="查看次数不能为负数")
        
        max_attempts = 10
        unique_id = None
        
        for _ in range(max_attempts):
            candidate_id = generate_unique_id()
            existing = db.query(Paste).filter(Paste.unique_id == candidate_id).first()
            if not existing:
                unique_id = candidate_id
                break
        
        if not unique_id:
            raise HTTPException(status_code=500, detail="无法生成唯一ID")
        
        encrypted_content = encrypt_text(request.content)
        
        paste = Paste(
            unique_id=unique_id,
            encrypted_content=encrypted_content,
            expire_hours=request.expire_hours,
            max_views=request.max_views,
            current_views=0
        )
        
        db.add(paste)
        db.commit()
        db.refresh(paste)
        
        base_url = os.getenv("BASE_URL", "http://localhost:8000")
        share_url = f"{base_url}/#view?id={unique_id}"
        
        return PasteCreateResponse(
            share_url=share_url,
            unique_id=unique_id,
            expire_hours=request.expire_hours,
            max_views=request.max_views,
            has_password=bool(request.password)
        )
        
    except HTTPException:
        raise
    except Exception as e:
        db.rollback()
        raise HTTPException(status_code=500, detail=f"创建分享失败: {str(e)}")

@app.get("/api/get/{unique_id}", response_model=PasteViewResponse)
async def get_paste(unique_id: str, db: Session = Depends(get_db)):
    """
    获取并销毁文本分享
    """
    try:
        paste = db.query(Paste).filter(Paste.unique_id == unique_id).first()
        
        if not paste:
            raise HTTPException(status_code=404, detail="链接不存在或已失效")
        
        from datetime import datetime, timedelta
        now = datetime.utcnow()
        
        if paste.expire_hours > 0:
            expire_time = paste.created_at + timedelta(hours=paste.expire_hours)
            if now > expire_time:
                db.delete(paste)
                db.commit()
                raise HTTPException(status_code=404, detail="链接已过期")
        
        if paste.max_views > 0 and paste.current_views >= paste.max_views:
            db.delete(paste)
            db.commit()
            raise HTTPException(status_code=404, detail="链接已达到查看次数限制")
        
        paste.current_views += 1
        
        if paste.max_views > 0 and paste.current_views >= paste.max_views:
            db.delete(paste)
        
        db.commit()
        
        content = decrypt_text(paste.encrypted_content)
        
        return PasteViewResponse(content=content)
        
    except HTTPException:
        raise
    except Exception as e:
        db.rollback()
        raise HTTPException(status_code=500, detail=f"获取内容失败: {str(e)}")

@app.get("/health")
async def health_check():
    """健康检查接口"""
    return {"status": "healthy"}


if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="0.0.0.0", port=8000)