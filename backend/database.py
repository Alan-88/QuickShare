from sqlalchemy import create_engine
from sqlalchemy.ext.declarative import declarative_base
from sqlalchemy.orm import sessionmaker
import os

# Render 的持久化磁盘挂载在 /var/data
# 我们将数据库文件放在该目录下
RENDER_DISK_PATH = "/var/data/quickshare.db"
LOCAL_DB_PATH = "sqlite:///./quickshare.db"

# 检查是否在 Render 环境中 (通过检查 /var/data 目录是否存在)
if os.path.exists("/var/data"):
    SQLALCHEMY_DATABASE_URL = f"sqlite:///{RENDER_DISK_PATH}"
    print(f"在 Render 环境中运行, 使用持久化磁盘数据库: {RENDER_DISK_PATH}")
else:
    SQLALCHEMY_DATABASE_URL = LOCAL_DB_PATH
    print(f"在本地环境运行, 使用本地数据库: {LOCAL_DB_PATH}")

# 创建数据库引擎
# SQLite 需要 check_same_thread=False
engine = create_engine(
    SQLALCHEMY_DATABASE_URL, connect_args={"check_same_thread": False}
)

# 创建会话工厂
SessionLocal = sessionmaker(autocommit=False, autoflush=False, bind=engine)

# 创建基础模型类
Base = declarative_base()
