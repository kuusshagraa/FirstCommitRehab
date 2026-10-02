import { Router } from "express";
import { db } from "../config/firebase.js";
import { requireAuth } from "../middleware/require-auth.js";

const router = Router();

router.get("/me", requireAuth, async (request, response) => {
  const snapshot = await db.collection("users").doc(request.user.uid).get();
  const profile = snapshot.data() || {};
  response.json({
    data: {
      uid: request.user.uid,
      email: request.user.email,
      displayName: request.user.displayName,
      role: request.user.role,
      createdAt: profile.createdAt?.toDate?.().toISOString() || null,
    },
  });
});

router.patch("/me", requireAuth, async (request, response, next) => {
  try {
    const displayName = typeof request.body?.displayName === "string" ? request.body.displayName.trim() : null;
    if (!displayName || displayName.length > 80) {
      const error = new Error("displayName must be between 1 and 80 characters.");
      error.status = 400;
      error.code = "INVALID_PROFILE";
      throw error;
    }

    await db.collection("users").doc(request.user.uid).set({
      displayName,
      updatedAt: new Date(),
    }, { merge: true });

    response.json({ data: { ...request.user, displayName } });
  } catch (error) {
    next(error);
  }
});

export default router;
