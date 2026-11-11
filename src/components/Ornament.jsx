export default function Ornament({ className = "" }) {
  return (
    <div
      aria-hidden="true"
      className={`flex items-center justify-center gap-3 ${className}`}
    >
      <span className="h-px w-16 bg-[#3b2a25]/35" />
      <span className="h-2 w-2 rotate-45 bg-[#a3233a]/70" />
      <span className="h-px w-16 bg-[#3b2a25]/35" />
    </div>
  );
}
