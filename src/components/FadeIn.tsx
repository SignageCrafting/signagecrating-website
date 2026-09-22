import { useRef } from 'react';
import { motion, useInView, useReducedMotion } from 'framer-motion';

const fadeUp = { hidden: { opacity: 0, y: 30 }, visible: { opacity: 1, y: 0 } };

interface Props {
  children: React.ReactNode;
  className?: string;
  style?: React.CSSProperties;
  delay?: number;
  // Above-the-fold content: show it on first paint instead of fading in, so
  // the page's main heading counts for Google's Largest Contentful Paint.
  eager?: boolean;
}

export default function FadeIn({ children, className = '', style, delay = 0, eager = false }: Props) {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: '-50px' });
  const reduceMotion = useReducedMotion();
  const skip = eager || !!reduceMotion;
  return (
    <motion.div
      ref={ref}
      initial={skip ? false : 'hidden'}
      animate={skip || isInView ? 'visible' : 'hidden'}
      variants={fadeUp}
      transition={{ duration: 0.6, ease: 'easeOut', delay }}
      className={className}
      style={style}
    >
      {children}
    </motion.div>
  );
}
