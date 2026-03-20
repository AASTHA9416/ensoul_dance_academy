


import { useEffect, useRef, useState } from "react";
import { motion } from "framer-motion";
import { Link } from "react-router-dom";
import {
  muteAllVideos,
  muteVideo,
  observeVideoVisibility,
  registerVideoElement,
  subscribeAudioOwnerChange,
  unmuteExclusive,
  unregisterVideoElement
} from "../utils/videoManager";

const heroVideos = [
  { id: "v1", src: "/homepage.mp4" },
  { id: "v2", src: "/homepage.mp4" },
  { id: "v3", src: "/homepage.mp4" },
  { id: "v4", src: "/homepage.mp4" }
];

export default function HeroSection() {
  const [activeId, setActiveId] = useState(null);
  const [unmutedId, setUnmutedId] = useState(null);
  const [isMobileView, setIsMobileView] = useState(false);
  const [mobileExpanded, setMobileExpanded] = useState(false);
  const videoRefs = useRef({});
  const refCallbacks = useRef({});

  const setVideoRef = (id, node) => {
    if (node) {
      Object.keys(videoRefs.current).forEach((key) => {
        if (key !== id && videoRefs.current[key] === node) {
          videoRefs.current[key] = null;
        }
      });
    }

    const previousNode = videoRefs.current[id];
    if (previousNode && previousNode !== node) {
      unregisterVideoElement(previousNode);
    }

    if (node) {
      node.dataset.videoOwnerId = `hero-${id}`;
      registerVideoElement(node);
    }

    videoRefs.current[id] = node;
  };

  const getRefCallback = (id) => {
    if (!refCallbacks.current[id]) {
      refCallbacks.current[id] = (node) => setVideoRef(id, node);
    }
    return refCallbacks.current[id];
  };

  useEffect(() => {
    const mediaQuery = window.matchMedia("(max-width: 767px)");
    const updateView = () => setIsMobileView(mediaQuery.matches);
    updateView();
    mediaQuery.addEventListener("change", updateView);
    return () => mediaQuery.removeEventListener("change", updateView);
  }, []);

  useEffect(() => {
    if (isMobileView) {
      setMobileExpanded(false);
      setActiveId("v1");
      setUnmutedId(null);
      muteAllVideos();
      
      const timer = setTimeout(() => {
        setMobileExpanded(true);
      }, 1000);

      return () => clearTimeout(timer);
    }

    const timer = setTimeout(() => {
      handleSelectVideo("v1");
    }, 4000);

    return () => clearTimeout(timer);
  }, [isMobileView]);

  useEffect(() => {
    const allVideos = Object.values(videoRefs.current).filter(Boolean);
    if (allVideos.length === 0) {
      return;
    }

    return observeVideoVisibility(allVideos, 0.45);
  }, [activeId, isMobileView]);

  useEffect(() => {
    const unsubscribe = subscribeAudioOwnerChange((ownerId) => {
      if (ownerId && ownerId.startsWith("hero-")) {
        setUnmutedId(ownerId.replace("hero-", ""));
        return;
      }
      setUnmutedId(null);
    });

    return () => unsubscribe();
  }, []);

  useEffect(() => {
    return () => {
      Object.values(videoRefs.current).forEach((video) => unregisterVideoElement(video));
    };
  }, []);

  const getSlotStyle = (id) => {
    if (!activeId) {
      const defaultMap = {
        v1: { gridColumn: "1 / 2", gridRow: "1 / 2" },
        v2: { gridColumn: "2 / 3", gridRow: "1 / 2" },
        v3: { gridColumn: "1 / 2", gridRow: "2 / 3" },
        v4: { gridColumn: "2 / 3", gridRow: "2 / 3" }
      };
      return defaultMap[id];
    }

    if (id === activeId) {
      return { gridColumn: "1 / 2", gridRow: "1 / span 3" };
    }

    const sideIds = heroVideos.filter((video) => video.id !== activeId).map((video) => video.id);
    const sideIndex = sideIds.indexOf(id);

    if (sideIndex === 0) {
      return { gridColumn: "2 / 3", gridRow: "1 / 2" };
    }
    if (sideIndex === 1) {
      return { gridColumn: "2 / 3", gridRow: "2 / 3" };
    }
    return { gridColumn: "2 / 3", gridRow: "3 / 4" };
  };

  const handleSelectVideo = (id) => {
    if (activeId === id) return;

    setActiveId(id);
    
    // Check if there is an unmuted video, if so, we probably want to mute it when switching videos, 
    // but ONLY if the newly selected video is different from the currently unmuted one.
    if (unmutedId && unmutedId !== id) {
       muteAllVideos();
       setUnmutedId(null);
    }

    const selectedVideo = videoRefs.current[id];
    if (selectedVideo) {
      selectedVideo.dataset.videoOwnerId = `hero-${id}`;
      selectedVideo.currentTime = 0;
      selectedVideo.play().catch(() => {});
    }
  };

  const toggleVideoMute = (id) => {
    const selectedVideo = videoRefs.current[id];
    if (!selectedVideo) {
      return;
    }

    selectedVideo.dataset.videoOwnerId = `hero-${id}`;

    const isCurrentlyUnmuted = !selectedVideo.muted && selectedVideo.volume > 0;

    if (isCurrentlyUnmuted) {
      muteVideo(selectedVideo);
      setUnmutedId(null);
      return;
    }

    selectedVideo.play().catch(() => {});
    unmuteExclusive(selectedVideo);
    setUnmutedId(id);
  };

  const featuredMobileId = activeId || "v1";

  return (
    <section className="relative overflow-hidden px-6 pb-2 pt-6 lg:px-10">
      <div className="pointer-events-none absolute -left-28 top-10 h-72 w-72 rounded-full bg-cyan-500/20 blur-3xl" />
      <div className="pointer-events-none absolute -right-24 top-24 h-72 w-72 rounded-full bg-fuchsia-500/20 blur-3xl" />

      <motion.div initial={{ opacity: 0, y: 18 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6 }} className="mx-auto max-w-7xl">
        <motion.div layout transition={{ type: "spring", stiffness: 170, damping: 24 }} className="flex flex-col gap-6 lg:flex-row">
          <motion.div
            layout
            animate={{ flex: activeId ? 1.25 : 1 }}
            transition={{ type: "spring", stiffness: 170, damping: 24 }}
            className="relative overflow-hidden rounded-3xl border border-white/10 bg-zinc-900 p-3 md:min-h-[380px]"
          >
            {!isMobileView && (
              <motion.div
                layout
                transition={{ type: "spring", stiffness: 170, damping: 24 }}
                className={`grid h-full min-h-[316px] gap-3 md:min-h-[356px] ${activeId ? "grid-cols-[3fr_1fr] grid-rows-3" : "grid-cols-2 grid-rows-2"}`}
              >
                {heroVideos.map((video) => {
                  const isActive = activeId === video.id;

                  return (
                    <motion.div
                      key={video.id}
                      layout
                      transition={{ type: "spring", stiffness: 170, damping: 24 }}
                      style={getSlotStyle(video.id)}
                      onMouseEnter={() => handleSelectVideo(video.id)}
                      className="group relative overflow-hidden rounded-2xl border border-white/15"
                    >
                      <video
                        ref={getRefCallback(video.id)}
                        src={video.src}
                        autoPlay
                        loop
                        muted={unmutedId !== video.id}
                        playsInline
                        preload="metadata"
                        className="h-full w-full object-cover transition duration-500 group-hover:scale-105"
                      />

                      <div className={`pointer-events-none absolute inset-0 transition ${isActive ? "bg-black/10" : "bg-black/30"}`} />

                      {isActive && (
                        <button
                          type="button"
                          onClick={(event) => {
                            event.preventDefault();
                            event.stopPropagation();
                            toggleVideoMute(video.id);
                          }}
                          className="absolute bottom-2 right-2 rounded-full border border-white/25 bg-black/60 px-3 py-1.5 font-body text-[10px] uppercase tracking-[0.14em] text-white transition hover:border-cyan-300 hover:text-cyan-300"
                        >
                          {unmutedId === video.id ? "Mute" : "Unmute"}
                        </button>
                      )}
                    </motion.div>
                  );
                })}
              </motion.div>
            )}

            {isMobileView && (
              <div className="grid gap-3">
                <div className="relative h-64 overflow-hidden rounded-2xl border border-white/15 sm:h-72">
                  <video
                    key={featuredMobileId}
                    ref={getRefCallback(featuredMobileId)}
                    src={heroVideos.find((video) => video.id === featuredMobileId)?.src}
                    autoPlay
                    loop
                    muted={unmutedId !== featuredMobileId}
                    playsInline
                    preload="metadata"
                    className="h-full w-full object-cover object-top"
                  />
                  <div className="pointer-events-none absolute inset-0 bg-black/20" />
                  <button
                    type="button"
                    onClick={() => toggleVideoMute(featuredMobileId)}
                    className="absolute bottom-2 right-2 rounded-full border border-white/25 bg-black/60 px-3 py-1.5 font-body text-[10px] uppercase tracking-[0.14em] text-white"
                  >
                    {unmutedId === featuredMobileId ? "Mute" : "Unmute"}
                  </button>
                </div>

                {!mobileExpanded && (
                  <motion.p 
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    className="text-center font-body text-[11px] uppercase tracking-[0.16em] text-zinc-300"
                  >
                    Loading more classes...
                  </motion.p>
                )}

                {mobileExpanded && (
                  <motion.div 
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.6, ease: "easeOut" }}
                    className="grid grid-cols-3 gap-2"
                  >
                    {heroVideos
                      .filter((video) => video.id !== featuredMobileId)
                      .map((video) => (
                        <button
                          key={video.id}
                          type="button"
                          onTouchStart={() => handleSelectVideo(video.id)}
                          onClick={() => handleSelectVideo(video.id)}
                          className="relative h-20 overflow-hidden rounded-xl border border-white/15 transition-transform hover:scale-[1.02] active:scale-95"
                        >
                          <video
                            src={video.src}
                            autoPlay
                            loop
                            muted
                            playsInline
                            preload="metadata"
                            className="h-full w-full object-cover"
                          />
                          <div className="absolute inset-0 bg-black/30" />
                        </button>
                      ))}
                  </motion.div>
                )}
              </div>
            )}
          </motion.div>

          <motion.div
            layout
            animate={{ flex: activeId ? 0.75 : 1 }}
            transition={{ type: "spring", stiffness: 170, damping: 24 }}
            className="flex min-h-[320px] flex-col justify-center rounded-3xl border border-white/10 bg-gradient-to-br from-zinc-900 to-black p-7 lg:min-h-[380px] lg:p-10"
          >
            <p className="font-body text-xs uppercase tracking-[0.24em] text-cyan-300">Kurukshetra, Haryana</p>
            <h1 className="mt-4 font-heading text-4xl leading-tight text-white md:text-5xl">
              Ensoul Dance <span className="text-cyan-300">&</span> Fitness Studio
            </h1>
            <a
              href="https://www.instagram.com/ensouldancestudio?utm_source=ig_web_button_share_sheet&igsh=ZDNlZDc0MzIxNw=="
              target="_blank"
              rel="noreferrer"
              className="mt-3 inline-flex w-fit rounded-full border border-white/20 bg-white/5 px-4 py-2 font-body text-xs uppercase tracking-[0.16em] text-zinc-200 transition hover:border-cyan-300 hover:text-cyan-300"
            >
              Instagram: @ensouldancestudio
            </a>
            <p className="mt-5 max-w-xl font-body text-base text-zinc-300">
              Build confidence, rhythm, and strength with expert-led programs in a high-energy studio experience.
            </p>

            <div className="mt-8 flex flex-wrap items-center gap-4">
              {isMobileView ? (
                <Link
                  to="/free-trial"
                  className="rounded-full bg-gradient-to-r from-cyan-400 to-fuchsia-500 px-7 py-3 font-body text-sm font-semibold uppercase tracking-[0.14em] text-black shadow-[0_0_22px_rgba(34,211,238,0.45)] transition hover:brightness-110"
                >
                  Book 2-Day Free Demo
                </Link>
              ) : (
                <button
                  type="button"
                  onClick={() => {
                    document.getElementById("lead-form")?.scrollIntoView({ behavior: "smooth" });
                  }}
                  className="rounded-full bg-gradient-to-r from-cyan-400 to-fuchsia-500 px-7 py-3 font-body text-sm font-semibold uppercase tracking-[0.14em] text-black shadow-[0_0_22px_rgba(34,211,238,0.45)] transition hover:brightness-110"
                >
                  Book 2-Day Free Demo
                </button>
              )}
              <span className="font-body text-sm text-zinc-400">No commitment | Expert guidance</span>
            </div>
          </motion.div>
        </motion.div>
      </motion.div>
    </section>
  );
}


