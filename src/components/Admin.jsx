<<<<<<< HEAD
import { useState } from 'react'
import { useApp } from '../contexts/AppContext'
import Auth from './Auth'
import { supabase } from '../supabaseClient'
import { LogOut } from 'lucide-react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { 
  ShoppingBag, 
  Users, 
  BarChart3, 
  Settings as SettingsIcon,
  Clock,
  CheckCircle,
  Truck,
  ChefHat
} from 'lucide-react'

// Componentes especializados
import ProductManagement from './admin/ProductManagement'
import DeliveryManagement from './admin/DeliveryManagement'
import Reports from './admin/Reports'
import Settings from './admin/Settings'

const Admin = () => {
  const { state, updateOrderStatus: updateOrderStatusSupabase, deleteOrder: deleteOrderSupabase, getOrdersByStatus, getOrdersToday, getTodayRevenue } = useApp()
  const { user, loading } = state
=======
import { useState, useEffect } from 'react'
import { useApp } from '../hooks/useApp'
import { supabase } from '../lib/supabase'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { Badge } from '@/components/ui/badge'
import { 
  ShoppingBag, 
  Clock, 
  DollarSign, 
  Users, 
  LogOut,
  Package,
  Truck,
  BarChart3,
  Settings
} from 'lucide-react'

const Admin = () => {
  const { state } = useApp()
  const [user, setUser] = useState(null)
  const [loading, setLoading] = useState(true)
  const [loginData, setLoginData] = useState({ email: '', password: '' })
  const [loginError, setLoginError] = useState('')

  useEffect(() => {
    // Verificar se o usuário está logado
    const checkUser = async () => {
      const { data: { session } } = await supabase.auth.getSession()
      setUser(session?.user || null)
      setLoading(false)
    }
    
    checkUser()

    // Escutar mudanças de autenticação
    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      setUser(session?.user || null)
    })

    return () => subscription.unsubscribe()
  }, [])

  const handleLogin = async (e) => {
    e.preventDefault()
    setLoginError('')
    setLoading(true)

    try {
      const { data, error } = await supabase.auth.signInWithPassword({
        email: loginData.email,
        password: loginData.password,
      })

      if (error) {
        setLoginError(error.message)
      }
    } catch (error) {
      setLoginError('Erro ao fazer login')
    } finally {
      setLoading(false)
    }
  }
>>>>>>> branch-11

  const handleLogout = async () => {
    await supabase.auth.signOut()
  }

