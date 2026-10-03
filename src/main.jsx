import React from 'react'
import ReactDOM from 'react-dom/client'
import { BrowserRouter } from 'react-router-dom'

import '@fontsource-variable/syne'
import '@fontsource-variable/space-grotesk'
import '@fontsource-variable/jetbrains-mono'
import './styles/index.css'

import App from './App'
import { ExperienceProvider } from './context/ExperienceContext'

if ('scrollRestoration' in history) history.scrollRestoration = 'manual'

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <BrowserRouter>
      <ExperienceProvider>
        <App />
      </ExperienceProvider>
    </BrowserRouter>
  </React.StrictMode>,
)
