"""
数据库初始化脚本
运行此脚本来创建数据库表
"""
from database import engine, Base

def init_database():
    """初始化数据库，创建所有表"""
    print("正在创建数据库表...")
    Base.metadata.create_all(bind=engine)
    print("数据库表创建完成！")

if __name__ == "__main__":
    init_database()
