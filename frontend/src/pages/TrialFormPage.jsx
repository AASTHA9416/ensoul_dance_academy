import { Link } from "react-router-dom";
import LeadGenerationForm from "../components/LeadGenerationForm";
import Navbar from "../components/Navbar";

export default function TrialFormPage() {
  return (
    <>
      <Navbar />
      <section className="mx-auto w-full max-w-7xl px-6 pt-6 lg:px-10">
        <div className="flex flex-wrap items-center gap-3">
          <Link
            to="/free-trial"
            className="rounded-full border border-white/20 bg-white/5 px-5 py-2 font-body text-xs uppercase tracking-[0.14em] text-zinc-200 transition hover:border-cyan-300 hover:text-cyan-300"
          >
            Back To Trial Details
          </Link>
        </div>
      </section>
      <LeadGenerationForm />
    </>
  );
}
