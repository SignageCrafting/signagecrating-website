import { Routes, Route } from 'react-router-dom';
import Layout from './components/Layout';
import Home from './pages/Home';
import SignTypes from './pages/SignTypes';
import SignTypeDetail from './pages/SignTypeDetail';
import About from './pages/About';
import Quote from './pages/Quote';
import Contact from './pages/Contact';
import Faq from './pages/Faq';
import LegalPage from './pages/LegalPage';
import NotFound from './pages/NotFound';
import ThankYou from './pages/ThankYou';

function PublicSite() {
  return (
    <Layout>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/sign-types" element={<SignTypes />} />
        <Route path="/sign-types/:id" element={<SignTypeDetail />} />
        <Route path="/about" element={<About />} />
        <Route path="/quote" element={<Quote />} />
        <Route path="/quote/thank-you" element={<ThankYou form="quote" />} />
        <Route path="/contact" element={<Contact />} />
        <Route path="/contact/thank-you" element={<ThankYou form="contact" />} />
        <Route path="/faq" element={<Faq />} />
        <Route path="/privacy" element={<LegalPage page="privacy" />} />
        <Route path="/terms" element={<LegalPage page="terms" />} />
        <Route path="/refund" element={<LegalPage page="refund" />} />
        <Route path="/shipping" element={<LegalPage page="shipping" />} />
        <Route path="*" element={<NotFound />} />
      </Routes>
    </Layout>
  );
}

// Shared by the browser app and the server renderer so both produce the same
// markup. The admin panel is only passed in by the browser app.
export default function SiteRoutes({ admin }: { admin: React.ReactNode }) {
  return (
    <Routes>
      {admin && <Route path="/admin/*" element={admin} />}
      <Route path="*" element={<PublicSite />} />
    </Routes>
  );
}
