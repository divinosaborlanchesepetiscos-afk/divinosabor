import { Link, useLocation } from 'react-router-dom'
<<<<<<< HEAD
import { Menu as MenuIcon, X } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { useState } from 'react'
import logoImage from '../assets/logo-divino-sabor.jpeg'
import ThemeToggle from './ThemeToggle'

const Header = ({ darkMode, toggleDarkMode }) => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)
  const location = useLocation()

  const navigation = [
    { name: 'Início', href: '/' },
    { name: 'Cardápio', href: '/menu' },
    { name: 'Status do Pedido', href: '/status' },
    { name: 'Admin', href: '/admin' }
  ]
=======
import { Moon, Sun, Volume2, VolumeX, Bell, BellOff } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { useState } from 'react'
import logoImage from '../assets/WhatsAppImage2025-10-05at19.58.33.jpeg'

const Header = ({ darkMode, toggleDarkMode }) => {
  const location = useLocation()
  const [soundEnabled, setSoundEnabled] = useState(true)
  const [notificationsEnabled, setNotificationsEnabled] = useState(true)
>>>>>>> branch-11

  const isActive = (path) => location.pathname === path

  return (
<<<<<<< HEAD
    <header className="sticky top-0 z-50 w-full border-b border-border/40 bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container mx-auto px-4">
        <div className="flex h-16 items-center justify-between">
          {/* Logo */}
          <Link to="/" className="flex items-center space-x-3 hover:opacity-80 transition-opacity">
            <img 
              src={logoImage} 
              alt="Divino Sabor" 
              className="h-10 w-10 rounded-full object-cover ring-2 ring-primary/20"
            />
            <div className="hidden sm:block">
              <h1 className="text-xl font-bold divino-text-gradient">Divino Sabor</h1>
              <p className="text-xs text-muted-foreground">Lanchonete</p>
            </div>
          </Link>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex items-center space-x-1">
            {navigation.map((item) => (
              <Link
                key={item.name}
                to={item.href}
                className={`px-4 py-2 rounded-md text-sm font-medium transition-colors hover:bg-accent hover:text-accent-foreground ${
                  isActive(item.href)
                    ? 'bg-primary text-primary-foreground'
                    : 'text-foreground'
                }`}
              >
                {item.name}
              </Link>
            ))}
          </nav>

          {/* Right side controls */}
          <div className="flex items-center space-x-2">
            {/* Dark mode toggle */}
            <ThemeToggle darkMode={darkMode} toggleDarkMode={toggleDarkMode} />

            {/* Mobile menu button */}
            <Button
              variant="ghost"
              size="icon"
              className="md:hidden h-9 w-9"
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            >
              {mobileMenuOpen ? (
                <X className="h-4 w-4" />
              ) : (
                <MenuIcon className="h-4 w-4" />
              )}
              <span className="sr-only">Toggle menu</span>
            </Button>
          </div>
        </div>

        {/* Mobile Navigation */}
        {mobileMenuOpen && (
          <div className="md:hidden border-t border-border/40 py-4">
            <nav className="flex flex-col space-y-2">
              {navigation.map((item) => (
                <Link
                  key={item.name}
                  to={item.href}
                  onClick={() => setMobileMenuOpen(false)}
                  className={`px-4 py-3 rounded-md text-sm font-medium transition-colors hover:bg-accent hover:text-accent-foreground ${
                    isActive(item.href)
                      ? 'bg-primary text-primary-foreground'
                      : 'text-foreground'
                  }`}
                >
                  {item.name}
                </Link>
              ))}
            </nav>
          </div>
        )}
=======
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
>>>>>>> branch-11
      </div>
    </header>
  )
}

export default Header
