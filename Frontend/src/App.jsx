import { useEffect, useState } from "react";
import AuthScreen from "./AuthScreen.jsx";
import { apiRequest } from "./api.js";
import { observeAuth, signOutUser } from "./auth.js";
import { firebaseConfigured } from "./firebase.js";

const featureCards = [
  {
    title: "My exercises",
    detail: "3 assigned",
    tone: "bg-[#e1f3ed]",
    icon: "exercise",
    message: "Your assigned exercises will appear here.",
  },
  {
    title: "Exercise guide",
    detail: "Learn each move",
    tone: "bg-[#faeee2]",
    icon: "play",
    message: "Your exercise library is coming in a later part.",
  },
  {
    title: "My progress",
    detail: "Weekly activity",
    tone: "bg-[#e8eef9]",
    icon: "chart",
    message: "Your workout history will appear here.",
  },
];

const navigation = [
  { label: "Home", icon: "home" },
  { label: "Exercises", icon: "list" },
  { label: "Progress", icon: "trend" },
  { label: "Profile", icon: "user" },
];

function Icon({ name, className = "h-5 w-5", filled = false }) {
  const common = {
    className,
    viewBox: name === "exercise" ? "0 0 48 48" : "0 0 24 24",
    fill: filled ? "currentColor" : "none",
    stroke: "currentColor",
    strokeWidth: 1.8,
    strokeLinecap: "round",
    strokeLinejoin: "round",
    "aria-hidden": true,
  };

  const artwork = {
    brand: <><path d="M5 19 10.2 5l3.2 8.1 2.6-4.7L19.5 19" /><circle cx="18" cy="5.5" r="1.5" fill="currentColor" stroke="none" /></>,
    bell: <path d="M18 9a6 6 0 0 0-12 0c0 7-3 7-3 9h18c0-2-3-2-3-9M10 21h4" />,
    more: <><circle cx="5" cy="12" r="1" /><circle cx="12" cy="12" r="1" /><circle cx="19" cy="12" r="1" /></>,
    exercise: <path d="M24 8v8m-8 4 8-4 8 4M16 20l-5 10m21-10 5 10M19 20l-2 12 7 8 7-8-2-12" />,
    play: <><circle cx="12" cy="12" r="9" /><path d="m10 8 7 4-7 4V8Z" fill="currentColor" stroke="none" /></>,
    chart: <path d="M5 19V12h4v7m3 0V5h4v14m3 0v-9h4v9M3 21h19" />,
    heart: <path d="M20.8 8.8c0 5.2-8.8 10.2-8.8 10.2S3.2 14 3.2 8.8A4.6 4.6 0 0 1 12 6.5a4.6 4.6 0 0 1 8.8 2.3Z" />,
    sparkle: <path d="m12 3 1.8 6.2L20 11l-6.2 1.8L12 19l-1.8-6.2L4 11l6.2-1.8L12 3Zm7 12 .9 2.1L22 18l-2.1.9L19 21l-.9-2.1L16 18l2.1-.9L19 15Z" />,
    calendar: <><rect x="3" y="5" width="18" height="16" rx="3" /><path d="M7 3v4m10-4v4M3 10h18M8 14h3m-3 3h6" /></>,
    camera: <><path d="M4 7h3l2-3h6l2 3h3a2 2 0 0 1 2 2v10a2 2 0 0 1-2 2H4a2 2 0 0 1-2-2V9a2 2 0 0 1 2-2Z" /><circle cx="12" cy="13" r="3.5" /></>,
    home: <path d="m3 10 9-7 9 7v10a1 1 0 0 1-1 1h-5v-7H9v7H4a1 1 0 0 1-1-1V10Z" />,
    list: <path d="M4 5h16v15H4zM8 9h8m-8 4h8m-8 4h5" />,
    trend: <path d="M4 19V5m0 14h17M8 15l4-5 3 3 5-7" />,
    user: <><circle cx="12" cy="8" r="4" /><path d="M4 21a8 8 0 0 1 16 0" /></>,
    check: <path d="m5 12 4 4L19 6" />,
  };

  return <svg {...common}>{artwork[name]}</svg>;
}

function MovementIllustration() {
  return (
    <div aria-hidden="true" className="absolute bottom-0 right-0 flex h-full w-[43%] items-end justify-center overflow-hidden bg-gradient-to-br from-transparent from-15% to-[#d7ebf6]">
      <div className="absolute -right-3 top-5 h-32 w-32 rounded-full border border-[#9bc6d1]" />
      <div className="absolute right-2 top-10 h-24 w-24 rounded-full border border-dashed border-[#9bc6d1]/70" />
      <svg viewBox="0 0 150 190" className="relative z-10 mb-1 mr-1 h-[155px] w-[118px]" fill="none">
        <circle cx="79" cy="27" r="14" fill="#E9B99D" />
        <path d="M67 26c1-13 21-19 27-5 1 3 0 6-1 8-5-4-10-7-18-5l-8 2Z" fill="#243B65" />
        <path d="m66 47 22-2 12 41-11 30-33-4 3-39 7-26Z" fill="#F8FCFB" stroke="#276D72" strokeWidth="3" />
        <path d="m67 51-22 25-22 7m54-34 21 20 22-10" stroke="#E9B99D" strokeWidth="10" strokeLinecap="round" strokeLinejoin="round" />
        <path d="m61 111-4 38-21 22m31-51 22 34 20 4" stroke="#243B65" strokeWidth="12" strokeLinecap="round" strokeLinejoin="round" />
        <path d="m36 171-9 2m82 2 10 2" stroke="#167D8D" strokeWidth="7" strokeLinecap="round" />
        <circle cx="45" cy="76" r="4" fill="#26A69A" /><circle cx="98" cy="68" r="4" fill="#26A69A" />
      </svg>
      <span className="absolute right-2 top-3 z-20 flex items-center gap-1.5 rounded-lg border border-[#d8e9ea] bg-white/95 px-2 py-1.5 text-[7px] font-bold text-[#5f7e84] shadow-sm">
        <span className="h-1.5 w-1.5 rounded-full bg-[#2ab58b]" /> Camera ready
      </span>
    </div>
  );
}

