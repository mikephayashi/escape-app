import Link from "next/link";

export default function Home() {
  return (
    <main
      className="relative min-h-screen w-full bg-cover bg-center"
      style={{ backgroundImage: "url('/main-background.png')" }}
    >
      <Link
        href="/island"
        className="absolute bottom-6 right-6 rounded-full bg-white/90 px-5 py-3 text-sm font-semibold text-slate-900 shadow-lg transition hover:bg-white"
      >
        Next
      </Link>
    </main>
  );
}
