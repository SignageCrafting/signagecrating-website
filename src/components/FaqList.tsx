import { ChevronDown } from 'lucide-react';
import RichText from '@/content/RichText';
import type { FaqItem } from '@/content/types';

interface Props {
  items: FaqItem[];
  isDark: boolean;
}

// Native <details> keeps every answer in the HTML, so search engines and AI
// assistants can read it even while it's collapsed.
export default function FaqList({ items, isDark }: Props) {
  const accent = isDark ? '#fd4601' : '#c43500';
  const heading = isDark ? '#fff' : '#1a1a1a';
  const text = isDark ? '#888' : '#5a5a5a';
  const cardBg = isDark ? '#111' : '#f0ece5';
  const border = isDark ? '#2a2a2a' : '#d4d0c8';

  return (
    <div className="space-y-3">
      {items.map((item, i) => (
        <details key={i} className="group rounded-2xl border transition-colors" style={{ backgroundColor: cardBg, borderColor: border }}>
          <summary className="flex items-center justify-between gap-4 cursor-pointer list-none p-5 md:p-6 [&::-webkit-details-marker]:hidden">
            <h3 className="font-helvetica font-semibold text-base md:text-lg" style={{ color: heading }}>{item.question}</h3>
            <ChevronDown size={18} className="flex-shrink-0 transition-transform group-open:rotate-180" style={{ color: accent }} />
          </summary>
          <RichText text={item.answer} linkColor={accent} strongColor={heading} className="px-5 md:px-6 pb-6 font-helvetica text-sm md:text-base leading-relaxed space-y-3" style={{ color: text }} />
        </details>
      ))}
    </div>
  );
}
