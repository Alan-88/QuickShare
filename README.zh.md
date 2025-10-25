# QuickShare

一个安全的、注重隐私的、阅后即焚的文本共享网络应用程序，支持多语言和主题。类似于一个私有的 Pastebin。

![QuickShare Demo](https://i.imgur.com/your-demo-image.gif) <!-- 占位符：替换为新 UI 的 GIF 动图 -->

## 功能

- 🔐 **安全存储**：所有内容都使用 Fernet (AES-128-CBC) 进行静态加密。
- 🔥 **可配置的自毁**：设置在特定时间或特定查看次数后过期的粘贴。
- 🔑 **密码保护**：添加可选密码以增加额外的安全层。
- 🌐 **多语言**：在中英文界面之间切换。
- 🎨 **主题支持**：在浅色、深色或与系统主题同步之间选择。
- 🚀 **现代 SPA**：构建为快速响应的单页应用程序。
- 💨 **轻量级**：前端没有不必要的跟踪器、广告或外部库。
- ☁️ **部署就绪**：包含一个 `render.yaml`，可在 Render 上轻松一键部署。

## 技术栈

- **后端**：Python 3.11, FastAPI, SQLAlchemy, Uvicorn
- **数据库**：PostgreSQL (生产环境), SQLite (本地开发)
- **前端**：原生 JavaScript (ESM), HTML5, CSS3
- **依赖**：`psycopg2`, `python-dotenv`, `cryptography`

## 项目结构

```
QuickShare/
├── backend/               # 后端源代码
├── frontend/              # 前端源代码
│   ├── i18n.js            # 国际化模块
│   ├── theme.js           # 主题切换模块
│   ├── script.js          # 主要应用程序逻辑
│   ├── style.css          # 支持主题的样式表
│   └── index.html         # 单页 HTML 结构
├── .gitignore             # Git 忽略文件
├── render.yaml            # Render 的部署配置
├── README.md              # 本文件
└── ...
```

## 开始

### 先决条件

- Python 3.11+
- Node.js (用于前端，如果你希望使用像 `vite` 这样的工具进行开发)
- Git 客户端

### 1. 本地开发

**1. 克隆仓库：**
```bash
git clone <your-repo-url>
cd QuickShare
```

**2. 设置后端：**
```bash
cd backend

# 创建并激活虚拟环境
python -m venv .venv
source .venv/bin/activate  # 在 Windows 上: .venv\Scripts\activate

# 安装依赖
pip install -r requirements.txt

# 为环境变量创建 .env 文件
# 你可以使用以下命令生成一个密钥：python -c "from cryptography.fernet import Fernet; print(Fernet.generate_key().decode())"
```
在 `backend` 目录中创建一个名为 `.env` 的文件，内容如下：
```
SECRET_KEY=your-strong-generated-secret-key-here
```

**3. 运行应用程序：**

从 `backend` 目录启动后端服务器：
```bash
uvicorn main:app --reload
```
应用程序将在 `http://127.0.0.1:8000` 上可用。

### 2. 在 Render 上部署

该项目已预先配置，可在 Render 上无缝部署。

**1. 推送到 Git 仓库：**

提交所有文件并将它们推送到 GitHub 或 GitLab 上的新仓库。

**2. 在 Render 上创建蓝图服务：**

- 在您的 Render 仪表板中，单击 **New > Blueprint**。
- 选择您的仓库。
- Render 将自动检测并解析 `render.yaml` 文件。
- 它将创建三个服务：一个 PostgreSQL 数据库、一个 Python 后端服务和一个静态前端站点。

**3. 设置环境变量：**

- 服务创建后，转到 `quickshare-backend` 服务的 **Environment** 选项卡。
- 添加一个新的秘密变量：
    - **Key**: `SECRET_KEY`
    - **Value**: 粘贴一个安全生成的 Fernet 密钥。

Render 将自动构建和部署应用程序。公共 URL 将是 `quickshare-frontend` 服务的 URL。
