import { ArrowUpRight, Instagram, Phone, Send } from "lucide-react";
import Section from "./Section.jsx";
import Reveal from "./Reveal.jsx";

export default function Contacts({ data }) {
  const links = [
    {
      label: "Telegram",
      value: data.telegram,
      href: data.telegramHref,
      Icon: Send,
    },
    {
      label: "Telefon",
      value: data.phone,
      href: data.phoneHref,
      Icon: Phone,
    },
    {
      label: "Instagram",
      value: data.instagram,
      href: data.instagramHref,
      Icon: Instagram,
    },
  ];

  return (
    <Section>
      <Reveal className="relative z-10 flex flex-col items-center">
        <h2 className="font-great-vibes text-[44px] leading-tight text-[#a3233a]">
          Bog'lanish uchun
        </h2>
        <p className="mt-2 max-w-[300px] font-cormorant-garamond text-lg italic leading-snug text-[#3b2a25]/85">
          {data.contactTitle}
        </p>
      </Reveal>

      <ul className="relative z-10 mt-7 w-full max-w-[340px] space-y-3">
        {links.map(({ label, value, href, Icon }, index) => (
          <Reveal key={label} y={24} blur={0} delay={index * 0.1}>
            <a
              href={href}
              target={href.startsWith("tel:") ? undefined : "_blank"}
              rel="noopener noreferrer"
              className="group flex items-center gap-4 rounded-2xl border border-[#e7d3c8] bg-[#fffaf6]/80 px-4 py-3 shadow-sm backdrop-blur-sm transition-colors hover:bg-white"
            >
              <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-[#f3e4dc] text-[#a3233a] transition-colors group-hover:bg-[#a3233a] group-hover:text-white">
                <Icon size={16} aria-hidden="true" />
              </span>
              <span className="min-w-0 flex-1 text-left">
                <span className="block text-[9px] font-semibold uppercase tracking-[0.3em] text-[#a3233a]/70">
                  {label}
                </span>
                <span className="block truncate font-cormorant-garamond text-lg italic text-[#3b2a25]">
                  {value}
                </span>
              </span>
              <ArrowUpRight
                size={16}
                className="shrink-0 text-[#3b2a25]/40"
                aria-hidden="true"
              />
            </a>
          </Reveal>
        ))}
      </ul>
    </Section>
  );
}
