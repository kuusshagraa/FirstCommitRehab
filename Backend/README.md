# Rehab AI Backend

Standalone Node.js API service for the Rehab AI React frontend. This is Part 1 of the backend build: service foundation, Firebase Admin setup, local emulator configuration, and a health endpoint. Part 2 adds verified-user profile routes and controlled doctor-role provisioning.

## Requirements

- Node.js 20 or newer
- A Firebase project for connected cloud development, or the Firebase Local Emulator Suite for local development

## Local setup

```sh
npm install
Copy-Item .env.example .env
```

The starter `.env` points at the local Auth and Firestore emulators with the demo project ID `demo-rehab-ai`. Start the emulators in a second terminal from this directory:

```sh
npx firebase-tools emulators:start --only auth,firestore --project demo-rehab-ai
```

Then run the API:

```sh
npm run dev
```

Check `http://localhost:3000/health`. The endpoint returns `firebaseConfigured: true` when a project ID and emulator or server credentials are available.

For a cloud Firebase project, set `FIREBASE_PROJECT_ID`, remove both emulator host values, and configure Application Default Credentials. For local service-account development, set `GOOGLE_APPLICATION_CREDENTIALS` to a key file stored outside this repository. Never commit service-account keys.

## API foundation

- `GET /health` reports service status and whether Firebase Admin is configured.
- `GET /api/v1/me` verifies a Firebase ID token and returns the caller's profile. First access creates a patient profile by default.
- `PATCH /api/v1/me` updates the caller's display name; role and UID are never accepted from the request body.
- CORS allows only the origins listed in `CORS_ORIGINS` (comma-separated); by default it allows the Vite development origin.
- Helmet sets standard HTTP security headers, and JSON request bodies are limited to 32 KB.
- Firestore client access is denied by the starter rules. The Admin SDK uses server credentials and does not rely on Firestore client rules; future API routes must verify Firebase ID tokens and enforce patient/doctor permissions themselves.
- Doctor accounts must be explicitly provisioned by an operator with Admin SDK credentials: `npm run set:doctor -- <firebase-auth-uid>`. The user must sign in again to refresh the role claim.

## Planned data groups

The later API parts will define and validate documents for user roles, patient/doctor relationships, exercise assignments, feedback, workout sessions, and evaluation results. This foundation intentionally exposes no patient-data routes yet.
