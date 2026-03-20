import { useEffect, useRef, useState } from "react";
import { motion } from "framer-motion";
import {
  muteVideo,
  observeVideoVisibility,
  registerVideoElement,
  subscribeAudioOwnerChange,
  unmuteExclusive,
  unregisterVideoElement
} from "../utils/videoManager";

const initialForm = {
  fullName: "",
  email: "",
  phone: "",
  level: "Beginner",
  dancePreference: "Yoga",
  preferredTime: "Evening",
  message: ""
};

export default function LeadGenerationForm() {
  const [form, setForm] = useState(initialForm);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [status, setStatus] = useState({ type: "idle", message: "" });

  const onChange = (event) => {
    const { name, value } = event.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  const onSubmit = async (event) => {
    event.preventDefault();
    setIsSubmitting(true);
    setStatus({ type: "idle", message: "Sending..." });

    try {
      const response = await fetch("https://formsubmit.co/ajax/aasthabansal741@gmail.com", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Accept: "application/json"
        },
        body: JSON.stringify({
          _subject: `Demo Request - ${form.fullName}`,
          _captcha: "false",
          _template: "table",
          "Full Name": form.fullName,
          Email: form.email,
          Phone: form.phone,
          Level: form.level,
          "Dance Preference": form.dancePreference,
          "Preferred Time": form.preferredTime,
          "Goal / Message": form.message || "N/A"
        })
      });

      if (!response.ok) {
        throw new Error("Network response was not ok");
      }

      const data = await response.json();

      if (data.success === "true" || data.success === true) {
        setStatus({ type: "success", message: "Demo request sent successfully! We will contact you soon." });
        setForm(initialForm);
      } else {
        throw new Error(data.message || "Form submission failed");
      }
    } catch (error) {
      setStatus({ type: "error", message: "Something went wrong. Please try again." });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <section id="lead-form" className="mx-auto max-w-7xl px-6 pb-4 pt-3 lg:px-10">
      <motion.div
        initial={{ opacity: 0, y: 24 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, amount: 0.2 }}
        transition={{ duration: 0.6 }}
        className="rounded-3xl border border-white/10 bg-zinc-950 p-4 sm:p-5 shadow-[0_0_50px_rgba(34,211,238,0.08)] lg:p-8"
      >
        <div className="mb-4 md:mb-5">
          <p className="font-body text-xs uppercase tracking-[0.24em] text-cyan-300">Final Registration</p>
          <h2 className="mt-2 font-heading text-2xl text-white md:text-3xl">Start Your Trial Journey</h2>
        </div>

        <div className="hidden md:flex gap-4 mb-6">
          <div className="flex-1 rounded-2xl border border-cyan-300/20 bg-cyan-400/5 p-4 shadow-[0_0_15px_rgba(34,211,238,0.05)]">
             <p className="font-body text-[10px] font-semibold uppercase tracking-[0.2em] text-cyan-300">Trial Day 1</p>
             <p className="mt-1 font-body text-sm text-zinc-200">Orientation, warm-up & foundation moves</p>
          </div>
          <div className="flex-1 rounded-2xl border border-fuchsia-500/20 bg-fuchsia-500/5 p-4 shadow-[0_0_15px_rgba(217,70,239,0.05)]">
             <p className="font-body text-[10px] font-semibold uppercase tracking-[0.2em] text-fuchsia-400">Trial Day 2</p>
             <p className="mt-1 font-body text-sm text-zinc-200">Guided choreography & feedback session</p>
          </div>
        </div>

        <motion.div layout className="grid gap-2.5 md:grid-cols-[13fr_7fr]" transition={{ duration: 0.45, ease: "easeInOut" }}>
          <motion.div layout className="rounded-2xl border border-white/10 bg-black/35 p-3 sm:p-4 md:p-5">
            <form onSubmit={onSubmit} className="grid gap-2.5 md:grid-cols-2">
              <InputField label="Full Name" name="fullName" value={form.fullName} onChange={onChange} required />
              <InputField label="Email" name="email" value={form.email} onChange={onChange} type="email" required />
              <InputField label="Phone" name="phone" value={form.phone} onChange={onChange} required />

              <SelectField label="Level" name="level" value={form.level} onChange={onChange} options={["Beginner", "Advanced"]} />
              <SelectField
                label="Dance Preference"
                name="dancePreference"
                value={form.dancePreference}
                onChange={onChange}
                options={["Yoga", "Hip-Hop", "Zumba", "Cardio"]}
              />
              <SelectField
                label="Preferred Time"
                name="preferredTime"
                value={form.preferredTime}
                onChange={onChange}
                options={["Morning", "Evening", "Weekend"]}
              />

              <label className="md:col-span-2">
                <span className="mb-1.5 block font-body text-xs text-zinc-300 md:text-sm">Goal / Message</span>
                <textarea
                  name="message"
                  value={form.message}
                  onChange={onChange}
                  rows={2}
                  className="w-full rounded-xl border border-white/15 bg-black/50 px-3 py-2 font-body text-xs text-white outline-none transition focus:border-cyan-300 focus:ring-2 focus:ring-cyan-300/40 md:py-2.5 md:text-sm"
                  placeholder="Example: I want weight-loss focused sessions with Zumba + Cardio mix"
                />
              </label>

              <div className="md:col-span-2 flex flex-col gap-2 md:flex-row md:items-center md:justify-between">
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="rounded-full bg-gradient-to-r from-cyan-400 to-fuchsia-500 px-6 py-2.5 font-body text-xs font-semibold uppercase tracking-[0.14em] text-black shadow-[0_0_24px_rgba(217,70,239,0.35)] transition hover:brightness-110 disabled:cursor-not-allowed disabled:opacity-60 md:px-7 md:py-3 md:text-sm"
                >
                  {isSubmitting ? "Sending..." : "Get My Demo Slot"}
                </button>

                {status.type !== "idle" && (
                  <p className={`font-body text-xs md:text-sm ${status.type === "success" ? "text-emerald-300" : "text-rose-300"}`}>
                    {status.message}
                  </p>
                )}
              </div>
            </form>
          </motion.div>

          <motion.div layout className="mt-0.5 grid gap-2.5 md:mt-0">
            <div className="rounded-xl border border-white/10 bg-black/35 p-3 sm:p-4">
              <p className="font-body text-xs uppercase tracking-[0.16em] text-cyan-300">Facilities</p>
              <ul className="mt-2 space-y-1.5 font-body text-xs text-zinc-200 md:text-sm">
                <li>Air-conditioned studio floor</li>
                <li>Mirror wall + audio setup</li>
                <li>Small-batch personal attention</li>
              </ul>
            </div>

            <FacilityVideoThumb title="Studio Walkthrough" src="/homepage.mp4" />

            <div className="rounded-xl border border-white/10 bg-black/35 p-3 sm:p-4">
              <p className="font-body text-xs uppercase tracking-[0.16em] text-cyan-300">Timings</p>
              <p className="mt-2 font-body text-xs text-zinc-200 md:text-sm">Morning: 6 AM to 11 AM</p>
              <p className="mt-1 font-body text-xs text-zinc-200 md:text-sm">Evening: 7 PM to 10 PM</p>
            </div>

            <a
              href="https://www.instagram.com/ensouldancestudio?utm_source=ig_web_button_share_sheet&igsh=ZDNlZDc0MzIxNw=="
              target="_blank"
              rel="noreferrer"
              className="rounded-xl border border-white/10 bg-black/35 p-3 sm:p-4 font-body text-xs text-zinc-100 transition hover:border-cyan-300 hover:text-cyan-200 md:text-sm"
            >
              Instagram: @ensouldancestudio
            </a>
          </motion.div>
        </motion.div>
      </motion.div>
    </section>
  );
}

