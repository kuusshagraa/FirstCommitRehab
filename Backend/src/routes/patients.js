import { Router } from "express";
import { FieldValue } from "firebase-admin/firestore";
import { db } from "../config/firebase.js";
import { exercises, exerciseById } from "../data/exercises.js";
import { requireAuth, requireRole } from "../middleware/require-auth.js";
import { requirePatientAccess } from "../middleware/patient-access.js";

const router = Router();

function invalid(message, code = "INVALID_REQUEST") {
  const error = new Error(message);
  error.status = 400;
  error.code = code;
  return error;
}

router.get("/patients", requireAuth, requireRole("doctor"), async (request, response) => {
  const links = await db.collection("patients").where("doctorUid", "==", request.user.uid).get();
  const patients = await Promise.all(links.docs.map(async (link) => {
    const patientUid = link.id;
    const profile = await db.collection("users").doc(patientUid).get();
    const data = profile.data() || {};
    return { uid: patientUid, displayName: data.displayName || "", email: data.email || null };
  }));
  response.json({ data: patients });
});

router.get("/patients/:patientUid", requireAuth, requirePatientAccess, async (request, response) => {
  const snapshot = await db.collection("users").doc(request.params.patientUid).get();
  if (!snapshot.exists) {
    const error = new Error("Patient profile not found.");
    error.status = 404;
    error.code = "PATIENT_NOT_FOUND";
    throw error;
  }
  const profile = snapshot.data();
  response.json({ data: { uid: snapshot.id, displayName: profile.displayName || "", email: profile.email || null } });
});

router.get("/patients/:patientUid/assignments", requireAuth, requirePatientAccess, async (request, response) => {
  const snapshot = await db.collection("patients").doc(request.params.patientUid).collection("assignments").get();
  const data = snapshot.docs.map((document) => ({ id: document.id, ...document.data() }));
  response.json({ data });
});

router.put("/patients/:patientUid/assignments", requireAuth, requireRole("doctor"), requirePatientAccess, async (request, response, next) => {
  try {
    const { exerciseIds } = request.body || {};
    if (!Array.isArray(exerciseIds) || exerciseIds.length > exercises.length || exerciseIds.some((id) => typeof id !== "string" || !exerciseById.has(id)) || new Set(exerciseIds).size !== exerciseIds.length) {
      throw invalid("exerciseIds must contain unique identifiers from the supported exercise catalog.", "INVALID_ASSIGNMENTS");
    }

    const patientRef = db.collection("patients").doc(request.params.patientUid);
    const assignmentCollection = patientRef.collection("assignments");
    const existing = await assignmentCollection.get();
    const batch = db.batch();
    existing.docs.forEach((document) => batch.delete(document.ref));
    exerciseIds.forEach((exerciseId) => {
      const exercise = exerciseById.get(exerciseId);
      batch.set(assignmentCollection.doc(exerciseId), {
        patientUid: request.params.patientUid,
        doctorUid: request.user.uid,
        exerciseId,
        exerciseName: exercise.name,
        active: true,
        updatedAt: FieldValue.serverTimestamp(),
      });
    });
    await batch.commit();
    response.json({ data: exerciseIds.map((exerciseId) => ({ ...exerciseById.get(exerciseId), active: true })) });
  } catch (error) {
    next(error);
  }
});

router.get("/patients/:patientUid/feedback", requireAuth, requirePatientAccess, async (request, response) => {
  const snapshot = await db.collection("patients").doc(request.params.patientUid).collection("feedback").orderBy("updatedAt", "desc").limit(20).get();
  const data = snapshot.docs.map((document) => ({ id: document.id, ...document.data(), updatedAt: document.data().updatedAt?.toDate?.().toISOString() || null }));
  response.json({ data });
});

router.post("/patients/:patientUid/feedback", requireAuth, requireRole("doctor"), requirePatientAccess, async (request, response, next) => {
  try {
    const message = typeof request.body?.message === "string" ? request.body.message.trim() : "";
    if (!message || message.length > 1000) throw invalid("message must be between 1 and 1000 characters.", "INVALID_FEEDBACK");

    const feedbackRef = db.collection("patients").doc(request.params.patientUid).collection("feedback").doc();
    await feedbackRef.set({
      patientUid: request.params.patientUid,
      doctorUid: request.user.uid,
      message,
      createdAt: FieldValue.serverTimestamp(),
      updatedAt: FieldValue.serverTimestamp(),
    });
    response.status(201).json({ data: { id: feedbackRef.id, message, doctorUid: request.user.uid } });
  } catch (error) {
    next(error);
  }
});

export default router;
