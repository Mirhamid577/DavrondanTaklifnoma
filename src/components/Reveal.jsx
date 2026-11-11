import { motion } from "framer-motion";
import { useScrollRoot } from "../lib/ScrollRoot.jsx";

const EASE = [0.22, 1, 0.36, 1];

export default function Reveal({
  children,
  className = "",
  delay = 0,
  x = 0,
  y = 28,
  scale = 1,
  blur = 6,
  duration = 0.9,
  amount = 0.25,
}) {
  const rootRef = useScrollRoot();

  const hidden = { opacity: 0, x, y, scale, filter: `blur(${blur}px)` };
  const shown = { opacity: 1, x: 0, y: 0, scale: 1, filter: "blur(0px)" };

  return (
    <motion.div
      className={className}
      initial={hidden}
      whileInView={shown}
      viewport={{ root: rootRef, once: true, amount }}
      transition={{ duration, delay, ease: EASE }}
    >
      {children}
    </motion.div>
  );
}
