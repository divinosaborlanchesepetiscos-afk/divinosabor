<<<<<<< HEAD
import { useState } from 'react'
import { useApp } from '../contexts/AppContext'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { Plus, Minus, ShoppingCart, Trash2 } from 'lucide-react'
import { motion } from 'framer-motion'
import OrderModal from './OrderModal'
import MenuFilters from './MenuFilters'
import OrderHistory from './OrderHistory'

const Menu = () => {
  const { state, dispatch, getProductsByCategory, getTotalCartItems, getTotalCartValue, createOrder } = useApp()
  const [activeCategory, setActiveCategory] = useState('cheese')
  const [isOrderModalOpen, setIsOrderModalOpen] = useState(false)
  const [filters, setFilters] = useState({ search: '', priceRange: null })

  const categories = [
    { id: 'cheese', name: 'Cheese Burgers', icon: '🍔' },
    { id: 'petiscos', name: 'Petiscos', icon: '🍟' },
    { id: 'espetinhos', name: 'Espetinhos', icon: '🍢' },
    { id: 'bebidas', name: 'Bebidas', icon: '🥤' }
  ]

  const addToCart = (product) => {
    dispatch({ type: 'ADD_TO_CART', payload: product })
  }

  const updateCartQuantity = (productId, quantity) => {
=======
import React, { useState, useEffect } from 'react'
import { useApp } from '../hooks/useApp'
import { FaShoppingCart } from 'react-icons/fa'
import Checkout from './Checkout'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Badge } from '@/components/ui/badge'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { Plus, Minus, ShoppingCart, Search, Filter, History, AlertCircle } from 'lucide-react'
import { motion, AnimatePresence } from 'framer-motion'

const Menu = () => {
  const { state, dispatch, getProductsByCategory, getTotalCartValue, getTotalCartItems, createOrder } = useApp()
  const [selectedCategory, setSelectedCategory] = useState('espetinhos')
  const [searchTerm, setSearchTerm] = useState('')
  const [isCheckoutOpen, setIsCheckoutOpen] = useState(false)
  const [showFilters, setShowFilters] = useState(false)
  const [priceRange, setPriceRange] = useState([0, 1000])

  const categories = [
    { id: 'espetinhos', name: 'Espetinhos', emoji: '🍢', key: 'espetinhos' },
    { id: 'porcoes', name: 'Porções', emoji: '🍟', key: 'porcoes' },
    { id: 'pasteis', name: 'Pastéis', emoji: '🥟', key: 'pasteis' },
    { id: 'cervejas', name: 'Cervejas', emoji: '🍺', key: 'cervejas' },
    { id: 'bebidas', name: 'Bebidas', emoji: '🥤', key: 'bebidas' },
    { id: 'x-gaucho', name: 'X Gaúcho', emoji: '🍔', key: 'x-gaucho' },
  ]

  const filteredProducts = React.useMemo(() => {
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

  const handleAddToCart = (product) => {
    dispatch({ type: 'ADD_TO_CART', payload: product })
  }

  const handleRemoveFromCart = (productId) => {
    dispatch({ type: 'REMOVE_FROM_CART', payload: productId })
  }

  const handleUpdateCartQuantity = (productId, quantity) => {
>>>>>>> branch-11
    dispatch({ type: 'UPDATE_CART_QUANTITY', payload: { id: productId, quantity } })
  }

  const getCartItemQuantity = (productId) => {
    const item = state.cart.find(item => item.id === productId)
    return item ? item.quantity : 0
  }

<<<<<<< HEAD
  const clearCart = () => {
    if (confirm('Tem certeza que deseja limpar o carrinho?')) {
      dispatch({ type: 'CLEAR_CART' })
    }
  }

  const getFilteredProducts = (category) => {
    let products = getProductsByCategory(category)

    // Filtro de busca
    if (filters.search) {
      products = products.filter(product =>
        product.name.toLowerCase().includes(filters.search.toLowerCase()) ||
        product.description.toLowerCase().includes(filters.search.toLowerCase())
      )
    }

    // Filtro de preço
    if (filters.priceRange) {
      products = products.filter(product =>
        product.price >= filters.priceRange.min &&
        product.price <= filters.priceRange.max
      )
    }

    return products
  }

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1
      }
    }
  }

  const itemVariants = {
    hidden: { y: 20, opacity: 0 },
    visible: {
      y: 0,
      opacity: 1,
      transition: {
        duration: 0.4
      }
    }
  }

  return (
    <div className="min-h-screen bg-background">
      {/* Header do Menu */}
      <section className="bg-gradient-to-r from-secondary/20 to-accent/20 py-12">
        <div className="container mx-auto px-4">
          <div className="text-center">
            <h1 className="text-4xl md:text-5xl font-bold mb-4">
              Nosso <span className="divino-text-gradient">Cardápio</span>
            </h1>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto mb-6">
              Descubra sabores únicos preparados com ingredientes frescos e muito amor
            </p>
            <OrderHistory />
          </div>
        </div>
      </section>

      <div className="container mx-auto px-4 py-8">
        <div className="grid lg:grid-cols-4 gap-8">
          {/* Menu Principal */}
          <div className="lg:col-span-3">
            {/* Filtros */}
            <div className="mb-6">
              <MenuFilters 
                onFilterChange={setFilters}
                activeFilters={filters}
              />
            </div>

            <Tabs value={activeCategory} onValueChange={setActiveCategory} className="w-full">
              <TabsList className="grid w-full grid-cols-4 mb-8">
                {categories.map((category) => (
                  <TabsTrigger 
                    key={category.id} 
                    value={category.id}
                    className="flex items-center gap-2 text-sm"
                  >
                    <span>{category.icon}</span>
                    <span className="hidden sm:inline">{category.name}</span>
                  </TabsTrigger>
                ))}
              </TabsList>

              {categories.map((category) => {
                const filteredProducts = getFilteredProducts(category.id)
                
                return (
                  <TabsContent key={category.id} value={category.id}>
                    {filteredProducts.length === 0 ? (
                      <div className="text-center py-12">
                        <p className="text-muted-foreground text-lg">
                          Nenhum produto encontrado
                        </p>
                        <p className="text-sm text-muted-foreground mt-2">
                          Tente ajustar os filtros ou buscar por outros termos
                        </p>
                      </div>
                    ) : (
                      <motion.div
                        variants={containerVariants}
                        initial="hidden"
                        animate="visible"
                        className="grid md:grid-cols-2 xl:grid-cols-3 gap-6"
                      >
                        {filteredProducts.map((product) => {
                          const cartQuantity = getCartItemQuantity(product.id)
                          
                          return (
                            <motion.div key={product.id} variants={itemVariants}>
                              <Card className="h-full hover-lift border-border/50 hover:border-primary/50 transition-colors">
                                <CardHeader className="p-0">
                                  <div className="aspect-video bg-muted rounded-t-lg flex items-center justify-center">
                                    <span className="text-4xl">{category.icon}</span>
                                  </div>
                                </CardHeader>
                                <CardContent className="p-4">
                                  <div className="flex justify-between items-start mb-2">
                                    <CardTitle className="text-lg">{product.name}</CardTitle>
                                    <Badge variant="secondary" className="ml-2">
                                      R$ {product.price.toFixed(2)}
                                    </Badge>
                                  </div>
                                  <p className="text-sm text-muted-foreground mb-4">
                                    {product.description}
                                  </p>
                                </CardContent>
                                <CardFooter className="p-4 pt-0">
                                  {cartQuantity === 0 ? (
                                    <Button 
                                      onClick={() => addToCart(product)}
                                      className="w-full divino-gradient hover:opacity-90 text-white"
                                    >
                                      <Plus className="h-4 w-4 mr-2" />
                                      Adicionar
                                    </Button>
                                  ) : (
                                    <div className="flex items-center justify-between w-full">
                                      <Button
                                        variant="outline"
                                        size="icon"
                                        onClick={() => updateCartQuantity(product.id, cartQuantity - 1)}
                                      >
                                        <Minus className="h-4 w-4" />
                                      </Button>
                                      <span className="font-semibold text-lg px-4">
                                        {cartQuantity}
                                      </span>
                                      <Button
                                        variant="outline"
                                        size="icon"
                                        onClick={() => updateCartQuantity(product.id, cartQuantity + 1)}
                                      >
                                        <Plus className="h-4 w-4" />
                                      </Button>
                                    </div>
                                  )}
                                </CardFooter>
                              </Card>
                            </motion.div>
                          )
                        })}
                      </motion.div>
                    )}
                  </TabsContent>
                )
              })}
            </Tabs>
          </div>

          {/* Carrinho Lateral */}
          <div className="lg:col-span-1">
            <Card className="sticky top-24 food-shadow">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <ShoppingCart className="h-5 w-5" />
                  Seu Pedido
                  {getTotalCartItems() > 0 && (
                    <Badge variant="secondary" className="ml-auto">
                      {getTotalCartItems()}
                    </Badge>
                  )}
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
                      <div key={item.id} className="flex justify-between items-center">
                        <div className="flex-1">
                          <h4 className="font-medium text-sm">{item.name}</h4>
                          <p className="text-xs text-muted-foreground">
                            R$ {item.price.toFixed(2)} x {item.quantity}
                          </p>
                        </div>
                        <div className="flex items-center gap-2">
                          <Button
                            variant="ghost"
                            size="icon"
                            className="h-6 w-6"
                            onClick={() => updateCartQuantity(item.id, item.quantity - 1)}
                          >
                            <Minus className="h-3 w-3" />
                          </Button>
                          <span className="text-sm font-medium w-6 text-center">
                            {item.quantity}
                          </span>
                          <Button
                            variant="ghost"
                            size="icon"
                            className="h-6 w-6"
                            onClick={() => updateCartQuantity(item.id, item.quantity + 1)}
                          >
                            <Plus className="h-3 w-3" />
                          </Button>
                        </div>
                      </div>
                    ))}
                    
                    <div className="border-t pt-4">
                      <div className="flex justify-between items-center font-semibold">
                        <span>Total:</span>
                        <span>R$ {getTotalCartValue().toFixed(2)}</span>
                      </div>
                    </div>
                  </div>
                )}
              </CardContent>
              {state.cart.length > 0 && (
                <CardFooter className="space-y-2">
                  <Button 
                    className="w-full divino-gradient hover:opacity-90 text-white"
                    onClick={() => setIsOrderModalOpen(true)}
                  >
                    Finalizar Pedido
                  </Button>
                  <Button 
                    variant="outline" 
                    size="sm"
                    className="w-full"
                    onClick={clearCart}
                  >
                    <Trash2 className="h-4 w-4 mr-2" />
                    Limpar Carrinho
                  </Button>
                </CardFooter>
              )}
            </Card>
          </div>
        </div>
      </div>

      {/* Modal de Finalização de Pedido */}
      <OrderModal 
        isOpen={isOrderModalOpen} 
        onClose={() => setIsOrderModalOpen(false)} 
