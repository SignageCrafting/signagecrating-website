import { createRoot, hydrateRoot } from 'react-dom/client'
import './index.css'
import App from './App'
import { initPhoneClickTracking } from './lib/googleAds'

initPhoneClickTracking()

const root = document.getElementById('root')!

// Pages rendered by server.js arrive with their HTML already in #root.
if (root.firstElementChild) {
  hydrateRoot(root, <App />)
} else {
  createRoot(root).render(<App />)
}
