import { Fragment } from 'react';
import { Link } from 'react-router-dom';
import { fullAddress, telHref, useContent } from './store';

// Renders text edited in /admin. Supports:
//   blank line          new paragraph
//   - item              bullet list (one "- " line per item)
//   | a | b |           table (first row is the header; a |---| row is optional)
//   **bold**            bold text
//   [label](url)        link (https://, mailto:, tel: or a /page path)
//   name@example.com    email addresses become mailto links
//   {email} {phone} {address} {business} {year}  business details from /admin
const INLINE = /(\*\*[^*]+\*\*|\[[^\]]+\]\([^)\s]+\)|\{(?:email|phone|address|business|year)\}|[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Za-z]{2,})/g;
const EMAIL = /^[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Za-z]{2,}$/;

function safeHref(url: string) {
  return /^(https?:\/\/|mailto:|tel:|\/)/i.test(url) ? url : null;
}

function tableCells(line: string) {
  return line.trim().replace(/^\|/, '').replace(/\|$/, '').split('|').map((c) => c.trim());
}

interface Props {
  text: string;
  linkColor: string;
  strongColor: string;
  borderColor?: string;
  className?: string;
  style?: React.CSSProperties;
}

export default function RichText({ text, linkColor, strongColor, borderColor = 'rgba(128,128,128,0.3)', className, style }: Props) {
  const { business } = useContent();
  const linkClass = 'underline break-words';

  const renderInline = (line: string) =>
    line.split(INLINE).map((part, i) => {
      if (!part) return null;
      if (part.startsWith('**') && part.endsWith('**') && part.length > 4) {
        return <strong key={i} style={{ color: strongColor }}>{renderInline(part.slice(2, -2))}</strong>;
      }
      const link = part.match(/^\[([^\]]+)\]\(([^)\s]+)\)$/);
      if (link) {
        const href = safeHref(link[2]);
        if (!href) return <Fragment key={i}>{link[1]}</Fragment>;
        if (href.startsWith('/')) return <Link key={i} to={href} className={linkClass} style={{ color: linkColor }}>{link[1]}</Link>;
        const external = /^https?:/i.test(href);
        return (
          <a key={i} href={href} className={linkClass} style={{ color: linkColor }} {...(external ? { target: '_blank', rel: 'noopener noreferrer' } : {})}>
            {link[1]}
          </a>
        );
      }
      if (EMAIL.test(part)) {
        return <a key={i} href={`mailto:${part}`} className={linkClass} style={{ color: linkColor }}>{part}</a>;
      }
      switch (part) {
        case '{email}':
          return <a key={i} href={`mailto:${business.email}`} className={linkClass} style={{ color: linkColor }}>{business.email}</a>;
        case '{phone}':
          return <a key={i} href={telHref(business.phone)} className={linkClass} style={{ color: linkColor }}>{business.phone}</a>;
        case '{address}':
          return <Fragment key={i}>{fullAddress(business)}</Fragment>;
        case '{business}':
          return <Fragment key={i}>{business.name}</Fragment>;
        case '{year}':
          return <Fragment key={i}>{new Date().getFullYear()}</Fragment>;
        default:
          return <Fragment key={i}>{part}</Fragment>;
      }
    });

  const blocks = text.split(/\n\s*\n/).map((b) => b.trim()).filter(Boolean);

  const renderBlock = (block: string, i: number) => {
    const lines = block.split('\n').map((l) => l.trim()).filter(Boolean);

    if (lines.every((l) => l.startsWith('- '))) {
      return (
        <ul key={i} className="list-disc pl-5 space-y-2 marker:opacity-60">
          {lines.map((l, j) => <li key={j}>{renderInline(l.slice(2))}</li>)}
        </ul>
      );
    }

    if (lines.every((l) => l.startsWith('|'))) {
      const rows = lines.filter((l) => !/^\|?\s*:?-{3,}/.test(l)).map(tableCells);
      const [head, ...body] = rows;
      const cell = { borderColor, borderStyle: 'solid', borderWidth: 1 } as const;
      return (
        <div key={i} className="overflow-x-auto">
          <table className="w-full border-collapse text-left text-sm">
            <thead>
              <tr>{head.map((c, j) => <th key={j} className="px-4 py-3 align-top font-semibold" style={{ ...cell, color: strongColor }}>{renderInline(c)}</th>)}</tr>
            </thead>
            <tbody>
              {body.map((row, r) => (
                <tr key={r}>{row.map((c, j) => <td key={j} className="px-4 py-3 align-top" style={cell}>{renderInline(c)}</td>)}</tr>
              ))}
            </tbody>
          </table>
        </div>
      );
    }

    return (
      <p key={i}>
        {lines.map((line, j) => (
          <Fragment key={j}>
            {j > 0 && <br />}
            {renderInline(line)}
          </Fragment>
        ))}
      </p>
    );
  };

  return (
    <div className={className} style={style}>
      {blocks.map(renderBlock)}
    </div>
  );
}
