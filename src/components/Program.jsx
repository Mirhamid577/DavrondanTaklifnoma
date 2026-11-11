import Reveal from "./Reveal.jsx";
import Section from "./Section.jsx";

export default function Program({ data }) {
  const media = data.media;

  return (
    <Section>
      <Reveal className="relative z-10 flex flex-col items-center">
        <img
          src={media.iconTimeline}
          alt=""
          width={72}
          height={72}
          loading="lazy"
          className="mb-3 h-16 w-16 object-contain"
        />
        <h2 className="font-great-vibes text-[44px] leading-tight text-[#a3233a]">
          To'y Dasturi
        </h2>
      </Reveal>

      <ol className="relative z-10 mt-8 w-full max-w-[340px]">
        <span
          aria-hidden="true"
          className="absolute inset-y-0 left-1/2 w-px -translate-x-1/2 bg-[#3b2a25]/30"
        />
        {data.schedule.map((item, index) => {
          const isRight = index % 2 === 1;
          return (
            <li
              key={`${item.time}-${item.title}`}
              className="relative grid grid-cols-2 gap-8 py-4"
            >
              <span
                aria-hidden="true"
                className="absolute left-1/2 top-1/2 h-3 w-3 -translate-x-1/2 -translate-y-1/2 rounded-full border-2 border-[#3b2a25]/60 bg-[#fbeee6]"
              />
              <Reveal
                x={isRight ? 24 : -24}
                y={0}
                blur={0}
                amount={0.5}
                delay={index * 0.1}
                className={isRight ? "col-start-2 text-left" : "text-right"}
              >
                <img
                  src={
                    item.icon === "car"
                      ? media.timelineCar
                      : media.timelineChampagne
                  }
                  alt=""
                  width={44}
                  height={44}
                  loading="lazy"
                  className="mb-1 inline-block h-11 w-11 object-contain"
                />
                <p className="font-great-vibes text-[30px] leading-none text-[#1f1512]">
                  {item.time}
                </p>
                <p className="mt-1 font-cormorant-garamond text-lg italic leading-snug text-[#a3233a] [overflow-wrap:anywhere]">
                  {item.title}
                </p>
              </Reveal>
            </li>
          );
        })}
      </ol>
    </Section>
  );
}