<<<<<<< HEAD
  if (loading) {
    return <div className="flex items-center justify-center min-h-screen">Carregando...</div>
  }

  if (!user) {
    return <Auth />
  }

  const [activeTab, setActiveTab] = useState("orders")

  const statusConfig = {
    em_preparo: {
      label: 'Em Preparo',
      icon: ChefHat,
      color: 'bg-yellow-500'
    },
    pronto: {
      label: 'Pronto',
      icon: CheckCircle,
      color: 'bg-green-500'
    },
    saiu_entrega: {
      label: 'Saiu para Entrega',
      icon: Truck,
      color: 'bg-blue-500'
    },
    entregue: {
      label: 'Entregue',
      icon: CheckCircle,
      color: 'bg-green-600'
    }
  }

  const updateOrderStatus = async (orderId, newStatus) => {
    await updateOrderStatusSupabase(orderId, newStatus)
  }

  const deleteOrder = async (orderId) => {
    if (confirm("Tem certeza que deseja excluir este pedido?")) {
      await deleteOrderSupabase(orderId)
    }
  }

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <section className="bg-gradient-to-r from-secondary/20 to-accent/20 py-12">
        <div className="container mx-auto px-4">
          <div className="text-center">
            <div className="flex items-center justify-center gap-4 mb-4">
              <h1 className="text-4xl md:text-5xl font-bold">
                Painel <span className="divino-text-gradient">Administrativo</span>
              </h1>
              <Button variant="ghost" size="icon" onClick={handleLogout} title="Sair">
                <LogOut className="h-6 w-6 text-primary" />
              </Button>
            </div>
            <p className="text-lg text-muted-foreground">
              Gerencie pedidos, produtos e relatórios
            </p>
          </div>
        </div>
      </section>

      <div className="container mx-auto px-4 py-8">
        {/* Cards de Resumo */}
        <div className="grid md:grid-cols-4 gap-6 mb-8">
          <Card className="food-shadow">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-muted-foreground">Pedidos Hoje</p>
                  <p className="text-2xl font-bold">{getOrdersToday().length}</p>
                </div>
                <ShoppingBag className="h-8 w-8 text-primary" />
              </div>
            </CardContent>
          </Card>

          <Card className="food-shadow">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-muted-foreground">Em Preparo</p>
                  <p className="text-2xl font-bold">{getOrdersByStatus('em_preparo').length}</p>
                </div>
                <Clock className="h-8 w-8 text-yellow-500" />
              </div>
            </CardContent>
          </Card>

          <Card className="food-shadow">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-muted-foreground">Faturamento Hoje</p>
                  <p className="text-2xl font-bold">R$ {getTodayRevenue().toFixed(2)}</p>
                </div>
                <BarChart3 className="h-8 w-8 text-green-500" />
              </div>
            </CardContent>
          </Card>

          <Card className="food-shadow">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-muted-foreground">Entregadores</p>
                  <p className="text-2xl font-bold">{state.deliveryPersons.filter(p => p.available).length}</p>
                </div>
                <Users className="h-8 w-8 text-blue-500" />
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Tabs Principais */}
        <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
          <TabsList className="grid w-full grid-cols-5">
            <TabsTrigger value="orders" className="flex items-center gap-2">
              <ShoppingBag className="h-4 w-4" />
              Pedidos
            </TabsTrigger>
            <TabsTrigger value="products" className="flex items-center gap-2">
              <ChefHat className="h-4 w-4" />
              Produtos
            </TabsTrigger>
            <TabsTrigger value="delivery" className="flex items-center gap-2">
              <Users className="h-4 w-4" />
              Entregadores
            </TabsTrigger>
            <TabsTrigger value="reports" className="flex items-center gap-2">
              <BarChart3 className="h-4 w-4" />
              Relatórios
            </TabsTrigger>
            <TabsTrigger value="settings" className="flex items-center gap-2">
              <SettingsIcon className="h-4 w-4" />
              Configurações
            </TabsTrigger>
          </TabsList>

          {/* Aba de Pedidos */}
          <TabsContent value="orders" className="space-y-6">
            <Card className="food-shadow">
              <CardHeader>
                <CardTitle>Gerenciar Pedidos</CardTitle>
              </CardHeader>
              <CardContent>
                {state.orders.length === 0 ? (
                  <p className="text-center text-muted-foreground py-8">
                    Nenhum pedido encontrado
                  </p>
                ) : (
                  <div className="space-y-4">
                    {state.orders
                      .sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt))
                      .map((order) => (
                        <div key={order.id} className="border rounded-lg p-4">
                          <div className="flex justify-between items-start mb-4">
                            <div>
                              <h3 className="font-semibold">Pedido #{order.id}</h3>
                              <p className="text-sm text-muted-foreground">
                                {new Date(order.createdAt).toLocaleString('pt-BR')}
                              </p>
                              <p className="text-sm">
                                Tipo: <Badge variant="outline">{order.type === 'delivery' ? 'Delivery' : 'Balcão'}</Badge>
                              </p>
                            </div>
                            <div className="text-right">
                              <Badge 
                                className={`${statusConfig[order.status]?.color} text-white mb-2`}
                              >
                                {statusConfig[order.status]?.label}
                              </Badge>
                              <p className="font-semibold">R$ {order.total.toFixed(2)}</p>
                            </div>
                          </div>

                          <div className="mb-4">
                            <h4 className="font-medium mb-2">Itens:</h4>
                            <div className="text-sm space-y-1">
                              {order.items.map((item, index) => (
                                <div key={index} className="flex justify-between">
                                  <span>{item.quantity}x {item.name}</span>
                                  <span>R$ {(item.price * item.quantity).toFixed(2)}</span>
                                </div>
                              ))}
                            </div>
                          </div>

                          {order.customerInfo && (
                            <div className="mb-4 text-sm">
                              <h4 className="font-medium mb-1">Cliente:</h4>
                              <p>{order.customerInfo.name} - {order.customerInfo.phone}</p>
                              {order.customerInfo.address && (
                                <p>{order.customerInfo.address}</p>
                              )}
                            </div>
                          )}

                          <div className="flex gap-2 flex-wrap">
                            {order.status === 'em_preparo' && (
                              <Button
                                size="sm"
                                onClick={() => updateOrderStatus(order.id, 'pronto')}
                                className="bg-green-500 hover:bg-green-600 text-white"
                              >
                                Marcar como Pronto
                              </Button>
                            )}
                            {order.status === 'pronto' && order.type === 'delivery' && (
                              <Button
                                size="sm"
                                onClick={() => updateOrderStatus(order.id, 'saiu_entrega')}
                                className="bg-blue-500 hover:bg-blue-600 text-white"
                              >
                                Saiu para Entrega
                              </Button>
                            )}
                            {(order.status === 'pronto' || order.status === 'saiu_entrega') && (
                              <Button
                                size="sm"
                                onClick={() => updateOrderStatus(order.id, 'entregue')}
                                className="bg-green-600 hover:bg-green-700 text-white"
                              >
                                Marcar como Entregue
                              </Button>
                            )}
                            <Button
                              size="sm"
                              variant="destructive"
                              onClick={() => deleteOrder(order.id)}
                            >
                              Excluir
                            </Button>
                          </div>
                        </div>
                      ))}
                  </div>
                )}
              </CardContent>
            </Card>
          </TabsContent>

          {/* Aba de Produtos */}
          <TabsContent value="products">
            <ProductManagement />
          </TabsContent>

          {/* Aba de Entregadores */}
          <TabsContent value="delivery">
            <DeliveryManagement />
          </TabsContent>

          {/* Aba de Relatórios */}
          <TabsContent value="reports">
            <Reports />
          </TabsContent>

          {/* Aba de Configurações */}
          <TabsContent value="settings">
            <Settings />
          </TabsContent>
        </Tabs>
      </div>
