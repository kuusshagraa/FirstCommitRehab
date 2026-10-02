import { useState } from "react";
import { createAccount, signIn } from "./auth.js";
import { firebaseConfigured } from "./firebase.js";

const firebaseErrorMessage = (error) => {
  const messages = {
    "auth/email-already-in-use": "An account with this email already exists. Sign in instead.",
    "auth/invalid-credential": "That email and password don’t match. Check them and try again.",
    "auth/invalid-email": "Enter a valid email address.",
    "auth/too-many-requests": "Too many attempts. Wait a moment, then try again.",
    "auth/weak-password": "Choose a password with at least 6 characters.",
    "auth/network-request-failed": "Couldn’t reach Firebase. Check your connection and try again.",
  };
  return messages[error.code] || error.message || "Something went wrong. Please try again.";
};

export default function AuthScreen() {
  const [mode, setMode] = useState("signin");
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [busy, setBusy] = useState(false);
  const isSignUp = mode === "signup";

  async function handleSubmit(event) {
    event.preventDefault();
    setError("");
    if (!firebaseConfigured) {
      setError("Firebase web configuration is missing. Add it to Frontend/.env.local and restart the app.");
      return;
    }
    setBusy(true);
    try {
      if (isSignUp) await createAccount(email.trim(), password, name.trim());
      else await signIn(email.trim(), password);
    } catch (authError) {
      setError(firebaseErrorMessage(authError));
    } finally {
      setBusy(false);
    }
  }

  return (
    <main className="mx-auto flex min-h-screen w-full max-w-[480px] flex-col bg-white px-[22px] pb-8 text-[#24324a] shadow-[0_0_50px_#263b690b] sm:my-7 sm:min-h-[calc(100vh-3.5rem)] sm:rounded-[28px] max-[360px]:px-4">
      <header className="flex h-[62px] items-center">
        <a href="#home" aria-label="Rehab AI" className="flex items-center gap-2 font-display text-[21px] font-extrabold tracking-[-1px] text-[#263b69]">
          <span className="grid h-[31px] w-[31px] place-items-center rounded-[11px] bg-[#e3f4ef] text-[#128886]"><svg viewBox="0 0 24 24" className="h-[23px] w-[23px]" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true"><path d="m4 19 5-14 3 8 3-5 4 11" /><circle cx="18" cy="5" r="1.5" fill="currentColor" /></svg></span>
          <span>rehab<span className="text-[#168b8c]">.ai</span></span>
        </a>
      </header>

      <section className="flex flex-1 flex-col justify-center pb-10 pt-8" aria-labelledby="auth-title">
        <div className="mb-7 grid h-14 w-14 place-items-center rounded-[18px] bg-[#e8f2fb] text-[#237eae]">
          <svg viewBox="0 0 24 24" className="h-7 w-7" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true"><path d="M12 3 4.5 6v5.4c0 4.5 3.2 7.8 7.5 9.6 4.3-1.8 7.5-5.1 7.5-9.6V6L12 3Z" /><path d="M8.5 12h7m-3.5-3.5v7" /></svg>
        </div>
        <h1 id="auth-title" className="font-display text-[27px] font-extrabold leading-tight tracking-[-.8px] text-[#263b69]">{isSignUp ? "Create your account" : "Welcome back"}</h1>
        <p className="mb-0 mt-2 max-w-[340px] text-sm leading-relaxed text-[#748598]">{isSignUp ? "Set up a patient account to keep your rehabilitation activity together." : "Sign in to see your exercise plan and progress."}</p>

        <form onSubmit={handleSubmit} className="mt-7 space-y-4">
          {isSignUp && <label className="block text-xs font-bold text-[#34415a]">Your name<input autoComplete="name" value={name} onChange={(event) => setName(event.target.value)} required maxLength={80} className="mt-2 h-12 w-full rounded-[13px] border border-[#dfe6eb] px-3 text-sm font-normal outline-none transition focus:border-[#168b8c] focus:ring-2 focus:ring-[#168b8c]/15" placeholder="Name shown on your profile" /></label>}
          <label className="block text-xs font-bold text-[#34415a]">Email address<input autoComplete="email" type="email" value={email} onChange={(event) => setEmail(event.target.value)} required className="mt-2 h-12 w-full rounded-[13px] border border-[#dfe6eb] px-3 text-sm font-normal outline-none transition focus:border-[#168b8c] focus:ring-2 focus:ring-[#168b8c]/15" placeholder="you@example.com" /></label>
          <label className="block text-xs font-bold text-[#34415a]">Password<input autoComplete={isSignUp ? "new-password" : "current-password"} type="password" value={password} onChange={(event) => setPassword(event.target.value)} required minLength={6} className="mt-2 h-12 w-full rounded-[13px] border border-[#dfe6eb] px-3 text-sm font-normal outline-none transition focus:border-[#168b8c] focus:ring-2 focus:ring-[#168b8c]/15" placeholder={isSignUp ? "At least 6 characters" : "Your password"} /></label>
          {error && <p role="alert" className="rounded-[13px] bg-[#fff1ef] px-3 py-2.5 text-xs leading-relaxed text-[#a3443d]">{error}</p>}
          {!firebaseConfigured && <p role="status" className="rounded-[13px] bg-[#fff8ed] px-3 py-2.5 text-xs leading-relaxed text-[#886b46]">Firebase isn’t configured for this build yet.</p>}
          <button type="submit" disabled={busy || !firebaseConfigured} className="min-h-12 w-full rounded-[14px] bg-[#237eae] text-sm font-bold text-white shadow-sm transition hover:bg-[#1f709b] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#237eae] disabled:cursor-wait disabled:opacity-60">{busy ? "Please wait…" : isSignUp ? "Create account" : "Sign in"}</button>
        </form>

        <p className="mb-0 mt-5 text-center text-xs text-[#748598]">{isSignUp ? "Already have an account?" : "New to Rehab AI?"}{" "}<button type="button" disabled={busy} onClick={() => { setError(""); setMode(isSignUp ? "signin" : "signup"); }} className="font-bold text-[#168b8c] underline underline-offset-2 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#168b8c]">{isSignUp ? "Sign in" : "Create an account"}</button></p>
        {isSignUp && <p className="mb-0 mt-5 rounded-[14px] bg-[#f3f7fb] px-3 py-2.5 text-[10px] leading-relaxed text-[#68788e]">New accounts are patient accounts. Clinician access is set up by a Rehab AI project administrator.</p>}
      </section>
      <p className="mb-0 text-center text-[10px] leading-relaxed text-[#8995a5]">Rehab AI helps you stay connected with your care team. It does not replace medical advice.</p>
    </main>
  );
}
