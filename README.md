# QuickShare

This project is a full-stack web application for securely sharing snippets of text or code, similar to a private Pastebin but with a modern feature set.

- **Backend**: A FastAPI-based API receives text from the user, encrypts it using a secret key, and stores it in a database (PostgreSQL for production, SQLite for development). It generates a unique, unguessable URL for each snippet and enforces self-destruction based on user-defined expiration (time-based or view-based) and optional password protection.

- **Frontend**: A responsive, vanilla JavaScript Single-Page Application (SPA) provides a clean, modern user interface. Key frontend features include a simple editor for submitting text and configuring expiration options, internationalization (i18n) support for English and Chinese, and a theme switcher with Light, Dark, and System-preference modes.

- **Deployment**: The project is ready for seamless deployment on platforms like Render, configured via a `render.yaml` file that defines the database, backend service, and static frontend site.

## Features

- 🔐 **Secure Storage**: All content is encrypted at rest using Fernet (AES-128-CBC).
- 🔥 **Configurable Self-Destruction**: Set pastes to expire after a certain time or a specific number of views.
- 🔑 **Password Protection**: Add an optional password for an extra layer of security.
- 🌐 **Multi-Language**: Switch between English and Chinese interfaces.
- 🎨 **Theme Support**: Choose between Light, Dark, or sync with your System theme.
- 🚀 **Modern SPA**: Built as a fast and responsive Single-Page Application.
- 💨 **Lightweight**: No unnecessary trackers, ads, or external libraries on the frontend.
- ☁️ **Deployment Ready**: Includes a `render.yaml` for easy, one-click deployment on Render.

## Tech Stack

- **Backend**: Python 3.11, FastAPI, SQLAlchemy, Uvicorn
- **Database**: PostgreSQL (for production), SQLite (for local development)
- **Frontend**: Vanilla JavaScript (ESM), HTML5, CSS3
- **Dependencies**: `psycopg2`, `python-dotenv`, `cryptography`

## Project Structure

```
QuickShare/
├── backend/               # Backend source code
├── frontend/              # Frontend source code
│   ├── i18n.js            # Internationalization module
│   ├── theme.js           # Theme switching module
│   ├── script.js          # Main application logic
│   ├── style.css          # Stylesheet with theme support
│   └── index.html         # Single-page HTML structure
├── .gitignore             # Git ignore file
├── render.yaml            # Deployment configuration for Render
├── README.md              # This file
└── ...
```

## Getting Started

### Prerequisites

- Python 3.11+
- Node.js (for frontend, if you wish to use tools like `vite` for development)
- A Git client

### 1. Local Development

**1. Clone the repository:**
```bash
git clone <your-repo-url>
cd QuickShare
```

**2. Set up the Backend:**
```bash
cd backend

# Create and activate a virtual environment
python -m venv .venv
source .venv/bin/activate  # On Windows: .venv\Scripts\activate

# Install dependencies
pip install -r requirements.txt

# Create a .env file for environment variables
# You can generate a key with: python -c "from cryptography.fernet import Fernet; print(Fernet.generate_key().decode())"
```
Create a file named `.env` inside the `backend` directory with the following content:
```
SECRET_KEY=your-strong-generated-secret-key-here
```

**3. Run the application:**

Start the backend server from the `backend` directory:
```bash
uvicorn main:app --reload
```
The application will be available at `http://127.0.0.1:8000`.

### 2. Deployment on Render

This project is pre-configured for a seamless deployment on Render.

**1. Push to a Git Repository:**

Commit all files and push them to a new repository on GitHub or GitLab.

**2. Create a Blueprint Service on Render:**

- In your Render dashboard, click **New > Blueprint**.
- Select your repository.
- Render will automatically detect and parse the `render.yaml` file.
- It will create three services: a PostgreSQL database, a Python backend service, and a static frontend site.

**3. Set Environment Variables:**

- After the service is created, go to the **Environment** tab for the `quickshare-backend` service.
- Add a new secret variable:
    - **Key**: `SECRET_KEY`
    - **Value**: Paste a securely generated Fernet key.

Render will automatically build and deploy the application. The public URL will be the one for the `quickshare-frontend` service.