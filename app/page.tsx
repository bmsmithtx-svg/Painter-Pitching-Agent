"use client";

import { FormEvent, MouseEvent, useEffect, useState } from "react";

const ADMIN_USERNAME = "CodyPainter";
const ADMIN_PASSWORD = "BobbyCoxField";
const AUTH_KEY = "painter-pitching-agent-auth";
const SESSIONS_KEY = "painter-pitching-agent-bullpen-sessions";

const pitchTypes = ["Curveball", "Slider", "Cutter", "4-Seam Fastball", "2-Seam Fastball", "Changeup"] as const;
const pitchLocations = ["1", "2", "3", "4", "Top", "Split 3/4", "Split 1/2", "Dirt", "Up/In"] as const;

type PitchType = (typeof pitchTypes)[number];
type PitchLocation = (typeof pitchLocations)[number];
type ActiveTab = "location" | "log";

type Pitch = {
  id: string;
  number: number;
  type: PitchType;
  location: PitchLocation;
  isStrike: boolean;
  isExecuted: boolean;
  x: number;
  y: number;
};

type BullpenSession = {
  id: string;
  name: string;
  createdAt: string;
  pitches: Pitch[];
};

function createSession(name: string): BullpenSession {
  return {
    id: crypto.randomUUID(),
    name: name.trim() || "New Bullpen Session",
    createdAt: new Date().toISOString(),
    pitches: []
  };
}

