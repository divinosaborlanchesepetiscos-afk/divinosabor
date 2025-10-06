import { useState } from 'react'
import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Card, CardContent } from '@/components/ui/card'
import { Search, Filter, X, DollarSign } from 'lucide-react'
import { motion } from 'framer-motion'

const MenuFilters = ({ onFilterChange, activeFilters }) => {
  const [searchTerm, setSearchTerm] = useState('')
  const [showFilters, setShowFilters] = useState(false)

  const priceRanges = [
    { id: 'low', label: 'Até R$ 10', min: 0, max: 10 },
    { id: 'medium', label: 'R$ 10 - R$ 20', min: 10, max: 20 },
    { id: 'high', label: 'Acima de R$ 20', min: 20, max: Infinity }
  ]

  const handleSearchChange = (value) => {
    setSearchTerm(value)
    onFilterChange({ ...activeFilters, search: value })
  }

  const handlePriceFilter = (range) => {
    const isActive = activeFilters.priceRange?.id === range.id
    onFilterChange({
      ...activeFilters,
      priceRange: isActive ? null : range
    })
  }

  const clearFilters = () => {
    setSearchTerm('')
    onFilterChange({ search: '', priceRange: null })
  }

  const hasActiveFilters = searchTerm || activeFilters.priceRange

  return (
    <div className="space-y-4">
      {/* Barra de Busca */}
      <div className="relative">
        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
        <Input
          placeholder="Buscar produtos..."
          value={searchTerm}
          onChange={(e) => handleSearchChange(e.target.value)}
          className="pl-10 pr-12"
        />
        {searchTerm && (
          <Button
            variant="ghost"
            size="icon"
            className="absolute right-1 top-1/2 transform -translate-y-1/2 h-8 w-8"
            onClick={() => handleSearchChange('')}
          >
            <X className="h-4 w-4" />
          </Button>
        )}
      </div>

      {/* Botão de Filtros */}
      <div className="flex items-center justify-between">
        <Button
          variant="outline"
          onClick={() => setShowFilters(!showFilters)}
          className="flex items-center gap-2"
        >
          <Filter className="h-4 w-4" />
          Filtros
          {hasActiveFilters && (
            <Badge variant="secondary" className="ml-1">
              {(searchTerm ? 1 : 0) + (activeFilters.priceRange ? 1 : 0)}
            </Badge>
          )}
        </Button>

        {hasActiveFilters && (
          <Button
            variant="ghost"
            size="sm"
            onClick={clearFilters}
            className="text-muted-foreground"
          >
            <X className="h-4 w-4 mr-1" />
            Limpar
          </Button>
        )}
      </div>

      {/* Painel de Filtros */}
      {showFilters && (
        <motion.div
          initial={{ opacity: 0, height: 0 }}
          animate={{ opacity: 1, height: 'auto' }}
          exit={{ opacity: 0, height: 0 }}
          transition={{ duration: 0.2 }}
        >
          <Card>
            <CardContent className="p-4 space-y-4">
              {/* Filtro de Preço */}
              <div>
                <h3 className="font-medium mb-3 flex items-center gap-2">
                  <DollarSign className="h-4 w-4" />
                  Faixa de Preço
                </h3>
                <div className="flex flex-wrap gap-2">
                  {priceRanges.map((range) => (
                    <Button
                      key={range.id}
                      variant={activeFilters.priceRange?.id === range.id ? "default" : "outline"}
                      size="sm"
                      onClick={() => handlePriceFilter(range)}
                      className={activeFilters.priceRange?.id === range.id ? "divino-gradient text-white" : ""}
                    >
                      {range.label}
                    </Button>
                  ))}
                </div>
              </div>
            </CardContent>
          </Card>
        </motion.div>
      )}

      {/* Filtros Ativos */}
      {hasActiveFilters && (
        <div className="flex flex-wrap gap-2">
          {searchTerm && (
            <Badge variant="secondary" className="flex items-center gap-1">
              Busca: "{searchTerm}"
              <Button
                variant="ghost"
                size="icon"
                className="h-4 w-4 p-0 hover:bg-transparent"
                onClick={() => handleSearchChange('')}
              >
                <X className="h-3 w-3" />
              </Button>
            </Badge>
          )}
          {activeFilters.priceRange && (
            <Badge variant="secondary" className="flex items-center gap-1">
              {activeFilters.priceRange.label}
              <Button
                variant="ghost"
                size="icon"
                className="h-4 w-4 p-0 hover:bg-transparent"
                onClick={() => onFilterChange({ ...activeFilters, priceRange: null })}
              >
                <X className="h-3 w-3" />
              </Button>
            </Badge>
          )}
        </div>
      )}
    </div>
  )
}

export default MenuFilters