=======
  // Tela de login
  if (loading) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="flex items-center justify-center min-h-[400px]">
          <div className="text-center space-y-4">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto"></div>
            <p className="text-muted-foreground">Carregando...</p>
          </div>
        </div>
      </div>
    )
  }

  if (!user) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="max-w-md mx-auto">
          <Card>
            <CardHeader>
              <CardTitle className="text-center">Login Administrativo</CardTitle>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleLogin} className="space-y-4">
                <div>
                  <Label htmlFor="email">Email</Label>
                  <Input
                    id="email"
                    type="email"
                    value={loginData.email}
                    onChange={(e) => setLoginData({ ...loginData, email: e.target.value })}
                    required
                  />
                </div>
                <div>
                  <Label htmlFor="password">Senha</Label>
                  <Input
                    id="password"
                    type="password"
                    value={loginData.password}
                    onChange={(e) => setLoginData({ ...loginData, password: e.target.value })}
                    required
                  />
                </div>
                {loginError && (
                  <p className="text-destructive text-sm">{loginError}</p>
                )}
                <Button type="submit" className="w-full" disabled={loading}>
                  {loading ? 'Entrando...' : 'Entrar'}
                </Button>
              </form>
            </CardContent>
          </Card>
        </div>
      </div>
    )
  }

  // Painel administrativo
  return (
    <div className="container mx-auto px-4 py-8">
      {/* Header */}
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-3xl font-bold">Painel <span className="text-primary">Administrativo</span></h1>
          <p className="text-muted-foreground">Gerencie pedidos, produtos e relatórios</p>
        </div>
        <Button variant="outline" onClick={handleLogout}>
          <LogOut className="h-4 w-4 mr-2" />
          Sair
        </Button>
      </div>

      {/* Cards de Estatísticas */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-muted-foreground">Pedidos Hoje</p>
                <p className="text-2xl font-bold">0</p>
              </div>
              <ShoppingBag className="h-8 w-8 text-muted-foreground" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-muted-foreground">Em Preparo</p>
                <p className="text-2xl font-bold">0</p>
              </div>
              <Clock className="h-8 w-8 text-muted-foreground" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-muted-foreground">Faturamento Hoje</p>
                <p className="text-2xl font-bold">R$ 0,00</p>
              </div>
              <DollarSign className="h-8 w-8 text-muted-foreground" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-muted-foreground">Entregadores</p>
                <p className="text-2xl font-bold">{state.deliveryPersons.length}</p>
              </div>
              <Users className="h-8 w-8 text-muted-foreground" />
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Tabs do Painel */}
      <Tabs defaultValue="orders" className="space-y-6">
        <TabsList className="grid w-full grid-cols-5">
          <TabsTrigger value="orders" className="flex items-center gap-2">
            <ShoppingBag className="h-4 w-4" />
            <span className="hidden sm:inline">Pedidos</span>
          </TabsTrigger>
          <TabsTrigger value="products" className="flex items-center gap-2">
            <Package className="h-4 w-4" />
            <span className="hidden sm:inline">Produtos</span>
          </TabsTrigger>
          <TabsTrigger value="delivery" className="flex items-center gap-2">
            <Truck className="h-4 w-4" />
            <span className="hidden sm:inline">Entregadores</span>
          </TabsTrigger>
          <TabsTrigger value="reports" className="flex items-center gap-2">
            <BarChart3 className="h-4 w-4" />
            <span className="hidden sm:inline">Relatórios</span>
          </TabsTrigger>
          <TabsTrigger value="settings" className="flex items-center gap-2">
            <Settings className="h-4 w-4" />
            <span className="hidden sm:inline">Configurações</span>
          </TabsTrigger>
        </TabsList>

        <TabsContent value="orders">
          <Card>
            <CardHeader>
              <CardTitle>Gerenciar Pedidos</CardTitle>
            </CardHeader>
            <CardContent>
              {state.orders.length === 0 ? (
                <p className="text-center text-muted-foreground py-8">
                  Nenhum pedido encontrado
                </p>
              ) : (
                <div className="space-y-4">
                  {state.orders.map((order) => (
                    <div key={order.id} className="flex items-center justify-between p-4 border rounded-lg">
                      <div>
                        <p className="font-medium">Pedido #{order.id}</p>
                        <p className="text-sm text-muted-foreground">
                          {order.customer_name} - {order.customer_phone}
                        </p>
                      </div>
                      <div className="flex items-center gap-2">
                        <Badge variant="outline">{order.status}</Badge>
                        <span className="font-semibold">R$ {order.total?.toFixed(2)}</span>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="products">
          <Card>
            <CardHeader>
              <CardTitle>Gerenciar Produtos</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                  <Card>
                    <CardContent className="p-4 text-center">
                      <p className="text-2xl font-bold text-primary">{state.products.filter(p => p.category === 'espetinhos').length}</p>
                      <p className="text-sm text-muted-foreground">Espetinhos</p>
                    </CardContent>
                  </Card>
                  <Card>
                    <CardContent className="p-4 text-center">
                      <p className="text-2xl font-bold text-primary">{state.products.filter(p => p.category === 'porcoes').length}</p>
                      <p className="text-sm text-muted-foreground">Porções</p>
                    </CardContent>
                  </Card>
                  <Card>
                    <CardContent className="p-4 text-center">
                      <p className="text-2xl font-bold text-primary">{state.products.filter(p => p.category === 'bebidas').length}</p>
                      <p className="text-sm text-muted-foreground">Bebidas</p>
                    </CardContent>
                  </Card>
                  <Card>
                    <CardContent className="p-4 text-center">
                      <p className="text-2xl font-bold text-primary">{state.products.filter(p => p.category === 'x-gaucho').length}</p>
                      <p className="text-sm text-muted-foreground">X Gaúcho</p>
                    </CardContent>
                  </Card>
                </div>

                <div className="space-y-2">
                  <h3 className="font-semibold">Lista de Produtos</h3>
                  {state.products.length === 0 ? (
                    <p className="text-center text-muted-foreground py-8">
                      Nenhum produto encontrado
                    </p>
                  ) : (
                    <div className="space-y-2">
                      {state.products.slice(0, 10).map((product) => (
                        <div key={product.id} className="flex items-center justify-between p-3 border rounded">
                          <div>
                            <p className="font-medium">{product.name}</p>
                            <p className="text-sm text-muted-foreground capitalize">{product.category}</p>
                          </div>
                          <div className="flex items-center gap-2">
                            <Badge variant={product.available ? "default" : "secondary"}>
                              {product.available ? "Disponível" : "Indisponível"}
                            </Badge>
                            <span className="font-semibold">R$ {product.price?.toFixed(2)}</span>
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="delivery">
          <Card>
            <CardHeader>
              <CardTitle>Gerenciar Entregadores</CardTitle>
            </CardHeader>
            <CardContent>
              {state.deliveryPersons.length === 0 ? (
                <p className="text-center text-muted-foreground py-8">
                  Nenhum entregador cadastrado
                </p>
              ) : (
                <div className="space-y-4">
                  {state.deliveryPersons.map((person) => (
                    <div key={person.id} className="flex items-center justify-between p-4 border rounded-lg">
                      <div>
                        <p className="font-medium">{person.name}</p>
                        <p className="text-sm text-muted-foreground">{person.phone}</p>
                      </div>
                      <Badge variant={person.available ? "default" : "secondary"}>
                        {person.available ? "Disponível" : "Ocupado"}
                      </Badge>
                    </div>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="reports">
          <Card>
            <CardHeader>
              <CardTitle>Relatórios e Dashboard</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-center text-muted-foreground py-8">
                Relatórios em desenvolvimento
              </p>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="settings">
          <Card>
            <CardHeader>
              <CardTitle>Configurações</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-center text-muted-foreground py-8">
                Configurações em desenvolvimento
              </p>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
>>>>>>> branch-11
    </div>
  )
}

export default Admin
