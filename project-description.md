# Project Title: QuickShare

## On-liner

A secure, privacy-focused, self-destructing text sharing web application with multi-language and theme support.

## Description

This project is a full-stack web application for securely sharing snippets of text or code, similar to a private Pastebin but with a modern feature set.

- **Backend**: A FastAPI-based API receives text from the user, encrypts it using a secret key, and stores it in a database (PostgreSQL for production, SQLite for development). It generates a unique, unguessable URL for each snippet and enforces self-destruction based on user-defined expiration (time-based or view-based) and optional password protection.

- **Frontend**: A responsive, vanilla JavaScript Single-Page Application (SPA) provides a clean, modern user interface. Key frontend features include:
    - A simple editor for submitting text and configuring expiration options.
    - Internationalization (i18n) support for English and Chinese.
    - A theme switcher with Light, Dark, and System-preference modes.
    - Modular code structure for maintainability.

- **Deployment**: The project is ready for seamless deployment on platforms like Render, configured via a `render.yaml` file that defines the database, backend service, and static frontend site.

This project focuses on robust backend logic (data encryption, unique ID generation, self-destruction), secure API design, and a polished, user-friendly frontend experience.