export default function Home() {
  const [isReady, setIsReady] = useState(false);
  const [isAuthed, setIsAuthed] = useState(false);
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [sessionName, setSessionName] = useState("New Bullpen Session");
  const [activeSession, setActiveSession] = useState<BullpenSession | null>(null);
  const [savedSessions, setSavedSessions] = useState<BullpenSession[]>([]);
  const [activeTab, setActiveTab] = useState<ActiveTab>("location");
  const [selectedPitchType, setSelectedPitchType] = useState<PitchType>("Curveball");
  const [selectedLocation, setSelectedLocation] = useState<PitchLocation>("1");
  const [isStrike, setIsStrike] = useState(false);
  const [isExecuted, setIsExecuted] = useState(false);

  useEffect(() => {
    setIsAuthed(window.localStorage.getItem(AUTH_KEY) === "true");
    const storedSessions = window.localStorage.getItem(SESSIONS_KEY);
    if (storedSessions) {
      try {
        const parsedSessions = JSON.parse(storedSessions) as BullpenSession[];
        setSavedSessions(parsedSessions);
      } catch {
        window.localStorage.removeItem(SESSIONS_KEY);
      }
    }
    setIsReady(true);
  }, []);

  function handleLogin(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (username === ADMIN_USERNAME && password === ADMIN_PASSWORD) {
      window.localStorage.setItem(AUTH_KEY, "true");
      setIsAuthed(true);
      setError("");
      return;
    }

    setError("Invalid username or password.");
  }

  function handleLogout() {
    window.localStorage.removeItem(AUTH_KEY);
    setIsAuthed(false);
    setPassword("");
  }

  function startSession() {
    const nextSession = createSession(sessionName);
    setActiveSession(nextSession);
    persistSessions([nextSession, ...savedSessions]);
    setActiveTab("location");
  }

  function persistSessions(nextSessions: BullpenSession[]) {
    setSavedSessions(nextSessions);
    window.localStorage.setItem(SESSIONS_KEY, JSON.stringify(nextSessions));
  }

  function updateSession(nextSession: BullpenSession) {
    setActiveSession(nextSession);
    persistSessions(savedSessions.map((session) => (session.id === nextSession.id ? nextSession : session)));
  }

  function reopenSession(session: BullpenSession) {
    setActiveSession(session);
    setActiveTab("location");
  }

  function renameActiveSession(name: string) {
    if (!activeSession) {
      return;
    }

    updateSession({ ...activeSession, name });
  }

  function handleZoneClick(event: MouseEvent<HTMLDivElement>) {
    if (!activeSession) {
      return;
    }

    const rect = event.currentTarget.getBoundingClientRect();
    const x = ((event.clientX - rect.left) / rect.width) * 100;
    const y = ((event.clientY - rect.top) / rect.height) * 100;

    const nextPitch: Pitch = {
      id: crypto.randomUUID(),
      number: activeSession.pitches.length + 1,
      type: selectedPitchType,
      location: selectedLocation,
      isStrike,
      isExecuted,
      x: Math.max(0, Math.min(100, x)),
      y: Math.max(0, Math.min(100, y))
    };

    updateSession({
      ...activeSession,
      pitches: [...activeSession.pitches, nextPitch]
    });
  }

  if (!isReady) {
    return (
      <main className="flex min-h-screen items-center justify-center px-6">
        <div className="h-12 w-12 rounded-full border-4 border-forest/20 border-t-forest" />
      </main>
    );
  }

  if (!isAuthed) {
    return <LoginView error={error} password={password} setPassword={setPassword} setUsername={setUsername} username={username} onLogin={handleLogin} />;
  }

  return (
    <main className="min-h-screen px-6 py-6 lg:px-10">
      <header className="mx-auto flex max-w-7xl flex-wrap items-center justify-between gap-4 rounded-3xl border border-forest/10 bg-white px-6 py-5 shadow-card">
        <div>
          <p className="text-sm font-bold uppercase tracking-[0.18em] text-gold">Painter Pitching Agent</p>
          <h1 className="mt-1 text-3xl font-black text-forest">Admin Dashboard</h1>
        </div>
        <button className="rounded-xl border border-forest/15 px-5 py-3 font-black text-forest hover:bg-cream" onClick={handleLogout}>
          Log Out
        </button>
      </header>

      <section className="mx-auto mt-6 grid max-w-7xl gap-6 xl:grid-cols-[360px_1fr]">
        <aside className="rounded-3xl border border-forest/10 bg-white p-6 shadow-card">
          <h2 className="text-2xl font-black text-forest">Start Bullpen Session</h2>
          <label className="mt-5 grid gap-2 text-sm font-bold text-forest">
            Session Name
            <input
              className="rounded-xl border border-forest/15 bg-white px-4 py-4 text-lg outline-none ring-gold/30 transition focus:border-gold focus:ring-4"
              value={sessionName}
              onChange={(event) => setSessionName(event.target.value)}
            />
          </label>
          <button className="mt-5 w-full rounded-xl bg-gold px-5 py-4 text-lg font-black text-forest transition hover:bg-[#e3bb55]" onClick={startSession}>
            Start New Bullpen
          </button>

          <div className="mt-8 border-t border-forest/10 pt-6">
            <h2 className="text-2xl font-black text-forest">Saved Bullpens</h2>
            <div className="mt-4 grid gap-3">
              {savedSessions.length ? (
                savedSessions.map((session) => (
                  <button
                    className={`rounded-2xl border p-4 text-left transition hover:border-gold hover:bg-cream/60 ${
                      activeSession?.id === session.id ? "border-gold bg-cream" : "border-forest/10 bg-white"
                    }`}
                    key={session.id}
                    onClick={() => reopenSession(session)}
                  >
                    <span className="block text-base font-black text-forest">{session.name}</span>
                    <span className="mt-1 block text-sm font-bold text-forest/60">{session.pitches.length} pitches</span>
                  </button>
                ))
              ) : (
                <p className="rounded-2xl bg-cream/70 p-4 text-sm font-bold text-forest/60">Saved bullpen sessions will appear here.</p>
              )}
            </div>
          </div>
        </aside>

        <section className="rounded-3xl border border-forest/10 bg-white p-6 shadow-card">
          {activeSession ? (
            <PitchTracker
              activeTab={activeTab}
              isExecuted={isExecuted}
              isStrike={isStrike}
              pitchType={selectedPitchType}
              session={activeSession}
              selectedLocation={selectedLocation}
              setActiveTab={setActiveTab}
              setIsExecuted={setIsExecuted}
              setIsStrike={setIsStrike}
              setPitchType={setSelectedPitchType}
              setSelectedLocation={setSelectedLocation}
              onRename={renameActiveSession}
              onZoneClick={handleZoneClick}
            />
          ) : (
            <div className="flex min-h-[620px] items-center justify-center rounded-2xl border border-dashed border-forest/20 bg-cream/50 p-8 text-center">
              <div>
                <p className="text-sm font-bold uppercase tracking-[0.16em] text-gold">No Active Bullpen</p>
                <h2 className="mt-2 text-4xl font-black text-forest">Start a bullpen session</h2>
                <p className="mt-3 text-lg font-semibold text-forest/65">Name the bullpen and press Start New Bullpen.</p>
              </div>
            </div>
          )}
        </section>
      </section>
    </main>
  );
}