function ExerciseDetails({ exercise, onBack, onStartWorkout, doctorFeedback }) {
  return (
    <section aria-labelledby="exercise-detail-title" className="pb-6 pt-5">
      <button onClick={onBack} className="mb-5 inline-flex items-center gap-2 text-xs font-bold text-[#168b8c]">
        <span aria-hidden="true" className="text-lg">←</span> Back to exercises
      </button>
      <div className="flex items-center gap-3">
        <span className={`grid h-14 w-14 place-items-center rounded-[18px] ${exercise.tone} text-[#298f83]`}><Icon name="exercise" className="h-8 w-8" /></span>
        <div>
          <p className="mb-1 text-[9px] font-extrabold uppercase tracking-[1px] text-[#8995a5]">{exercise.assigned ? "Assigned by your care team" : "Movement library"}</p>
          <h1 id="exercise-detail-title" className="font-display text-2xl font-extrabold tracking-[-.7px] text-[#263b69]">{exercise.name}</h1>
        </div>
      </div>

      <div className="relative mt-5 flex min-h-[205px] flex-col items-center justify-center overflow-hidden rounded-[22px] bg-[#e8f2fb] px-5 text-center">
        <div className="absolute -right-5 -top-8 h-40 w-40 rounded-full border border-[#a8ced6]" />
        <div className="absolute -bottom-16 -left-8 h-44 w-44 rounded-full border border-dashed border-[#a8ced6]" />
        <div className="relative z-10 grid h-14 w-14 place-items-center rounded-full bg-white/90 text-[#237eae] shadow-sm"><Icon name="play" className="h-7 w-7" /></div>
        <p className="relative z-10 mb-1 mt-3 font-display text-sm font-bold text-[#263b69]">Exercise preview</p>
        <p className="relative z-10 max-w-[230px] text-[10px] leading-relaxed text-[#748598]">A clinician-approved video guide will be added here.</p>
        <span className="absolute bottom-3 right-3 rounded-full bg-white/80 px-2.5 py-1 text-[8px] font-bold text-[#718097]">PREVIEW NOT CONNECTED</span>
      </div>

      <div className="mt-4 rounded-[18px] border border-[#edf0f3] p-4">
        <div className="flex items-center gap-2 font-display text-sm font-bold text-[#263b69]"><Icon name="list" className="h-4 w-4 text-[#168b8c]" /> Exercise instructions</div>
        <p className="mb-0 mt-2 text-xs leading-relaxed text-[#778397]">Instructions for this movement have not been added to the prototype. Use the guidance provided by your care team.</p>
      </div>

      <div className="mt-3 rounded-[18px] bg-[#f3f7fb] p-4">
        <p className="mb-1 text-[9px] font-extrabold uppercase tracking-[.9px] text-[#8995a5]">Assignment</p>
        <p className="font-display text-xs font-bold text-[#34415a]">{exercise.assigned ? "This exercise is on your plan" : "Not currently assigned"}</p>
        <p className="mt-1 text-[10px] text-[#778397]">Your care team manages your assigned exercises.</p>
      </div>

      <div className="mt-3 rounded-[18px] border border-[#edf0f3] p-4">
        <div className="flex items-center gap-2 font-display text-xs font-bold text-[#34415a]"><Icon name="sparkle" className="h-4 w-4 text-[#5878ab]" /> Doctor feedback</div>
        <p className="mb-0 mt-2 text-[10px] leading-relaxed text-[#778397]">{doctorFeedback || "No feedback has been added yet."}</p>
      </div>

      <button onClick={onStartWorkout} className="mt-5 flex min-h-12 w-full items-center justify-center gap-2 rounded-[14px] bg-[#237eae] text-sm font-bold text-white shadow-md shadow-[#237eae2b]">
        Start exercise <span aria-hidden="true">→</span>
      </button>
      <p className="mt-2 text-center text-[9px] text-[#8995a5]">This preview records session time only. Camera tracking and movement evaluation are not connected.</p>
    </section>
  );
}

function formatDuration(seconds) {
  return `${String(Math.floor(seconds / 60)).padStart(2, "0")}:${String(seconds % 60).padStart(2, "0")}`;
}

function SessionSummary({ session, onBack, onViewProgress }) {
  const completedAt = new Date(session.completedAt);
  const evaluation = session.evaluation;
  return (
    <section aria-labelledby="session-summary-title" className="pb-6 pt-5">
      <button onClick={onBack} className="mb-5 inline-flex items-center gap-2 text-xs font-bold text-[#168b8c]"><span aria-hidden="true" className="text-lg">←</span> Back</button>
      <div className="flex flex-col items-center rounded-[22px] bg-[#e1f3ed] px-5 py-6 text-center">
        <div className="grid h-14 w-14 place-items-center rounded-full bg-white text-[#198a7e]"><Icon name="check" className="h-7 w-7" /></div>
        <p className="mb-1 mt-4 text-[9px] font-extrabold uppercase tracking-[1px] text-[#4e8c7d]">SESSION SAVED</p>
        <h1 id="session-summary-title" className="font-display text-2xl font-extrabold text-[#263b69]">Nice work!</h1>
        <p className="mb-0 mt-1 text-xs text-[#668078]">Your session is saved to your account.</p>
      </div>
      <div className="mt-4 rounded-[18px] border border-[#edf0f3] p-4">
        <div className="flex items-start justify-between gap-3"><div><p className="mb-1 text-[9px] font-bold uppercase tracking-[.8px] text-[#8995a5]">Exercise</p><p className="mb-0 font-display text-sm font-bold text-[#263b69]">{session.exerciseName}</p></div></div>
        <div className="mt-4 grid grid-cols-2 gap-3">
          <div className="rounded-[13px] bg-[#f5f8fa] p-3"><p className="mb-1 text-[9px] text-[#8995a5]">Duration</p><p className="mb-0 font-display text-lg font-extrabold tabular-nums text-[#263b69]">{formatDuration(session.durationSeconds)}</p></div>
          <div className="rounded-[13px] bg-[#f5f8fa] p-3"><p className="mb-1 text-[9px] text-[#8995a5]">Movement review</p><p className="mb-0 font-display text-sm font-extrabold text-[#168b8c]">{evaluation ? evaluation.classLabel : "Not available"}</p></div>
        </div>
        <p className="mb-0 mt-3 text-[9px] text-[#8995a5]">{completedAt.toLocaleString([], { dateStyle: "medium", timeStyle: "short" })}</p>
      </div>
      {!evaluation && <div className="mt-3 rounded-[14px] bg-[#fff8ed] px-3 py-2.5 text-[9px] leading-relaxed text-[#886b46]">Your time was saved. An AI movement review will appear here after an evaluation service is connected.</div>}
      <button onClick={onViewProgress} className="mt-5 min-h-12 w-full rounded-[14px] bg-[#237eae] text-xs font-bold text-white">View progress</button>
    </section>
  );
}

