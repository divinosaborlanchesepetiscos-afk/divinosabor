import { useState } from 'react'
import { useApp } from '../../contexts/AppContext'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { 
  BarChart, 
  Bar, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
  LineChart,
  Line
} from 'recharts'
import { 
  TrendingUp, 
  DollarSign, 
  ShoppingBag, 
  Clock,
  Calendar,
  Award
} from 'lucide-react'
import { motion } from 'framer-motion'

const Reports = () => {
  const { state, getOrdersToday, getTodayRevenue, getMostSoldProducts } = useApp()
  const [selectedPeriod, setSelectedPeriod] = useState('today')

  const getOrdersByPeriod = (period) => {
    const now = new Date()
    let startDate

    switch (period) {
      case 'today':
        startDate = new Date(now.getFullYear(), now.getMonth(), now.getDate())
        break
      case 'week':
        startDate = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000)
        break
      case 'month':
        startDate = new Date(now.getFullYear(), now.getMonth(), 1)
        break
      default:
        startDate = new Date(now.getFullYear(), now.getMonth(), now.getDate())
    }

    return state.orders.filter(order => new Date(order.createdAt) >= startDate)
  }

  const getRevenueByPeriod = (period) => {
    const orders = getOrdersByPeriod(period)
    return orders.reduce((sum, order) => sum + order.total, 0)
  }

  const getOrdersByHour = () => {
    const todayOrders = getOrdersToday()
    const hourlyData = Array.from({ length: 24 }, (_, hour) => ({
      hour: `${hour.toString().padStart(2, '0')}:00`,
      pedidos: 0,
      faturamento: 0
    }))

    todayOrders.forEach(order => {
      const hour = new Date(order.createdAt).getHours()
      hourlyData[hour].pedidos += 1
      hourlyData[hour].faturamento += order.total
    })

    return hourlyData.filter(data => data.pedidos > 0)
  }

  const getOrdersByCategory = () => {
    const categoryData = {}
    
    state.orders.forEach(order => {
      order.items.forEach(item => {
        const product = state.products.find(p => p.id === item.id)
        if (product) {
          if (!categoryData[product.category]) {
            categoryData[product.category] = {
              category: product.category,
              quantidade: 0,
              faturamento: 0
            }
          }
          categoryData[product.category].quantidade += item.quantity
          categoryData[product.category].faturamento += item.price * item.quantity
        }
      })
    })

    return Object.values(categoryData)
  }

  const getOrderStatusData = () => {
    const statusCount = {
      em_preparo: 0,
      pronto: 0,
      saiu_entrega: 0,
      entregue: 0
    }

    state.orders.forEach(order => {
      statusCount[order.status] = (statusCount[order.status] || 0) + 1
    })

    return Object.entries(statusCount).map(([status, count]) => ({
      status: status.replace('_', ' ').replace(/\b\w/g, l => l.toUpperCase()),
      count,
      percentage: ((count / state.orders.length) * 100).toFixed(1)
    }))
  }

  const COLORS = ['#F59E0B', '#EF4444', '#10B981', '#3B82F6', '#8B5CF6']

  const categoryNames = {
    cheese: 'Cheese Burgers',
    petiscos: 'Petiscos',
    espetinhos: 'Espetinhos',
    bebidas: 'Bebidas'
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
    <motion.div
      variants={containerVariants}
      initial="hidden"
      animate="visible"
      className="space-y-6"
    >
      {/* Header */}
      <motion.div variants={itemVariants} className="flex justify-between items-center">
        <div>
          <h2 className="text-2xl font-bold">Relatórios e Análises</h2>
          <p className="text-muted-foreground">
            Acompanhe o desempenho do seu negócio
          </p>
        </div>
        
        <Select value={selectedPeriod} onValueChange={setSelectedPeriod}>
          <SelectTrigger className="w-48">
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="today">Hoje</SelectItem>
            <SelectItem value="week">Últimos 7 dias</SelectItem>
            <SelectItem value="month">Este mês</SelectItem>
          </SelectContent>
        </Select>
      </motion.div>

      {/* Cards de resumo */}
      <motion.div variants={itemVariants}>
        <div className="grid md:grid-cols-4 gap-4">
          <Card>
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-muted-foreground">Pedidos</p>
                  <p className="text-2xl font-bold">{getOrdersByPeriod(selectedPeriod).length}</p>
                </div>
                <ShoppingBag className="h-8 w-8 text-primary" />
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-muted-foreground">Faturamento</p>
                  <p className="text-2xl font-bold">R$ {getRevenueByPeriod(selectedPeriod).toFixed(2)}</p>
                </div>
                <DollarSign className="h-8 w-8 text-green-500" />
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-muted-foreground">Ticket Médio</p>
                  <p className="text-2xl font-bold">
                    R$ {getOrdersByPeriod(selectedPeriod).length > 0 
                      ? (getRevenueByPeriod(selectedPeriod) / getOrdersByPeriod(selectedPeriod).length).toFixed(2)
                      : '0.00'
                    }
                  </p>
                </div>
                <TrendingUp className="h-8 w-8 text-blue-500" />
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-muted-foreground">Tempo Médio</p>
                  <p className="text-2xl font-bold">25 min</p>
                </div>
                <Clock className="h-8 w-8 text-orange-500" />
              </div>
            </CardContent>
          </Card>
        </div>
      </motion.div>

      {/* Tabs de relatórios */}
      <motion.div variants={itemVariants}>
        <Tabs defaultValue="sales" className="w-full">
          <TabsList className="grid w-full grid-cols-4">
            <TabsTrigger value="sales">Vendas</TabsTrigger>
            <TabsTrigger value="products">Produtos</TabsTrigger>
            <TabsTrigger value="categories">Categorias</TabsTrigger>
            <TabsTrigger value="status">Status</TabsTrigger>
          </TabsList>

          {/* Aba de Vendas */}
          <TabsContent value="sales" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Calendar className="h-5 w-5" />
                  Vendas por Horário (Hoje)
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="h-80">
                  <ResponsiveContainer width="100%" height="100%">
                    <LineChart data={getOrdersByHour()}>
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis dataKey="hour" />
                      <YAxis />
                      <Tooltip 
                        formatter={(value, name) => [
                          name === 'pedidos' ? value : `R$ ${value.toFixed(2)}`,
                          name === 'pedidos' ? 'Pedidos' : 'Faturamento'
                        ]}
                      />
                      <Bar dataKey="pedidos" fill="#F59E0B" />
                      <Line 
                        type="monotone" 
                        dataKey="faturamento" 
                        stroke="#EF4444" 
                        strokeWidth={2}
                      />
                    </LineChart>
                  </ResponsiveContainer>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Aba de Produtos */}
          <TabsContent value="products" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Award className="h-5 w-5" />
                  Produtos Mais Vendidos
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {getMostSoldProducts().slice(0, 10).map((product, index) => (
                    <div key={product.id} className="flex items-center justify-between p-3 border rounded-lg">
                      <div className="flex items-center gap-3">
                        <Badge variant="outline" className="w-8 h-8 rounded-full flex items-center justify-center">
                          {index + 1}
                        </Badge>
                        <div>
                          <p className="font-medium">{product.name}</p>
                          <p className="text-sm text-muted-foreground">
                            {categoryNames[product.category] || product.category}
                          </p>
                        </div>
                      </div>
                      <div className="text-right">
                        <p className="font-semibold">{product.quantity} vendidos</p>
                        <p className="text-sm text-muted-foreground">
                          R$ {(product.price * product.quantity).toFixed(2)}
                        </p>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Aba de Categorias */}
          <TabsContent value="categories" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Vendas por Categoria</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="h-80">
                  <ResponsiveContainer width="100%" height="100%">
                    <BarChart data={getOrdersByCategory()}>
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis 
                        dataKey="category" 
                        tickFormatter={(value) => categoryNames[value] || value}
                      />
                      <YAxis />
                      <Tooltip 
                        formatter={(value, name) => [
                          name === 'quantidade' ? value : `R$ ${value.toFixed(2)}`,
                          name === 'quantidade' ? 'Quantidade' : 'Faturamento'
                        ]}
                        labelFormatter={(value) => categoryNames[value] || value}
                      />
                      <Bar dataKey="quantidade" fill="#F59E0B" />
                      <Bar dataKey="faturamento" fill="#EF4444" />
                    </BarChart>
                  </ResponsiveContainer>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Aba de Status */}
          <TabsContent value="status" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Distribuição de Status dos Pedidos</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid md:grid-cols-2 gap-6">
                  <div className="h-80">
                    <ResponsiveContainer width="100%" height="100%">
                      <PieChart>
                        <Pie
                          data={getOrderStatusData()}
                          cx="50%"
                          cy="50%"
                          labelLine={false}
                          label={({ status, percentage }) => `${status} (${percentage}%)`}
                          outerRadius={80}
                          fill="#8884d8"
                          dataKey="count"
                        >
                          {getOrderStatusData().map((entry, index) => (
                            <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                          ))}
                        </Pie>
                        <Tooltip />
                      </PieChart>
                    </ResponsiveContainer>
                  </div>
                  
                  <div className="space-y-4">
                    {getOrderStatusData().map((item, index) => (
                      <div key={item.status} className="flex items-center justify-between p-3 border rounded-lg">
                        <div className="flex items-center gap-3">
                          <div 
                            className="w-4 h-4 rounded-full"
                            style={{ backgroundColor: COLORS[index % COLORS.length] }}
                          />
                          <span className="font-medium">{item.status}</span>
                        </div>
                        <div className="text-right">
                          <p className="font-semibold">{item.count} pedidos</p>
                          <p className="text-sm text-muted-foreground">{item.percentage}%</p>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </motion.div>
    </motion.div>
  )
}

export default Reports
