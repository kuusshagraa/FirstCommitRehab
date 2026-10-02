import "dotenv/config";
import { FieldValue } from "firebase-admin/firestore";
import { auth, db } from "../src/config/firebase.js";

const [patientUid, doctorUid] = process.argv.slice(2);

if (!patientUid || !doctorUid) {
  console.error("Usage: npm run link:patient -- <patient-auth-uid> <doctor-auth-uid>");
  process.exit(1);
}

if (!auth || !db) {
  console.error("Firebase Admin is not configured. Set FIREBASE_PROJECT_ID and server credentials first.");
  process.exit(1);
}

try {
  const [patientAuthUser, doctorAuthUser, patientProfile, doctorProfile] = await Promise.all([
    auth.getUser(patientUid),
    auth.getUser(doctorUid),
    db.collection("users").doc(patientUid).get(),
    db.collection("users").doc(doctorUid).get(),
  ]);
  if (doctorAuthUser.customClaims?.role !== "doctor" || doctorProfile.data()?.role !== "doctor") {
    throw new Error("The selected doctor must first be provisioned with the doctor role.");
  }
  if (patientProfile.data()?.role !== "patient") {
    throw new Error("The selected patient must sign in once to create a patient profile.");
  }

  await db.collection("patients").doc(patientUid).set({
    patientUid,
    doctorUid,
    patientEmail: patientAuthUser.email || null,
    doctorEmail: doctorAuthUser.email || null,
    linkedAt: FieldValue.serverTimestamp(),
  }, { merge: true });
  console.log(`Linked patient ${patientUid} to doctor ${doctorUid}.`);
} catch (error) {
  console.error(`Could not link patient: ${error.message}`);
  process.exitCode = 1;
}
