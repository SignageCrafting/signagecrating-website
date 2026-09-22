import { motion, AnimatePresence } from 'framer-motion';
import type { ReactNode } from 'react';

interface FadeOverlayProps {
  children: ReactNode;
}

export default function FadeOverlay({ children }: FadeOverlayProps) {
  return (
    <AnimatePresence mode="wait">
      <motion.div
        key={location.pathname}
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        transition={{
          duration: 0.5,
          ease: [0.16, 1, 0.3, 1] as [number, number, number, number],
        }}
        className="w-full"
      >
        {children}
      </motion.div>
    </AnimatePresence>
  );
}
