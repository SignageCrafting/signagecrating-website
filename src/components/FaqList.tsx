import { ChevronDown } from 'lucide-react';
import RichText from '@/content/RichText';
import type { FaqItem } from '@/content/types';

interface Props {
  items: FaqItem[];
}

// Native <details> keeps every answer in the HTML, so search engines and AI
// assistants can read it even while it's collapsed.
export default function FaqList({ items }: Props) {
  const accent = 'var(--accent)';
  const heading = 'var(--heading)';
  const text = 'var(--text)';
  const cardBg = 'var(--card)';
  const border = 'var(--border)';

  return (
    <div className="space-y-3">
      {items.map((item, i) => (
        <details key={i} className="group rounded-2xl border transition-colors" style={{ backgroundColor: cardBg, borderColor: border }}>
          <summary className="flex items-center justify-between gap-4 cursor-pointer list-none p-5 md:p-6 [&::-webkit-details-marker]:hidden">
            <h3 className="font-helvetica font-semibold text-base md:text-lg" style={{ color: heading }}>{item.question}</h3>
            <ChevronDown size={18} className="flex-shrink-0 transition-transform group-open:rotate-180" style={{ color: accent }} />
          </summary>
          <RichText text={item.answer} linkColor={accent} strongColor={heading} className="px-5 md:px-6 pb-6 font-helvetica text-sm md:text-base text-body space-y-3" style={{ color: text }} />
        </details>
      ))}
    </div>
  );
}
