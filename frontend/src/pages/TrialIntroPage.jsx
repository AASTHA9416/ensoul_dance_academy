import { Link } from "react-router-dom";
import Navbar from "../components/Navbar";

export default function TrialIntroPage() {
  return (
    <>
      <Navbar />
      <section className="mx-auto min-h-screen w-full max-w-4xl px-6 py-10 lg:px-10">
        <div className="rounded-3xl border border-white/10 bg-gradient-to-br from-zinc-900 to-black p-6 sm:p-8">
          <p className="font-body text-xs uppercase tracking-[0.22em] text-cyan-300">Free Trial</p>
          <h1 className="mt-3 font-heading text-3xl text-white sm:text-4xl">2-Day Free Trial Program</h1>
          <p className="mt-4 font-body text-sm text-zinc-300 sm:text-base">
            Experience our studio vibe, meet coaches, and try beginner-friendly sessions before you enroll.
          </p>

          <ul className="mt-6 grid gap-3 sm:grid-cols-2">
            <li className="rounded-xl border border-white/10 bg-white/5 px-4 py-3 font-body text-sm text-zinc-200">
              Day 1: Orientation + warm-up + foundation moves
            </li>
            <li className="rounded-xl border border-white/10 bg-white/5 px-4 py-3 font-body text-sm text-zinc-200">
              Day 2: Guided choreography + feedback session
            </li>
          </ul>

          <div className="mt-7 flex flex-wrap gap-3">
            <Link
              to="/free-trial/form"
              className="rounded-full bg-gradient-to-r from-cyan-400 to-fuchsia-500 px-7 py-3 font-body text-xs font-semibold uppercase tracking-[0.14em] text-black shadow-[0_0_24px_rgba(34,211,238,0.35)] transition hover:brightness-110"
            >
              Fill 2-Day Free Trial Form
            </Link>
          </div>
        </div>
      </section>
    </>
  );
}
