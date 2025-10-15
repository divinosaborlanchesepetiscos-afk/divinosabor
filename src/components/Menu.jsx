import { useState, useMemo } from 'react'
import { useApp } from '../hooks/useApp'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Badge } from '@/components/ui/badge'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { Plus, Minus, ShoppingCart, Search, Filter, History } from 'lucide-react'
import { motion, AnimatePresence } from 'framer-motion'
import Checkout from './Checkout'

const Menu = () => {
  const { state, getProductsByCategory, getTotalCartValue, getTotalCartItems, dispatch } = useApp()
  const [searchTerm, setSearchTerm] = useState('')
  const [selectedCategory, setSelectedCategory] = useState('espetinhos')
  const [priceRange, setPriceRange] = useState([0, 100])
  const [showFilters, setShowFilters] = useState(false)
  const [showCart, setShowCart] = useState(false)
  const [showCheckout, setShowCheckout] = useState(false)

  // Categorias disponíveis
  const categories = [
    { id: 'espetinhos', name: 'Espetinhos', emoji: '🍢', count: getProductsByCategory('espetinhos').length },
    { id: 'porcoes', name: 'Porções', emoji: '🍟', count: getProductsByCategory('porcoes').length },
    { id: 'pasteis', name: 'Pastéis', emoji: '🥟', count: getProductsByCategory('pasteis').length },
    { id: 'cervejas', name: 'Cervejas', emoji: '🍺', count: getProductsByCategory('cervejas').length },
    { id: 'bebidas', name: 'Bebidas', emoji: '🥤', count: getProductsByCategory('bebidas').length },
    { id: 'x-gaucho', name: 'X Gaúcho', emoji: '🍔', count: getProductsByCategory('x-gaucho').length }
  ]

  // Produtos filtrados
  const filteredProducts = useMemo(() => {
    let products = getProductsByCategory(selectedCategory)
    
    if (searchTerm) {
      products = products.filter(product =>
        product.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        product.description?.toLowerCase().includes(searchTerm.toLowerCase())
      )
    }
    
    products = products.filter(product =>
      product.price >= priceRange[0] && product.price <= priceRange[1]
    )
    
    return products
  }, [selectedCategory, searchTerm, priceRange, getProductsByCategory])

  const addToCart = (product) => {
    dispatch({ type: 'ADD_TO_CART', payload: product })
  }

  const removeFromCart = (productId) => {
    dispatch({ type: 'REMOVE_FROM_CART', payload: productId })
  }

  const updateCartQuantity = (productId, quantity) => {
    dispatch({ type: 'UPDATE_CART_QUANTITY', payload: { id: productId, quantity } })
  }

  const getCartItemQuantity = (productId) => {
    const item = state.cart.find(item => item.id === productId)
    return item ? item.quantity : 0
  }

  if (state.loading) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="flex items-center justify-center min-h-[400px]">
          <div className="text-center space-y-4">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto"></div>
            <p className="text-muted-foreground">Carregando cardápio...</p>
          </div>
        </div>
      </div>
    )
  }

  if (state.error) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="flex items-center justify-center min-h-[400px]">
          <div className="text-center space-y-4">
            <p className="text-destructive">Erro ao carregar cardápio: {state.error}</p>
            <Button onClick={() => window.location.reload()}>Tentar novamente</Button>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="container mx-auto px-4 py-8">
      {/* Header */}
      <div className="text-center space-y-4 mb-8">
        <h1 className="text-4xl md:text-5xl font-bold">
          Nosso <span className="text-primary">Cardápio</span>
        </h1>
        <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
          Descubra sabores únicos preparados com ingredientes frescos e muito amor
        </p>
      </div>

      {/* Controles */}
      <div className="flex flex-col sm:flex-row gap-4 mb-8">
        <Button variant="outline" className="flex items-center gap-2">
          <History className="h-4 w-4" />
          Histórico de Pedidos
        </Button>
        
        <div className="flex-1 relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Buscar produtos..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-10"
          />
        </div>
        
        <Button
          variant="outline"
          onClick={() => setShowFilters(!showFilters)}
          className="flex items-center gap-2"
        >
          <Filter className="h-4 w-4" />
          Filtros
        </Button>
      </div>

      {/* Filtros */}
      <AnimatePresence>
        {showFilters && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            className="mb-8 p-4 border rounded-lg bg-muted/20"
          >
            <div className="space-y-4">
              <div>
                <label className="text-sm font-medium">Faixa de Preço</label>
                <div className="flex items-center gap-4 mt-2">
                  <Input
                    type="number"
                    placeholder="Min"
                    value={priceRange[0]}
                    onChange={(e) => setPriceRange([Number(e.target.value), priceRange[1]])}
                    className="w-24"
                  />
                  <span>até</span>
                  <Input
                    type="number"
                    placeholder="Max"
                    value={priceRange[1]}
                    onChange={(e) => setPriceRange([priceRange[0], Number(e.target.value)])}
                    className="w-24"
                  />
                </div>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      <div className="grid lg:grid-cols-4 gap-8">
        {/* Categorias */}
        <div className="lg:col-span-3">
          <Tabs value={selectedCategory} onValueChange={setSelectedCategory}>
            <TabsList className="grid w-full grid-cols-3 lg:grid-cols-6 mb-8">
              {categories.map((category) => (
                <TabsTrigger key={category.id} value={category.id} className="flex items-center gap-1 text-xs">
                  <span>{category.emoji}</span>
                  <span className="hidden sm:inline">{category.name}</span>
                  <Badge variant="secondary" className="ml-1 text-xs">
                    {category.count}
                  </Badge>
                </TabsTrigger>
              ))}
            </TabsList>

            {categories.map((category) => (
              <TabsContent key={category.id} value={category.id}>
                <div className="grid sm:grid-cols-2 xl:grid-cols-3 gap-6">
                  <AnimatePresence>
                    {filteredProducts.map((product) => (
                      <motion.div
                        key={product.id}
                        initial={{ opacity: 0, scale: 0.9 }}
                        animate={{ opacity: 1, scale: 1 }}
                        exit={{ opacity: 0, scale: 0.9 }}
                        transition={{ duration: 0.2 }}
                      >
                        <Card className="h-full hover:shadow-lg transition-shadow">
                          <CardHeader className="pb-4">
                            <div className="aspect-video bg-gradient-to-br from-primary/20 to-secondary/20 rounded-lg flex items-center justify-center mb-4">
                              {product.image && product.image !== '/api/placeholder/300/200' ? (
                                <img src={product.image} alt={product.name} className="w-full h-full object-cover rounded-lg" />
                              ) : (
                                <span className="text-4xl">🍽️</span>
                              )}
                            </div>
                            <CardTitle className="text-lg">{product.name}</CardTitle>
                            {product.description && (
                              <p className="text-sm text-muted-foreground">{product.description}</p>
                            )}
                          </CardHeader>
                          <CardContent className="pt-0">
                            <div className="flex items-center justify-between">
                              <span className="text-2xl font-bold text-primary">
                                R$ {product.price.toFixed(2)}
                              </span>
                              
                              {getCartItemQuantity(product.id) > 0 ? (
                                <div className="flex items-center gap-2">
                                  <Button
                                    size="sm"
                                    variant="outline"
                                    onClick={() => updateCartQuantity(product.id, getCartItemQuantity(product.id) - 1)}
                                  >
                                    <Minus className="h-4 w-4" />
                                  </Button>
                                  <span className="w-8 text-center font-semibold">
                                    {getCartItemQuantity(product.id)}
                                  </span>
                                  <Button
                                    size="sm"
                                    onClick={() => addToCart(product)}
                                  >
                                    <Plus className="h-4 w-4" />
                                  </Button>
                                </div>
                              ) : (
                                <Button onClick={() => addToCart(product)}>
                                  Adicionar
                                </Button>
                              )}
                            </div>
                          </CardContent>
                        </Card>
                      </motion.div>
                    ))}
                  </AnimatePresence>
                </div>
                
                {filteredProducts.length === 0 && (
                  <div className="text-center py-12">
                    <p className="text-muted-foreground">Nenhum produto encontrado nesta categoria.</p>
                  </div>
                )}
              </TabsContent>
            ))}
          </Tabs>
        </div>

        {/* Carrinho */}
        <div className="lg:col-span-1">
          <Card className="sticky top-24">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <ShoppingCart className="h-5 w-5" />
                Seu Pedido
              </CardTitle>
            </CardHeader>
            <CardContent>
              {state.cart.length === 0 ? (
                <p className="text-muted-foreground text-center py-8">
                  Seu carrinho está vazio
                </p>
              ) : (
                <div className="space-y-4">
                  {state.cart.map((item) => (
                    <div key={item.id} className="flex items-center justify-between">
                      <div className="flex-1">
                        <p className="font-medium text-sm">{item.name}</p>
                        <p className="text-xs text-muted-foreground">
                          R$ {item.price.toFixed(2)} x {item.quantity}
                        </p>
                      </div>
                      <div className="flex items-center gap-1">
                        <Button
                          size="sm"
                          variant="ghost"
                          onClick={() => updateCartQuantity(item.id, item.quantity - 1)}
                        >
                          <Minus className="h-3 w-3" />
                        </Button>
                        <span className="w-6 text-center text-sm">{item.quantity}</span>
                        <Button
                          size="sm"
                          variant="ghost"
                          onClick={() => addToCart(item)}
                        >
                          <Plus className="h-3 w-3" />
                        </Button>
                      </div>
                    </div>
                  ))}
                  
                  <div className="border-t pt-4 space-y-2">
                    <div className="flex justify-between font-semibold">
                      <span>Total:</span>
                      <span className="text-primary">R$ {getTotalCartValue().toFixed(2)}</span>
                    </div>
                    <Button className="w-full" size="lg" onClick={() => setShowCheckout(true)}>
                      Finalizar Pedido
                    </Button>
                  </div>
                </div>
              )}
            </CardContent>
          </Card>
        </div>
      </div>
      
      {/* Modal de Checkout */}
      <Checkout 
        isOpen={showCheckout} 
        onClose={() => setShowCheckout(false)} 
      />
    </div>
  )
}

export default Menu
