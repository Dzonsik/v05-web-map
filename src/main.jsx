// Vstupní bod aplikace: mount Reactu do #root a zapnutí StrictMode.
import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
// Globální styly (Tailwind + vlastní) aplikované na celý dokument
import './index.css'
// Kořenová komponenta aplikace
import App from './App.jsx'

// Najdeme DOM uzel s id="root" a vyrenderujeme do něj aplikaci.
// StrictMode pomáhá odhalit potenciální problémy v dev režimu
// (např. duplicitní volání effectů apod.).
createRoot(document.getElementById('root')).render(
  <StrictMode>
    <App />
  </StrictMode>,
)
