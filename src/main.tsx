import React, { StrictMode } from 'react'
import ReactDOM from 'react-dom/client'
import { BrowserRouter } from 'react-router-dom'
import App from './App'
import './styles/index.css'

function LoadingScreen() {
  const loaderText = 'Loading William Anthony'
  const [spinnerIndex, setSpinnerIndex] = React.useState(0)
  const spinnerFrames = ['/','—','\\','|']

  React.useEffect(() => {
    const timer = window.setInterval(() => setSpinnerIndex((index) => (index + 1) % spinnerFrames.length), 180)
    return () => window.clearInterval(timer)
  }, [])

  return (
    <div className="boot-screen-content" role="status" aria-live="polite">
      <div className="boot-loader" aria-hidden="true" />
      <p className="boot-label" aria-label="Loading William Anthony / systems online">
        <span className="fx-pop" aria-hidden="true">{[...loaderText].map((letter, index) => <b key={`${letter}-${index}`} style={{ '--i': index } as React.CSSProperties}>{letter === ' ' ? '\u00a0' : letter}</b>)}</span>
        <span className="boot-label-status"><span className="boot-spinner" aria-hidden="true">{spinnerFrames[spinnerIndex]}</span> systems online</span>
      </p>
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
