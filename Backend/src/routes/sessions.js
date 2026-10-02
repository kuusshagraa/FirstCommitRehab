import { Router } from "express";
import { FieldValue } from "firebase-admin/firestore";
import { db } from "../config/firebase.js";
import { exerciseById } from "../data/exercises.js";
import { requireAuth, requireRole } from "../middleware/require-auth.js";
import { requirePatientAccess } from "../middleware/patient-access.js";

const router = Router();

function invalid(message) {
  const error = new Error(message);
  error.status = 400;
  error.code = "INVALID_SESSION";
  return error;
}

function serializeSession(document) {
  const session = document.data();
  return {
    id: document.id,
    ...session,
    completedAt: session.completedAt?.toDate?.().toISOString() || null,
  };
}

router.post("/patients/:patientUid/sessions", requireAuth, requireRole("patient"), requirePatientAccess, async (request, response, next) => {
  try {
    const { exerciseId, durationSeconds } = request.body || {};
    if (typeof exerciseId !== "string" || !exerciseById.has(exerciseId)) {
      throw invalid("exerciseId must identify an exercise in the supported catalog.");
    }
    if (!Number.isInteger(durationSeconds) || durationSeconds < 1 || durationSeconds > 7200) {
      throw invalid("durationSeconds must be an integer from 1 to 7200.");
    }

    const exercise = exerciseById.get(exerciseId);
    const sessionRef = db.collection("patients").doc(request.params.patientUid).collection("sessions").doc();
    await sessionRef.create({
      patientUid: request.params.patientUid,
      exerciseId,
      exerciseName: exercise.name,
      durationSeconds,
      completedAt: FieldValue.serverTimestamp(),
      evaluation: null,
      evaluationStatus: "not_requested",
      createdAt: FieldValue.serverTimestamp(),
    });
    const saved = await sessionRef.get();
    response.status(201).json({ data: serializeSession(saved) });
  } catch (error) {
    next(error);
  }
});

router.get("/patients/:patientUid/sessions", requireAuth, requirePatientAccess, async (request, response) => {
  const snapshot = await db.collection("patients").doc(request.params.patientUid).collection("sessions")
    .orderBy("completedAt", "desc")
    .limit(50)
    .get();
  response.json({ data: snapshot.docs.map(serializeSession) });
});

router.get("/patients/:patientUid/sessions/:sessionId", requireAuth, requirePatientAccess, async (request, response) => {
  const snapshot = await db.collection("patients").doc(request.params.patientUid)
    .collection("sessions").doc(request.params.sessionId).get();
  if (!snapshot.exists) {
    const error = new Error("Workout session not found.");
    error.status = 404;
    error.code = "SESSION_NOT_FOUND";
    throw error;
  }
  response.json({ data: serializeSession(snapshot) });
});

export default router;
