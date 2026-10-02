import { auth, db } from "../config/firebase.js";

export async function requireAuth(request, _response, next) {
  try {
    if (!auth || !db) {
      const error = new Error("Firebase Admin is not configured.");
      error.status = 503;
      error.code = "FIREBASE_NOT_CONFIGURED";
      throw error;
    }

    const authorization = request.get("authorization") || "";
    const tokenMatch = authorization.match(/^Bearer\s+(.+)$/i);
    if (!tokenMatch) {
      const error = new Error("A Firebase ID token is required.");
      error.status = 401;
      error.code = "AUTH_REQUIRED";
      throw error;
    }

    let decodedToken;
    try {
      decodedToken = await auth.verifyIdToken(tokenMatch[1]);
    } catch {
      const error = new Error("The Firebase ID token is invalid or expired.");
      error.status = 401;
      error.code = "INVALID_TOKEN";
      throw error;
    }

    const profileRef = db.collection("users").doc(decodedToken.uid);
    const profileSnapshot = await profileRef.get();
    const profileData = profileSnapshot.exists ? profileSnapshot.data() : {};
    const claimedRole = decodedToken.role === "doctor" ? "doctor" : "patient";
    const role = claimedRole;

    if (!profileSnapshot.exists) {
      await profileRef.set({
        uid: decodedToken.uid,
        email: decodedToken.email || null,
        displayName: decodedToken.name || "",
        role: claimedRole,
        createdAt: new Date(),
        updatedAt: new Date(),
      });
    } else if (profileData.role !== role) {
      await profileRef.set({ role, updatedAt: new Date() }, { merge: true });
    }

    request.user = {
      uid: decodedToken.uid,
      email: decodedToken.email || null,
      displayName: profileData.displayName || decodedToken.name || "",
      role,
    };
    return next();
  } catch (error) {
    return next(error);
  }
}

export function requireRole(...allowedRoles) {
  return (request, _response, next) => {
    if (!request.user || !allowedRoles.includes(request.user.role)) {
      const error = new Error("You do not have permission to perform this action.");
      error.status = 403;
      error.code = "FORBIDDEN";
      return next(error);
    }
    return next();
  };
}
