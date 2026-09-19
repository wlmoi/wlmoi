import React, { StrictMode } from 'react'
import ReactDOM from 'react-dom/client'
import { BrowserRouter } from 'react-router-dom'
import App from './App'
import './styles/index.css'

function LoadingScreen() {
  return (
    <div className="boot-screen-content" role="status" aria-live="polite">
      <div className="boot-loader" aria-hidden="true" />
      <p className="boot-label">Loading William Anthony<span> / systems online</span></p>
    </div>
  )
}

function Boot() {
  const [ready, setReady] = React.useState(false)
  const [exiting, setExiting] = React.useState(false)

  React.useEffect(() => {
    const exitTimer = window.setTimeout(() => setExiting(true), 2500)
    const readyTimer = window.setTimeout(() => setReady(true), 3050)
    return () => {
      window.clearTimeout(exitTimer)
      window.clearTimeout(readyTimer)
    }
  }, [])

  return ready ? <App /> : <div className={exiting ? 'boot-screen boot-screen--exiting' : 'boot-screen'}><LoadingScreen /></div>
}

ReactDOM.createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <BrowserRouter>
      <Boot />
    </BrowserRouter>
  </StrictMode>,
)
