import { applicationDefault, getApps, initializeApp } from "firebase-admin/app";
import { getAuth } from "firebase-admin/auth";
import { getFirestore } from "firebase-admin/firestore";

const projectId = process.env.FIREBASE_PROJECT_ID;
const usingEmulators = Boolean(
  process.env.FIRESTORE_EMULATOR_HOST || process.env.FIREBASE_AUTH_EMULATOR_HOST,
);
const hasCredentials = Boolean(
  usingEmulators || process.env.GOOGLE_APPLICATION_CREDENTIALS || process.env.K_SERVICE,
);

export const firebaseConfigured = Boolean(projectId && hasCredentials);

const firebaseApp = firebaseConfigured
  ? getApps()[0] ?? initializeApp({
    projectId,
    ...(usingEmulators ? {} : { credential: applicationDefault() }),
  })
  : null;

export const auth = firebaseApp ? getAuth(firebaseApp) : null;
export const db = firebaseApp ? getFirestore(firebaseApp) : null;
