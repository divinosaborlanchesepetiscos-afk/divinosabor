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

import ProductManagement from './admin/ProductManagement'

// Stubs para funcionalidades futuras
const DeliveryManagement = () => <div>Gerenciamento de Entregadores (A ser implementado)</div>
const Reports = () => <div>Relatórios (A ser implementado)</div>

const Admin = () => {
  const { state } = useApp()
  const [user, setUser] = useState(null)
  const [loading, setLoading] = useState(true)
  const [activeTab, setActiveTab] = useState("orders")

  useEffect(() => {
    const checkUser = async () => {
      const { data: { session } } = await supabase.auth.getSession()
      setUser(session?.user || null)
      setLoading(false)
    }
    
    checkUser()

    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      setUser(session?.user || null)
    })

    return () => subscription.unsubscribe()
  }, [])

  const handleLogout = async () => {
    await supabase.auth.signOut()
  }

  if (loading) {
    return <div className="flex items-center justify-center min-h-screen">Carregando...</div>
  }

  if (!user) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <Card className="w-full max-w-md">
          <CardHeader>
            <CardTitle className="text-2xl">Acesso Restrito</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-muted-foreground">Por favor, faça login para acessar o painel administrativo.</p>
            <Button onClick={() => supabase.auth.signInWithOAuth({ provider: 'google' })} className="mt-4 w-full">
              Fazer Login (Exemplo)
            </Button>
          </CardContent>
        </Card>
      </div>
    )
  }

  const getOrdersToday = () => state.orders.filter(order => new Date(order.created_at).toDateString() === new Date().toDateString())
  const getOrdersByStatus = (status) => state.orders.filter(order => order.status === status)
  const getTodayRevenue = () => getOrdersToday().reduce((acc, order) => acc + order.total, 0)

  const statusConfig = {
    pending: { label: 'Pendente', icon: Clock, color: 'bg-yellow-500' },
    preparing: { label: 'Em Preparo', icon: Package, color: 'bg-blue-500' },
    delivering: { label: 'Em Entrega', icon: Truck, color: 'bg-orange-500' },
    delivered: { label: 'Entregue', icon: DollarSign, color: 'bg-green-500' },
    cancelled: { label: 'Cancelado', icon: Settings, color: 'bg-red-500' }
  }

  return (
    <div className="min-h-screen bg-background">
      <section className="bg-muted py-8">
        <div className="container mx-auto px-4">
          <div className="flex justify-between items-center">
            <h1 className="text-3xl md:text-4xl font-bold">Painel <span className="text-primary">Admin</span></h1>
            <Button variant="ghost" size="icon" onClick={handleLogout} title="Sair">
              <LogOut className="h-6 w-6 text-primary" />
            </Button>
          </div>
          <p className="text-lg text-muted-foreground mt-2">Gerencie pedidos, produtos e entregadores</p>
        </div>
      </section>

      <div className="container mx-auto px-4 py-8">
        <div className="grid md:grid-cols-4 gap-6 mb-8">
          <Card>
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
          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-muted-foreground">Em Preparo</p>
                  <p className="text-2xl font-bold">{getOrdersByStatus('preparing').length}</p>
                </div>
                <Package className="h-8 w-8 text-blue-500" />
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-muted-foreground">Faturamento Hoje</p>
                  <p className="text-2xl font-bold">R$ {getTodayRevenue().toFixed(2)}</p>
                </div>
                <DollarSign className="h-8 w-8 text-green-500" />
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-muted-foreground">Entregadores</p>
                  <p className="text-2xl font-bold">{state.deliveryPersons.length}</p>
                </div>
                <Users className="h-8 w-8 text-orange-500" />
              </div>
            </CardContent>
          </Card>
        </div>

        <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
          <TabsList className="grid w-full grid-cols-4">
            <TabsTrigger value="orders" className="flex items-center gap-2"><ShoppingBag className="h-4 w-4" />Pedidos</TabsTrigger>
            <TabsTrigger value="products" className="flex items-center gap-2"><Package className="h-4 w-4" />Produtos</TabsTrigger>
            <TabsTrigger value="delivery" className="flex items-center gap-2"><Truck className="h-4 w-4" />Entregadores</TabsTrigger>
            <TabsTrigger value="reports" className="flex items-center gap-2"><BarChart3 className="h-4 w-4" />Relatórios</TabsTrigger>
          </TabsList>

          <TabsContent value="orders" className="space-y-6">
            <Card>
              <CardHeader><CardTitle>Gerenciar Pedidos</CardTitle></CardHeader>
              <CardContent>
                {state.orders.length === 0 ? (
                  <p className="text-center text-muted-foreground py-8">Nenhum pedido encontrado</p>
                ) : (
                  <div className="space-y-4">
                    {state.orders.sort((a, b) => new Date(b.created_at) - new Date(a.created_at)).map((order) => (
                      <div key={order.id} className="border rounded-lg p-4">
                        <div className="flex justify-between items-start mb-4">
                          <div>
                            <h3 className="font-semibold">Pedido #{order.id}</h3>
                            <p className="text-sm text-muted-foreground">{new Date(order.created_at).toLocaleString('pt-BR')}</p>
                            <p className="text-sm">Cliente: {order.customer_name}</p>
                          </div>
                          <div className="text-right">
                            <Badge className={`${statusConfig[order.status]?.color} text-white mb-2`}>{statusConfig[order.status]?.label}</Badge>
                            <p className="font-semibold">R$ {order.total.toFixed(2)}</p>
                          </div>
                        </div>
                        <div className="mb-4">
                          <h4 className="font-medium mb-2">Itens:</h4>
                          <div className="text-sm space-y-1">
                            {JSON.parse(order.items).map((item, index) => (
                              <div key={index} className="flex justify-between">
                                <span>{item.name} x {item.quantity}</span>
                                <span>R$ {(item.price * item.quantity).toFixed(2)}</span>
                              </div>
                            ))}
                          </div>
                        </div>
                        <div className="flex justify-end space-x-2">
                          <Button variant="outline" size="sm">Ver Detalhes</Button>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="products">
            <ProductManagement />
          </TabsContent>

          <TabsContent value="delivery">
            <DeliveryManagement />
          </TabsContent>

          <TabsContent value="reports">
            <Reports />
          </TabsContent>
        </Tabs>
      </div>
    </div>
  )
}

export default Admin