function FacilityVideoThumb({ title, src }) {
  const [hovered, setHovered] = useState(false);
  const [isMuted, setIsMuted] = useState(true);
  const videoRef = useRef(null);
  const ownerId = "facility-thumb";

  const onEnter = () => {
    setHovered(true);
    if (videoRef.current) {
      videoRef.current.play().catch(() => {});
    }
  };

  const onLeave = () => {
    if (window.innerWidth >= 768) {
      setHovered(false);
    }
  };
  
  const handleInteraction = () => {
    setHovered(true);
    if (videoRef.current) {
      videoRef.current.play().catch(() => {});
    }
  };

  useEffect(() => {
    const node = videoRef.current;
    if (!node) {
      return;
    }

    node.dataset.videoOwnerId = ownerId;
    registerVideoElement(node);
    const cleanupObserver = observeVideoVisibility([node], 0.45);
    const unsubscribe = subscribeAudioOwnerChange((activeOwnerId) => {
      setIsMuted(activeOwnerId !== ownerId);
      
      if (window.innerWidth < 768 && activeOwnerId !== ownerId) {
         setHovered(false);
         if (videoRef.current) {
           videoRef.current.pause();
         }
      }
    });

    return () => {
      unsubscribe();
      cleanupObserver?.();
      unregisterVideoElement(node);
    };
  }, []);
  
  const isActive = hovered || !isMuted;

  return (
    <div
      className="group relative h-40 overflow-hidden rounded-xl border border-white/10 cursor-pointer"
      onMouseEnter={onEnter}
      onMouseLeave={onLeave}
      onClick={handleInteraction}
    >
      <video
        ref={videoRef}
        src={src}
        muted={isMuted}
        loop
        playsInline
        preload="auto"
        className={`h-full w-full object-cover transition duration-500 ${isActive ? "scale-110" : "scale-100"}`}
      />
      <div className="absolute inset-0 bg-black/35" />
      <p className="absolute bottom-2 left-3 right-3 truncate font-body text-xs uppercase tracking-[0.12em] text-zinc-100">
        {title}
      </p>
      
      {isActive && window.innerWidth < 768 && (
        <button
          type="button"
          onClick={(event) => {
            event.preventDefault();
            event.stopPropagation();
            if (!videoRef.current) {
              return;
            }

            if (isMuted) {
              unmuteExclusive(videoRef.current);
              setIsMuted(false);
            } else {
              muteVideo(videoRef.current);
              setIsMuted(true);
              videoRef.current.pause(); 
              setHovered(false);
            }
          }}
          className="absolute bottom-2 right-2 rounded-full border border-white/25 bg-black/60 px-3 py-1.5 font-body text-[10px] uppercase tracking-[0.14em] text-white transition hover:border-cyan-300 hover:text-cyan-300"
        >
          {isMuted ? "Unmute" : "Mute"}
        </button>
      )}
    </div>
  );
}

function InputField({ label, name, value, onChange, type = "text", required = false }) {
  return (
    <label>
      <span className="mb-1 block font-body text-[11px] text-zinc-300 md:text-sm">{label}</span>
      <input
        type={type}
        name={name}
        value={value}
        onChange={onChange}
        required={required}
        className="w-full rounded-xl border border-white/15 bg-black/50 px-3 py-2 font-body text-xs text-white outline-none transition focus:border-cyan-300 focus:ring-2 focus:ring-cyan-300/40 md:py-2.5 md:text-sm"
      />
    </label>
  );
}

function SelectField({ label, name, value, onChange, options }) {
  return (
    <label>
      <span className="mb-1 block font-body text-[11px] text-zinc-300 md:text-sm">{label}</span>
      <select
        name={name}
        value={value}
        onChange={onChange}
        className="w-full rounded-xl border border-white/15 bg-black/50 px-3 py-2 font-body text-xs text-white outline-none transition focus:border-cyan-300 focus:ring-2 focus:ring-cyan-300/40 md:py-2.5 md:text-sm"
      >
        {options.map((option) => (
          <option key={option} value={option} className="bg-zinc-900">
            {option}
          </option>
        ))}
      </select>
    </label>
  );
}
