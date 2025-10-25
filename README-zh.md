# QuickShare

[English Readme (README.md)](README.md)

本项目是一个用于安全共享文本或代码片段的全栈 Web 应用程序，类似于私有的 Pastebin，但具有更现代化的功能集。

- **后端**: 一个基于 FastAPI 的 API，它同时负责提供 REST API 接口和托管静态前端应用。它接收用户文本，使用密钥加密并存储在数据库中（生产环境使用 PostgreSQL，开发环境使用 SQLite）。它为每个片段生成唯一的、不可预测的 URL，并根据用户定义的过期设置（基于时间或查看次数）和可选的密码保护来强制执行自毁。

- **前端**: 一个响应式的原生 JavaScript 单页应用（SPA），提供简洁、现代的用户界面。主要前端功能包括：一个用于提交文本和配置过期选项的简单编辑器，对英语和中文的国际化（i18n）支持，以及一个包含浅色、深色和跟随系统偏好模式的主题切换器。

## 功能

- 🔐 **安全存储**：所有内容都使用 Fernet (AES-128-CBC) 进行静态加密。
- 🔥 **可配置的自毁**：设置在特定时间或特定查看次数后过期的粘贴。
- 🔑 **密码保护**：添加可选密码以增加额外的安全层。
- 🌐 **多语言**：在中英文界面之间切换。
- 🎨 **主题支持**：在浅色、深色或与系统主题同步之间选择。
- 🚀 **现代 SPA**：构建为快速响应的单页应用程序。
- 💨 **轻量级**：前端没有不必要的跟踪器、广告或外部库。
- ☁️ **部署就绪**：已配置为在 Render 上作为单个服务进行简单部署。

## 技术栈

- **后端**：Python 3.11, FastAPI, SQLAlchemy, Uvicorn
- **数据库**：PostgreSQL (生产环境, 如 Neon), SQLite (本地开发)
- **前端**：原生 JavaScript (ESM), HTML5, CSS3
- **依赖**：`psycopg2-binary`, `python-dotenv`, `cryptography`

## 项目结构

```

QuickShare/

├── backend/ # 后端源代码

│ ├── database.py # (数据库配置, 支持 Neon/SQLite)

│ ├── main.py # (FastAPI 应用: API + SPA 服务)

│ ├── models.py # (SQLAlchemy 模型)

│ ├── schemas.py # (Pydantic 模型)

│ ├── utils.py # (加密逻辑)

│ ├── requirements.txt # (Python 依赖)

│ └── .env.example # (环境变量模板)

├── frontend/ # 前端源代码

│ ├── index.html # (单页 HTML)

│ ├── script.js # (主要应用逻辑)

│ ├── style.css # (样式表, 支持主题)

│ ├── i18n.js # (国际化模块)

│ └── theme.js # (主题切换模块)

├── .gitignore # Git 忽略文件

└── README.md # 本文件

```

## 开始

### 先决条件

- Python 3.11+
- Git 客户端
- (可选) 一个云 PostgreSQL 数据库（如 [Neon](https://neon.tech/)）用于部署。

### 1. 本地开发

**1. 克隆仓库：**
```bash
git clone <your-repo-url>
cd QuickShare
```

**2. 设置后端：**

Bash

```
# 进入后端目录
cd backend

# 创建并激活虚拟环境
python -m venv .venv
source .venv/bin/activate  # 在 Windows 上: .venv\Scripts\activate

# 安装依赖
pip install -r requirements.txt
```

3. 配置环境：

在 backend 目录中创建一个名为 .env 的文件。

- 选项A (推荐 - 使用 SQLite):
    
    你只需要提供 SECRET_KEY。应用将自动回退到本地的 quickshare.db 文件。
    
    代码段
    
    ```
    SECRET_KEY=your-strong-generated-secret-key-here
    ```
    
- 选项B (本地连接 Neon 测试):
    
    从你的 Neon 项目中复制数据库连接字符串。
    
    代码段
    
    ```
    SECRET_KEY=your-strong-generated-secret-key-here
    DATABASE_URL=postgresql://user:password@host.neon.tech/dbname?sslmode=require
    ```
    

4. 运行应用程序：

从 backend 目录启动后端服务器：

Bash

```
uvicorn main:app --reload
```

现在，整个应用（前端和后端）都运行在 `http://127.0.0.1:8000`。

### 2. 在 Render 上部署 (使用 Neon 数据库)

本项目已配置为在 Render 上进行简单的统一化部署。

1. 推送到 Git 仓库：

提交所有文件（backend/, frontend/ 等）并推送到 GitHub 或 GitLab 上的新仓库。

2. 获取数据库 URL：

访问 Neon，创建项目并复制 PostgreSQL 连接 URL。

**3. 在 Render 上创建 Web 服务：**

- 在 Render 仪表板中, 点击 **New > Web Service**。
    
- 选择你的仓库。
    
- 配置服务：
    
    - **Name:** `quickshare` (或任意名称)
        
    - **Root Directory:** `backend` (非常重要)
        
    - **Environment:** `Python 3`
        
    - **Build Command:** `pip install -r requirements.txt`
        
    - **Start Command:** `uvicorn main:app --host 0.0.0.0 --port $PORT`
        

**4. 设置环境变量：**

- 转到新服务的 **Environment** 选项卡。
    
- 添加两个 **Secret Variables** (秘密变量):
    
    1. Key: DATABASE_URL
        
        Value: (粘贴你的 Neon 数据库完整连接 URL)
        
    2. Key: SECRET_KEY
        
        Value: (粘贴一个新生成的、安全的 Fernet 密钥)
        

5. 部署：

点击 Create Web Service。Render 将构建并启动你的应用。公共 URL 将自动加载你的前端 SPA，并且它能正确调用同域下的 API。