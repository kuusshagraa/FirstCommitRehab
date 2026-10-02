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
    evaluationUpdatedAt: session.evaluationUpdatedAt?.toDate?.().toISOString() || null,
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

router.post("/patients/:patientUid/sessions/:sessionId/evaluation", requireAuth, requireRole("patient"), requirePatientAccess, async (request, response, next) => {
  try {
    const { jointAngles } = request.body || {};
    if (!Array.isArray(jointAngles) || jointAngles.length < 2 || jointAngles.length > 120 || jointAngles.some((frame) => !Array.isArray(frame) || frame.length !== 16 || frame.some((angle) => typeof angle !== "number" || !Number.isFinite(angle)))) {
      throw invalid("jointAngles must contain 2 to 120 frames, each with 16 finite numeric features.");
    }

    const modelUrl = process.env.AI_EVALUATION_URL;
    if (!modelUrl) {
      const error = new Error("The movement evaluation service is not configured.");
      error.status = 503;
      error.code = "AI_SERVICE_NOT_CONFIGURED";
      throw error;
    }

    const sessionRef = db.collection("patients").doc(request.params.patientUid).collection("sessions").doc(request.params.sessionId);
    const sessionSnapshot = await sessionRef.get();
    if (!sessionSnapshot.exists) {
      const error = new Error("Workout session not found.");
      error.status = 404;
      error.code = "SESSION_NOT_FOUND";
      throw error;
    }
    const session = sessionSnapshot.data();
    if (session.evaluationStatus === "complete") {
      const error = new Error("This workout session already has an evaluation.");
      error.status = 409;
      error.code = "EVALUATION_ALREADY_EXISTS";
      throw error;
    }

    const exercise = exerciseById.get(session.exerciseId);
    if (!exercise) throw invalid("The stored session references an unsupported exercise.");

    const headers = { "content-type": "application/json" };
    if (process.env.AI_SERVICE_TOKEN) headers.authorization = `Bearer ${process.env.AI_SERVICE_TOKEN}`;
    let modelResponse;
    try {
      modelResponse = await fetch(modelUrl, {
        method: "POST",
        headers,
        body: JSON.stringify({
          sessionId: request.params.sessionId,
          exerciseLabel: exercise.label,
          jointAngles,
          samplingHz: 30,
        }),
        signal: AbortSignal.timeout(15000),
      });
    } catch {
      const error = new Error("The movement evaluation service could not be reached.");
      error.status = 502;
      error.code = "AI_SERVICE_UNAVAILABLE";
      throw error;
    }

    if (!modelResponse.ok) {
      const error = new Error("The movement evaluation service returned an error.");
      error.status = 502;
      error.code = "AI_SERVICE_ERROR";
      throw error;
    }
    const result = await modelResponse.json();
    const validLabels = new Set(Array.from(exerciseById.values(), (item) => item.label));
    if (!result || !validLabels.has(result.classLabel) || typeof result.confidence !== "number" || !Number.isFinite(result.confidence) || result.confidence < 0 || result.confidence > 1) {
      const error = new Error("The movement evaluation service returned an invalid result.");
      error.status = 502;
      error.code = "INVALID_AI_RESPONSE";
      throw error;
    }

    const evaluation = {
      classLabel: result.classLabel,
      confidence: result.confidence,
      modelVersion: typeof result.modelVersion === "string" ? result.modelVersion.slice(0, 80) : null,
    };
    await sessionRef.update({
      evaluation,
      evaluationStatus: "complete",
      evaluationUpdatedAt: FieldValue.serverTimestamp(),
    });
    response.json({ data: evaluation });
  } catch (error) {
    next(error);
  }
});

export default router;
