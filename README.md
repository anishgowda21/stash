# Stash

A minimal personal file upload and storage service.

> **Note:** This project is built for personal use. If you'd like to run or self-host your own instance, you can set it up by configuring your own environment variables based on `.env.example`.

## Getting Started

### 1. Install Dependencies

```bash
bun install
```

### 2. Environment Setup

Copy `.env.example` to `.env` and fill in the values:

```bash
cp .env.example .env
```

- `UPLOADTHING_TOKEN`: UploadThing API token for file storage.
- `UPLOADTHING_LOG_LEVEL`: Log level (e.g. `Warning`).
- `TURSO_DATABASE_URL`: Turso / libSQL database URL.
- `TURSO_AUTH_TOKEN`: Turso database authentication token.
- `BETTER_AUTH_SECRET`: Secret key used by Better Auth.
- `BETTER_AUTH_URL`: Base URL of the app (e.g. `http://localhost:3000`).
- `DISABLE_SIGNUP`: Set to `true` to block new user registrations after initial setup.

### 3. Database Migration

Run database migrations:

```bash
bunx drizzle-kit migrate
```

### 4. Run Development Server

```bash
bun dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser.
