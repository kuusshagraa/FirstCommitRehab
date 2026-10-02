# Rehab AI API contract

Base path: `/api/v1`. All routes except `GET /health` require a Firebase ID token in `Authorization: Bearer <id-token>` unless noted. JSON errors use `{ "error": { "code": "...", "message": "..." } }`.

## Current routes

| Method | Path | Access | Purpose |
| --- | --- | --- | --- |
| GET | `/health` | Public | API and Firebase configuration status |
| GET | `/api/v1/me` | Signed in | Read or initialize own profile |
| PATCH | `/api/v1/me` | Signed in | Update own display name |
| GET | `/api/v1/exercises` | Signed in | Read the supported movement catalog |
| GET | `/api/v1/patients` | Doctor | List linked patient profiles |
| GET | `/api/v1/patients/:patientUid` | Self or linked doctor | Read a basic patient profile |
| GET | `/api/v1/patients/:patientUid/assignments` | Self or linked doctor | Read exercise assignments |
| PUT | `/api/v1/patients/:patientUid/assignments` | Linked doctor | Replace assigned exercise IDs |
| GET | `/api/v1/patients/:patientUid/feedback` | Self or linked doctor | Read recent feedback |
| POST | `/api/v1/patients/:patientUid/feedback` | Linked doctor | Add feedback |
| POST | `/api/v1/patients/:patientUid/sessions` | Patient self | Save completed exercise and duration |
| GET | `/api/v1/patients/:patientUid/sessions` | Self or linked doctor | List up to 50 recent sessions |
| GET | `/api/v1/patients/:patientUid/sessions/:sessionId` | Self or linked doctor | Read one session |
| POST | `/api/v1/patients/:patientUid/sessions/:sessionId/evaluation` | Patient self | Send pose features to a configured model service |

### Assignment request

`PUT /api/v1/patients/:patientUid/assignments`

```json
{ "exerciseIds": ["arm-rotation", "squat", "body-twist"] }
```

IDs must be unique and belong to the catalog returned by `/api/v1/exercises`.

### Feedback request

`POST /api/v1/patients/:patientUid/feedback`

```json
{ "message": "Please follow the exercise plan from your care team." }
```

Messages are limited to 1,000 characters.

### Session request

`POST /api/v1/patients/:patientUid/sessions`

```json
{ "exerciseId": "squat", "durationSeconds": 95 }
```

Duration must be an integer from 1 to 7,200 seconds. The server supplies completion timestamps; a client cannot submit its own score.

### Inference service contract

The supported exercise catalog contains the six REHAB24-6 classes: arm abduction (`Ex1`), arm V-to-W (`Ex2`), table push-up (`Ex3`), leg abduction (`Ex4`), leg lunge (`Ex5`), and squat (`Ex6`).

The patient evaluation route accepts `jointSequence` as 2–32 frames, each containing 26 `[x, y]` pairs normalized to the 0–1 camera frame. The backend sends `{ sessionId, exerciseLabel, jointSequence, samplingHz }` to the configured model service and expects `{ classLabel, className, confidence, dataset?, modelVersion? }`. Labels must be one of `Ex1` through `Ex6`, and confidence must be a number from 0 to 1. The route stores the predicted exercise label, display name, confidence, dataset, and model version; it does not score exercise form or correctness. If `AI_EVALUATION_URL` is absent, the API returns `503 AI_SERVICE_NOT_CONFIGURED`.

The browser extracts landmarks on-device with MediaPipe. It sends one sampled pose sequence (not camera frames or video) to the authenticated backend; the backend stores only the resulting classification. The model endpoint accepts 26-joint REHAB24-6 skeletons, so a submitted sequence is an integration baseline and may not classify MediaPipe camera poses as well as its held-out dataset evaluation suggests.

## Role and relationship setup

Newly authenticated users default to patient. Doctor access comes from a server-set Firebase custom claim. Use `npm run set:doctor -- <uid>` to provision a clinician and `npm run link:patient -- <patient-uid> <doctor-uid>` to link a patient. Patients can read their own data; doctors can read only linked patients. A client-supplied role is never accepted.

## Frontend integration notes

The React app initializes Firebase Authentication from Vite environment variables, supports patient email/password registration and sign-in, and sends Firebase ID tokens to protected API routes. Set `VITE_API_BASE_URL` to the backend origin (default `http://localhost:3000`). The patient app reads assignments, feedback, exercise catalog, and session history from the API; clinicians can review linked patients, update assignments, and send feedback. New self-registered accounts are patients. Provision clinician custom claims and patient links with the backend operator scripts. Firebase Admin credentials must remain server-side and must never be placed in the frontend environment.
