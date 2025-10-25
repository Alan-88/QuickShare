# QuickShare

[中文文档 (README-zh.md)](README-zh.md)

This project is a full-stack web application for securely sharing snippets of text or code, similar to a private Pastebin but with a modern feature set.

- **Backend**: A FastAPI-based API serves both the REST API endpoints and the static frontend application. It receives text, encrypts it using a secret key, and stores it in a database (PostgreSQL for production, SQLite for development). It generates a unique, unguessable URL for each snippet and enforces self-destruction based on user-defined expiration (time-based or view-based) and optional password protection.

- **Frontend**: A responsive, vanilla JavaScript Single-Page Application (SPA) provides a clean, modern user interface. Key frontend features include a simple editor for submitting text and configuring expiration options, internationalization (i18n) support for English and Chinese, and a theme switcher with Light, Dark, and System-preference modes.

## Features

- 🔐 **Secure Storage**: All content is encrypted at rest using Fernet (AES-128-CBC).
- 🔥 **Configurable Self-Destruction**: Set pastes to expire after a certain time or a specific number of views.
- 🔑 **Password Protection**: Add an optional password for an extra layer of security.
- 🌐 **Multi-Language**: Switch between English and Chinese interfaces.
- 🎨 **Theme Support**: Choose between Light, Dark, or sync with your System theme.
- 🚀 **Modern SPA**: Built as a fast and responsive Single-Page Application.
- 💨 **Lightweight**: No unnecessary trackers, ads, or external libraries on the frontend.
- ☁️ **Deployment Ready**: Configured for simple deployment on Render as a single service.

## Tech Stack

- **Backend**: Python 3.11, FastAPI, SQLAlchemy, Uvicorn
- **Database**: PostgreSQL (for production, e.g., via Neon), SQLite (for local development)
- **Frontend**: Vanilla JavaScript (ESM), HTML5, CSS3
- **Dependencies**: `psycopg2-binary`, `python-dotenv`, `cryptography`

## Project Structure

```

QuickShare/

├── backend/ # Backend source code

│ ├── database.py # (Database config, supports Neon/SQLite)

│ ├── main.py # (FastAPI app: API + SPA serving)

│ ├── models.py # (SQLAlchemy models)

│ ├── schemas.py # (Pydantic models)

│ ├── utils.py # (Encryption logic)

│ ├── requirements.txt # (Python dependencies)

│ └── .env.example # (Environment variable template)

├── frontend/ # Frontend source code

│ ├── index.html # (The single HTML page)

│ ├── script.js # (Main application logic)

│ ├── style.css # (Stylesheet with theme support)

│ ├── i18n.js # (Internationalization module)

│ └── theme.js # (Theme switching module)

├── .gitignore # Git ignore file

└── README.md # This file

```

## Getting Started

### Prerequisites

- Python 3.11+
- A Git client
- (Optional) An account with a cloud PostgreSQL provider like [Neon](https://neon.tech/) for deployment.

### 1. Local Development

**1. Clone the repository:**
```bash
git clone <your-repo-url>
cd QuickShare
```

**2. Set up the Backend:**

Bash

```
# Navigate to the backend directory
cd backend

# Create and activate a virtual environment
python -m venv .venv
source .venv/bin/activate  # On Windows: .venv\Scripts\activate

# Install dependencies
pip install -r requirements.txt
```

3. Configure Environment:

Create a file named .env inside the backend directory.

- Option A (Recommended - Use SQLite):
    
    You only need to provide a SECRET_KEY. The app will automatically fall back to a local quickshare.db file.
    
    代码段
    
    ```
    SECRET_KEY=your-strong-generated-secret-key-here
    ```
    
- Option B (Use Neon for local testing):
    
    Copy your database connection string from Neon.
    
    代码段
    
    ```
    SECRET_KEY=your-strong-generated-secret-key-here
    DATABASE_URL=postgresql://user:password@host.neon.tech/dbname?sslmode=require
    ```
    

4. Run the application:

Start the backend server from the backend directory:

Bash

```
uvicorn main:app --reload
```

The application (both frontend and backend) is now available at `http://127.0.0.1:8000`.

### 2. Deployment on Render (with Neon DB)

This project is configured for a simple, unified deployment on Render.

1. Push to a Git Repository:

Commit all files (backend/, frontend/, etc.) and push them to a new repository on GitHub or GitLab.

2. Get Database URL:

Go to your Neon project and copy the PostgreSQL connection URL.

**3. Create a Web Service on Render:**

- In your Render dashboard, click **New > Web Service**.
    
- Select your repository.
    
- Configure the service settings:
    
    - **Name:** `quickshare` (or as you like)
        
    - **Root Directory:** `backend` (This is crucial)
        
    - **Environment:** `Python 3`
        
    - **Build Command:** `pip install -r requirements.txt`
        
    - **Start Command:** `uvicorn main:app --host 0.0.0.0 --port $PORT`
        

**4. Set Environment Variables:**

- Go to the **Environment** tab for your new service.
    
- Add two **Secret Variables**:
    
    1. Key: DATABASE_URL
        
        Value: (Paste your full Neon database connection URL)
        
    2. Key: SECRET_KEY
        
        Value: (Paste a new, securely generated Fernet key)
        

5. Deploy:

Click Create Web Service. Render will build and launch your application. The public URL will serve your frontend SPA, which will correctly call the API on the same domain.