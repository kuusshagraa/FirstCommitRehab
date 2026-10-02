import {
  createUserWithEmailAndPassword,
  onAuthStateChanged,
  signInWithEmailAndPassword,
  signOut,
  updateProfile,
} from "firebase/auth";
import { auth } from "./firebase.js";

function requireAuth() {
  if (!auth) {
    throw new Error("Firebase is not configured. Copy .env.example to .env.local and add the Firebase web app config.");
  }
  return auth;
}

export async function signIn(email, password) {
  const result = await signInWithEmailAndPassword(requireAuth(), email, password);
  return result.user;
}

export async function createAccount(email, password, displayName) {
  const result = await createUserWithEmailAndPassword(requireAuth(), email, password);
  if (displayName?.trim()) {
    await updateProfile(result.user, { displayName: displayName.trim() });
  }
  return result.user;
}

export function observeAuth(callback) {
  return onAuthStateChanged(requireAuth(), callback);
}

export function signOutUser() {
  return signOut(requireAuth());
}
