import { useCallback, useEffect, useMemo, useState } from "react";
import useEmblaCarousel from "embla-carousel-react";
import { ChevronLeft, ChevronRight, Loader2, Send } from "lucide-react";
import Section from "./Section.jsx";
import Reveal from "./Reveal.jsx";
import { createWish, fetchWishes } from "../lib/wishes.js";

/* Har bir svayper sahifasida ko'rsatiladigan tilaklar soni */
const WISHES_PER_PAGE = 10;

/* Bir vaqtda DOMda saqlanadigan qo'shni sahifalar soni.
 * 100+ tilak bo'lsa ham faqat joriy sahifa atrofi chiziladi. */
const PAGES_IN_MEMORY = 2;

export default function Wishes({ data }) {
  const [wishes, setWishes] = useState(data.wishes || []);
  const [name, setName] = useState("");
  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(true);
  const [loadingFailed, setLoadingFailed] = useState(false);
  const [submitError, setSubmitError] = useState("");
  const [submitting, setSubmitting] = useState(false);
  /* null — hali aniqlanmadi, false — umumiy baza yo'q (faqat brauzer) */
  const [shared, setShared] = useState(null);
  const [emblaRef, emblaApi] = useEmblaCarousel({
    loop: false,
    align: "start",
    containScroll: "trimSnaps",
  });
  const [selectedPage, setSelectedPage] = useState(0);
  const [pageCount, setPageCount] = useState(1);

  const syncPages = useCallback((api) => {
    setSelectedPage(api.selectedScrollSnap());
    setPageCount(Math.max(1, api.scrollSnapList().length));
  }, []);

  useEffect(() => {
    if (!emblaApi) return;
    syncPages(emblaApi);
    emblaApi.on("select", syncPages);
    emblaApi.on("reInit", syncPages);
    return () => {
      emblaApi.off("select", syncPages);
      emblaApi.off("reInit", syncPages);
    };
  }, [emblaApi, syncPages]);

  /* Umumiy ro'yxatni serverdan yuklash */
  useEffect(() => {
    let cancelled = false;

    fetchWishes()
      .then(({ enabled, wishes: rows }) => {
        if (cancelled) return;
        setShared(enabled);
        if (enabled) setWishes(rows);
      })
      .catch(() => {
        if (!cancelled) setLoadingFailed(true);
      })
      .finally(() => {
        if (!cancelled) setLoading(false);
      });

    return () => {
      cancelled = true;
    };
  }, []);

  /* Yangi tilak qo'shilganda sahifalar qayta hisoblanadi */
  useEffect(() => {
    if (!emblaApi) return;
    emblaApi.reInit();
    emblaApi.scrollTo(0);
  }, [emblaApi, wishes.length]);

  const pages = useMemo(() => {
    const result = [];
    for (let i = 0; i < wishes.length; i += WISHES_PER_PAGE) {
      result.push(wishes.slice(i, i + WISHES_PER_PAGE));
    }
    return result;
  }, [wishes]);

  const submit = async (event) => {
    event.preventDefault();
    if (submitting) return;

    const trimmedName = name.trim().slice(0, 100);
    const trimmedMessage = message.trim().slice(0, 500);
    if (!trimmedName || !trimmedMessage) return;

    setSubmitError("");
    const tempWish = {
      id: `local-${Date.now()}`,
      name: trimmedName,
      message: trimmedMessage,
      createdAt: new Date().toISOString(),
      pending: true,
    };
    setWishes((prev) => [tempWish, ...prev]);
    setName("");
    setMessage("");

    if (shared === false) return;

    setSubmitting(true);
    try {
      const saved = await createWish({ name: trimmedName, message: trimmedMessage });
      if (saved) {
        setWishes((prev) => prev.map((wish) => (wish.id === tempWish.id ? saved : wish)));
        setShared(true);
      }
    } catch {
      setWishes((prev) => prev.filter((wish) => wish.id !== tempWish.id));
      setSubmitError(
        "Tilagingizni yuborib bo'lmadi. Internetni tekshirib, qayta urinib ko'ring.",
      );
      setName(trimmedName);
      setMessage(trimmedMessage);
    } finally {
      setSubmitting(false);
    }
  };

  const multiPage = pages.length > 1;

  return (
    <Section>
      <Reveal className="relative z-10 flex flex-col items-center">
        <h2 className="font-great-vibes text-[44px] leading-tight text-[#a3233a]">
          Tilaklar
        </h2>
        <p className="mt-2 max-w-[300px] font-cormorant-garamond text-lg italic leading-snug text-[#3b2a25]/85">
          To'y egaslariga o'z ezgu tilaklaringizni qoldiring
        </p>
      </Reveal>

      <Reveal delay={0.1} className="relative z-10 mt-5 w-full max-w-[360px]">
        <div className="relative w-full rounded-3xl border border-[#e7d3c8] bg-[#fffaf6]/80 p-4 shadow-[0_20px_50px_rgba(120,70,60,0.12)] backdrop-blur-sm">
          <form className="space-y-3" onSubmit={submit}>
            <input
              required
              maxLength={100}
              aria-label="Ismingiz"
              placeholder="Ismingiz"
              value={name}
              onChange={(event) => setName(event.target.value)}
              className="w-full rounded-xl border border-[#e7d3c8] bg-white/70 px-4 py-3 font-cormorant-garamond text-lg italic text-[#3b2a25] placeholder:text-[#3b2a25]/40 focus:border-[#a3233a]/50 focus:outline-none"
            />
            <textarea
              required
              rows={2}
              maxLength={500}
              aria-label="Kelin-kuyovga tilagingiz..."
              placeholder="Kelin-kuyovga tilagingiz..."
              value={message}
              onChange={(event) => setMessage(event.target.value)}
              className="w-full resize-none rounded-xl border border-[#e7d3c8] bg-white/70 px-4 py-3 font-cormorant-garamond text-lg italic text-[#3b2a25] placeholder:text-[#3b2a25]/40 focus:border-[#a3233a]/50 focus:outline-none"
            />
            <button
              type="submit"
              disabled={submitting}
              className="flex w-full items-center justify-center gap-2 rounded-xl bg-[#b98a91] py-3 font-cormorant-garamond text-lg italic text-white shadow-md transition-transform active:scale-[0.98] disabled:opacity-60"
            >
              {submitting ? (
                <Loader2 size={16} className="animate-spin" aria-hidden="true" />
              ) : (
                <Send size={16} aria-hidden="true" />
              )}
              {submitting ? "Yuborilmoqda..." : "Tilak yuborish"}
            </button>
            {submitError && (
              <p className="text-center font-cormorant-garamond text-base italic text-[#a3233a]">
                {submitError}
              </p>
            )}
          </form>
        </div>
      </Reveal>

      <div className="relative z-10 mt-4 w-full max-w-[360px]">
        {loading ? (
          <p className="flex items-center justify-center gap-2 rounded-2xl border border-dashed border-[#e7d3c8] bg-[#fffaf6]/60 px-4 py-8 font-cormorant-garamond text-lg italic text-[#3b2a25]/70">
            <Loader2 size={18} className="animate-spin" aria-hidden="true" />
            Tilaklar yuklanmoqda...
          </p>
        ) : pages.length === 0 ? (
          <p className="rounded-2xl border border-dashed border-[#e7d3c8] bg-[#fffaf6]/60 px-4 py-8 font-cormorant-garamond text-lg italic text-[#3b2a25]/70">
            {loadingFailed
              ? "Tilaklarni yuklab bo'lmadi — sahifani yangilab ko'ring"
              : "Hozircha tilaklar yo'q — birinchi bo'lib tilagingizni qoldiring"}
          </p>
        ) : (
          <>
            <div className="overflow-hidden" ref={emblaRef}>
              <div className="flex touch-pan-y">
                {pages.map((page, pageIndex) => (
                  <div key={pageIndex} className="min-w-0 flex-[0_0_100%]">
                    <ul
                      aria-live="polite"
                      className={`no-scrollbar space-y-2.5 overflow-y-auto pr-1 ${
                        multiPage ? "h-[42dvh]" : ""
                      }`}
                    >
                      {Math.abs(pageIndex - selectedPage) <= PAGES_IN_MEMORY
                        ? page.map((wish) => (
                            <li
                              key={wish.id}
                              className={`rounded-2xl border border-[#ecdcd3] bg-[#fffaf6]/80 px-4 py-3 text-left ${
                                wish.pending ? "opacity-60" : ""
                              }`}
                            >
                              <p className="font-great-vibes text-xl text-[#a3233a] [overflow-wrap:anywhere]">
                                {wish.name}
                              </p>
                              <p className="font-cormorant-garamond text-base italic leading-snug text-[#3b2a25] [overflow-wrap:anywhere]">
                                {wish.message}
                              </p>
                            </li>
                          ))
                        : null}
                    </ul>
                  </div>
                ))}
              </div>
            </div>

            {multiPage && (
              <>
                <div className="mt-4 flex items-center justify-center gap-3">
                  <button
                    type="button"
                    aria-label="Oldingi tilaklar"
                    onClick={() => emblaApi?.scrollPrev()}
                    disabled={selectedPage === 0}
                    className="flex h-9 w-9 items-center justify-center rounded-full border border-[#e7d3c8] bg-[#fffaf6]/80 text-[#a3233a] transition-opacity disabled:opacity-35"
                  >
                    <ChevronLeft size={18} aria-hidden="true" />
                  </button>

                  <div className="flex items-center gap-1.5">
                    {Array.from({ length: pageCount }).map((_, index) => (
                      <button
                        key={index}
                        type="button"
                        aria-label={`${index + 1}-sahifa`}
                        aria-current={index === selectedPage}
                        onClick={() => {
                          setSelectedPage(index);
                          emblaApi?.scrollTo(index);
                        }}
                        className={`h-1.5 rounded-full transition-all ${
                          index === selectedPage
                            ? "w-5 bg-[#a3233a]"
                            : "w-1.5 bg-[#a3233a]/30"
                        }`}
                      />
                    ))}
                  </div>

                  <button
                    type="button"
                    aria-label="Keyingi tilaklar"
                    onClick={() => emblaApi?.scrollNext()}
                    disabled={selectedPage >= pageCount - 1}
                    className="flex h-9 w-9 items-center justify-center rounded-full border border-[#e7d3c8] bg-[#fffaf6]/80 text-[#a3233a] transition-opacity disabled:opacity-35"
                  >
                    <ChevronRight size={18} aria-hidden="true" />
                  </button>
                </div>

                <p className="mt-2 font-cormorant-garamond text-sm italic text-[#3b2a25]/60">
                  {selectedPage + 1} / {pageCount} — boshqa tilaklarni ko'rish
                  uchun suring
                </p>
              </>
            )}
          </>
        )}
      </div>
    </Section>
  );
}
