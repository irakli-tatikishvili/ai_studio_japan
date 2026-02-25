import React from 'react'
import ReactDOM from 'react-dom/client'
import { HashRouter } from 'react-router-dom'
import App from './App'
import { UsageProvider } from './context/UsageContext'
import { LanguageProvider } from './context/LanguageContext'
import './index.css'

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <HashRouter>
      <LanguageProvider>
        <UsageProvider>
          <App />
        </UsageProvider>
      </LanguageProvider>
    </HashRouter>
  </React.StrictMode>,
)
