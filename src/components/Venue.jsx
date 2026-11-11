import { ExternalLink, Navigation } from "lucide-react";
import Section from "./Section.jsx";
import Reveal from "./Reveal.jsx";

export default function Venue({ data }) {
  return (
    <Section>
      <Reveal className="relative z-10 flex flex-col items-center">
        <h2 className="font-great-vibes text-[44px] leading-tight text-[#a3233a]">
          Manzil
        </h2>
      </Reveal>

      <Reveal
        scale={0.94}
        blur={0}
        className="relative z-10 mt-6 w-full max-w-[340px] rounded-[28px] border border-[#e7d3c8] bg-[#fffaf6]/80 p-2 shadow-[0_20px_50px_rgba(120,70,60,0.14)]"
      >
        <iframe
          src={data.mapEmbed}
          title={data.locationName}
          loading="lazy"
          allowFullScreen
          className="aspect-[16/9] w-full rounded-[22px] border-0"
        />
      </Reveal>

      <Reveal delay={0.1} className="relative z-20 flex flex-col items-center">
        <h3 className="mt-3 font-great-vibes text-3xl text-[#a3233a] [overflow-wrap:anywhere]">
          {data.locationName}
        </h3>
        <p className="mt-1 max-w-[290px] font-cormorant-garamond text-lg italic leading-snug text-[#3b2a25]">
          {data.address}
        </p>
      </Reveal>

      <Reveal delay={0.2} className="relative z-10 mt-6 w-full max-w-[320px]">
        <a
          href={data.mapUrl}
          target="_blank"
          rel="noopener noreferrer"
          className="flex items-center gap-3 rounded-full border border-[#e2c9bd] bg-white/75 px-3 py-2.5 text-left shadow-sm backdrop-blur-sm transition-colors hover:bg-white"
        >
          <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-[#f3e4dc] text-[#3b2a25]">
            <Navigation size={16} aria-hidden="true" />
          </span>
          <span className="flex-1">
            <span className="block font-cormorant-garamond text-lg italic leading-tight text-[#3b2a25]">
              Xaritada ko'rish
            </span>
            <span className="block font-cormorant-garamond text-sm italic text-[#3b2a25]/60">
              Xaritada ochish
            </span>
          </span>
          <ExternalLink size={16} className="mr-2 text-[#3b2a25]/60" aria-hidden="true" />
        </a>
      </Reveal>
    </Section>
  );
}
