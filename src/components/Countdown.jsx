import { useEffect, useState } from "react";
import { CalendarDays, Clock } from "lucide-react";
import Section from "./Section.jsx";
import Reveal from "./Reveal.jsx";
import { getCountdown, parseDateTime, getCalendarData } from "../lib/date.js";

const pad = (value) => String(value).padStart(2, "0");

export default function Countdown({ data }) {
  const target = parseDateTime(data.date, data.time);
  const [left, setLeft] = useState(() => getCountdown(target));
  const calendar = getCalendarData(data.date);
  const dateLabel = `${pad(calendar.day)}.${pad(calendar.month + 1)}.${calendar.year}`;

  useEffect(() => {
    const id = window.setInterval(() => setLeft(getCountdown(target)), 1000);
    return () => window.clearInterval(id);
  }, [target]);

  const cells = [
    { value: left.days, label: "Kun" },
    { value: left.hours, label: "Soat" },
    { value: left.minutes, label: "Daqiqa" },
    { value: left.seconds, label: "Soniya" },
  ];

  return (
    <Section>
      <Reveal className="relative z-10 flex flex-col items-center">
        <h2 className="font-great-vibes text-[44px] leading-tight text-[#a3233a]">
          Qolgan vaqt
        </h2>
        <p className="mt-2 max-w-[300px] font-cormorant-garamond text-lg italic leading-snug text-[#3b2a25]/85">
          Bu lahzani intiqlik bilan kutyapmiz!
        </p>
      </Reveal>

      <div className="relative z-10 mt-10 grid w-full max-w-[340px] grid-cols-4 gap-2.5">
        {cells.map((cell, index) => (
          <Reveal key={cell.label} delay={0.1 + index * 0.08} className="flex flex-col items-center">
            <span className="flex aspect-square w-full items-center justify-center rounded-2xl bg-[radial-gradient(circle,rgba(255,255,255,0.85)_0%,rgba(255,240,232,0.35)_75%)] font-great-vibes text-[38px] tabular-nums text-[#a3233a] shadow-[0_8px_24px_rgba(163,35,58,0.08)]">
              {pad(cell.value)}
            </span>
            <span className="mt-2 font-great-vibes text-lg text-[#a3233a]/80">
              {cell.label}
            </span>
          </Reveal>
        ))}
      </div>

      <Reveal delay={0.2} className="relative z-10 mt-10 flex items-center gap-5 font-cormorant-garamond text-lg italic text-[#3b2a25]">
        <span className="flex items-center gap-2">
          <CalendarDays size={16} className="text-[#a3233a]" aria-hidden="true" />
          {dateLabel}
        </span>
        <span className="h-4 w-px bg-[#3b2a25]/30" />
        <span className="flex items-center gap-2">
          <Clock size={16} className="text-[#a3233a]" aria-hidden="true" />
          {data.time}
        </span>
      </Reveal>
    </Section>
  );
}
