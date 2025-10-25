from sqlalchemy import create_engine, Column, Integer, String, Text, DateTime
from sqlalchemy.ext.declarative import declarative_base
from sqlalchemy.orm import sessionmaker
from datetime import datetime
import os

# 数据库配置
# 优先从环境变量获取 DATABASE_URL，如果没有则回退到本地的 SQLite 数据库
DATABASE_URL = os.getenv("DATABASE_URL", "sqlite:///./quickshare.db")

# 根据是 SQLite 还是其他数据库（如 PostgreSQL）来设置参数
engine_args = {}
if DATABASE_URL.startswith("sqlite"):
    engine_args["connect_args"] = {"check_same_thread": False}

# 创建数据库引擎
engine = create_engine(DATABASE_URL, **engine_args)

# 创建会话工厂
SessionLocal = sessionmaker(autocommit=False, autoflush=False, bind=engine)

# 创建基础模型类
Base = declarative_base()
