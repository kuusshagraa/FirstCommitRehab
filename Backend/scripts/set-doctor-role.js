import "dotenv/config";
import { FieldValue } from "firebase-admin/firestore";
import { auth, db } from "../src/config/firebase.js";

const uid = process.argv[2];

if (!uid) {
  console.error("Usage: npm run set:doctor -- <firebase-auth-uid>");
  process.exit(1);
}

if (!auth || !db) {
  console.error("Firebase Admin is not configured. Set FIREBASE_PROJECT_ID and server credentials first.");
  process.exit(1);
}

try {
  const user = await auth.getUser(uid);
  await auth.setCustomUserClaims(uid, { ...user.customClaims, role: "doctor" });
  await db.collection("users").doc(uid).set({
    uid,
    email: user.email || null,
    displayName: user.displayName || "",
    role: "doctor",
    updatedAt: FieldValue.serverTimestamp(),
  }, { merge: true });
  console.log(`Doctor role provisioned for ${uid}. The user must sign in again to refresh their ID token.`);
} catch (error) {
  console.error(`Could not provision doctor role: ${error.message}`);
  process.exitCode = 1;
}
