import { useEffect, useState } from "react";

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

const exerciseCatalog = [
  { id: "arm-rotation", name: "Arm rotation", assigned: true, label: "ArmRotation", tone: "bg-[#e1f3ed]", icon: "exercise" },
  { id: "squat", name: "Squat", assigned: true, label: "Squat", tone: "bg-[#faeee2]", icon: "exercise" },
  { id: "body-twist", name: "Body twist", assigned: true, label: "BodyTwist", tone: "bg-[#e8eef9]", icon: "exercise" },
  { id: "arm-crossing", name: "Arm crossing", assigned: false, label: "ArmCrossing", tone: "bg-[#e1f3ed]", icon: "exercise" },
  { id: "hip-rotation", name: "Hip rotation", assigned: false, label: "HipRotation", tone: "bg-[#faeee2]", icon: "exercise" },
  { id: "body-rotation", name: "Body rotation", assigned: false, label: "BodyRotation", tone: "bg-[#e8eef9]", icon: "exercise" },
  { id: "step-jack", name: "Step jack", assigned: false, label: "StepJack", tone: "bg-[#e1f3ed]", icon: "exercise" },
  { id: "ab-twist", name: "Ab twist", assigned: false, label: "AbTwist", tone: "bg-[#faeee2]", icon: "exercise" },
  { id: "swing-arm-walk", name: "Swing arm walk", assigned: false, label: "SwingArmWalk", tone: "bg-[#e8eef9]", icon: "exercise" },
];

