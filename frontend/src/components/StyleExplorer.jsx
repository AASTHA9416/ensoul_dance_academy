import { useEffect, useRef, useState } from "react";
import { motion } from "framer-motion";
import { danceStyles } from "../data/styles";
import {
  muteVideo,
  observeVideoVisibility,
  registerVideoElement,
  subscribeAudioOwnerChange,
  unmuteExclusive,
  unregisterVideoElement
} from "../utils/videoManager";

export default function StyleExplorer() {
  return (
    <section id="styles" className="mx-auto max-w-7xl px-6 pb-3 pt-4 lg:px-10">
      <div className="mb-5">
        <p className="font-body text-xs uppercase tracking-[0.22em] text-cyan-300">Style Explorer</p>
        <h2 className="mt-2 font-heading text-2xl text-white md:text-4xl">Find Your Signature Movement</h2>
      </div>

      <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
        {danceStyles.map((style, index) => (
          <StyleCard key={style.id} style={style} index={index} />
        ))}
      </div>
    </section>
  );
}

function StyleCard({ style, index }) {
  const [isHovered, setIsHovered] = useState(false);
  const [isMuted, setIsMuted] = useState(true);
  const [isAnotherUnmuted, setIsAnotherUnmuted] = useState(false);
  const videoRef = useRef(null);
  const ownerId = `style-${style.id}`;

  const handleInteraction = () => {
    if (window.innerWidth >= 768 && isAnotherUnmuted) {
      return;
    }
    
    setIsHovered(true);
    if (videoRef.current) {
      videoRef.current.play().catch(() => {});
    }
  };

  const onEnter = () => handleInteraction();
  
  const onLeave = () => {
    if (window.innerWidth >= 768) {
       setIsHovered(false);
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
         setIsHovered(false);
         if (videoRef.current) {
           videoRef.current.pause();
         }
      }

      setIsAnotherUnmuted(
        activeOwnerId !== null &&
        activeOwnerId !== ownerId &&
        activeOwnerId.startsWith("style-")
      );
    });

    return () => {
      unsubscribe();
      cleanupObserver?.();
      unregisterVideoElement(node);
    };
  }, [ownerId]);

  const isActive = isHovered || !isMuted;

  return (
    <motion.article
      initial={{ opacity: 0, y: 24 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, amount: 0.2 }}
      transition={{ duration: 0.5, delay: index * 0.08 }}
      whileHover={{ y: -4, scale: isAnotherUnmuted && window.innerWidth >= 768 ? 1 : 1.05 }}
      onMouseEnter={onEnter}
      onMouseLeave={onLeave}
      onClick={handleInteraction}
      className={`group relative overflow-hidden rounded-2xl border border-white/10 bg-gradient-to-b ${style.accent} p-[1px]`}
    >
      <div className="relative h-48 overflow-hidden rounded-2xl bg-zinc-950 sm:h-56 md:min-h-[300px]">
        <video
          ref={videoRef}
          src={style.video}
          loop
          muted={isMuted}
          playsInline
          preload="auto"
          className={`absolute inset-0 h-full w-full object-cover transition duration-500 ${isActive ? "scale-105 opacity-100" : "scale-100 opacity-50"}`}
        />

        <div className={`absolute inset-0 transition duration-500 ${isActive ? "bg-black/40" : "bg-black/55"}`} />

        <div className="relative z-10 flex h-full flex-col justify-end p-5">
          <p className="font-body text-[10px] uppercase tracking-[0.2em] text-cyan-200/80">{style.tag}</p>
          <h3 className="mt-2 font-heading text-xl text-white md:text-2xl">{style.title}</h3>
          <p className="mt-2 line-clamp-2 font-body text-xs text-zinc-200 md:text-sm">{style.description}</p>
          <div className={`mt-3 h-[2px] bg-cyan-300/80 transition-all duration-300 ${isActive ? "w-20" : "w-12"}`} />

          {isActive && (
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
                  if (window.innerWidth < 768) {
                    videoRef.current.pause(); 
                    setIsHovered(false);
                  }
                }
              }}
              className="mt-3 w-fit rounded-full border border-white/25 bg-black/60 px-3 py-1.5 font-body text-[10px] uppercase tracking-[0.14em] text-white transition hover:border-cyan-300 hover:text-cyan-300 md:px-4 md:py-2 md:text-xs"
            >
              {isMuted ? "Unmute" : "Mute"}
            </button>
          )}
        </div>
      </div>
    </motion.article>
  );
}
