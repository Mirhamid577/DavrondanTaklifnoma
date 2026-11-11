import { motion } from "framer-motion";
import { CalendarDays } from "lucide-react";
import Section from "./Section.jsx";
import Reveal from "./Reveal.jsx";
import { useScrollRoot } from "../lib/ScrollRoot.jsx";
import {
  buildMonthGrid,
  getCalendarData,
  googleCalendarUrl,
  CALENDAR_WEEKDAYS,
} from "../lib/date.js";

const gridVariants = {
  hidden: {},
  show: { transition: { staggerChildren: 0.018, delayChildren: 0.1 } },
};

const cellVariants = {
  hidden: { opacity: 0, scale: 0.6 },
  show: {
    opacity: 1,
    scale: 1,
    transition: { duration: 0.35, ease: [0.22, 1, 0.36, 1] },
  },
};

const captionVariants = {
  hidden: { opacity: 0, y: 8, filter: "blur(4px)" },
  show: { opacity: 1, y: 0, filter: "blur(0px)" },
};

const linkVariants = {
  hidden: { opacity: 0, y: 10 },
  show: { opacity: 1, y: 0 },
};

export default function Calendar({ data }) {
  const rootRef = useScrollRoot();
  const calendar = getCalendarData(data.date);
  const cells = buildMonthGrid(calendar.year, calendar.month);

  return (
    <Section>
      <Reveal className="relative z-10 flex flex-col items-center">
        <h2 className="font-great-vibes text-[52px] leading-tight text-[#a3233a]">
          Kalendar
        </h2>
        <p className="mt-2 max-w-[300px] font-cormorant-garamond text-lg italic leading-snug text-[#3b2a25]/60">
          To'y kunini kalendarga belgilab qo&apos;ying
        </p>
      </Reveal>

      <Reveal delay={0.1} className="relative z-10 mt-6 w-full max-w-[330px]">
        <div className="w-full rounded-3xl border border-[#e7d3c8] bg-[#fffaf6]/80 px-4 py-5 shadow-[0_20px_50px_rgba(120,70,60,0.12)] backdrop-blur-sm">
          <motion.p
            className="text-center font-great-vibes text-3xl text-[#a3233a]/80"
            initial={{ opacity: 0, y: 12, filter: "blur(4px)" }}
            whileInView={{ opacity: 1, y: 0, filter: "blur(0px)" }}
            viewport={{ root: rootRef, once: true, amount: 0.4 }}
            transition={{ duration: 0.6, delay: 0.12 }}
          >
            {calendar.monthName} {calendar.year}
          </motion.p>

          <motion.div
            className="mt-3 grid grid-cols-7 border-b border-[#3b2a25]/15 pb-1"
            initial="hidden"
            whileInView="show"
            viewport={{ root: rootRef, once: true, amount: 0.4 }}
            variants={gridVariants}
          >
            {CALENDAR_WEEKDAYS.map((day) => (
              <motion.span
                key={day}
                variants={cellVariants}
                className="text-center font-cormorant-garamond text-[15px] italic uppercase tracking-wide text-[#3b2a25]/45"
              >
                {day}
              </motion.span>
            ))}
          </motion.div>

          <motion.div
            className="mt-2 grid grid-cols-7 gap-y-1.5"
            initial="hidden"
            whileInView="show"
            viewport={{ root: rootRef, once: true, amount: 0.4 }}
            variants={gridVariants}
          >
            {cells.map((day, index) => (
              <motion.span
                key={index}
                variants={cellVariants}
                className="flex h-8 items-center justify-center font-cormorant-garamond text-[17px] text-[#3b2a25]/80"
              >
                {day === null ? null : day === calendar.day ? (
                  <span className="relative flex h-8 w-8 items-center justify-center rounded-full bg-[#a3233a] text-[17px] text-[#fffaf6] shadow-[0_4px_12px_rgba(163,35,58,0.30)]">
                    {day}
                  </span>
                ) : (
                  day
                )}
              </motion.span>
            ))}
          </motion.div>

          <motion.a
            href={googleCalendarUrl(data)}
            target="_blank"
            rel="noopener noreferrer"
            className="mx-auto mt-5 flex w-fit items-center gap-2 rounded-full border border-[#e2c9bd] bg-white/75 px-5 py-2.5 font-cormorant-garamond text-base italic text-[#3b2a25]/80 shadow-sm backdrop-blur-sm transition-colors hover:bg-white"
            initial={{ opacity: 0, y: 10 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ root: rootRef, once: true, amount: 0.4 }}
            transition={{ duration: 0.5, delay: 0.6 }}
          >
            <CalendarDays size={16} className="text-[#a3233a]/85" aria-hidden="true" />
            Kalendariga qo&apos;shish
          </motion.a>
        </div>
      </Reveal>
    </Section>
  );
}
