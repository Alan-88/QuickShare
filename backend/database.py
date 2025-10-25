import os
from sqlalchemy import create_engine
from sqlalchemy.ext.declarative import declarative_base
from sqlalchemy.orm import sessionmaker
from dotenv import load_dotenv

# 加载 .env 文件 (会加载 backend/.env)
# 这样我们在本地开发时也能读取 DATABASE_URL
load_dotenv()

# 1. 从环境变量中获取 DATABASE_URL
#    在 Render 上, 我们会手动设置这个变量
# 2. 如果没有设置 (例如本地开发), 则回退到本地 SQLite
DATABASE_URL = os.getenv("DATABASE_URL", "sqlite:///./quickshare.db")

# 修复 Neon/Heroku 的 'postgres://' URL
# SQLAlchemy 期望 'postgresql://'
if DATABASE_URL.startswith("postgres://"):
    DATABASE_URL = DATABASE_URL.replace("postgres://", "postgresql://", 1)

# 根据是 SQLite 还是 PostgreSQL 来设置 engine_args
engine_args = {}
if DATABASE_URL.startswith("sqlite"):
    # 仅 SQLite 需要这个参数
    engine_args["connect_args"] = {"check_same_thread": False}
    print("使用本地 SQLite 数据库")
else:
    # 生产环境 (PostgreSQL)
    print(f"连接到远程 PostgreSQL 数据库...")

# 创建数据库引擎
engine = create_engine(DATABASE_URL, **engine_args)

# 创建会话工厂
SessionLocal = sessionmaker(autocommit=False, autoflush=False, bind=engine)

# 创建基础模型类
Base = declarative_base()
