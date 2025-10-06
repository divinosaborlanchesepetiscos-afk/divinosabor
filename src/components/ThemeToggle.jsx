import { Button } from '@/components/ui/button'
import { Moon, Sun } from 'lucide-react'

const ThemeToggle = ({ darkMode, toggleDarkMode }) => {
  return (
    <Button
      variant="outline"
      size="icon"
      onClick={toggleDarkMode}
      className="relative overflow-hidden"
      title={darkMode ? 'Ativar tema claro' : 'Ativar tema escuro'}
    >
      <Sun className={`h-4 w-4 transition-all duration-300 ${darkMode ? 'rotate-90 scale-0' : 'rotate-0 scale-100'}`} />
      <Moon className={`absolute h-4 w-4 transition-all duration-300 ${darkMode ? 'rotate-0 scale-100' : '-rotate-90 scale-0'}`} />
    </Button>
  )
}

export default ThemeToggle
