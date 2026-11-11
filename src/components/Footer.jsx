import Section from "./Section.jsx";
import Reveal from "./Reveal.jsx";
import Ornament from "./Ornament.jsx";
import { getCalendarData } from "../lib/date.js";

export default function Footer({ data }) {
  const calendar = getCalendarData(data.date);
  const dateLabel = `${String(calendar.day).padStart(2, "0")}.${String(
    calendar.month + 1
  ).padStart(2, "0")}.${calendar.year}`;

  return (
    <Section>
      <div className="relative z-10 flex max-w-[320px] flex-col items-center">
        <Reveal className="font-cormorant-garamond text-xl italic leading-relaxed text-[#3b2a25]/85">
          Sizni intizorlik bilan kutamiz.
        </Reveal>

        <Reveal delay={0.1} className="mt-7 font-great-vibes text-[34px] leading-tight text-[#5a3d33]">
          {data.groomName}
          <span className="block text-xl text-[#a3233a]/80">&amp;</span>
          {data.brideName}
        </Reveal>

        <Reveal delay={0.18} className="mt-5 text-xs tracking-[0.4em] text-[#3b2a25]/70">
          {dateLabel}
        </Reveal>

        <Reveal delay={0.26} className="my-8">
          <Ornament />
        </Reveal>

        <Reveal delay={0.34}>
          <p className="text-[9px] font-semibold uppercase tracking-[0.4em] text-[#a3233a]/70">
            Hurmat bilan
          </p>
          <p className="mt-2 font-great-vibes text-2xl text-[#a3233a]">
            {data.familyNames}
          </p>
        </Reveal>
      </div>

    </Section>
  );
}
