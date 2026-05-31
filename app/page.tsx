"use client";

import { FormEvent, useEffect, useState } from "react";

const ADMIN_USERNAME = "CodyPainter";
const ADMIN_PASSWORD = "BobbyCoxField";
const AUTH_KEY = "painter-pitching-agent-auth";

type SessionType = "Bullpen" | "Game";

export default function Home() {
  const [isReady, setIsReady] = useState(false);
  const [isAuthed, setIsAuthed] = useState(false);
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [sessionType, setSessionType] = useState<SessionType>("Bullpen");
  const [sessionName, setSessionName] = useState("New Bullpen Session");

  useEffect(() => {
    setIsAuthed(window.localStorage.getItem(AUTH_KEY) === "true");
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

  function handleSessionType(nextType: SessionType) {
    setSessionType(nextType);
    setSessionName(nextType === "Bullpen" ? "New Bullpen Session" : "New Game Session");
  }

  if (!isReady) {
    return (
      <main className="flex min-h-screen items-center justify-center px-6">
        <div className="h-12 w-12 rounded-full border-4 border-forest/20 border-t-forest" />
      </main>
    );
  }

  if (!isAuthed) {
    return (
      <main className="flex min-h-screen items-center justify-center px-6 py-10">
        <section className="grid w-full max-w-5xl overflow-hidden rounded-3xl border border-forest/10 bg-white shadow-card lg:grid-cols-[1fr_0.9fr]">
          <div className="bg-forest p-10 text-white">
            <p className="text-sm font-bold uppercase tracking-[0.18em] text-gold">Painter Pitching Agent</p>
            <h1 className="mt-5 text-5xl font-black leading-tight">Baseball operations pitch tracker</h1>
            <p className="mt-5 max-w-xl text-lg leading-8 text-white/78">
              A clean local dashboard for bullpen and game pitching sessions.
            </p>
          </div>

          <form className="flex flex-col gap-5 p-8 sm:p-10" onSubmit={handleLogin}>
            <div>
              <h2 className="text-3xl font-black text-forest">Coach Login</h2>
              <p className="mt-2 text-sm font-semibold text-forest/60">Sign in to manage pitching sessions.</p>
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

      <section className="mx-auto mt-6 grid max-w-7xl gap-6 lg:grid-cols-[360px_1fr]">
        <aside className="rounded-3xl border border-forest/10 bg-white p-6 shadow-card">
          <h2 className="text-2xl font-black text-forest">Start Session</h2>
          <div className="mt-5 grid grid-cols-2 gap-3 rounded-2xl bg-cream p-2">
            {(["Bullpen", "Game"] as const).map((type) => (
              <button
                className={`rounded-xl px-4 py-3 text-base font-black transition ${
                  sessionType === type ? "bg-forest text-white shadow-sm" : "text-forest hover:bg-white"
                }`}
                key={type}
                onClick={() => handleSessionType(type)}
              >
                {type}
              </button>
            ))}
          </div>
          <label className="mt-5 grid gap-2 text-sm font-bold text-forest">
            Session Name
            <input
              className="rounded-xl border border-forest/15 bg-white px-4 py-4 text-lg outline-none ring-gold/30 transition focus:border-gold focus:ring-4"
              value={sessionName}
              onChange={(event) => setSessionName(event.target.value)}
            />
          </label>
          <button className="mt-5 w-full rounded-xl bg-gold px-5 py-4 text-lg font-black text-forest transition hover:bg-[#e3bb55]">
            Start New Session
          </button>
        </aside>

        <section className="rounded-3xl border border-forest/10 bg-white p-6 shadow-card">
          <div className="flex flex-wrap items-start justify-between gap-4">
            <div>
              <p className="text-sm font-bold uppercase tracking-[0.16em] text-gold">{sessionType}</p>
              <h2 className="mt-1 text-3xl font-black text-forest">{sessionName}</h2>
            </div>
            <span className="rounded-full bg-cream px-4 py-2 text-sm font-black text-forest">Ready</span>
          </div>
          <div className="mt-6 rounded-2xl border border-dashed border-forest/20 bg-cream/50 p-8 text-center text-lg font-bold text-forest/65">
            Pitch tracking workspace will appear here.
          </div>
        </section>
      </section>
    </main>
  );
}