function LoginView({
  error,
  password,
  setPassword,
  setUsername,
  username,
  onLogin
}: {
  error: string;
  password: string;
  setPassword: (value: string) => void;
  setUsername: (value: string) => void;
  username: string;
  onLogin: (event: FormEvent<HTMLFormElement>) => void;
}) {
  return (
    <main className="flex min-h-screen items-center justify-center px-6 py-10">
      <section className="grid w-full max-w-5xl overflow-hidden rounded-3xl border border-forest/10 bg-white shadow-card lg:grid-cols-[1fr_0.9fr]">
        <div className="bg-forest p-10 text-white">
          <p className="text-sm font-bold uppercase tracking-[0.18em] text-gold">Painter Pitching Agent</p>
          <h1 className="mt-5 text-5xl font-black leading-tight">Bullpen pitch tracker</h1>
          <p className="mt-5 max-w-xl text-lg leading-8 text-white/78">A clean local dashboard for bullpen command and execution tracking.</p>
        </div>

        <form className="flex flex-col gap-5 p-8 sm:p-10" onSubmit={onLogin}>
          <div>
            <h2 className="text-3xl font-black text-forest">Coach Login</h2>
            <p className="mt-2 text-sm font-semibold text-forest/60">Sign in to manage bullpen sessions.</p>
          </div>

          <label className="grid gap-2 text-sm font-bold text-forest">
            Username
            <input
              className="rounded-xl border border-forest/15 bg-cream/40 px-4 py-4 text-lg outline-none ring-gold/30 transition focus:border-gold focus:ring-4"
              value={username}
              onChange={(event) => setUsername(event.target.value)}
              autoComplete="username"
            />
          </label>

          <label className="grid gap-2 text-sm font-bold text-forest">
            Password
            <input
              className="rounded-xl border border-forest/15 bg-cream/40 px-4 py-4 text-lg outline-none ring-gold/30 transition focus:border-gold focus:ring-4"
              type="password"
              value={password}
              onChange={(event) => setPassword(event.target.value)}
              autoComplete="current-password"
            />
          </label>

          {error ? <p className="rounded-xl bg-red-50 px-4 py-3 text-sm font-bold text-red-700">{error}</p> : null}

          <button className="rounded-xl bg-forest px-5 py-4 text-lg font-black text-white transition hover:bg-grass" type="submit">
            Log In
          </button>
        </form>
      </section>
    </main>
  );
}

function PitchTracker({
  activeTab,
  isExecuted,
  isStrike,
  pitchType,
  session,
  selectedLocation,
  setActiveTab,
  setIsExecuted,
  setIsStrike,
  setPitchType,
  setSelectedLocation,
  onRename,
  onZoneClick
}: {
  activeTab: ActiveTab;
  isExecuted: boolean;
  isStrike: boolean;
  pitchType: PitchType;
  session: BullpenSession;
  selectedLocation: PitchLocation;
  setActiveTab: (value: ActiveTab) => void;
  setIsExecuted: (value: boolean) => void;
  setIsStrike: (value: boolean) => void;
  setPitchType: (value: PitchType) => void;
  setSelectedLocation: (value: PitchLocation) => void;
  onRename: (value: string) => void;
  onZoneClick: (event: MouseEvent<HTMLDivElement>) => void;
}) {
  return (
    <div>
      <div className="flex flex-wrap items-start justify-between gap-4">
        <div>
          <p className="text-sm font-bold uppercase tracking-[0.16em] text-gold">Bullpen</p>
          <input
            className="mt-1 w-full max-w-xl rounded-xl border border-transparent bg-transparent px-0 text-3xl font-black text-forest outline-none ring-gold/30 transition focus:border-gold focus:bg-white focus:px-3 focus:ring-4"
            value={session.name}
            onChange={(event) => onRename(event.target.value)}
          />
        </div>
        <span className="rounded-full bg-cream px-4 py-2 text-sm font-black text-forest">{session.pitches.length} Pitches</span>
      </div>

      <div className="mt-6 flex flex-wrap gap-3 border-b border-forest/10 pb-3">
        <TabButton isActive={activeTab === "location"} onClick={() => setActiveTab("location")}>
          Interactive Pitch Location
        </TabButton>
        <TabButton isActive={activeTab === "log"} onClick={() => setActiveTab("log")}>
          Pitch Log
        </TabButton>
      </div>

      {activeTab === "location" ? (
        <div className="mt-6 grid gap-6 lg:grid-cols-[minmax(320px,560px)_1fr]">
          <div className="rounded-3xl border border-forest/10 bg-cream/55 p-5">
            <div
              className="relative mx-auto aspect-[0.72] max-h-[680px] min-h-[500px] w-full max-w-[500px] cursor-crosshair rounded-3xl border-8 border-gold/55 bg-white shadow-inner"
              onClick={onZoneClick}
            >
              <div className="absolute inset-[14%_18%] grid grid-cols-3 grid-rows-3 border-4 border-forest">
                {Array.from({ length: 9 }).map((_, index) => (
                  <div className="border border-forest/35" key={index} />
                ))}
              </div>
              {session.pitches.map((pitch) => (
                <span
                  className="absolute h-5 w-5 -translate-x-1/2 -translate-y-1/2 rounded-full border-2 border-white bg-gold shadow-[0_0_0_2px_rgba(15,61,46,0.9)]"
                  key={pitch.id}
                  style={{ left: `${pitch.x}%`, top: `${pitch.y}%` }}
                  title={`Pitch ${pitch.number}`}
                />
              ))}
            </div>
          </div>

          <div className="rounded-3xl border border-forest/10 bg-white p-5 shadow-sm">
            <h3 className="text-2xl font-black text-forest">Current Pitch</h3>
            <div className="mt-5 grid gap-4">
              <SelectControl label="Pitch Type" value={pitchType} values={pitchTypes} onChange={(value) => setPitchType(value as PitchType)} />
              <SelectControl label="Pitch Location" value={selectedLocation} values={pitchLocations} onChange={(value) => setSelectedLocation(value as PitchLocation)} />
              <label className="flex items-center justify-between gap-4 rounded-2xl border border-forest/10 bg-cream/50 px-4 py-4 text-lg font-black text-forest">
                Strike
                <input className="h-7 w-7 accent-grass" checked={isStrike} type="checkbox" onChange={(event) => setIsStrike(event.target.checked)} />
              </label>
              <label className="flex items-center justify-between gap-4 rounded-2xl border border-forest/10 bg-cream/50 px-4 py-4 text-lg font-black text-forest">
                Execute
                <input className="h-7 w-7 accent-gold" checked={isExecuted} type="checkbox" onChange={(event) => setIsExecuted(event.target.checked)} />
              </label>
            </div>
          </div>
        </div>
      ) : (
        <PitchLog pitches={session.pitches} />
      )}
    </div>
  );
}

