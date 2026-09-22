import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App'
import { initPhoneClickTracking } from './lib/googleAds'

initPhoneClickTracking()

createRoot(document.getElementById('root')!).render(<App />)
