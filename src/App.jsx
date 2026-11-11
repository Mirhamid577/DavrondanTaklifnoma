import { useEffect, useRef, useState } from "react";
import { AnimatePresence } from "framer-motion";
import config from "./config.js";
import { ScrollRootProvider } from "./lib/ScrollRoot.jsx";
import EntryGate from "./components/EntryGate.jsx";
import Hero from "./components/Hero.jsx";
import Countdown from "./components/Countdown.jsx";
import Venue from "./components/Venue.jsx";
import Program from "./components/Program.jsx";
import Calendar from "./components/Calendar.jsx";
import Wishes from "./components/Wishes.jsx";
import Contacts from "./components/Contacts.jsx";
import Footer from "./components/Footer.jsx";
import MusicButton from "./components/MusicButton.jsx";

export default function App() {
  const [gateVisible, setGateVisible] = useState(true);
  const [entered, setEntered] = useState(false);
  const [playing, setPlaying] = useState(false);
  const audioRef = useRef(null);
  const scrollRef = useRef(null);

  useEffect(() => {
    if (gateVisible) return;
    scrollRef.current?.scrollTo({ top: 0, behavior: "auto" });
  }, [gateVisible]);


  const toggleMusic = () => {
    const audio = audioRef.current;
    if (!audio) return;
    if (audio.paused) {
      audio.play().catch(() => setPlaying(false));
    } else {
      audio.pause();
    }
  };

  const openInvitation = () => {
    const audio = audioRef.current;
    if (audio) {
      audio.play().then(() => setPlaying(true)).catch(() => setPlaying(false));
    }
  };

  return (
    <div className="relative isolate h-[100dvh] w-full overflow-hidden bg-[#f6e7dc] text-[#3b2a25]">
      <div
        aria-hidden="true"
        className="absolute inset-0 scale-110 bg-cover bg-center opacity-70 blur-2xl"
        style={{ backgroundImage: `url(${config.media.bgPoster})` }}
      />

      <div className="relative mx-auto h-full w-full max-w-[calc(100dvh*9/16)] overflow-hidden shadow-[0_0_80px_rgba(90,61,51,0.25)]">
        <div
          className="pointer-events-none absolute inset-0 z-0 overflow-hidden"
          aria-hidden="true"
        >
          <video
            src={config.media.bgVideo}
            poster={config.media.bgPoster}
            autoPlay
            muted
            loop
            playsInline
            preload="auto"
            className="h-full w-full object-cover"
          />
          <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,rgba(252,238,228,0.55)_0%,rgba(252,238,228,0)_70%)]" />
        </div>

        <audio ref={audioRef} src={config.musicUrl} loop preload="metadata" />

        <MusicButton playing={playing} onToggle={toggleMusic} />

        <ScrollRootProvider rootRef={scrollRef}>
          <div
            ref={scrollRef}
            data-testid="swan-garden-template"
            className="no-scrollbar absolute inset-0 z-10 snap-y snap-mandatory overflow-x-hidden overflow-y-auto"
          >
            <Hero data={config} active={entered} />
            <Countdown data={config} />
            <Venue data={config} />
            <Program data={config} />
            <Calendar data={config} />
            <Wishes data={config} />
            <Contacts data={config} />
            <Footer data={config} />
          </div>
        </ScrollRootProvider>

        <AnimatePresence>
          {gateVisible && (
            <EntryGate
              data={config}
              onOpen={openInvitation}
              onFinished={() => {
                setGateVisible(false);
                setEntered(true);
              }}
            />
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}