function PitchLog({ pitches }: { pitches: Pitch[] }) {
  if (!pitches.length) {
    return (
      <div className="mt-6 rounded-2xl border border-dashed border-forest/20 bg-cream/50 p-8 text-center text-lg font-bold text-forest/65">
        Click the strike zone to log the first pitch.
      </div>
    );
  }

  return (
    <div className="mt-6 overflow-x-auto rounded-3xl border border-forest/10">
      <table className="w-full min-w-[820px] border-collapse bg-white text-left">
        <thead className="bg-forest text-white">
          <tr>
            <TableHead>Pitch</TableHead>
            <TableHead>Type</TableHead>
            <TableHead>Location</TableHead>
            <TableHead>Strike</TableHead>
            <TableHead>Execute</TableHead>
            <TableHead>Clicked Location</TableHead>
          </tr>
        </thead>
        <tbody>
          {pitches.map((pitch) => (
            <tr className="border-t border-forest/10" key={pitch.id}>
              <TableCell>#{pitch.number}</TableCell>
              <TableCell>{pitch.type}</TableCell>
              <TableCell>{pitch.location}</TableCell>
              <TableCell>{pitch.isStrike ? "Yes" : "No"}</TableCell>
              <TableCell>{pitch.isExecuted ? "Yes" : "No"}</TableCell>
              <TableCell>
                <div className="flex items-center gap-3">
                  <div className="relative h-20 w-16 rounded-lg border-2 border-gold/60 bg-cream">
                    <div className="absolute inset-[16%_20%] grid grid-cols-3 grid-rows-3 border-2 border-forest">
                      {Array.from({ length: 9 }).map((_, index) => (
                        <div className="border border-forest/25" key={index} />
                      ))}
                    </div>
                    <span className="absolute h-3 w-3 -translate-x-1/2 -translate-y-1/2 rounded-full bg-gold ring-2 ring-forest" style={{ left: `${pitch.x}%`, top: `${pitch.y}%` }} />
                  </div>
                  <span className="font-mono text-sm text-forest/70">
                    x {pitch.x.toFixed(1)}, y {pitch.y.toFixed(1)}
                  </span>
                </div>
              </TableCell>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

function TableHead({ children }: { children: React.ReactNode }) {
  return <th className="px-4 py-4 text-sm font-black uppercase tracking-[0.1em]">{children}</th>;
}

function TableCell({ children }: { children: React.ReactNode }) {
  return <td className="px-4 py-4 text-base font-bold text-forest">{children}</td>;
}

function TabButton({ children, isActive, onClick }: { children: React.ReactNode; isActive: boolean; onClick: () => void }) {
  return (
    <button className={`rounded-xl px-5 py-3 text-base font-black transition ${isActive ? "bg-forest text-white" : "bg-cream text-forest hover:bg-gold/30"}`} onClick={onClick}>
      {children}
    </button>
  );
}

function SelectControl({
  label,
  value,
  values,
  onChange
}: {
  label: string;
  value: string;
  values: readonly string[];
  onChange: (value: string) => void;
}) {
  return (
    <label className="grid gap-2 text-sm font-bold text-forest">
      {label}
      <select
        className="rounded-xl border border-forest/15 bg-white px-4 py-4 text-lg font-bold outline-none ring-gold/30 transition focus:border-gold focus:ring-4"
        value={value}
        onChange={(event) => onChange(event.target.value)}
      >
        {values.map((option) => (
          <option key={option} value={option}>
            {option}
          </option>
        ))}
      </select>
    </label>
  );
}
