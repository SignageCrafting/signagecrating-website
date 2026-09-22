import { Navigate, useParams } from 'react-router-dom';
import { ExternalLink } from 'lucide-react';
import { sections } from './schema';
import { FieldGrid } from './fields';

export default function ContentEditor() {
  const { sectionId } = useParams();
  const section = sections.find((s) => s.id === sectionId);
  if (!section) return <Navigate to="/admin" replace />;
  const Icon = section.icon;

  return (
    <div>
      <div className="mb-6 flex flex-wrap items-start justify-between gap-4">
        <div className="flex items-start gap-3">
          <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-teal-50 text-teal-700 dark:bg-teal-950 dark:text-teal-300"><Icon size={20} /></div>
          <div>
            <h1 className="text-xl font-semibold text-slate-900 dark:text-white">{section.title}</h1>
            <p className="mt-0.5 max-w-2xl text-sm text-slate-500 dark:text-slate-400">{section.description}</p>
          </div>
        </div>
        <a href={section.preview} target="_blank" rel="noopener" className="inline-flex items-center gap-1.5 rounded-lg border border-slate-300 px-3 py-2 text-sm font-medium text-slate-700 transition hover:bg-white dark:border-slate-700 dark:text-slate-200 dark:hover:bg-slate-900">
          View page <ExternalLink size={14} />
        </a>
      </div>
      <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm sm:p-6 dark:border-slate-800 dark:bg-slate-900">
        <FieldGrid fields={section.fields} path={section.path} />
      </div>
    </div>
  );
}
