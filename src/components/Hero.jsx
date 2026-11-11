import { motion } from "framer-motion";
import Ornament from "./Ornament.jsx";
import { getCalendarData } from "../lib/date.js";

const EASE = [0.22, 1, 0.36, 1];

const hidden = { opacity: 0, y: 24, filter: "blur(8px)" };
const shown = { opacity: 1, y: 0, filter: "blur(0px)" };

export default function Hero({ data, active = false }) {
  const calendar = getCalendarData(data.date);
  const media = data.media;
  const state = active ? shown : hidden;

  return (
    <section className="relative flex h-[100dvh] snap-start snap-always flex-col items-center overflow-hidden bg-[#efe3d6] text-center">
      <video
        src={media.heroVideo}
        poster={media.heroPoster}
        autoPlay
        muted
        loop
        playsInline
        preload="auto"
        aria-hidden="true"
        className="absolute inset-0 h-full w-full object-cover"
      />
      <div className="absolute inset-x-0 top-0 h-2/3 bg-gradient-to-b from-[#f6ece3]/50 via-[#f6ece3]/20 to-transparent" />

      <div className="relative z-10 flex w-full max-w-[360px] flex-col items-center px-6 pt-[15dvh]">
        <motion.h1
          className="font-great-vibes text-[40px] leading-[1.1] text-[#5a3d33]"
          initial={hidden}
          animate={state}
          transition={{ duration: 1, delay: 0.15, ease: EASE }}
        >
          {data.groomName}
        </motion.h1>
        <motion.span
          className="font-great-vibes text-xl text-[#a3233a]/80"
          initial={hidden}
          animate={state}
          transition={{ duration: 1, delay: 0.3, ease: EASE }}
        >
          &amp;
        </motion.span>
        <motion.h1
          className="font-great-vibes text-[40px] leading-[1.1] text-[#5a3d33]"
          initial={hidden}
          animate={state}
          transition={{ duration: 1, delay: 0.45, ease: EASE }}
        >
          {data.brideName}
        </motion.h1>

        <motion.p
          className="mt-4 max-w-[260px] font-cormorant-garamond text-lg italic leading-snug text-[#a3233a] [overflow-wrap:anywhere]"
          initial={hidden}
          animate={state}
          transition={{ duration: 1, delay: 0.6, ease: EASE }}
        >
          {data.message}
        </motion.p>

        <motion.div
          className="mt-7"
          initial={hidden}
          animate={state}
          transition={{ duration: 1, delay: 0.75, ease: EASE }}
        >
          <Ornament />
        </motion.div>

        <motion.p
          className="mt-4 font-great-vibes text-[30px] leading-none text-[#5a3d33]"
          initial={hidden}
          animate={state}
          transition={{ duration: 1, delay: 0.9, ease: EASE }}
        >
          {calendar.day} {calendar.monthName} {calendar.year}
        </motion.p>
      </div>

      <motion.div
        className="absolute bottom-8 z-10 flex flex-col items-center gap-2"
        aria-hidden="true"
        initial={{ opacity: 0 }}
        animate={{ opacity: active ? 1 : 0 }}
        transition={{ duration: 1, delay: active ? 1.4 : 0 }}
      >
        <span className="text-[10px] font-semibold uppercase tracking-[0.25em] text-[#5a3d33]">
          Scroll
        </span>
        <span className="flex h-9 w-6 justify-center rounded-full border-2 border-[#5a3d33] pt-1.5">
          <motion.span
            className="h-2 w-1 rounded-full bg-[#5a3d33]"
            animate={{ y: [0, 10, 0] }}
            transition={{ duration: 1.8, repeat: Infinity, ease: "easeInOut" }}
          />
        </span>
      </motion.div>
    </section>
  );
}
