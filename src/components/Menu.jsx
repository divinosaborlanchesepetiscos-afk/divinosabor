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
    dispatch({ type: 'UPDATE_CART_QUANTITY', payload: { id: productId, quantity } })
  }

  const getCartItemQuantity = (productId) => {
    const item = state.cart.find(item => item.id === productId)
    return item ? item.quantity : 0
  }

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
      />
    </div>
  )
}

export default Menu
