export default function Home() {
  return (
    <main className="flex min-h-screen items-center justify-center px-6 py-10">
      <section className="w-full max-w-3xl rounded-2xl border border-forest/10 bg-white p-10 shadow-card">
        <p className="text-sm font-bold uppercase tracking-[0.18em] text-gold">Painter Pitching Agent</p>
        <h1 className="mt-4 text-5xl font-black text-forest">Pitching tracker setup</h1>
        <p className="mt-4 max-w-2xl text-lg leading-8 text-forest/75">
          Local bullpen and game tracking dashboard scaffolded as a Next.js PWA.
        </p>
      </section>
    </main>
  );
}
