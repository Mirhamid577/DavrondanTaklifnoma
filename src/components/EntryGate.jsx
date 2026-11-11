import { useEffect, useRef, useState } from "react";
import { motion } from "framer-motion";

/* Konvert video tezligi (1 = original, 2 = ikki barobar tez) */
const PLAYBACK_RATE = 2;

export default function EntryGate({ data, onOpen, onFinished }) {
  const media = data.media;
  const videoRef = useRef(null);
  const [opening, setOpening] = useState(false);

  useEffect(() => {
    if (!opening) return undefined;

    const video = videoRef.current;
    const fallback = video?.duration
      ? Math.round((video.duration * 1000) / PLAYBACK_RATE) + 600
      : 4000;
    const timer = window.setTimeout(onFinished, fallback);
    return () => window.clearTimeout(timer);
  }, [opening, onFinished]);

  const handleOpen = () => {
    if (opening) return;
    setOpening(true);
    onOpen?.();

    const video = videoRef.current;
    if (!video) {
      onFinished();
      return;
    }
    video.currentTime = 0;
    video.playbackRate = PLAYBACK_RATE;
    video.play().catch(() => onFinished());
  };

  return (
    <motion.div
      key="gate"
      role="button"
      tabIndex={0}
      aria-label="Ochish uchun bosing"
      onClick={handleOpen}
      onKeyDown={(event) => {
        if (event.key === "Enter" || event.key === " ") {
          event.preventDefault();
          handleOpen();
        }
      }}
      className="absolute inset-0 z-[60] cursor-pointer overflow-hidden bg-[#efe3d6]"
      initial={{ opacity: 1 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.9, ease: "easeInOut" }}
    >
      <motion.div
        className="absolute inset-0 flex items-end justify-center pb-6"
        style={{ background: "linear-gradient(to top, rgba(239,227,214,0.92) 0%, rgba(239,227,214,0.0) 70%, rgba(239,227,214,0.0) 100%)" }}
        aria-hidden="true"
      />
      <video
        ref={videoRef}
        src={media.envelopeVideo}
        poster={media.envelopePoster}
        muted
        playsInline
        preload="auto"
        onEnded={onFinished}
        onError={onFinished}
        className="absolute inset-0 h-full w-full object-cover"
      />
      <motion.p
        className="absolute inset-x-0 bottom-[8%] text-center font-cormorant-garamond text-lg italic tracking-wide text-[#6b5045]"
        animate={{ opacity: opening ? 0 : [0.5, 1, 0.5] }}
        transition={
          opening
            ? { duration: 0.3 }
            : { duration: 2.8, repeat: Infinity, ease: "easeInOut" }
        }
      >
        Ochish uchun bosing
      </motion.p>
    </motion.div>
  );
}
