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

function App() {
  const [activePage, setActivePage] = useState("Home");
  const [notice, setNotice] = useState("");

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
        <section aria-label="Patient account" className="flex min-h-[67px] items-center gap-[11px] border-b border-[#edf0f3] py-2">
          <div aria-hidden="true" className="grid h-[42px] w-[42px] shrink-0 place-items-center rounded-full bg-[#e4f2ef] font-display text-xs font-extrabold text-[#167d78]">KM</div>
          <div className="min-w-0 flex-1">
            <div className="font-display text-sm font-bold text-[#273550]">Kushagra Misra <span title="Patient profile" className="ml-0.5 inline-grid h-[15px] w-[15px] place-items-center rounded-full bg-[#dff3ee] text-[10px] font-bold text-[#198a7e]">✓</span></div>
            <div className="mt-[3px] text-[11px] text-[#8691a0]">Patient account <span className="px-[3px]">·</span> ID RA-2048</div>
          </div>
          <button onClick={() => showNotice("Profile settings are coming in a later part.")} aria-label="Profile options" className="grid h-[34px] w-[34px] place-items-center rounded-[14px] text-[#718097]"><Icon name="more" className="h-[22px] w-[22px]" /></button>
        </section>

        <section className="pb-[17px] pt-[21px]">
          <p className="mb-[7px] text-[9px] font-bold tracking-[1.15px] text-[#8995a5]">FRIDAY, OCTOBER 2</p>
          <h1 className="font-display text-[27px] font-extrabold leading-[1.14] tracking-[-1.15px] text-[#253653]">Good morning,<br /><span className="text-[#168b8c]">Kushagra</span></h1>
          <p className="mt-2 text-xs text-[#8190a0]">A little movement goes a long way.</p>
        </section>

        <section aria-label="Rehabilitation services" className="grid grid-cols-3 gap-[10px] max-[360px]:gap-[7px]">
          {featureCards.map((card) => (
            <button key={card.title} onClick={() => showNotice(card.message)} className={`${card.tone} flex min-h-[122px] min-w-0 flex-col items-center rounded-[20px] px-2 py-[13px] text-center transition hover:-translate-y-0.5 hover:shadow-lg max-[360px]:min-h-[114px] max-[360px]:px-1`}>
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
            <button onClick={() => showNotice("Workout mode will be built in Part 3.")} className="inline-flex min-h-[34px] items-center gap-[13px] rounded-[11px] bg-[#237eae] px-[13px] text-[10px] font-bold text-white shadow-md shadow-[#237eae2b]">Start workout <span className="text-[15px]">→</span></button>
          </div>
          <MovementIllustration />
        </section>

        <section aria-label="Weekly workout summary" className="mt-3 grid grid-cols-2 gap-[10px]">
          <article className="min-h-[122px] rounded-[18px] border border-[#edf0f3] bg-white p-3 shadow-sm shadow-[#293f5c0a]">
            <div className="grid h-[25px] w-[25px] place-items-center rounded-[9px] bg-[#fff0f0] text-[15px] text-[#e86779]"><Icon name="heart" className="h-4 w-4" filled /></div>
            <div className="mt-2 text-[9px] text-[#8390a0]">This week</div>
            <div className="mt-0.5 font-display text-[17px] font-extrabold text-[#263b69]">2 <span className="font-sans text-[9px] font-medium text-[#7f8b9c]">of 3 sessions</span></div>
            <div className="mt-[9px] h-[5px] overflow-hidden rounded-full bg-[#eef1f4]"><div className="h-full w-[67%] rounded-full bg-[#26a695]" /></div>
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
      </main>

      <nav aria-label="Main navigation" className="fixed bottom-0 left-1/2 z-20 grid min-h-[72px] w-full max-w-[480px] -translate-x-1/2 grid-cols-4 border-t border-[#edf0f3] bg-white/95 px-[10px] pb-[calc(8px+env(safe-area-inset-bottom))] pt-2 backdrop-blur sm:bottom-7 sm:rounded-b-[28px]">
        {navigation.map((item) => {
          const active = activePage === item.label;
          return <button key={item.label} aria-current={active ? "page" : undefined} onClick={() => { setActivePage(item.label); if (item.label !== "Home") showNotice(`${item.label} will be built in a later part.`); }} className={`flex flex-col items-center justify-center gap-1 text-[9px] ${active ? "font-bold text-[#167eab]" : "text-[#8a96a6]"}`}>
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
