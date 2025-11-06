import { Link, useLocation } from 'react-router-dom'
import { Moon, Sun, Volume2, VolumeX, Bell, BellOff } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { useState } from 'react'
import logoImage from '../assets/WhatsAppImage2025-10-05at19.58.33.jpeg'

const Header = ({ darkMode, toggleDarkMode }) => {
  const location = useLocation()
  const [soundEnabled, setSoundEnabled] = useState(true)
  const [notificationsEnabled, setNotificationsEnabled] = useState(true)

  const isActive = (path) => location.pathname === path

  return (
    <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container flex h-16 items-center justify-between px-4">
        {/* Logo e Nome */}
        <Link to="/" className="flex items-center space-x-3">
          <img 
            src={logoImage} 
            alt="Divino Sabor Logo" 
            className="h-10 w-10 rounded-full object-cover"
          />
          <div className="flex flex-col">
            <span className="text-xl font-bold text-primary">Divino Sabor</span>
            <span className="text-sm text-muted-foreground">Lanchonete</span>
          </div>
        </Link>

        {/* Navegação Central */}
        <nav className="hidden md:flex items-center space-x-6">
          <Link
            to="/"
            className={`text-sm font-medium transition-colors hover:text-primary ${
              isActive('/') ? 'text-primary' : 'text-muted-foreground'
            }`}
          >
            Início
          </Link>
          <Link
            to="/menu"
            className={`text-sm font-medium transition-colors hover:text-primary ${
              isActive('/menu') ? 'text-primary' : 'text-muted-foreground'
            }`}
          >
            Cardápio
          </Link>
          <Link
            to="/status"
            className={`text-sm font-medium transition-colors hover:text-primary ${
              isActive('/status') ? 'text-primary' : 'text-muted-foreground'
            }`}
          >
            Status do Pedido
          </Link>
          <Link
            to="/admin"
            className={`text-sm font-medium transition-colors hover:text-primary ${
              isActive('/admin') ? 'text-primary' : 'text-muted-foreground'
            }`}
          >
            Admin
          </Link>
        </nav>

        {/* Controles */}
        <div className="flex items-center space-x-2">
          <Button
            variant="ghost"
            size="icon"
            onClick={toggleDarkMode}
            title={darkMode ? "Ativar tema claro" : "Ativar tema escuro"}
          >
            {darkMode ? <Sun className="h-4 w-4" /> : <Moon className="h-4 w-4" />}
          </Button>
          
          <Button
            variant="ghost"
            size="icon"
            onClick={() => setSoundEnabled(!soundEnabled)}
            title={soundEnabled ? "Desativar som" : "Ativar som"}
          >
            {soundEnabled ? <Volume2 className="h-4 w-4" /> : <VolumeX className="h-4 w-4" />}
          </Button>
          
          <Button
            variant="ghost"
            size="icon"
            onClick={() => setNotificationsEnabled(!notificationsEnabled)}
            title={notificationsEnabled ? "Desativar notificações" : "Ativar notificações"}
          >
            {notificationsEnabled ? <Bell className="h-4 w-4" /> : <BellOff className="h-4 w-4" />}
          </Button>
        </div>
      </div>

      {/* Navegação Mobile */}
      <div className="md:hidden border-t">
        <nav className="flex items-center justify-around py-2">
          <Link
            to="/"
            className={`flex flex-col items-center space-y-1 px-3 py-2 text-xs ${
              isActive('/') ? 'text-primary' : 'text-muted-foreground'
            }`}
          >
            <span>Início</span>
          </Link>
          <Link
            to="/menu"
            className={`flex flex-col items-center space-y-1 px-3 py-2 text-xs ${
              isActive('/menu') ? 'text-primary' : 'text-muted-foreground'
            }`}
          >
            <span>Cardápio</span>
          </Link>
          <Link
            to="/status"
            className={`flex flex-col items-center space-y-1 px-3 py-2 text-xs ${
              isActive('/status') ? 'text-primary' : 'text-muted-foreground'
            }`}
          >
            <span>Status</span>
          </Link>
          <Link
            to="/admin"
            className={`flex flex-col items-center space-y-1 px-3 py-2 text-xs ${
              isActive('/admin') ? 'text-primary' : 'text-muted-foreground'
            }`}
          >
            <span>Admin</span>
          </Link>
        </nav>
      </div>
    </header>
  )
}

export default Header
