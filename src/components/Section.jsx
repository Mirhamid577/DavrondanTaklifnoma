export default function Section({ id, className = "", children }) {
  return (
    <section
      id={id}
      className={`relative flex min-h-[100dvh] snap-start snap-always flex-col items-center justify-center overflow-hidden px-6 py-20 text-center ${className}`}
    >
      {children}
    </section>
  );
}
