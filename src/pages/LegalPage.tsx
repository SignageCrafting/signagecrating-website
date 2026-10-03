import { useStore } from '@/store/useStore';
import FadeIn from '@/components/FadeIn';
import { useContent } from '@/content/store';
import RichText from '@/content/RichText';
import type { LegalKey } from '@/content/types';

export default function LegalPage({ page }: { page: LegalKey }) {
  const theme = useStore((s) => s.theme);
  const { title, lastUpdated, sections } = useContent().legal[page];
  const isDark = theme !== 'light';
  const accent = '#ff5a1a';
  const headingColor = isDark ? '#fff' : '#1a1a1a';
  const textColor = isDark ? '#888' : '#5a5a5a';
  const cardBg = isDark ? '#111' : '#f0ece5';
  const borderColor = isDark ? '#2a2a2a' : '#d4d0c8';

  return (
    <div className="pt-24 pb-20 transition-colors duration-300" style={{ backgroundColor: isDark ? '#080c0d' : '#ffffff' }}>
      <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
        <FadeIn eager className="text-center mb-16">
          <p className="font-mono text-xs tracking-[0.2em] uppercase mb-3" style={{ color: accent }}>Legal</p>
          <h1 className="font-trajan font-bold title-page" style={{ color: headingColor }}>{title}</h1>
          {lastUpdated && <p className="font-helvetica text-sm mt-4" style={{ color: isDark ? '#555' : '#8a8a8a' }}>Last updated: {lastUpdated}</p>}
        </FadeIn>

        <FadeIn>
          <div className="p-8 md:p-10 rounded-2xl border transition-colors duration-300 space-y-10" style={{ backgroundColor: cardBg, borderColor }}>
            {sections.map((section, i) => (
              <section key={i}>
                {section.heading && <h2 className="font-trajan font-bold title-sub mb-4" style={{ color: headingColor }}>{section.heading}</h2>}
                <RichText text={section.body} linkColor={accent} strongColor={headingColor} borderColor={borderColor} className="font-helvetica text-base text-body space-y-4" style={{ color: textColor }} />
              </section>
            ))}
          </div>
        </FadeIn>
      </div>
    </div>
  );
}
