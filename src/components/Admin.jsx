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

  const handleLogout = async () => {
    await supabase.auth.signOut()
  }

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
    </div>
  )
}

export default Admin