const demoPatients = [
  { id: "RA-2048", name: "Kushagra Misra", initials: "KM", condition: "Recovery plan", latest: "Squat · today", status: "Active" },
  { id: "RA-1832", name: "Aarav Shah", initials: "AS", condition: "Mobility plan", latest: "Arm rotation · yesterday", status: "Review" },
  { id: "RA-1657", name: "Maya Patel", initials: "MP", condition: "Strength plan", latest: "Body twist · Sep 29", status: "Active" },
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

function ExerciseDetails({ exercise, onBack, onStartWorkout }) {
  return (
    <section aria-labelledby="exercise-detail-title" className="pb-6 pt-5">
      <button onClick={onBack} className="mb-5 inline-flex items-center gap-2 text-xs font-bold text-[#168b8c]">
        <span aria-hidden="true" className="text-lg">←</span> Back to exercises
      </button>
      <div className="flex items-center gap-3">
        <span className={`grid h-14 w-14 place-items-center rounded-[18px] ${exercise.tone} text-[#298f83]`}><Icon name="exercise" className="h-8 w-8" /></span>
        <div>
          <p className="mb-1 text-[9px] font-extrabold uppercase tracking-[1px] text-[#8995a5]">{exercise.assigned ? "Assigned exercise · demo" : "Movement library · demo"}</p>
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
        <p className="font-display text-xs font-bold text-[#34415a]">Assigned by your care team</p>
        <p className="mt-1 text-[10px] text-[#778397]">Sample assignment shown for the frontend prototype.</p>
      </div>

      <div className="mt-3 rounded-[18px] border border-[#edf0f3] p-4">
        <div className="flex items-center gap-2 font-display text-xs font-bold text-[#34415a]"><Icon name="sparkle" className="h-4 w-4 text-[#5878ab]" /> Doctor feedback</div>
        <p className="mb-0 mt-2 text-[10px] leading-relaxed text-[#778397]">No feedback has been added to this sample assignment.</p>
      </div>

      <button onClick={onStartWorkout} className="mt-5 flex min-h-12 w-full items-center justify-center gap-2 rounded-[14px] bg-[#237eae] text-sm font-bold text-white shadow-md shadow-[#237eae2b]">
        Start exercise <span aria-hidden="true">→</span>
      </button>
      <p className="mt-2 text-center text-[9px] text-[#8995a5]">Opens an illustrative session preview; camera and AI are not connected.</p>
    </section>
  );
}

function formatDuration(seconds) {
  return `${String(Math.floor(seconds / 60)).padStart(2, "0")}:${String(seconds % 60).padStart(2, "0")}`;
}

function SessionSummary({ session, onBack, onViewProgress }) {
  const completedAt = new Date(session.completedAt);
  return (
    <section aria-labelledby="session-summary-title" className="pb-6 pt-5">
      <button onClick={onBack} className="mb-5 inline-flex items-center gap-2 text-xs font-bold text-[#168b8c]"><span aria-hidden="true" className="text-lg">←</span> Back</button>
      <div className="flex flex-col items-center rounded-[22px] bg-[#e1f3ed] px-5 py-6 text-center">
        <div className="grid h-14 w-14 place-items-center rounded-full bg-white text-[#198a7e]"><Icon name="check" className="h-7 w-7" /></div>
        <p className="mb-1 mt-4 text-[9px] font-extrabold uppercase tracking-[1px] text-[#4e8c7d]">DEMO SESSION COMPLETE</p>
        <h1 id="session-summary-title" className="font-display text-2xl font-extrabold text-[#263b69]">Nice work!</h1>
        <p className="mb-0 mt-1 text-xs text-[#668078]">Your session has been added to history.</p>
      </div>
      <div className="mt-4 rounded-[18px] border border-[#edf0f3] p-4">
        <div className="flex items-start justify-between gap-3"><div><p className="mb-1 text-[9px] font-bold uppercase tracking-[.8px] text-[#8995a5]">Exercise</p><p className="mb-0 font-display text-sm font-bold text-[#263b69]">{session.exerciseName}</p></div><span className="rounded-full bg-[#fff4df] px-2.5 py-1 text-[8px] font-bold text-[#9b7441]">DEMO</span></div>
        <div className="mt-4 grid grid-cols-2 gap-3">
          <div className="rounded-[13px] bg-[#f5f8fa] p-3"><p className="mb-1 text-[9px] text-[#8995a5]">Duration</p><p className="mb-0 font-display text-lg font-extrabold tabular-nums text-[#263b69]">{formatDuration(session.durationSeconds)}</p></div>
          <div className="rounded-[13px] bg-[#f5f8fa] p-3"><p className="mb-1 text-[9px] text-[#8995a5]">Sample score</p><p className="mb-0 font-display text-lg font-extrabold text-[#168b8c]">{session.score}%</p></div>
        </div>
        <p className="mb-0 mt-3 text-[9px] text-[#8995a5]">{completedAt.toLocaleString([], { dateStyle: "medium", timeStyle: "short" })}</p>
      </div>
      <div className="mt-3 rounded-[14px] bg-[#fff8ed] px-3 py-2.5 text-[9px] leading-relaxed text-[#886b46]">Demo only: the score is a sample UI value. No camera recording or AI movement analysis was performed.</div>
      <button onClick={onViewProgress} className="mt-5 min-h-12 w-full rounded-[14px] bg-[#237eae] text-xs font-bold text-white">View progress</button>
    </section>
  );
}

function WorkoutSession({ exercise, onBack, onComplete, onViewProgress }) {
  const [isRunning, setIsRunning] = useState(false);
  const [elapsed, setElapsed] = useState(0);
  const [showPose, setShowPose] = useState(true);
  const [completedSession, setCompletedSession] = useState(null);

  useEffect(() => {
    if (!isRunning) return undefined;
    const timerId = window.setInterval(() => setElapsed((seconds) => seconds + 1), 1000);
    return () => window.clearInterval(timerId);
  }, [isRunning]);

  const time = formatDuration(elapsed);

  if (completedSession) return <SessionSummary session={completedSession} onBack={onBack} onViewProgress={onViewProgress} />;

  const finishSession = () => {
    setIsRunning(false);
    const session = { id: `${Date.now()}`, exerciseName: exercise.name, exerciseLabel: exercise.label, durationSeconds: elapsed, score: 92, completedAt: new Date().toISOString(), isDemo: true };
    onComplete(session);
    setCompletedSession(session);
  };

  return (
    <section aria-labelledby="workout-title" className="pb-6 pt-5">
      <button onClick={onBack} className="mb-4 inline-flex items-center gap-2 text-xs font-bold text-[#168b8c]"><span aria-hidden="true" className="text-lg">←</span> Back to exercise</button>
      <div className="flex items-end justify-between">
        <div>
          <p className="mb-1 text-[9px] font-extrabold uppercase tracking-[1px] text-[#8995a5]">GUIDED WORKOUT · DEMO</p>
          <h1 id="workout-title" className="font-display text-[23px] font-extrabold tracking-[-.6px] text-[#263b69]">{exercise.name}</h1>
        </div>
        <div className="font-display text-sm font-bold tabular-nums text-[#263b69]">{time}</div>
      </div>

      <div className="relative mt-4 flex h-[310px] items-center justify-center overflow-hidden rounded-[22px] bg-gradient-to-b from-[#1e2e4c] to-[#354c70]">
        <div className="absolute inset-x-5 bottom-5 h-20 rounded-[50%] border border-white/10" />
        <div className="absolute left-3 top-3 flex items-center gap-1.5 rounded-full border border-white/10 bg-white/10 px-2.5 py-1.5 text-[8px] font-bold text-white/80">
          <Icon name="camera" className="h-3 w-3" /> DEMO CAMERA FRAME
        </div>
        <span className="absolute right-3 top-3 flex items-center gap-1.5 rounded-full bg-white/10 px-2.5 py-1.5 text-[8px] font-semibold text-white/75">
          <span className={`h-1.5 w-1.5 rounded-full ${isRunning ? "animate-pulse bg-[#59ddb1]" : "bg-[#f3c979]"}`} /> {isRunning ? "Tracking demo" : "Preview paused"}
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
          <div><p className="mb-0 text-[8px] font-bold uppercase tracking-[.8px] text-[#8995a5]">{isRunning ? "Sample detection" : "Ready when you are"}</p><p className="mb-0 mt-0.5 font-display text-xs font-bold text-[#263b69]">{isRunning ? exercise.label : "No live analysis"}</p></div>
        </div>
        {isRunning && <div className="text-right"><p className="mb-0 text-[8px] font-bold uppercase tracking-[.7px] text-[#8995a5]">Sample score</p><p className="mb-0 mt-0.5 font-display text-sm font-extrabold text-[#168b8c]">92%</p></div>}
      </div>

      <button role="switch" aria-checked={showPose} onClick={() => setShowPose((value) => !value)} className="mt-3 flex min-h-11 w-full items-center justify-between rounded-[15px] bg-[#f5f8fa] px-3 text-left">
        <span><span className="block text-[10px] font-bold text-[#34415a]">Pose keypoint overlay</span><span className="mt-0.5 block text-[9px] text-[#8995a5]">Show the illustrative skeleton points</span></span>
        <span className={`relative h-6 w-11 rounded-full transition ${showPose ? "bg-[#168b8c]" : "bg-[#cbd3dc]"}`}><span className={`absolute top-[3px] h-[18px] w-[18px] rounded-full bg-white shadow transition-all ${showPose ? "left-[21px]" : "left-[3px]"}`} /></span>
      </button>

      <div className="mt-3 rounded-[15px] bg-[#fff8ed] px-3 py-2.5 text-[9px] leading-relaxed text-[#886b46]">
        Demo only: the classification and 92% score are sample UI values, not a real movement assessment.
      </div>

      <div className="mt-4 grid grid-cols-2 gap-2.5">
        <button onClick={() => setIsRunning((value) => !value)} className="min-h-12 rounded-[14px] bg-[#237eae] text-xs font-bold text-white shadow-md shadow-[#237eae2b]">{isRunning ? "Pause" : elapsed > 0 ? "Resume" : "Start tracking"}</button>
        <button onClick={finishSession} disabled={!isRunning && elapsed === 0} className="min-h-12 rounded-[14px] border border-[#dce3e9] text-xs font-bold text-[#53637a] disabled:cursor-not-allowed disabled:opacity-45">Finish session</button>
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
      <p className="mb-5 mt-1 text-xs text-[#8190a0]">A simple view of your recent demo sessions.</p>
      <div className="rounded-[20px] bg-[#e8f2fb] p-4">
        <div className="flex items-end justify-between"><div><p className="mb-1 text-[9px] font-bold uppercase tracking-[.8px] text-[#66839b]">Last 7 days</p><p className="mb-0 font-display text-2xl font-extrabold text-[#263b69]">{weekCount}<span className="ml-1 text-xs font-semibold text-[#748598]">sessions</span></p></div><Icon name="chart" className="h-8 w-8 text-[#5878ab]" /></div>
        <div className="mt-3 h-1.5 overflow-hidden rounded-full bg-white"><div className="h-full rounded-full bg-[#26a695] transition-all" style={{ width: `${Math.min((weekCount / 3) * 100, 100)}%` }} /></div>
        <p className="mb-0 mt-2 text-[9px] text-[#748598]">Progress is based on demo sessions saved on this device.</p>
      </div>
      <div className="mt-6 flex items-center justify-between"><h2 className="mb-0 font-display text-sm font-bold text-[#263b69]">Recent workouts</h2><span className="text-[9px] text-[#8995a5]">{recentSessions.length} total</span></div>
      {recentSessions.length ? <div className="mt-3 space-y-2.5">{recentSessions.map((session) => <button key={session.id} onClick={() => setSelectedSession(session)} className="flex w-full items-center gap-3 rounded-[17px] border border-[#edf0f3] p-3 text-left transition hover:border-[#c7e4df]"><span className="grid h-11 w-11 shrink-0 place-items-center rounded-[14px] bg-[#e1f3ed] text-[#298f83]"><Icon name="exercise" className="h-6 w-6" /></span><span className="min-w-0 flex-1"><span className="block font-display text-xs font-bold text-[#263750]">{session.exerciseName}</span><span className="mt-1 block text-[9px] text-[#8995a5]">{new Date(session.completedAt).toLocaleDateString([], { dateStyle: "medium" })} · {formatDuration(session.durationSeconds)}</span></span><span className="rounded-full bg-[#fff4df] px-2 py-1 text-[8px] font-bold text-[#9b7441]">DEMO</span><span aria-hidden="true" className="text-xl text-[#9ba5b1]">›</span></button>)}</div> : <div className="mt-3 rounded-[18px] border border-dashed border-[#dce3e9] px-4 py-7 text-center"><div className="mx-auto grid h-11 w-11 place-items-center rounded-[14px] bg-[#f3f6f8] text-[#718097]"><Icon name="calendar" /></div><p className="mb-1 mt-3 font-display text-xs font-bold text-[#34415a]">No workouts yet</p><p className="mb-0 text-[10px] text-[#8995a5]">Finish a demo session to see it here.</p></div>}
      <div className="mt-4 rounded-[14px] bg-[#fff8ed] px-3 py-2.5 text-[9px] leading-relaxed text-[#886b46]">This prototype stores sessions in memory only. Closing or refreshing the app clears this demo history.</div>
    </section>
  );
}

function ExercisesPage({ onWorkoutComplete, onViewProgress }) {
  const [tab, setTab] = useState("Assigned");
  const [selected, setSelected] = useState(null);
  const [workoutOpen, setWorkoutOpen] = useState(false);
  const [completedSession, setCompletedSession] = useState(null);
  const exercises = tab === "Assigned" ? exerciseCatalog.filter((exercise) => exercise.assigned) : exerciseCatalog;

  if (completedSession) return <SessionSummary session={completedSession} onBack={() => setCompletedSession(null)} onViewProgress={onViewProgress} />;

  if (workoutOpen && selected) {
    return <WorkoutSession exercise={selected} onBack={() => setWorkoutOpen(false)} onComplete={(session) => { onWorkoutComplete(session); setCompletedSession(session); }} onViewProgress={onViewProgress} />;
  }

  if (selected) {
    return <ExerciseDetails exercise={selected} onBack={() => setSelected(null)} onStartWorkout={() => setWorkoutOpen(true)} />;
  }

  return (
    <section aria-labelledby="exercises-title" className="pb-6 pt-5">
      <p className="mb-1 text-[9px] font-extrabold uppercase tracking-[1px] text-[#8995a5]">YOUR MOVEMENT PLAN</p>
      <h1 id="exercises-title" className="font-display text-[25px] font-extrabold tracking-[-.8px] text-[#263b69]">My exercises</h1>
      <p className="mb-5 mt-1 text-xs text-[#8190a0]">Review your assignments and exercise guides.</p>

      <div role="tablist" aria-label="Exercise list" className="mb-4 grid grid-cols-2 rounded-[14px] bg-[#f3f6f8] p-1">
        {["Assigned", "All exercises"].map((item) => (
          <button key={item} role="tab" aria-selected={tab === item} onClick={() => setTab(item)} className={`min-h-9 rounded-[11px] text-[11px] font-bold transition ${tab === item ? "bg-white text-[#263b69] shadow-sm" : "text-[#8995a5]"}`}>
            {item}{item === "Assigned" ? " (3)" : " (9)"}
          </button>
        ))}
      </div>

      <div className="mb-3 flex items-start gap-2 rounded-[14px] bg-[#fff8ed] px-3 py-2.5 text-[9px] leading-relaxed text-[#886b46]">
        <span className="font-bold">Note</span><span>These are prototype exercise names. Clinical instructions and assignments must come from your care team.</span>
      </div>

      <div className="space-y-2.5">
        {exercises.map((exercise) => (
          <button key={exercise.id} onClick={() => setSelected(exercise)} className="flex w-full items-center gap-3 rounded-[18px] border border-[#edf0f3] bg-white p-3 text-left shadow-sm shadow-[#293f5c0a] transition hover:border-[#c7e4df] hover:shadow-md">
            <span className={`grid h-12 w-12 shrink-0 place-items-center rounded-[15px] ${exercise.tone} text-[#298f83}`}><Icon name="exercise" className="h-7 w-7" /></span>
            <span className="min-w-0 flex-1">
              <span className="flex items-center gap-2"><span className="font-display text-xs font-bold text-[#263750]">{exercise.name}</span>{exercise.assigned && <span className="rounded-full bg-[#e7f5ef] px-2 py-0.5 text-[8px] font-bold text-[#23836f]">Assigned</span>}</span>
              <span className="mt-1 block text-[9px] text-[#8995a5]">{exercise.assigned ? "Sample assignment · instructions pending" : "Movement class from Rehab AI demo"}</span>
            </span>
            <span className="text-xl text-[#9ba5b1]" aria-hidden="true">›</span>
          </button>
        ))}
      </div>
    </section>
  );
}

function DoctorDashboard({ sessions, showNotice }) {
  const [selectedPatient, setSelectedPatient] = useState(null);
  const [query, setQuery] = useState("");
  const [feedback, setFeedback] = useState({});
  const [assignments, setAssignments] = useState({});
  const filteredPatients = demoPatients.filter((patient) => `${patient.name} ${patient.id}`.toLowerCase().includes(query.toLowerCase()));

  if (selectedPatient) {
    const patientSessions = selectedPatient.id === "RA-2048" ? sessions : [];
    const assigned = assignments[selectedPatient.id] || ["Arm rotation", "Squat", "Body twist"];
    return (
      <section className="pb-6 pt-5">
        <button onClick={() => setSelectedPatient(null)} className="mb-5 inline-flex items-center gap-2 text-xs font-bold text-[#168b8c]"><span aria-hidden="true" className="text-lg">←</span> All patients</button>
        <div className="flex items-center gap-3"><span className="grid h-14 w-14 place-items-center rounded-full bg-[#e5edfa] font-display text-sm font-extrabold text-[#5878ab]">{selectedPatient.initials}</span><div><p className="mb-1 text-[9px] font-bold uppercase tracking-[.8px] text-[#8995a5]">{selectedPatient.id} · DEMO PATIENT</p><h1 className="mb-0 font-display text-xl font-extrabold text-[#263b69]">{selectedPatient.name}</h1></div></div>
        <div className="mt-4 grid grid-cols-2 gap-2.5"><div className="rounded-[16px] bg-[#e8f2fb] p-3"><p className="mb-1 text-[9px] text-[#748598]">Care plan</p><p className="mb-0 font-display text-xs font-bold text-[#263b69]">{selectedPatient.condition}</p></div><div className="rounded-[16px] bg-[#e1f3ed] p-3"><p className="mb-1 text-[9px] text-[#748598]">Recent activity</p><p className="mb-0 font-display text-xs font-bold text-[#263b69]">{patientSessions.length} demo sessions</p></div></div>
        <div className="mt-5"><div className="flex items-center justify-between"><h2 className="mb-0 font-display text-sm font-bold text-[#263b69]">Exercise assignment</h2><span className="text-[9px] text-[#8995a5]">Prototype</span></div><div className="mt-2 rounded-[17px] border border-[#edf0f3] p-3"><div className="max-h-48 space-y-2 overflow-y-auto">{exerciseCatalog.map((exercise) => <label key={exercise.id} className="flex items-center gap-2 text-[11px] text-[#34415a]"><input type="checkbox" checked={assigned.includes(exercise.name)} onChange={(event) => setAssignments((current) => ({ ...current, [selectedPatient.id]: event.target.checked ? [...assigned, exercise.name] : assigned.filter((name) => name !== exercise.name) }))} className="accent-[#168b8c]" />{exercise.name}</label>)}</div><button onClick={() => showNotice("Demo assignment saved for this screen only.")} className="mt-3 min-h-9 w-full rounded-[11px] bg-[#237eae] text-[10px] font-bold text-white">Save assignment</button></div></div>
        <div className="mt-5"><h2 className="mb-2 font-display text-sm font-bold text-[#263b69]">Workout results</h2>{patientSessions.length ? <div className="space-y-2">{patientSessions.map((session) => <div key={session.id} className="rounded-[15px] border border-[#edf0f3] p-3"><div className="flex justify-between"><span className="font-display text-xs font-bold text-[#263b69]">{session.exerciseName}</span><span className="rounded-full bg-[#fff4df] px-2 py-1 text-[8px] font-bold text-[#9b7441]">DEMO</span></div><p className="mb-0 mt-1 text-[9px] text-[#8995a5]">{new Date(session.completedAt).toLocaleString([], { dateStyle: "medium", timeStyle: "short" })} · {formatDuration(session.durationSeconds)}</p></div>)}</div> : <div className="rounded-[15px] bg-[#f5f8fa] p-3 text-[10px] text-[#8995a5]">No demo workout records available.</div>}</div>
        <div className="mt-5"><h2 className="mb-2 font-display text-sm font-bold text-[#263b69]">Doctor feedback</h2><textarea value={feedback[selectedPatient.id] || ""} onChange={(event) => setFeedback((current) => ({ ...current, [selectedPatient.id]: event.target.value }))} placeholder="Write a note for this patient..." rows="3" className="w-full resize-none rounded-[15px] border border-[#e5eaf0] p-3 text-xs text-[#34415a] outline-none focus:border-[#168b8c]" /><button onClick={() => showNotice("Demo feedback saved for this screen only.")} className="mt-2 min-h-10 w-full rounded-[12px] border border-[#cfdde6] text-[10px] font-bold text-[#237eae]">Save feedback</button></div>
        <p className="mb-0 mt-4 rounded-[14px] bg-[#fff8ed] px-3 py-2.5 text-[9px] leading-relaxed text-[#886b46]">All patient records and actions are sample UI only. Nothing is sent or saved to a clinical system.</p>
      </section>
    );
  }

  return (
    <section className="pb-6 pt-5">
      <p className="mb-1 text-[9px] font-extrabold uppercase tracking-[1px] text-[#8995a5]">CARE TEAM · DEMO</p><h1 className="font-display text-[25px] font-extrabold tracking-[-.8px] text-[#263b69]">Patient overview</h1><p className="mb-5 mt-1 text-xs text-[#8190a0]">Review activity and manage sample care plans.</p>
      <div className="grid grid-cols-2 gap-2.5"><div className="rounded-[16px] bg-[#e8f2fb] p-3"><p className="mb-1 text-[9px] text-[#748598]">Patients</p><p className="mb-0 font-display text-xl font-extrabold text-[#263b69]">{demoPatients.length}</p></div><div className="rounded-[16px] bg-[#e1f3ed] p-3"><p className="mb-1 text-[9px] text-[#748598]">Needs review</p><p className="mb-0 font-display text-xl font-extrabold text-[#263b69]">1</p></div></div>
      <label className="mt-4 flex h-11 items-center gap-2 rounded-[13px] border border-[#e8edf1] px-3 text-[#8995a5]"><Icon name="user" className="h-4 w-4"/><input value={query} onChange={(event) => setQuery(event.target.value)} aria-label="Search patients" placeholder="Search patients" className="w-full bg-transparent text-xs text-[#34415a] outline-none placeholder:text-[#a0a9b3]" /></label>
      <div className="mt-5 flex items-center justify-between"><h2 className="mb-0 font-display text-sm font-bold text-[#263b69]">Your patients</h2><span className="text-[9px] text-[#8995a5]">{filteredPatients.length} shown</span></div>
      <div className="mt-3 space-y-2.5">{filteredPatients.map((patient) => <button key={patient.id} onClick={() => setSelectedPatient(patient)} className="flex w-full items-center gap-3 rounded-[17px] border border-[#edf0f3] p-3 text-left transition hover:border-[#c7e4df]"><span className="grid h-11 w-11 shrink-0 place-items-center rounded-full bg-[#e5edfa] font-display text-[11px] font-extrabold text-[#5878ab]">{patient.initials}</span><span className="min-w-0 flex-1"><span className="flex items-center gap-2"><span className="font-display text-xs font-bold text-[#263750]">{patient.name}</span><span className={`rounded-full px-2 py-0.5 text-[8px] font-bold ${patient.status === "Review" ? "bg-[#fff4df] text-[#9b7441]" : "bg-[#e7f5ef] text-[#23836f]"}`}>{patient.status}</span></span><span className="mt-1 block text-[9px] text-[#8995a5]">{patient.id} · {patient.latest}</span></span><span aria-hidden="true" className="text-xl text-[#9ba5b1]">›</span></button>)}{filteredPatients.length === 0 && <p className="rounded-[15px] bg-[#f5f8fa] p-4 text-center text-xs text-[#8995a5]">No matching patients.</p>}</div>
      <p className="mb-0 mt-4 rounded-[14px] bg-[#fff8ed] px-3 py-2.5 text-[9px] leading-relaxed text-[#886b46]">Demo patient data only. This dashboard is not connected to real patient records.</p>
    </section>
  );
}

function App() {
  const [activePage, setActivePage] = useState("Home");
  const [userMode, setUserMode] = useState("Patient");
  const [notice, setNotice] = useState("");
  const [sessions, setSessions] = useState([]);
  const appNavigation = userMode === "Doctor" ? [{ label: "Home", icon: "home" }, { label: "Patients", icon: "list" }, { label: "Profile", icon: "user" }] : navigation;

  useEffect(() => {
    if (!notice) return undefined;
    const timeoutId = window.setTimeout(() => setNotice(""), 2400);
    return () => window.clearTimeout(timeoutId);
  }, [notice]);

  const showNotice = (message) => setNotice(message);

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
          <div aria-hidden="true" className="grid h-[42px] w-[42px] shrink-0 place-items-center rounded-full bg-[#e4f2ef] font-display text-xs font-extrabold text-[#167d78]">{userMode === "Doctor" ? "DR" : "KM"}</div>
          <div className="min-w-0 flex-1">
            <div className="font-display text-sm font-bold text-[#273550]">{userMode === "Doctor" ? "Dr. Taylor Morgan" : "Kushagra Misra"} <span title="Demo profile" className="ml-0.5 inline-grid h-[15px] w-[15px] place-items-center rounded-full bg-[#dff3ee] text-[10px] font-bold text-[#198a7e]">✓</span></div>
            <div className="mt-[3px] text-[11px] text-[#8691a0]">{userMode} account <span className="px-[3px]">·</span> Demo</div>
          </div>
          <button onClick={() => { setUserMode((mode) => mode === "Patient" ? "Doctor" : "Patient"); setActivePage("Home"); }} aria-label={`Switch to ${userMode === "Patient" ? "doctor" : "patient"} demo view`} className="rounded-[11px] bg-[#f1f5f8] px-2.5 py-2 text-[9px] font-bold text-[#52617a]">{userMode === "Patient" ? "Doctor view" : "Patient view"}</button>
        </section>

        {userMode === "Doctor" ? (
          <DoctorDashboard sessions={sessions} showNotice={showNotice} />
        ) : activePage === "Exercises" ? (
          <ExercisesPage onWorkoutComplete={(session) => setSessions((current) => [session, ...current])} onViewProgress={() => setActivePage("Progress")} />
        ) : activePage === "Progress" ? (
          <ProgressPage sessions={sessions} />
        ) : (
          <>
        <section className="pb-[17px] pt-[21px]">
          <p className="mb-[7px] text-[9px] font-bold tracking-[1.15px] text-[#8995a5]">FRIDAY, OCTOBER 2</p>
          <h1 className="font-display text-[27px] font-extrabold leading-[1.14] tracking-[-1.15px] text-[#253653]">Good morning,<br /><span className="text-[#168b8c]">Kushagra</span></h1>
          <p className="mt-2 text-xs text-[#8190a0]">A little movement goes a long way.</p>
        </section>

        <section aria-label="Rehabilitation services" className="grid grid-cols-3 gap-[10px] max-[360px]:gap-[7px]">
          {featureCards.map((card) => (
            <button key={card.title} onClick={() => card.title === "My exercises" || card.title === "Exercise guide" ? setActivePage("Exercises") : setActivePage("Progress")} className={`${card.tone} flex min-h-[122px] min-w-0 flex-col items-center rounded-[20px] px-2 py-[13px] text-center transition hover:-translate-y-0.5 hover:shadow-lg max-[360px]:min-h-[114px] max-[360px]:px-1`}>
              <span className="mb-[7px] grid h-10 w-10 place-items-center rounded-[14px] bg-white/75 text-[#298f83]"><Icon name={card.icon} className={`h-[29px] w-[29px] ${card.icon === "play" ? "text-[#ca875d]" : card.icon === "chart" ? "text-[#637dab]" : ""}`} /></span>
              <span className="w-full whitespace-nowrap font-display text-[11px] font-bold text-[#263750] max-[360px]:text-[10px]">{card.title}</span>
              <span className="mt-[3px] w-full text-[9px] text-[#7a8795]">{card.detail}</span>
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
            <div className="mt-0.5 font-display text-[17px] font-extrabold text-[#263b69]">{sessions.filter((session) => Date.now() - new Date(session.completedAt).getTime() < 7 * 24 * 60 * 60 * 1000).length} <span className="font-sans text-[9px] font-medium text-[#7f8b9c]">of 3 sessions</span></div>
            <div className="mt-[9px] h-[5px] overflow-hidden rounded-full bg-[#eef1f4]"><div className="h-full rounded-full bg-[#26a695] transition-all" style={{ width: `${Math.min((sessions.filter((session) => Date.now() - new Date(session.completedAt).getTime() < 7 * 24 * 60 * 60 * 1000).length / 3) * 100, 100)}%` }} /></div>
          </article>
          <article className="min-h-[122px] rounded-[18px] border border-[#edf0f3] bg-white p-3 shadow-sm shadow-[#293f5c0a]">
            <div className="flex items-center justify-between"><div className="grid h-[25px] w-[25px] place-items-center rounded-[9px] bg-[#eef4ff] text-[#5878ab]"><Icon name="sparkle" className="h-4 w-4" /></div><span className="rounded-full bg-[#fef2e9] px-[7px] py-1 text-[8px] font-bold text-[#bc8050]">1 new</span></div>
            <div className="mt-2 text-[9px] text-[#8390a0]">Doctor feedback</div>
            <div className="mt-[5px] overflow-hidden text-ellipsis whitespace-nowrap font-display text-[10px] font-bold text-[#34435b]">You’re building a great routine.</div>
            <button onClick={() => showNotice("Doctor feedback details will be available in Part 2.")} className="mt-[7px] text-[9px] font-bold text-[#168b8c]">View note <span>→</span></button>
          </article>
        </section>

        <section aria-label="Next scheduled exercise" className="mt-3 flex items-center gap-[10px] rounded-[17px] border border-[#edf0f3] bg-[#fbfcfd] p-3">
          <div className="grid h-9 w-9 place-items-center rounded-xl bg-[#f0edfb] text-[#7a70ad]"><Icon name="calendar" /></div>
          <div><div className="text-[8px] font-extrabold tracking-[.8px] text-[#99a2ae]">UP NEXT</div><div className="mt-[3px] font-display text-[11px] font-bold text-[#34415a]">Arm rotations <span className="font-sans text-[9px] font-medium text-[#8994a1]">· 8 min</span></div></div>
          <span className="ml-auto text-[25px] text-[#9ba5b1]" aria-hidden="true">›</span>
        </section>
          </>
        )}
      </main>

      <nav aria-label="Main navigation" className="fixed bottom-0 left-1/2 z-20 grid min-h-[72px] w-full max-w-[480px] -translate-x-1/2 grid-cols-4 border-t border-[#edf0f3] bg-white/95 px-[10px] pb-[calc(8px+env(safe-area-inset-bottom))] pt-2 backdrop-blur sm:bottom-7 sm:rounded-b-[28px]">
        {appNavigation.map((item) => {
          const active = activePage === item.label;
          return <button key={item.label} aria-current={active ? "page" : undefined} onClick={() => { if (item.label === "Home" || item.label === "Exercises" || item.label === "Progress" || item.label === "Patients") setActivePage(item.label); else showNotice(`${item.label} settings are planned for a later part.`); }} className={`flex flex-col items-center justify-center gap-1 text-[9px] ${active ? "font-bold text-[#167eab]" : "text-[#8a96a6]"}`}>
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
