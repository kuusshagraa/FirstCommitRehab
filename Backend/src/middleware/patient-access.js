import { db } from "../config/firebase.js";

export async function requirePatientAccess(request, _response, next) {
  try {
    const patientUid = request.params.patientUid;
    if (request.user.role === "patient") {
      if (request.user.uid !== patientUid) {
        const error = new Error("Patients may only access their own records.");
        error.status = 403;
        error.code = "PATIENT_ACCESS_DENIED";
        throw error;
      }
      return next();
    }

    if (request.user.role !== "doctor") {
      const error = new Error("A patient or doctor account is required.");
      error.status = 403;
      error.code = "ROLE_NOT_ALLOWED";
      throw error;
    }

    const patientSnapshot = await db.collection("patients").doc(patientUid).get();
    if (!patientSnapshot.exists || patientSnapshot.data().doctorUid !== request.user.uid) {
      const error = new Error("This patient is not linked to your care team.");
      error.status = 403;
      error.code = "PATIENT_ACCESS_DENIED";
      throw error;
    }
    return next();
  } catch (error) {
    return next(error);
  }
}
