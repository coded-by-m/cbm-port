import Link from "next/link";

export default function Home() {
  return (
    <main className="flex min-h-screen flex-col items-center justify-center gap-6 px-4">
      <h1 className="text-3xl font-light tracking-widest">CODED BY M</h1>
      <p className="max-w-md text-center text-sm text-neutral-400">
        Web Design Premium para empresas que querem transmitir mais valor,
        confiança e profissionalismo.
      </p>
      <Link
        href="/lab"
        className="mt-4 border border-neutral-700 px-6 py-2 text-xs tracking-[0.3em] text-neutral-300 transition-colors hover:border-neutral-400 hover:text-white"
      >
        EXPERIENCE LAB
      </Link>
    </main>
  );
}
