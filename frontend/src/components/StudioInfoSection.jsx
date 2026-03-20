import { useEffect, useRef, useState } from "react";
import { motion } from "framer-motion";
import { Link } from "react-router-dom";
import {
  muteVideo,
  observeVideoVisibility,
  registerVideoElement,
  subscribeAudioOwnerChange,
  unmuteExclusive,
  unregisterVideoElement
} from "../utils/videoManager";

const levels = [
  {
    tag: "Brand New",
    title: "Got two left feet?",
    description: "Start with our 10-day intro program and build your base with confidence."
  },
  {
    tag: "Beginner",
    title: "Got the basics down?",
    description: "Level up with new moves and routines in guided progressive batches."
  },
  {
    tag: "Intermediate",
    title: "Feel pretty confident?",
    description: "Learn more challenging skills, transitions, and choreography control."
  },
  {
    tag: "Advanced",
    title: "Already killin' it?",
    description: "Train with top choreographers and sharpen stage-ready performance quality."
  }
];

const quickFacts = [
  "Certified coaches with stage + competition experience",
  "Small-batch sessions for focused learning",
  "Weekly choreography and stamina tracking",
  "Performance-oriented choreography practice"
];

export default function StudioInfoSection() {
  const [aboutMuted, setAboutMuted] = useState(true);
  const [cinemaMode, setCinemaMode] = useState(false);
  const aboutVideoRef = useRef(null);

  useEffect(() => {
    const node = aboutVideoRef.current;
    if (!node) {
      return;
    }

    node.dataset.videoOwnerId = "about-main";
    registerVideoElement(node);
    const cleanupObserver = observeVideoVisibility([node], 0.45);
    const unsubscribe = subscribeAudioOwnerChange((ownerId) => {
      setAboutMuted(ownerId !== "about-main");
    });

    return () => {
      unsubscribe();
      cleanupObserver?.();
      unregisterVideoElement(node);
    };
  }, []);

  return (
    <>
      <section id="levels" className="mx-auto max-w-7xl px-6 py-3 lg:px-10">
        <div className="mb-4">
          <p className="font-body text-xs uppercase tracking-[0.22em] text-cyan-300">Step-By-Step Learning</p>
          <h2 className="mt-2 font-heading text-2xl text-white md:text-4xl">For All Levels</h2>
          <p className="mt-2 max-w-3xl font-body text-sm text-zinc-300 md:text-base">
            Whether you are just starting out or already trained, we have the right progression path for you.
          </p>
        </div>

        <div className="grid gap-3 md:grid-cols-2 xl:grid-cols-4">
          {levels.map((item, index) => (
            <motion.article
              key={item.tag}
              initial={{ opacity: 0, y: 18 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, amount: 0.2 }}
              transition={{ duration: 0.45, delay: index * 0.08 }}
              className="rounded-2xl border border-white/10 bg-gradient-to-br from-zinc-950 to-zinc-900 p-4 md:p-5"
            >
              <span className="inline-block rounded-md border border-cyan-300/40 bg-cyan-400/10 px-2.5 py-1.5 font-body text-[10px] font-semibold uppercase tracking-[0.14em] text-cyan-200 md:px-3 md:py-2 md:text-xs">
                {item.tag}
              </span>
              <h3 className="mt-3 font-heading text-2xl leading-tight text-white md:text-3xl">{item.title}</h3>
              <p className="mt-2 font-body text-sm text-zinc-300 md:text-base">{item.description}</p>
            </motion.article>
          ))}
        </div>
      </section>

      <section id="about-us" className="mx-auto max-w-7xl px-6 py-3 lg:px-10">
        <motion.div
          layout
          className="rounded-3xl border border-white/10 bg-gradient-to-br from-zinc-900 to-black p-4 sm:p-5 lg:p-8"
          transition={{ type: "spring", stiffness: 170, damping: 24 }}
        >
          <motion.div layout className="flex flex-col gap-3 lg:gap-5 lg:flex-row" transition={{ type: "spring", stiffness: 170, damping: 24 }}>
            <motion.div
              layout
              animate={{ flex: cinemaMode ? 0.7 : 1 }}
              transition={{ type: "spring", stiffness: 170, damping: 24 }}
              className="rounded-2xl border border-white/10 bg-black/35 p-3.5 sm:p-4 lg:p-5"
            >
              <p className="font-body text-xs uppercase tracking-[0.22em] text-cyan-300">About Us</p>
              <h2 className="mt-2 font-heading text-xl leading-tight text-white sm:text-2xl md:text-4xl">Where Performance Meets Fitness</h2>
              <p className="mt-2 font-body text-xs leading-relaxed text-zinc-300 sm:text-sm md:text-base">
                Ensoul Dance & Fitness Studio is a high-energy training space built for students who want to dance with confidence and train with purpose. We combine technique, choreography, and conditioning so every class feels expressive and results-driven.
              </p>

              <ul className="mt-3 grid gap-2 md:mt-6 md:gap-3 md:grid-cols-2">
                {quickFacts.map((fact) => (
                  <li key={fact} className="rounded-xl border border-white/10 bg-white/5 px-3 py-2 font-body text-xs text-zinc-200 sm:text-sm md:px-4 md:py-3">
                    {fact}
                  </li>
                ))}
              </ul>
            </motion.div>

            <motion.div
              layout
              animate={{ flex: cinemaMode ? 1.3 : 1 }}
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              transition={{ type: "spring", stiffness: 170, damping: 24 }}
              onMouseEnter={() => setCinemaMode(true)}
              onMouseLeave={() => setCinemaMode(false)}
              onClick={() => setCinemaMode(!cinemaMode)}
              className="group relative h-56 overflow-hidden rounded-2xl border border-white/10 sm:h-64 lg:h-auto lg:min-h-[320px] cursor-pointer"
            >
              <video
                ref={aboutVideoRef}
                src="/homepage.mp4"
                autoPlay
                loop
                muted={aboutMuted}
                playsInline
                className={`h-full w-full object-cover object-top transition duration-500 ${cinemaMode ? "scale-105" : "scale-100"}`}
              />
              <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-black/70 via-black/25 to-transparent" />
              <button
                type="button"
                onClick={(e) => {
                  e.stopPropagation();
                  if (!aboutVideoRef.current) {
                    return;
                  }

                  if (aboutMuted) {
                    unmuteExclusive(aboutVideoRef.current);
                    setAboutMuted(false);
                  } else {
                    muteVideo(aboutVideoRef.current);
                    setAboutMuted(true);
                  }
                }}
                className="absolute bottom-4 right-4 rounded-full border border-white/20 bg-black/60 px-4 py-2 font-body text-xs uppercase tracking-[0.14em] text-white transition hover:border-cyan-300 hover:text-cyan-300"
              >
                {aboutMuted ? "Unmute" : "Mute"}
              </button>
            </motion.div>
          </motion.div>
        </motion.div>
      </section>

      <section id="contact" className="mx-auto max-w-7xl px-6 pb-4 pt-4 lg:px-10">
        <div className="mb-3 grid grid-cols-2 gap-3 md:hidden">
          <div className="rounded-xl border border-white/10 bg-black/35 p-3">
            <p className="font-body text-[10px] uppercase tracking-[0.14em] text-cyan-300">Facilities</p>
            <ul className="mt-2 space-y-1 font-body text-[11px] leading-snug text-zinc-200">
              <li>Air-conditioned studio floor</li>
              <li>Mirror wall + audio setup</li>
              <li>Small-batch personal attention</li>
            </ul>
          </div>

          <div className="rounded-xl border border-white/10 bg-black/35 p-3">
            <p className="font-body text-[10px] uppercase tracking-[0.14em] text-cyan-300">Timings</p>
            <p className="mt-2 font-body text-[11px] text-zinc-200">Morning: 6 AM to 11 AM</p>
            <p className="mt-1 font-body text-[11px] text-zinc-200">Evening: 7 PM to 10 PM</p>
          </div>
        </div>

        <div className="mb-4">
          <Link
            to="/free-trial"
            className="md:hidden inline-flex w-full items-center justify-center rounded-full bg-gradient-to-r from-cyan-400 to-fuchsia-500 px-6 py-3 text-center font-body text-xs font-semibold uppercase tracking-[0.14em] text-black shadow-[0_0_24px_rgba(34,211,238,0.35)] transition hover:brightness-110"
          >
            Fill 2-Day Free Trial Form
          </Link>
        </div>

        <div className="grid grid-cols-2 gap-3 md:gap-4">
          <a
            href="tel:+918059613321"
            className="flex h-full min-h-[150px] flex-col rounded-2xl border border-white/10 bg-zinc-950 p-4 transition hover:border-cyan-300 md:min-h-[170px] md:p-6"
          >
            <p className="font-body text-xs uppercase tracking-[0.16em] text-cyan-300">Call</p>
            <p className="mt-2 font-heading text-lg text-white md:text-2xl">+91 80596 13321</p>
            <p className="mt-2 font-body text-xs text-zinc-300 md:text-sm">Tap to call the studio desk.</p>
          </a>

          <a
            href="https://wa.me/919896455140?text=Hi%20Ensoul%20Studio%2C%20I%20want%20to%20book%20a%20demo."
            target="_blank"
            rel="noreferrer"
            className="flex h-full min-h-[150px] flex-col rounded-2xl border border-white/10 bg-zinc-950 p-4 transition hover:border-cyan-300 md:min-h-[170px] md:p-6"
          >
            <p className="font-body text-xs uppercase tracking-[0.16em] text-cyan-300">WhatsApp</p>
            <p className="mt-2 font-heading text-lg text-white md:text-2xl">Quick Chat</p>
            <p className="mt-2 font-body text-xs text-zinc-300 md:text-sm">Opens WhatsApp with a pre-filled message.</p>
          </a>

          <a
            href="https://maps.google.com/?q=Kurukshetra+Haryana"
            target="_blank"
            rel="noreferrer"
            className="flex h-full min-h-[150px] flex-col rounded-2xl border border-white/10 bg-zinc-950 p-4 transition hover:border-cyan-300 md:min-h-[170px] md:p-6"
          >
            <p className="font-body text-xs uppercase tracking-[0.16em] text-cyan-300">Location</p>
            <p className="mt-2 font-heading text-lg text-white md:text-2xl">Kurukshetra</p>
            <p className="mt-2 font-body text-xs text-zinc-300 md:text-sm">Sector-5, Near PNB Bank, SCO-43, First Floor.</p>
          </a>

          <a
            href="https://www.instagram.com/ensouldancestudio?utm_source=ig_web_button_share_sheet&igsh=ZDNlZDc0MzIxNw=="
            target="_blank"
            rel="noreferrer"
            className="flex h-full min-h-[150px] flex-col overflow-hidden rounded-2xl border border-white/10 bg-zinc-950 p-4 transition hover:border-cyan-300 md:min-h-[170px] md:p-6"
          >
            <p className="font-body text-xs uppercase tracking-[0.16em] text-cyan-300">Instagram</p>
            <p className="mt-2 break-all font-heading text-sm leading-snug text-white md:text-xl">@ensouldancestudio</p>
            <p className="mt-2 font-body text-xs text-zinc-300 md:text-sm">See class reels, transformations, and announcements.</p>
          </a>
        </div>
      </section>
    </>
  );
}
