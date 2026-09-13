import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.jsx'

// GitHub Pages serves 404.html for any path it doesn't have a file for, including client-side routes
// like /views. That page stashes the original path and sends the browser to the root; restoring it
// here means a direct visit or a refresh lands where it should, with the right URL in the bar.
const redirectPath = sessionStorage.getItem('redirectPath')
if (redirectPath) {
  sessionStorage.removeItem('redirectPath')
  if (redirectPath !== window.location.pathname) {
    window.history.replaceState(null, '', redirectPath)
  }
}

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <App />
  </StrictMode>,
)