=======
  const handleOpenCheckout = () => {
    setIsCheckoutOpen(true)
  }

  const handleCloseCheckout = () => {
    setIsCheckoutOpen(false)
  }

  const handleCheckoutComplete = async (orderData) => {
    const result = await createOrder(orderData)
    if (result) {
      handleCloseCheckout()
      // Mostrar mensagem de sucesso
      alert('Pedido realizado com sucesso! ID: ' + result.id)
    }
  }

  useEffect(() => {
    // Certifique-se de que o estado do carrinho é persistente ou carregado aqui, se necessário
  }, [])

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
            <div className="flex items-center justify-center gap-2 text-destructive">
              <AlertCircle className="h-6 w-6" />
              <p>Erro ao carregar cardápio: {state.error}</p>
            </div>
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
                    {getProductsByCategory(category.id).length}
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
                        <Card className="h-full hover:shadow-lg transition-shadow overflow-hidden">
                          <CardHeader className="pb-4">
                            <div className="aspect-video bg-gradient-to-br from-primary/20 to-secondary/20 rounded-lg flex items-center justify-center mb-4 overflow-hidden">
                              {product.image ? (
                                <img 
                                  src={product.image} 
                                  alt={product.name} 
                                  className="w-full h-full object-cover rounded-lg"
                                  onError={(e) => {
                                    e.target.style.display = 'none'; console.error('Erro ao carregar imagem:', product.image);
                                    const nextSibling = e.target.nextSibling;
                                    if (nextSibling) {
                                      nextSibling.style.display = 'flex';
                                    }
                                  }}
                                />
                              ) : null}
                              <span className="text-4xl" style={{ display: product.image ? 'none' : 'flex' }}>🍽️</span>
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
                                    onClick={() => handleUpdateCartQuantity(product.id, getCartItemQuantity(product.id) - 1)}
                                  >
                                    <Minus className="h-4 w-4" />
                                  </Button>
                                  <span className="w-8 text-center font-semibold">
                                    {getCartItemQuantity(product.id)}
                                  </span>
                                  <Button
                                    size="sm"
                                    onClick={() => handleAddToCart(product)}
                                  >
                                    <Plus className="h-4 w-4" />
                                  </Button>
                                </div>
                              ) : (
                                <Button onClick={() => handleAddToCart(product)}>
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
                    <div key={item.id} className="flex items-center justify-between py-2 border-b">
                      <div className="flex-1">
                        <p className="font-medium text-sm">{item.name}</p>
                        <p className="text-sm text-muted-foreground">
                          {item.quantity}x R$ {item.price.toFixed(2)}
                        </p>
                      </div>
                      <Button
                        size="sm"
                        variant="ghost"
                        onClick={() => handleRemoveFromCart(item.id)}
                      >
                        ✕
                      </Button>
                    </div>
                  ))}
                  
                  <div className="border-t pt-4 space-y-2">
                    <div className="flex justify-between font-semibold">
                      <span>Total:</span>
                      <span className="text-primary">R$ {getTotalCartValue().toFixed(2)}</span>
                    </div>
                    <Button 
                      className="w-full"
                      onClick={handleOpenCheckout}
                    >
                      Finalizar Pedido
                    </Button>
                  </div>
                </div>
              )}
            </CardContent>
          </Card>
        </div>
      </div>

      {/* Checkout Modal */}
      <Checkout 
        isOpen={isCheckoutOpen} 
        onClose={handleCloseCheckout}
        onComplete={handleCheckoutComplete}
        cartItems={state.cart}
        total={getTotalCartValue()}
>>>>>>> branch-11
      />
    </div>
  )
}

export default Menu
<<<<<<< HEAD
=======

>>>>>>> branch-11
