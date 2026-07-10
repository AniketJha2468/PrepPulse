# PrepPulse Backend

Backend service for **PrepPulse** — an AI-powered Interview Preparation Platform.

This README documents **Phase 1: Backend Initialization** only. Authentication, AI
integration, and core business logic will be introduced in later phases.

## Tech Stack

- **Runtime:** Node.js
- **Framework:** Express
- **Database:** MongoDB Atlas (via Mongoose)
- **Auth (planned):** JWT, Passport, Google OAuth, GitHub OAuth
- **Security:** Helmet, CORS, Cookie Parser
- **Logging:** Morgan
- **Performance:** Compression
- **File uploads (planned):** Multer, Cloudinary
- **Email (planned):** Nodemailer
- **Validation (planned):** Express Validator
- **AI Provider (planned):** Google Gemini

## Folder Structure

```
Backend/
├── src/
│   ├── config/
│   │   ├── db.js            # MongoDB connection logic
│   │   └── env.js           # Centralized environment variable loader
│   ├── controllers/
│   │   └── health.controller.js
│   ├── middlewares/
│   │   ├── errorHandler.js   # Centralized error handler
│   │   └── notFound.js       # 404 handler
│   ├── models/                # Mongoose models (added in later phases)
│   ├── routes/
│   │   ├── health.routes.js
│   │   └── index.js          # Aggregates all API routes
│   ├── services/              # Business logic layer (added in later phases)
│   ├── utils/
│   │   ├── ApiError.js
│   │   └── ApiResponse.js
│   └── app.js                 # Express app configuration
├── server.js                  # Application entry point
├── package.json
├── .env
├── .env.example
├── .gitignore
└── README.md
```

## Architecture

The backend follows an **MVC + Service layer** architecture:

- **Routes** define API endpoints and delegate to controllers.
- **Controllers** handle HTTP request/response concerns only.
- **Services** (added in later phases) will contain business logic, keeping
  controllers thin.
- **Models** (added in later phases) will define Mongoose schemas.
- **Middlewares** handle cross-cutting concerns (errors, auth, validation).
- **Config** centralizes environment variables and external service setup.
- **Utils** contains reusable helpers (`ApiError`, `ApiResponse`).

## Getting Started

### 1. Install dependencies

```bash
cd Backend
npm install
```

### 2. Configure environment variables

Copy `.env.example` to `.env` and fill in the required values:

```bash
cp .env.example .env
```

At minimum, set `MONGODB_URI` to a valid MongoDB Atlas connection string.

### 3. Run the server

Development (with auto-reload):

```bash
npm run dev
```

Production:

```bash
npm start
```

The server starts on the port defined in `.env` (default: `5000`).

## API Endpoints (Phase 1)

### Health Check

```
GET /api/health
```

**Response:**

```json
{
  "success": true,
  "message": "PrepPulse Backend Running"
}
```

## Middleware Stack

Configured in `src/app.js`, applied in order:

1. `helmet` — secure HTTP headers
2. `cors` — cross-origin access restricted to `CLIENT_URL`
3. `morgan` — request logging (`dev` in development, `combined` in production)
4. `compression` — gzip response compression
5. `express.json` / `express.urlencoded` — body parsing
6. `cookie-parser` — cookie parsing
7. API routes (`/api`)
8. `notFound` — 404 handler for unmatched routes
9. `errorHandler` — centralized error handler

## Scope of This Phase

This phase covers backend initialization only:

- Express server setup
- MongoDB connection configuration
- Core security and utility middleware
- Centralized error handling and 404 handling
- A single health check endpoint

Authentication, AI-powered features, and all business logic are explicitly
out of scope and will be implemented in subsequent phases.
