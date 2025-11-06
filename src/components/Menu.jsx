import React, { useState, useEffect } from 'react'
import { useApp } from '../hooks/useApp'
import { FaShoppingCart } from 'react-icons/fa'
import Checkout from './Checkout'
import { Dialog } from '@/components/ui/dialog'
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
    dispatch({ type: 'UPDATE_CART_QUANTITY', payload: { id: productId, quantity } })
  }

  const getCartItemQuantity = (productId) => {
    const item = state.cart.find(item => item.id === productId)
    return item ? item.quantity : 0
  }

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
                  <Badge variant="secondary" className="ml-1 text-xs">{getProductsByCategory(category.id).length}</Badge>
                </TabsTrigger>
              ))}
            </TabsList>

            {categories.map((category) => (
              <TabsContent key={category.id} value={category.id}>
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ duration: 0.5 }}
                  className="grid md:grid-cols-2 xl:grid-cols-3 gap-6"
                >
                  {filteredProducts.map((product) => (
                    <Card key={product.id} className="overflow-hidden">
                      <CardHeader className="p-0">
                        <img src={product.image || '/api/placeholder/300/200'} alt={product.name} className="w-full h-48 object-cover" />
                      </CardHeader>
                      <CardContent className="p-4">
                        <CardTitle className="text-lg mb-2">{product.name}</CardTitle>
                        <p className="text-sm text-muted-foreground h-12 overflow-hidden">{product.description}</p>
                      </CardContent>
                      <div className="flex justify-between items-center p-4">
                        <Badge variant="secondary">R$ {product.price.toFixed(2)}</Badge>
                        <div className="flex items-center gap-2">
                          {getCartItemQuantity(product.id) > 0 ? (
                            <>
                              <Button variant="outline" size="icon" onClick={() => handleUpdateCartQuantity(product.id, getCartItemQuantity(product.id) - 1)}><Minus className="h-4 w-4" /></Button>
                              <span>{getCartItemQuantity(product.id)}</span>
                              <Button variant="outline" size="icon" onClick={() => handleUpdateCartQuantity(product.id, getCartItemQuantity(product.id) + 1)}><Plus className="h-4 w-4" /></Button>
                            </>
                          ) : (
                            <Button onClick={() => handleAddToCart(product)}><Plus className="h-4 w-4 mr-2" /> Adicionar</Button>
                          )}
                        </div>
                      </div>
                    </Card>
                  ))}
                </motion.div>
              </TabsContent>
            ))}
          </Tabs>
        </div>

        {/* Carrinho */}
        <div className="lg:col-span-1">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <FaShoppingCart />
                Seu Pedido
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              {state.cart.length === 0 ? (
                <p className="text-muted-foreground">Seu carrinho está vazio.</p>
              ) : (
                state.cart.map(item => (
                  <div key={item.id} className="flex justify-between items-center">
                    <div>
                      <p className="font-semibold">{item.name}</p>
                      <p className="text-sm text-muted-foreground">R$ {item.price.toFixed(2)} x {item.quantity}</p>
                    </div>
                    <div className="flex items-center gap-2">
                      <Button variant="outline" size="icon" onClick={() => handleUpdateCartQuantity(item.id, item.quantity - 1)}><Minus className="h-4 w-4" /></Button>
                      <Button variant="destructive" size="icon" onClick={() => handleRemoveFromCart(item.id)}><Trash2 className="h-4 w-4" /></Button>
                    </div>
                  </div>
                ))
              )}
            </CardContent>
            {state.cart.length > 0 && (
              <div className="p-4 border-t">
                <div className="flex justify-between font-semibold">
                  <span>Total:</span>
                  <span>R$ {getTotalCartValue().toFixed(2)}</span>
                </div>
                <Button className="w-full mt-4" onClick={handleOpenCheckout}>Finalizar Pedido</Button>
              </div>
            )}
          </Card>
        </div>
      </div>

      <Dialog open={isCheckoutOpen} onOpenChange={setIsCheckoutOpen}>
        <Checkout 
          onClose={handleCloseCheckout} 
          onCheckout={handleCheckoutComplete} 
          cart={state.cart} 
          total={getTotalCartValue()} 
        />
      </Dialog>
    </div>
  )
}

export default Menu
