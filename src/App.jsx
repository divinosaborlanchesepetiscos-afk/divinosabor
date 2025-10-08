import { BrowserRouter as Router, Routes, Route } from 'react-router-dom'
import { useState } from 'react'
import './App.css'

// Contexto
import { AppProvider } from './hooks/useApp'

// Componentes principais
import Header from './components/Header'
import Home from './components/Home'
import Menu from './components/Menu'
import Admin from './components/Admin'
import OrderStatus from './components/OrderStatus'

function App() {
  const [darkMode, setDarkMode] = useState(false)

  const toggleDarkMode = () => {
    setDarkMode(!darkMode)
    document.documentElement.classList.toggle('dark')
  }

  return (
    <AppProvider>
      <div className={`min-h-screen ${darkMode ? 'dark' : ''}`}>
        <Router>
          <Header darkMode={darkMode} toggleDarkMode={toggleDarkMode} />
          <main className="min-h-screen bg-background">
            <Routes>
              <Route path="/" element={<Home />} />
              <Route path="/menu" element={<Menu />} />
              <Route path="/admin" element={<Admin />} />
              <Route path="/status" element={<OrderStatus />} />
            </Routes>
          </main>
        </Router>
      </div>
    </AppProvider>
  )
}

export default App
