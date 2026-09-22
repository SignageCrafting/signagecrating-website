import { lazy, Suspense } from 'react';
import { BrowserRouter } from 'react-router-dom';
import ContentProvider from './content/ContentProvider';
import SiteRoutes from './SiteRoutes';

// Loaded only when someone opens /admin, so visitors never download it.
const AdminApp = lazy(() => import('./admin/AdminApp'));

export default function App() {
  return (
    <BrowserRouter>
      <ContentProvider>
        <SiteRoutes
          admin={
            <Suspense fallback={<div className="min-h-screen bg-slate-50" />}>
              <AdminApp />
            </Suspense>
          }
        />
      </ContentProvider>
    </BrowserRouter>
  );
}
