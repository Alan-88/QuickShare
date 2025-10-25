# QuickShare - 阅后即焚文本分享

这是一个使用 FastAPI (后端) 和原生 JavaScript (前端) 构建的全栈 Web 应用。

它被设计为**单个统一的服务**：FastAPI 后端不仅提供 `/api` 接口，还负责托管前端 SPA 静态文件。

## 技术栈

- **后端**: Python 3.11, FastAPI, SQLAlchemy
- **数据库**: PostgreSQL (生产环境, via Neon) / SQLite (本地开发)
- **前端**: 原生 JavaScript (ESM), HTML5, CSS3

## 项目结构

```

QuickShare/

├── backend/

│ ├── .env.example # (本地开发环境变量示例)

│ ├── main.py # (FastAPI 应用, API 路由 + 静态文件服务)

│ ├── database.py # (数据库配置, 支持本地和 Neon)

│ ├── models.py # (SQLAlchemy 模型)

│ ├── schemas.py # (Pydantic 模型)

│ ├── utils.py # (加密工具)

│ └── requirements.txt

└── frontend/

├── index.html # (SPA 入口)

├── style.css # (样式)

├── script.js # (主逻辑)

└── ...

```

## 1. 本地开发运行

**1. 设置后端:**
```bash
# 进入后端目录
cd backend

# (推荐) 创建并激活虚拟环境
python -m venv .venv
source .venv/bin/activate  # macOS/Linux
# .venv\Scripts\activate   # Windows

# 安装依赖
pip install -r requirements.txt
```

2. 设置环境变量:

在 backend/ 目录下创建一个 .env 文件。

- 选项A (推荐, 使用本地 SQLite):
    
    你只需要设置 SECRET_KEY。database.py 会自动回退到本地 quickshare.db 文件。
    
    代码段
    
    ```
    SECRET_KEY="a-very-secret-key-for-local-dev"
    ```
    
- 选项B (连接 Neon 进行本地测试):
    
    从你的 Neon 项目获取连接字符串。
    
    代码段
    
    ```
    # 替换为你的 Neon 数据库连接 URL
    DATABASE_URL="postgresql://user:password@host.neon.tech/dbname?sslmode=require"
    SECRET_KEY="a-very-secret-key-for-local-dev"
    ```
    

**3. 运行项目:**

Bash

```
# 在 backend/ 目录下运行
uvicorn main:app --reload --port 8000
```

应用现在运行在 `http://127.0.0.1:8000`。

## 2. 在 Render 上部署 (统一服务 + Neon 数据库)

**目标：** 部署为 _1个_ Web 服务 (用于 FastAPI)。数据库由 Neon **外部**提供。

**1. 准备工作：**

- **GitHub:** 确保你所有的代码（`backend/` 和 `frontend/` 目录）都在一个 GitHub 仓库中。
    
- **Neon:** 注册 Neon，创建一个新项目，获取数据库连接 URL (PostgreSQL URL)。
    

**2. 在 Render 创建新服务:**

- 在 Render 仪表板, 点击 **New > Web Service**。
    
- 连接你的 GitHub 仓库。
    

**3. 配置 Web Service:**

- **Name:** `quickshare` (或你喜欢的)
    
- **Root Directory:** `backend` (重要！因为 `main.py` 和 `requirements.txt` 在这里)
    
- **Environment:** `Python 3`
    
- **Build Command:** `pip install -r requirements.txt`
    
- **Start Command:** `uvicorn main:app --host 0.0.0.0 --port $PORT`
    

**4. 添加环境变量 (最关键的一步):**

- 在 "Environment" 标签页，添加 **Secret Variables**：
    
- Key 1: DATABASE_URL
    
    Value 1: (粘贴你从 Neon 获取的完整数据库连接 URL)
    
- Key 2: SECRET_KEY
    
    Value 2: (粘贴一个新生成的、强壮的 Fernet 密钥)
    

**5. 创建服务:**

- 点击 "Create Web Service"。
    
- Render 将会构建并启动你的 FastAPI 服务。`database.py` 中的逻辑会读取 `DATABASE_URL` 环境变量并连接到你的 Neon 数据库。
    

**6. 访问：**

- 使用 Render 提供的 `...onrender.com` URL 访问你的应用。
