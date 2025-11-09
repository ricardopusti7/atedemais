import { BrowserRouter as Router, Routes, Route, useLocation } from 'react-router-dom'
import MagicBento from './components/MagicBento'
import LiquidChrome from './components/LiquidChrome'
import FuzzyText from './components/FuzzyText'
import VideoPlayer from './components/VideoPlayer/VideoPlayer'

function MainLayout() {
  return (
    <>
      <div className="fuzzy-top">
        <FuzzyText baseIntensity={0.2} hoverIntensity={0.5} enableHover={true}>
          UmNãoSer
        </FuzzyText>
      </div>
      <MagicBento />
    </>
  )
}

function App() {
  return (
    <Router>
      <div style={{ 
        width: '100%', 
        minHeight: '100vh', 
        backgroundColor: 'black',
        position: 'relative',
        overflow: 'auto',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center'
      }}>
        {/* LiquidChrome is fixed background (z-index 0) */}
        <LiquidChrome
          baseColor={[0.3, 0.1, 0.5]}
          speed={0.1}
          amplitude={0.4}
          interactive={true}
        />

        <main style={{
          position: 'relative',
          zIndex: 2,
          width: '100%',
          maxWidth: '1400px',
          padding: '48px 16px 96px 16px',
          boxSizing: 'border-box'
        }}>
          <Routes>
            <Route path="/" element={<MainLayout />} />
            <Route path="/video/:id" element={<VideoPlayer />} />
          </Routes>
        </main>
      </div>
    </Router>
  )
}

export default App
