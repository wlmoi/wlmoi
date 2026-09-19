import React, { StrictMode } from 'react'
import ReactDOM from 'react-dom/client'
import { BrowserRouter } from 'react-router-dom'
import App from './App'
import './styles/index.css'

function LoadingScreen() {
  return (
    <div className="boot-screen" role="status" aria-live="polite">
      <div className="boot-loader" aria-hidden="true" />
      <p className="boot-label">Loading William Anthony<span> / systems online</span></p>
    </div>
  )
}

function Boot() {
  const [ready, setReady] = React.useState(false)

  React.useEffect(() => {
    const timer = window.setTimeout(() => setReady(true), 2900)
    return () => window.clearTimeout(timer)
  }, [])

  return ready ? <App /> : <LoadingScreen />
}

ReactDOM.createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <BrowserRouter>
      <Boot />
    </BrowserRouter>
  </StrictMode>,
)
