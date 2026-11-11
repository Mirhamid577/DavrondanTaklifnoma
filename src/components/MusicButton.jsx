import { Volume2, VolumeX } from "lucide-react";

export default function MusicButton({ playing, onToggle }) {
  return (
    <div className="fixed bottom-8 right-8 z-[110]">
      <button
        type="button"
        aria-label="Toggle music"
        onClick={onToggle}
        className="flex h-14 w-14 items-center justify-center rounded-full bg-[#3b2a25]/85 text-white shadow-2xl backdrop-blur-md transition-transform active:scale-95"
      >
        {playing ? (
          <Volume2 size={24} aria-hidden="true" />
        ) : (
          <VolumeX size={24} aria-hidden="true" />
        )}
      </button>
    </div>
  );
}