function WorkoutSession({ exercise, onBack, onComplete, onViewProgress }) {
  const [isRunning, setIsRunning] = useState(false);
  const [elapsed, setElapsed] = useState(0);
  const [showPose, setShowPose] = useState(true);
  const [completedSession, setCompletedSession] = useState(null);
  const [isSaving, setIsSaving] = useState(false);
  const [saveError, setSaveError] = useState("");

  useEffect(() => {
    if (!isRunning) return undefined;
    const timerId = window.setInterval(() => setElapsed((seconds) => seconds + 1), 1000);
    return () => window.clearInterval(timerId);
  }, [isRunning]);

  const time = formatDuration(elapsed);

  if (completedSession) return <SessionSummary session={completedSession} onBack={onBack} onViewProgress={onViewProgress} />;

  const finishSession = async () => {
    setIsRunning(false);
    setIsSaving(true);
    setSaveError("");
    try {
      const session = await onComplete({ exerciseId: exercise.id, durationSeconds: elapsed });
      setCompletedSession(session);
    } catch (error) {
      setSaveError(error.message || "Couldn’t save this session. Please try again.");
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <section aria-labelledby="workout-title" className="pb-6 pt-5">
      <button onClick={onBack} className="mb-4 inline-flex items-center gap-2 text-xs font-bold text-[#168b8c]"><span aria-hidden="true" className="text-lg">←</span> Back to exercise</button>
      <div className="flex items-end justify-between">
        <div>
          <p className="mb-1 text-[9px] font-extrabold uppercase tracking-[1px] text-[#8995a5]">GUIDED WORKOUT</p>
          <h1 id="workout-title" className="font-display text-[23px] font-extrabold tracking-[-.6px] text-[#263b69]">{exercise.name}</h1>
        </div>
        <div className="font-display text-sm font-bold tabular-nums text-[#263b69]">{time}</div>
      </div>

      <div className="relative mt-4 flex h-[310px] items-center justify-center overflow-hidden rounded-[22px] bg-gradient-to-b from-[#1e2e4c] to-[#354c70]">
        <div className="absolute inset-x-5 bottom-5 h-20 rounded-[50%] border border-white/10" />
        <div className="absolute left-3 top-3 flex items-center gap-1.5 rounded-full border border-white/10 bg-white/10 px-2.5 py-1.5 text-[8px] font-bold text-white/80">
          <Icon name="camera" className="h-3 w-3" /> ILLUSTRATION ONLY
        </div>
        <span className="absolute right-3 top-3 flex items-center gap-1.5 rounded-full bg-white/10 px-2.5 py-1.5 text-[8px] font-semibold text-white/75">
          <span className={`h-1.5 w-1.5 rounded-full ${isRunning ? "animate-pulse bg-[#59ddb1]" : "bg-[#f3c979]"}`} /> {isRunning ? "Preview active" : "Preview paused"}
        </span>
        <svg viewBox="0 0 180 250" className="relative z-10 h-[235px] w-[170px]" fill="none" aria-hidden="true">
          <circle cx="90" cy="34" r="18" fill="#e9b99d" />
          <path d="M72 33c1-18 28-24 37-6 2 4 1 9-1 12-6-6-14-8-25-5l-11 3Z" fill="#b7c4dc" />
          <path d="m70 61 39-1 18 66-17 36H72l-14-37 12-64Z" fill="#d8e3ee" stroke="#91a8c5" strokeWidth="3" />
          <path d="m72 68-29 44-19 31m84-81 29 40 18-13" stroke="#e9b99d" strokeWidth="13" strokeLinecap="round" strokeLinejoin="round" />
          <path d="m73 157-7 46-19 27m44-71 15 47 27 13" stroke="#aebdd4" strokeWidth="15" strokeLinecap="round" strokeLinejoin="round" />
          {showPose && <g stroke="#62dec0" strokeWidth="2" fill="#62dec0">
            <path d="m90 52-1 23-3 23m-1-20-26 21-16 16m46-36 25 18 19 3m-43-2-12 40-8 40m20-40 7 40 17 22" fill="none" strokeLinecap="round" />
            <circle cx="90" cy="52" r="3"/><circle cx="89" cy="75" r="3"/><circle cx="86" cy="98" r="3"/><circle cx="60" cy="119" r="3"/><circle cx="44" cy="115" r="3"/><circle cx="115" cy="97" r="3"/><circle cx="134" cy="100" r="3"/><circle cx="74" cy="138" r="3"/><circle cx="66" cy="178" r="3"/><circle cx="98" cy="138" r="3"/><circle cx="105" cy="178" r="3"/>
          </g>}
        </svg>
        <div className="absolute bottom-3 left-3 right-3 rounded-xl border border-white/10 bg-[#13223d]/80 px-3 py-2 text-left text-[9px] leading-relaxed text-white/75">
          This is an illustrative preview. Camera and AI tracking are not connected.
        </div>
      </div>

        <div className="mt-3 flex items-center justify-between rounded-[16px] border border-[#edf0f3] px-3 py-3">
        <div className="flex items-center gap-2.5">
          <span className="grid h-9 w-9 place-items-center rounded-xl bg-[#eef4ff] text-[#5878ab]"><Icon name="exercise" className="h-5 w-5" /></span>
          <div><p className="mb-0 text-[8px] font-bold uppercase tracking-[.8px] text-[#8995a5]">{isRunning ? "Session in progress" : "Ready when you are"}</p><p className="mb-0 mt-0.5 font-display text-xs font-bold text-[#263b69]">{exercise.name}</p></div>
        </div>
      </div>

      <button role="switch" aria-checked={showPose} onClick={() => setShowPose((value) => !value)} className="mt-3 flex min-h-11 w-full items-center justify-between rounded-[15px] bg-[#f5f8fa] px-3 text-left">
        <span><span className="block text-[10px] font-bold text-[#34415a]">Pose keypoint overlay</span><span className="mt-0.5 block text-[9px] text-[#8995a5]">Show the illustrative skeleton points</span></span>
        <span className={`relative h-6 w-11 rounded-full transition ${showPose ? "bg-[#168b8c]" : "bg-[#cbd3dc]"}`}><span className={`absolute top-[3px] h-[18px] w-[18px] rounded-full bg-white shadow transition-all ${showPose ? "left-[21px]" : "left-[3px]"}`} /></span>
      </button>

      <div className="mt-3 rounded-[15px] bg-[#fff8ed] px-3 py-2.5 text-[9px] leading-relaxed text-[#886b46]">
        This screen saves your exercise and time. Camera tracking and AI movement evaluation are not connected yet.
      </div>

      {saveError && <p role="alert" className="mt-3 rounded-[14px] bg-[#fff1ef] px-3 py-2.5 text-[10px] text-[#a3443d]">{saveError}</p>}
      <div className="mt-4 grid grid-cols-2 gap-2.5">
        <button onClick={() => setIsRunning((value) => !value)} className="min-h-12 rounded-[14px] bg-[#237eae] text-xs font-bold text-white shadow-md shadow-[#237eae2b]">{isRunning ? "Pause" : elapsed > 0 ? "Resume" : "Start tracking"}</button>
        <button onClick={finishSession} disabled={isSaving || (!isRunning && elapsed === 0)} className="min-h-12 rounded-[14px] border border-[#dce3e9] text-xs font-bold text-[#53637a] disabled:cursor-not-allowed disabled:opacity-45">{isSaving ? "Saving…" : "Finish session"}</button>
      </div>
    </section>
  );
}

function ProgressPage({ sessions }) {
  const [selectedSession, setSelectedSession] = useState(null);
  if (selectedSession) return <SessionSummary session={selectedSession} onBack={() => setSelectedSession(null)} onViewProgress={() => setSelectedSession(null)} />;
  const recentSessions = [...sessions].sort((a, b) => new Date(b.completedAt) - new Date(a.completedAt));
  const weekCount = recentSessions.filter((session) => Date.now() - new Date(session.completedAt).getTime() < 7 * 24 * 60 * 60 * 1000).length;

  return (
    <section aria-labelledby="progress-title" className="pb-6 pt-5">
      <p className="mb-1 text-[9px] font-extrabold uppercase tracking-[1px] text-[#8995a5]">YOUR ACTIVITY</p>
      <h1 id="progress-title" className="font-display text-[25px] font-extrabold tracking-[-.8px] text-[#263b69]">My progress</h1>
      <p className="mb-5 mt-1 text-xs text-[#8190a0]">Your recent sessions saved to your account.</p>
      <div className="rounded-[20px] bg-[#e8f2fb] p-4">
        <div className="flex items-end justify-between"><div><p className="mb-1 text-[9px] font-bold uppercase tracking-[.8px] text-[#66839b]">Last 7 days</p><p className="mb-0 font-display text-2xl font-extrabold text-[#263b69]">{weekCount}<span className="ml-1 text-xs font-semibold text-[#748598]">sessions</span></p></div><Icon name="chart" className="h-8 w-8 text-[#5878ab]" /></div>
        <p className="mb-0 mt-3 text-[9px] text-[#748598]">Counted from your sessions saved to Rehab AI.</p>
      </div>
      <div className="mt-6 flex items-center justify-between"><h2 className="mb-0 font-display text-sm font-bold text-[#263b69]">Recent workouts</h2><span className="text-[9px] text-[#8995a5]">{recentSessions.length} total</span></div>
      {recentSessions.length ? <div className="mt-3 space-y-2.5">{recentSessions.map((session) => <button key={session.id} onClick={() => setSelectedSession(session)} className="flex w-full items-center gap-3 rounded-[17px] border border-[#edf0f3] p-3 text-left transition hover:border-[#c7e4df]"><span className="grid h-11 w-11 shrink-0 place-items-center rounded-[14px] bg-[#e1f3ed] text-[#298f83]"><Icon name="exercise" className="h-6 w-6" /></span><span className="min-w-0 flex-1"><span className="block font-display text-xs font-bold text-[#263750]">{session.exerciseName}</span><span className="mt-1 block text-[9px] text-[#8995a5]">{new Date(session.completedAt).toLocaleDateString([], { dateStyle: "medium" })} · {formatDuration(session.durationSeconds)}</span></span><span className="text-[9px] font-bold text-[#168b8c]">Saved</span><span aria-hidden="true" className="text-xl text-[#9ba5b1]">›</span></button>)}</div> : <div className="mt-3 rounded-[18px] border border-dashed border-[#dce3e9] px-4 py-7 text-center"><div className="mx-auto grid h-11 w-11 place-items-center rounded-[14px] bg-[#f3f6f8] text-[#718097]"><Icon name="calendar" /></div><p className="mb-1 mt-3 font-display text-xs font-bold text-[#34415a]">No workouts yet</p><p className="mb-0 text-[10px] text-[#8995a5]">Complete a session to see it here.</p></div>}
      <div className="mt-4 rounded-[14px] bg-[#fff8ed] px-3 py-2.5 text-[9px] leading-relaxed text-[#886b46]">Only session time is recorded. Movement analysis appears after an AI evaluation service is connected.</div>
    </section>
  );
}

function ExercisesPage({ onWorkoutComplete, onViewProgress, exerciseList, assignedIds, doctorFeedback }) {
  const [tab, setTab] = useState("Assigned");
  const [selected, setSelected] = useState(null);
  const [workoutOpen, setWorkoutOpen] = useState(false);
  const [completedSession, setCompletedSession] = useState(null);
  const tones = ["bg-[#e1f3ed]", "bg-[#faeee2]", "bg-[#e8eef9]"];
  const patientExercises = exerciseList.map((exercise, index) => ({ ...exercise, tone: tones[index % tones.length], icon: "exercise", assigned: assignedIds.includes(exercise.id) }));
  const exercises = tab === "Assigned" ? patientExercises.filter((exercise) => exercise.assigned) : patientExercises;

  if (completedSession) return <SessionSummary session={completedSession} onBack={() => setCompletedSession(null)} onViewProgress={onViewProgress} />;

  if (workoutOpen && selected) {
    return <WorkoutSession exercise={selected} onBack={() => setWorkoutOpen(false)} onComplete={(session) => { onWorkoutComplete(session); setCompletedSession(session); }} onViewProgress={onViewProgress} />;
  }

  if (selected) {
    return <ExerciseDetails exercise={selected} onBack={() => setSelected(null)} onStartWorkout={() => setWorkoutOpen(true)} doctorFeedback={doctorFeedback} />;
  }

  return (
    <section aria-labelledby="exercises-title" className="pb-6 pt-5">
      <p className="mb-1 text-[9px] font-extrabold uppercase tracking-[1px] text-[#8995a5]">YOUR MOVEMENT PLAN</p>
      <h1 id="exercises-title" className="font-display text-[25px] font-extrabold tracking-[-.8px] text-[#263b69]">My exercises</h1>
      <p className="mb-5 mt-1 text-xs text-[#8190a0]">Review your assignments and exercise guides.</p>

      <div role="tablist" aria-label="Exercise list" className="mb-4 grid grid-cols-2 rounded-[14px] bg-[#f3f6f8] p-1">
        {["Assigned", "All exercises"].map((item) => (
          <button key={item} role="tab" aria-selected={tab === item} onClick={() => setTab(item)} className={`min-h-9 rounded-[11px] text-[11px] font-bold transition ${tab === item ? "bg-white text-[#263b69] shadow-sm" : "text-[#8995a5]"}`}>
            {item}{item === "Assigned" ? ` (${patientExercises.filter((exercise) => exercise.assigned).length})` : ` (${patientExercises.length})`}
          </button>
        ))}
      </div>

      <div className="mb-3 flex items-start gap-2 rounded-[14px] bg-[#fff8ed] px-3 py-2.5 text-[9px] leading-relaxed text-[#886b46]">
        <span className="font-bold">Note</span><span>Use exercise instructions provided by your care team. The app records session time; camera coaching is not connected.</span>
      </div>

      <div className="space-y-2.5">
        {exercises.map((exercise) => (
          <button key={exercise.id} onClick={() => setSelected(exercise)} className="flex w-full items-center gap-3 rounded-[18px] border border-[#edf0f3] bg-white p-3 text-left shadow-sm shadow-[#293f5c0a] transition hover:border-[#c7e4df] hover:shadow-md">
            <span className={`grid h-12 w-12 shrink-0 place-items-center rounded-[15px] ${exercise.tone} text-[#298f83}`}><Icon name="exercise" className="h-7 w-7" /></span>
            <span className="min-w-0 flex-1">
              <span className="flex items-center gap-2"><span className="font-display text-xs font-bold text-[#263750]">{exercise.name}</span>{exercise.assigned && <span className="rounded-full bg-[#e7f5ef] px-2 py-0.5 text-[8px] font-bold text-[#23836f]">Assigned</span>}</span>
              <span className="mt-1 block text-[9px] text-[#8995a5]">{exercise.assigned ? "Assigned by your care team · instructions pending" : "Movement class · instructions pending"}</span>
            </span>
            <span className="text-xl text-[#9ba5b1]" aria-hidden="true">›</span>
          </button>
        ))}
        {exercises.length === 0 && <div className="rounded-[16px] border border-dashed border-[#dce3e9] px-4 py-6 text-center"><p className="mb-1 font-display text-xs font-bold text-[#34415a]">{tab === "Assigned" ? "No exercises assigned yet" : "Exercise catalog is empty"}</p><p className="mb-0 text-[10px] leading-relaxed text-[#8995a5]">{tab === "Assigned" ? "Your care team can add exercises to your plan." : "Check back after the exercise catalog is configured."}</p>{tab === "Assigned" && patientExercises.length > 0 && <button onClick={() => setTab("All exercises")} className="mt-3 text-[10px] font-bold text-[#168b8c]">Browse all exercises</button>}</div>}
      </div>
    </section>
  );
}

function LiveDoctorDashboard({ patients, exerciseList, showNotice }) {
  const [selectedPatient, setSelectedPatient] = useState(null);
  const [sessions, setSessions] = useState([]);
  const [feedback, setFeedback] = useState([]);
  const [exerciseIds, setExerciseIds] = useState([]);
  const [draft, setDraft] = useState("");
  const [query, setQuery] = useState("");
  const [loadingPatient, setLoadingPatient] = useState(false);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");
  const filteredPatients = patients.filter((patient) => `${patient.displayName} ${patient.email}`.toLowerCase().includes(query.toLowerCase()));

  useEffect(() => {
    if (!selectedPatient) return undefined;
    let cancelled = false;
    setLoadingPatient(true);
    setError("");
    const prefix = `/api/v1/patients/${encodeURIComponent(selectedPatient.uid)}`;
    Promise.all([
      apiRequest(`${prefix}/sessions`),
      apiRequest(`${prefix}/assignments`),
      apiRequest(`${prefix}/feedback`),
    ]).then(([sessionResult, assignmentResult, feedbackResult]) => {
      if (cancelled) return;
      setSessions(sessionResult.data);
      setExerciseIds(assignmentResult.data.map((item) => item.exerciseId || item.id));
      setFeedback(feedbackResult.data);
    }).catch((loadError) => {
      if (!cancelled) setError(loadError.message);
    }).finally(() => {
      if (!cancelled) setLoadingPatient(false);
    });
    return () => { cancelled = true; };
  }, [selectedPatient]);

  async function saveAssignments() {
    setSaving(true);
    setError("");
    try {
      const result = await apiRequest(`/api/v1/patients/${encodeURIComponent(selectedPatient.uid)}/assignments`, {
        method: "PUT",
        body: JSON.stringify({ exerciseIds }),
      });
      setExerciseIds(result.data.map((item) => item.id));
      showNotice("Exercise plan saved.");
    } catch (saveError) {
      setError(saveError.message);
    } finally {
      setSaving(false);
    }
  }

  async function sendFeedback() {
    if (!draft.trim()) return;
    setSaving(true);
    setError("");
    try {
      const result = await apiRequest(`/api/v1/patients/${encodeURIComponent(selectedPatient.uid)}/feedback`, {
        method: "POST",
        body: JSON.stringify({ message: draft.trim() }),
      });
      setFeedback((current) => [result.data, ...current]);
      setDraft("");
      showNotice("Feedback sent to the patient.");
    } catch (saveError) {
      setError(saveError.message);
    } finally {
      setSaving(false);
    }
  }

  if (selectedPatient) {
    return (
      <section className="pb-6 pt-5">
        <button onClick={() => setSelectedPatient(null)} className="mb-5 inline-flex items-center gap-2 text-xs font-bold text-[#168b8c]"><span aria-hidden="true" className="text-lg">←</span> All patients</button>
        <h1 className="font-display text-[25px] font-extrabold tracking-[-.8px] text-[#263b69]">{selectedPatient.displayName || "Patient"}</h1>
        <p className="mb-5 mt-1 break-all text-xs text-[#8190a0]">{selectedPatient.email || selectedPatient.uid}</p>
        {error && <p role="alert" className="mb-4 rounded-[14px] bg-[#fff1ef] px-3 py-2.5 text-[10px] leading-relaxed text-[#a3443d]">{error}</p>}
        {loadingPatient ? <div className="rounded-[15px] bg-[#f3f7fb] p-4 text-xs text-[#748598]">Loading this patient’s records…</div> : <>
          <div className="rounded-[17px] bg-[#e8f2fb] p-3"><p className="mb-1 text-[9px] text-[#748598]">Saved sessions</p><p className="mb-0 font-display text-xl font-extrabold text-[#263b69]">{sessions.length}</p></div>
          <div className="mt-5"><div className="flex items-center justify-between"><h2 className="mb-0 font-display text-sm font-bold text-[#263b69]">Exercise assignment</h2><span className="text-[9px] text-[#8995a5]">{exerciseIds.length} selected</span></div>
            <div className="mt-2 max-h-56 space-y-1 overflow-y-auto rounded-[16px] border border-[#edf0f3] p-3">{exerciseList.map((exercise) => <label key={exercise.id} className="flex min-h-10 items-center gap-2.5 text-[11px] text-[#34415a]"><input type="checkbox" checked={exerciseIds.includes(exercise.id)} onChange={(event) => setExerciseIds((current) => event.target.checked ? [...current, exercise.id] : current.filter((id) => id !== exercise.id))} className="h-4 w-4 accent-[#168b8c]" />{exercise.name}</label>)}</div>
            <button onClick={saveAssignments} disabled={saving || loadingPatient} className="mt-2 min-h-10 w-full rounded-[12px] bg-[#237eae] text-[10px] font-bold text-white disabled:opacity-55">{saving ? "Saving…" : "Save exercise plan"}</button>
          </div>
          <div className="mt-5"><h2 className="mb-2 font-display text-sm font-bold text-[#263b69]">Recent sessions</h2>{sessions.length ? <div className="space-y-2">{sessions.map((session) => <div key={session.id} className="rounded-[14px] border border-[#edf0f3] p-3"><div className="font-display text-xs font-bold text-[#263b69]">{session.exerciseName}</div><p className="mb-0 mt-1 text-[9px] text-[#8995a5]">{new Date(session.completedAt).toLocaleString([], { dateStyle: "medium", timeStyle: "short" })} · {formatDuration(session.durationSeconds)}</p><p className="mb-0 mt-2 text-[9px] text-[#748598]">{session.evaluation ? `AI review: ${session.evaluation.classLabel}` : "AI movement review unavailable"}</p></div>)}</div> : <p className="rounded-[14px] bg-[#f5f8fa] p-3 text-[10px] text-[#748598]">No sessions have been recorded yet.</p>}</div>
          <div className="mt-5"><h2 className="mb-2 font-display text-sm font-bold text-[#263b69]">Doctor feedback</h2><textarea value={draft} onChange={(event) => setDraft(event.target.value)} placeholder="Write a note for this patient…" rows="3" maxLength={1000} className="w-full resize-none rounded-[14px] border border-[#e5eaf0] p-3 text-xs text-[#34415a] outline-none focus:border-[#168b8c]" /><button onClick={sendFeedback} disabled={saving || !draft.trim()} className="mt-2 min-h-10 w-full rounded-[12px] border border-[#cfdde6] text-[10px] font-bold text-[#237eae] disabled:opacity-50">{saving ? "Saving…" : "Send feedback"}</button>
            {feedback.length > 0 && <div className="mt-3 space-y-2">{feedback.map((note) => <p key={note.id} className="mb-0 rounded-[13px] bg-[#f3f7fb] p-3 text-[10px] leading-relaxed text-[#52617a]">{note.message}</p>)}</div>}
          </div>
          <p className="mb-0 mt-4 rounded-[14px] bg-[#fff8ed] px-3 py-2.5 text-[9px] leading-relaxed text-[#886b46]">The workout preview does not collect video or produce a clinical movement assessment.</p>
        </>}
      </section>
    );
  }

  return (
    <section className="pb-6 pt-5">
      <h1 className="font-display text-[25px] font-extrabold tracking-[-.8px] text-[#263b69]">Patient overview</h1>
      <p className="mb-5 mt-1 text-xs text-[#8190a0]">Review activity and manage care plans for linked patients.</p>
      <label className="flex h-11 items-center gap-2 rounded-[13px] border border-[#e8edf1] px-3 text-[#8995a5]"><Icon name="user" className="h-4 w-4" /><input value={query} onChange={(event) => setQuery(event.target.value)} aria-label="Search patients" placeholder="Search patients" className="w-full bg-transparent text-xs text-[#34415a] outline-none placeholder:text-[#a0a9b3]" /></label>
      <div className="mt-5 flex items-center justify-between"><h2 className="mb-0 font-display text-sm font-bold text-[#263b69]">Your patients</h2><span className="text-[9px] text-[#8995a5]">{filteredPatients.length}</span></div>
      {filteredPatients.length ? <div className="mt-3 space-y-2.5">{filteredPatients.map((patient) => <button key={patient.uid} onClick={() => setSelectedPatient(patient)} className="flex w-full items-center gap-3 rounded-[16px] border border-[#edf0f3] p-3 text-left transition hover:border-[#c7e4df]"><span className="grid h-11 w-11 shrink-0 place-items-center rounded-full bg-[#e5edfa] font-display text-[11px] font-extrabold text-[#5878ab]">{(patient.displayName || patient.email || "P").slice(0, 2).toUpperCase()}</span><span className="min-w-0 flex-1"><span className="block font-display text-xs font-bold text-[#263750]">{patient.displayName || "Patient"}</span><span className="mt-1 block truncate text-[9px] text-[#8995a5]">{patient.email || patient.uid}</span></span><span aria-hidden="true" className="text-xl text-[#9ba5b1]">›</span></button>)}</div> : <div className="mt-3 rounded-[16px] border border-dashed border-[#dce3e9] px-4 py-7 text-center"><p className="mb-1 font-display text-xs font-bold text-[#34415a]">No linked patients yet</p><p className="mb-0 text-[10px] leading-relaxed text-[#8995a5]">A project administrator needs to link patient accounts to your clinician account before they appear here.</p></div>}
    </section>
  );
}

function App() {
  const [activePage, setActivePage] = useState("Home");
  const [notice, setNotice] = useState("");
  const [firebaseUser, setFirebaseUser] = useState(null);
  const [authLoading, setAuthLoading] = useState(true);
  const [profile, setProfile] = useState(null);
  const [profileLoading, setProfileLoading] = useState(false);
  const [profileError, setProfileError] = useState("");
  const [refreshKey, setRefreshKey] = useState(0);
  const [exerciseList, setExerciseList] = useState([]);
  const [assignedIds, setAssignedIds] = useState([]);
  const [sessions, setSessions] = useState([]);
  const [feedback, setFeedback] = useState([]);
  const [patients, setPatients] = useState([]);
  const [signingOut, setSigningOut] = useState(false);
  const userMode = profile?.role === "doctor" ? "Doctor" : "Patient";
  const appNavigation = userMode === "Doctor" ? [{ label: "Home", icon: "home" }, { label: "Patients", icon: "list" }, { label: "Profile", icon: "user" }] : navigation;

  useEffect(() => {
    if (!firebaseConfigured) {
      setAuthLoading(false);
      return undefined;
    }
    return observeAuth((user) => {
      setFirebaseUser(user);
      setProfile(null);
      setProfileError("");
      setProfileLoading(Boolean(user));
      setAuthLoading(false);
    });
  }, []);

  useEffect(() => {
    if (!firebaseUser) return undefined;
    let cancelled = false;
    setProfileLoading(true);
    setProfileError("");
    (async () => {
      try {
        const { data: loadedProfile } = await apiRequest("/api/v1/me");
        if (cancelled) return;
        setProfile(loadedProfile);
        if (loadedProfile.role === "doctor") {
          const [patientResult, exerciseResult] = await Promise.all([
            apiRequest("/api/v1/patients"),
            apiRequest("/api/v1/exercises"),
          ]);
          if (!cancelled) {
            setPatients(patientResult.data);
            setExerciseList(exerciseResult.data);
          }
        } else {
          const prefix = `/api/v1/patients/${encodeURIComponent(loadedProfile.uid)}`;
          const [exerciseResult, assignmentResult, sessionResult, feedbackResult] = await Promise.all([
            apiRequest("/api/v1/exercises"),
            apiRequest(`${prefix}/assignments`),
            apiRequest(`${prefix}/sessions`),
            apiRequest(`${prefix}/feedback`),
          ]);
          if (cancelled) return;
          setExerciseList(exerciseResult.data);
          setAssignedIds(assignmentResult.data.map((assignment) => assignment.exerciseId || assignment.id));
          setSessions(sessionResult.data);
          setFeedback(feedbackResult.data);
        }
      } catch (error) {
        if (!cancelled) setProfileError(error.message || "Couldn’t connect to the Rehab AI backend.");
      } finally {
        if (!cancelled) setProfileLoading(false);
      }
    })();
    return () => { cancelled = true; };
  }, [firebaseUser?.uid, refreshKey]);

  useEffect(() => {
    if (!notice) return undefined;
    const timeoutId = window.setTimeout(() => setNotice(""), 2400);
    return () => window.clearTimeout(timeoutId);
  }, [notice]);

  const showNotice = (message) => setNotice(message);

  async function completeWorkout(sessionInput) {
    const { data: session } = await apiRequest(`/api/v1/patients/${encodeURIComponent(profile.uid)}/sessions`, {
      method: "POST",
      body: JSON.stringify(sessionInput),
    });
    setSessions((current) => [session, ...current]);
    return session;
  }

  async function handleSignOut() {
    setSigningOut(true);
    try {
      await signOutUser();
      setActivePage("Home");
    } catch (error) {
      showNotice(error.message || "Couldn’t sign out. Please try again.");
    } finally {
      setSigningOut(false);
    }
  }

  if (authLoading || (firebaseUser && (profileLoading || (!profile && !profileError)))) {
    return <div className="grid min-h-screen place-items-center bg-[#f4f7f8] px-5"><div role="status" className="w-full max-w-[420px] rounded-[18px] bg-white p-5 text-center text-sm text-[#748598] shadow-sm">{authLoading ? "Checking your sign-in…" : "Loading your Rehab AI account…"}</div></div>;
  }
  if (!firebaseUser) return <AuthScreen />;
  if (profileError) {
    return <div className="grid min-h-screen place-items-center bg-[#f4f7f8] px-5"><div className="w-full max-w-[420px] rounded-[18px] bg-white p-5"><h1 className="font-display text-lg font-extrabold text-[#263b69]">Can’t load your account</h1><p role="alert" className="mt-2 text-sm leading-relaxed text-[#a3443d]">{profileError}</p><div className="mt-4 grid grid-cols-2 gap-2"><button onClick={() => setRefreshKey((value) => value + 1)} className="min-h-11 rounded-[12px] bg-[#237eae] text-xs font-bold text-white">Try again</button><button onClick={handleSignOut} disabled={signingOut} className="min-h-11 rounded-[12px] border border-[#dce3e9] text-xs font-bold text-[#53637a]">{signingOut ? "Signing out…" : "Sign out"}</button></div></div></div>;
  }
  const userName = profile.displayName || firebaseUser.displayName || firebaseUser.email?.split("@")[0] || "there";
  const latestFeedback = feedback[0]?.message || "No new feedback yet.";
  const weeklySessions = sessions.filter((session) => Date.now() - new Date(session.completedAt).getTime() < 7 * 24 * 60 * 60 * 1000).length;
  const nextExercise = exerciseList.find((exercise) => assignedIds.includes(exercise.id));

  return (
    <div className="mx-auto min-h-screen w-full max-w-[480px] overflow-hidden bg-white px-[22px] pb-[110px] text-[#24324a] shadow-[0_0_50px_#263b690b] sm:my-7 sm:min-h-[calc(100vh-3.5rem)] sm:rounded-[28px] max-[360px]:px-4">
      <header className="flex h-[62px] items-center justify-between">
        <a href="#home" aria-label="Rehab AI home" className="flex items-center gap-2 font-display text-[21px] font-extrabold tracking-[-1px] text-[#263b69]">
          <span className="grid h-[31px] w-[31px] place-items-center rounded-[11px] bg-[#e3f4ef] text-[#128886]"><Icon name="brand" className="h-[23px] w-[23px]" /></span>
          <span>rehab<span className="text-[#168b8c]">.ai</span></span>
        </a>
        <button onClick={() => showNotice("You’re all caught up.")} aria-label="Notifications" className="relative grid h-10 w-10 place-items-center rounded-[14px] bg-[#f6f8fa] text-[#52617a]">
          <Icon name="bell" />
          <span className="absolute right-[9px] top-2 h-[7px] w-[7px] rounded-full border-[1.5px] border-white bg-[#ef766b]" />
        </button>
      </header>

      <main id="home">
        <section aria-label={`${userMode} account`} className="flex min-h-[67px] items-center gap-[11px] border-b border-[#edf0f3] py-2">
          <div aria-hidden="true" className="grid h-[42px] w-[42px] shrink-0 place-items-center rounded-full bg-[#e4f2ef] font-display text-xs font-extrabold text-[#167d78]">{userName.slice(0, 2).toUpperCase()}</div>
          <div className="min-w-0 flex-1">
            <div className="truncate font-display text-sm font-bold text-[#273550]">{userName}</div>
            <div className="mt-[3px] truncate text-[11px] text-[#8691a0]">{userMode} account <span className="px-[3px]">·</span> {firebaseUser.email}</div>
          </div>
          <button onClick={handleSignOut} disabled={signingOut} className="rounded-[11px] bg-[#f1f5f8] px-2.5 py-2 text-[9px] font-bold text-[#52617a] disabled:opacity-55">{signingOut ? "Signing out…" : "Sign out"}</button>
        </section>

        {userMode === "Doctor" ? (
          activePage === "Profile" ? <section className="pb-6 pt-5"><h1 className="font-display text-[25px] font-extrabold text-[#263b69]">Your profile</h1><p className="mt-2 text-xs text-[#8190a0]">Clinician account · {firebaseUser.email}</p><button onClick={handleSignOut} disabled={signingOut} className="mt-5 min-h-11 w-full rounded-[13px] border border-[#dce3e9] text-xs font-bold text-[#53637a]">{signingOut ? "Signing out…" : "Sign out"}</button></section> : <LiveDoctorDashboard patients={patients} exerciseList={exerciseList} showNotice={showNotice} />
        ) : activePage === "Exercises" ? (
          <ExercisesPage onWorkoutComplete={completeWorkout} onViewProgress={() => setActivePage("Progress")} exerciseList={exerciseList} assignedIds={assignedIds} doctorFeedback={latestFeedback} />
        ) : activePage === "Progress" ? (
          <ProgressPage sessions={sessions} />
        ) : activePage === "Profile" ? (
          <section className="pb-6 pt-5"><h1 className="font-display text-[25px] font-extrabold text-[#263b69]">Your profile</h1><div className="mt-4 rounded-[16px] bg-[#f3f7fb] p-4"><p className="mb-1 text-[9px] text-[#8995a5]">Name</p><p className="mb-3 font-display text-sm font-bold text-[#34415a]">{userName}</p><p className="mb-1 text-[9px] text-[#8995a5]">Email</p><p className="mb-0 break-all text-xs text-[#34415a]">{firebaseUser.email}</p></div><button onClick={handleSignOut} disabled={signingOut} className="mt-4 min-h-11 w-full rounded-[13px] border border-[#dce3e9] text-xs font-bold text-[#53637a]">{signingOut ? "Signing out…" : "Sign out"}</button><p className="mb-0 mt-4 rounded-[14px] bg-[#fff8ed] px-3 py-2.5 text-[9px] leading-relaxed text-[#886b46]">Rehab AI is a rehabilitation support tool and does not replace advice from your clinician.</p></section>
        ) : (
          <>
        <section className="pb-[17px] pt-[21px]">
          <p className="mb-[7px] text-[9px] font-bold tracking-[1.15px] text-[#8995a5]">{new Date().toLocaleDateString([], { weekday: "long", month: "long", day: "numeric" }).toUpperCase()}</p>
          <h1 className="font-display text-[27px] font-extrabold leading-[1.14] tracking-[-1.15px] text-[#253653]">Good morning,<br /><span className="text-[#168b8c]">{userName}</span></h1>
          <p className="mt-2 text-xs text-[#8190a0]">A little movement goes a long way.</p>
        </section>

        <section aria-label="Rehabilitation services" className="grid grid-cols-3 gap-[10px] max-[360px]:gap-[7px]">
          {featureCards.map((card) => (
            <button key={card.title} onClick={() => card.title === "My exercises" || card.title === "Exercise guide" ? setActivePage("Exercises") : setActivePage("Progress")} className={`${card.tone} flex min-h-[122px] min-w-0 flex-col items-center rounded-[20px] px-2 py-[13px] text-center transition hover:-translate-y-0.5 hover:shadow-lg max-[360px]:min-h-[114px] max-[360px]:px-1`}>
              <span className="mb-[7px] grid h-10 w-10 place-items-center rounded-[14px] bg-white/75 text-[#298f83]"><Icon name={card.icon} className={`h-[29px] w-[29px] ${card.icon === "play" ? "text-[#ca875d]" : card.icon === "chart" ? "text-[#637dab]" : ""}`} /></span>
              <span className="w-full whitespace-nowrap font-display text-[11px] font-bold text-[#263750] max-[360px]:text-[10px]">{card.title}</span>
              <span className="mt-[3px] w-full text-[9px] text-[#7a8795]">{card.title === "My exercises" ? `${assignedIds.length} assigned` : card.detail}</span>
            </button>
          ))}
        </section>

        <section aria-labelledby="today-title" className="relative mt-[17px] flex min-h-[208px] overflow-hidden rounded-[22px] bg-[#e8f2fb]">
          <div className="relative z-10 w-[63%] py-[17px] pl-[17px] max-[360px]:w-[66%] max-[360px]:pl-[13px]">
            <div className="flex items-center gap-1.5 text-[8px] font-extrabold tracking-[.85px] text-[#50809b]"><span className="h-[7px] w-[7px] rounded-full bg-[#24a69a] shadow-[0_0_0_3px_#24a69a21]" /> YOUR PLAN TODAY</div>
            <h2 id="today-title" className="mb-1.5 mt-[11px] font-display text-xl font-extrabold leading-[1.18] tracking-[-.6px] text-[#263b69] max-[360px]:text-lg">Ready for a<br />guided session?</h2>
            <p className="mb-[11px] max-w-[195px] text-[10px] leading-[1.45] text-[#748598]">Follow your plan at your own pace. Your doctor can review your movement after.</p>
            <button onClick={() => setActivePage("Exercises")} className="inline-flex min-h-[34px] items-center gap-[13px] rounded-[11px] bg-[#237eae] px-[13px] text-[10px] font-bold text-white shadow-md shadow-[#237eae2b]">Start workout <span className="text-[15px]">→</span></button>
          </div>
          <MovementIllustration />
        </section>

        <section aria-label="Weekly workout summary" className="mt-3 grid grid-cols-2 gap-[10px]">
          <article className="min-h-[122px] rounded-[18px] border border-[#edf0f3] bg-white p-3 shadow-sm shadow-[#293f5c0a]">
            <div className="grid h-[25px] w-[25px] place-items-center rounded-[9px] bg-[#fff0f0] text-[15px] text-[#e86779]"><Icon name="heart" className="h-4 w-4" filled /></div>
            <div className="mt-2 text-[9px] text-[#8390a0]">This week</div>
            <div className="mt-0.5 font-display text-[17px] font-extrabold text-[#263b69]">{weeklySessions} <span className="font-sans text-[9px] font-medium text-[#7f8b9c]">sessions</span></div>
            <p className="mb-0 mt-[6px] text-[9px] text-[#7f8b9c]">completed in the last 7 days</p>
          </article>
          <article className="min-h-[122px] rounded-[18px] border border-[#edf0f3] bg-white p-3 shadow-sm shadow-[#293f5c0a]">
            <div className="flex items-center justify-between"><div className="grid h-[25px] w-[25px] place-items-center rounded-[9px] bg-[#eef4ff] text-[#5878ab]"><Icon name="sparkle" className="h-4 w-4" /></div><span className="rounded-full bg-[#f3f6f8] px-[7px] py-1 text-[8px] font-bold text-[#748598]">{feedback.length} total</span></div>
            <div className="mt-2 text-[9px] text-[#8390a0]">Doctor feedback</div>
            <div className="mt-[5px] overflow-hidden text-ellipsis whitespace-nowrap font-display text-[10px] font-bold text-[#34435b]">{latestFeedback}</div>
            <button onClick={() => setActivePage("Exercises")} className="mt-[7px] text-[9px] font-bold text-[#168b8c]">Open exercise details <span>→</span></button>
          </article>
        </section>

        <section aria-label="Next scheduled exercise" className="mt-3 flex items-center gap-[10px] rounded-[17px] border border-[#edf0f3] bg-[#fbfcfd] p-3">
          <div className="grid h-9 w-9 place-items-center rounded-xl bg-[#f0edfb] text-[#7a70ad]"><Icon name="calendar" /></div>
          <div><div className="text-[8px] font-extrabold tracking-[.8px] text-[#99a2ae]">YOUR PLAN</div><div className="mt-[3px] font-display text-[11px] font-bold text-[#34415a]">{nextExercise?.name || "No exercise assigned"}</div></div>
          <span className="ml-auto text-[25px] text-[#9ba5b1]" aria-hidden="true">›</span>
        </section>
          </>
        )}
      </main>

      <nav aria-label="Main navigation" className="fixed bottom-0 left-1/2 z-20 grid min-h-[72px] w-full max-w-[480px] -translate-x-1/2 grid-cols-4 border-t border-[#edf0f3] bg-white/95 px-[10px] pb-[calc(8px+env(safe-area-inset-bottom))] pt-2 backdrop-blur sm:bottom-7 sm:rounded-b-[28px]">
        {appNavigation.map((item) => {
          const active = activePage === item.label;
          return <button key={item.label} aria-current={active ? "page" : undefined} onClick={() => { if (item.label === "Home") setActivePage("Home"); else if (item.label === "Exercises" || item.label === "Progress" || item.label === "Patients") setActivePage(item.label); else if (item.label === "Profile") setActivePage("Profile"); }} className={`flex flex-col items-center justify-center gap-1 text-[9px] ${active ? "font-bold text-[#167eab]" : "text-[#8a96a6]"}`}>
            <Icon name={item.icon} className="h-[21px] w-[21px]" /><span>{item.label}</span>
          </button>;
        })}
      </nav>

      <div role="status" aria-live="polite" className={`fixed bottom-[86px] left-1/2 z-30 max-w-[calc(100vw-40px)] -translate-x-1/2 rounded-xl bg-[#263b69] px-[15px] py-2.5 text-[11px] text-white shadow-lg transition duration-200 ${notice ? "translate-y-0 opacity-100" : "pointer-events-none translate-y-3 opacity-0"}`}>
        {notice}
      </div>
    </div>
  );
}

export default App;
