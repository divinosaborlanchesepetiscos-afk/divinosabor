<<<<<<< HEAD
import React, { useState } from 'react'
import { useApp } from '../contexts/AppContext'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Badge } from '@/components/ui/badge'
import { Search, Clock, CheckCircle, Truck, ChefHat } from 'lucide-react'
=======
import { useState } from 'react'
import { useApp } from '../hooks/useApp'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Badge } from '@/components/ui/badge'
import { Search, Clock, CheckCircle, Truck, Package } from 'lucide-react'
>>>>>>> branch-11
import { motion } from 'framer-motion'

const OrderStatus = () => {
  const { state } = useApp()
<<<<<<< HEAD
  const [searchId, setSearchId] = useState('')
  const [foundOrder, setFoundOrder] = useState(null)

  const statusConfig = {
    em_preparo: {
      label: 'Em Preparo',
      icon: ChefHat,
      color: 'bg-yellow-500',
      description: 'Seu pedido está sendo preparado com carinho'
    },
    pronto: {
      label: 'Pronto',
      icon: CheckCircle,
      color: 'bg-green-500',
      description: 'Seu pedido está pronto para retirada/entrega'
    },
    saiu_entrega: {
      label: 'Saiu para Entrega',
      icon: Truck,
      color: 'bg-blue-500',
      description: 'Seu pedido está a caminho'
    },
    entregue: {
      label: 'Entregue',
      icon: CheckCircle,
      color: 'bg-green-600',
      description: 'Pedido entregue com sucesso'
    }
  }

  const searchOrder = () => {
    const order = state.orders.find(order => order.id.toString() === searchId)
    setFoundOrder(order || null)
  }

  const getEstimatedTime = (order) => {
    if (!order) return 0
    
    const createdAt = new Date(order.createdAt)
    const now = new Date()
    const elapsed = Math.floor((now - createdAt) / (1000 * 60)) // minutos
    const remaining = Math.max(0, order.estimatedTime - elapsed)
    
    return remaining
  }

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.2
      }
    }
  }

  const itemVariants = {
    hidden: { y: 20, opacity: 0 },
    visible: {
      y: 0,
      opacity: 1,
      transition: {
        duration: 0.6
      }
    }
  }

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <section className="bg-gradient-to-r from-secondary/20 to-accent/20 py-12">
        <div className="container mx-auto px-4">
          <div className="text-center">
            <h1 className="text-4xl md:text-5xl font-bold mb-4">
              Status do <span className="divino-text-gradient">Pedido</span>
            </h1>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
              Acompanhe seu pedido em tempo real
            </p>
          </div>
        </div>
      </section>

      <div className="container mx-auto px-4 py-8">
        <motion.div
          variants={containerVariants}
          initial="hidden"
          animate="visible"
          className="max-w-2xl mx-auto"
        >
          {/* Busca de Pedido */}
          <motion.div variants={itemVariants}>
            <Card className="mb-8 food-shadow">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Search className="h-5 w-5" />
                  Consultar Pedido
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="flex gap-4">
                  <Input
                    placeholder="Digite o número do seu pedido"
                    value={searchId}
                    onChange={(e) => setSearchId(e.target.value)}
                    className="flex-1"
                  />
                  <Button 
                    onClick={searchOrder}
                    className="divino-gradient hover:opacity-90 text-white"
                  >
                    <Search className="h-4 w-4 mr-2" />
                    Buscar
                  </Button>
                </div>
              </CardContent>
            </Card>
          </motion.div>

          {/* Resultado da Busca */}
          {searchId && (
            <motion.div variants={itemVariants}>
              {foundOrder ? (
                <Card className="food-shadow">
                  <CardHeader>
                    <div className="flex justify-between items-start">
                      <div>
                        <CardTitle>Pedido #{foundOrder.id}</CardTitle>
                        <p className="text-sm text-muted-foreground">
                          {new Date(foundOrder.createdAt).toLocaleString('pt-BR')}
                        </p>
                      </div>
                      <Badge 
                        variant="secondary" 
                        className={`${statusConfig[foundOrder.status]?.color} text-white`}
                      >
                        {statusConfig[foundOrder.status]?.label}
                      </Badge>
                    </div>
                  </CardHeader>
                  <CardContent className="space-y-6">
                    {/* Status Visual */}
                    <div className="text-center">
                      <div className={`w-16 h-16 mx-auto rounded-full ${statusConfig[foundOrder.status]?.color} flex items-center justify-center mb-4`}>
                        {statusConfig[foundOrder.status]?.icon && 
                          React.createElement(statusConfig[foundOrder.status].icon, { className: "h-8 w-8 text-white" })
                        }
                      </div>
                      <h3 className="text-xl font-semibold mb-2">
                        {statusConfig[foundOrder.status]?.label}
                      </h3>
                      <p className="text-muted-foreground">
                        {statusConfig[foundOrder.status]?.description}
                      </p>
                      
                      {foundOrder.status === 'em_preparo' && (
                        <div className="mt-4 p-4 bg-muted/50 rounded-lg">
                          <div className="flex items-center justify-center gap-2 text-sm">
                            <Clock className="h-4 w-4" />
                            <span>
                              Tempo estimado: {getEstimatedTime(foundOrder)} minutos
                            </span>
                          </div>
                        </div>
                      )}
                    </div>

                    {/* Detalhes do Pedido */}
                    <div className="border-t pt-6">
                      <h4 className="font-semibold mb-4">Itens do Pedido:</h4>
                      <div className="space-y-2">
                        {foundOrder.items.map((item, index) => (
                          <div key={index} className="flex justify-between items-center">
                            <span className="text-sm">
                              {item.quantity}x {item.name}
                            </span>
                            <span className="text-sm font-medium">
                              R$ {(item.price * item.quantity).toFixed(2)}
                            </span>
                          </div>
                        ))}
                      </div>
                      
                      <div className="border-t mt-4 pt-4">
                        <div className="flex justify-between items-center font-semibold">
                          <span>Total:</span>
                          <span>R$ {foundOrder.total.toFixed(2)}</span>
                        </div>
                      </div>
                    </div>

                    {/* Informações de Entrega */}
                    {foundOrder.type === 'delivery' && foundOrder.customerInfo && (
                      <div className="border-t pt-6">
                        <h4 className="font-semibold mb-4">Informações de Entrega:</h4>
                        <div className="space-y-2 text-sm">
                          <p><strong>Nome:</strong> {foundOrder.customerInfo.name}</p>
                          <p><strong>Telefone:</strong> {foundOrder.customerInfo.phone}</p>
                          <p><strong>Endereço:</strong> {foundOrder.customerInfo.address}</p>
                          {foundOrder.deliveryPerson && (
                            <p><strong>Entregador:</strong> {foundOrder.deliveryPerson.name}</p>
                          )}
                        </div>
                      </div>
                    )}
                  </CardContent>
                </Card>
              ) : (
                <Card className="text-center py-8">
                  <CardContent>
                    <div className="text-muted-foreground">
                      <Search className="h-12 w-12 mx-auto mb-4 opacity-50" />
                      <p>Pedido não encontrado</p>
                      <p className="text-sm mt-2">
                        Verifique se o número do pedido está correto
                      </p>
                    </div>
                  </CardContent>
                </Card>
              )}
            </motion.div>
          )}

          {/* Pedidos Recentes */}
          {!searchId && state.orders.length > 0 && (
            <motion.div variants={itemVariants}>
              <Card className="food-shadow">
                <CardHeader>
                  <CardTitle>Pedidos Recentes</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {state.orders
                      .slice(-5)
                      .reverse()
                      .map((order) => (
                        <div 
                          key={order.id}
                          className="flex justify-between items-center p-4 border rounded-lg hover:bg-muted/50 transition-colors cursor-pointer"
                          onClick={() => {
                            setSearchId(order.id.toString())
                            setFoundOrder(order)
                          }}
                        >
                          <div>
                            <p className="font-medium">Pedido #{order.id}</p>
                            <p className="text-sm text-muted-foreground">
                              {new Date(order.createdAt).toLocaleString('pt-BR')}
                            </p>
                          </div>
                          <div className="text-right">
                            <Badge 
                              variant="secondary"
                              className={`${statusConfig[order.status]?.color} text-white mb-1`}
                            >
                              {statusConfig[order.status]?.label}
                            </Badge>
                            <p className="text-sm font-medium">
                              R$ {order.total.toFixed(2)}
                            </p>
                          </div>
                        </div>
                      ))}
=======
  const [searchPhone, setSearchPhone] = useState('')
  const [searchResults, setSearchResults] = useState([])
  const [searching, setSearching] = useState(false)

  const getStatusIcon = (status) => {
    switch (status) {
      case 'em_preparo':
        return <Clock className="h-5 w-5 text-yellow-500" />
      case 'pronto':
        return <Package className="h-5 w-5 text-blue-500" />
      case 'saiu_para_entrega':
        return <Truck className="h-5 w-5 text-orange-500" />
      case 'entregue':
        return <CheckCircle className="h-5 w-5 text-green-500" />
      default:
        return <Clock className="h-5 w-5 text-gray-500" />
    }
  }

  const getStatusText = (status) => {
    switch (status) {
      case 'em_preparo':
        return 'Em Preparo'
      case 'pronto':
        return 'Pronto'
      case 'saiu_para_entrega':
        return 'Saiu para Entrega'
      case 'entregue':
        return 'Entregue'
      default:
        return 'Status Desconhecido'
    }
  }

  const getStatusColor = (status) => {
    switch (status) {
      case 'em_preparo':
        return 'bg-yellow-100 text-yellow-800 border-yellow-200'
      case 'pronto':
        return 'bg-blue-100 text-blue-800 border-blue-200'
      case 'saiu_para_entrega':
        return 'bg-orange-100 text-orange-800 border-orange-200'
      case 'entregue':
        return 'bg-green-100 text-green-800 border-green-200'
      default:
        return 'bg-gray-100 text-gray-800 border-gray-200'
    }
  }

  const handleSearch = () => {
    if (!searchPhone.trim()) return

    setSearching(true)
    
    // Simular busca (em produção, seria uma consulta ao banco)
    setTimeout(() => {
      const results = state.orders.filter(order => 
        order.customer_phone && order.customer_phone.includes(searchPhone.trim())
      )
      setSearchResults(results)
      setSearching(false)
    }, 1000)
  }

  const formatDate = (dateString) => {
    const date = new Date(dateString)
    return date.toLocaleDateString('pt-BR', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    })
  }

  return (
    <div className="container mx-auto px-4 py-8">
      {/* Header */}
      <div className="text-center space-y-4 mb-8">
        <h1 className="text-4xl md:text-5xl font-bold">
          Status do <span className="text-primary">Pedido</span>
        </h1>
        <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
          Acompanhe seu pedido em tempo real
        </p>
      </div>

      {/* Busca */}
      <div className="max-w-md mx-auto mb-8">
        <Card>
          <CardHeader>
            <CardTitle className="text-center">Consultar Pedido</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <Label htmlFor="phone">Número do Telefone</Label>
              <Input
                id="phone"
                type="tel"
                placeholder="(45) 99999-9999"
                value={searchPhone}
                onChange={(e) => setSearchPhone(e.target.value)}
                onKeyPress={(e) => e.key === 'Enter' && handleSearch()}
              />
            </div>
            <Button 
              onClick={handleSearch} 
              className="w-full" 
              disabled={searching || !searchPhone.trim()}
            >
              <Search className="h-4 w-4 mr-2" />
              {searching ? 'Buscando...' : 'Consultar'}
            </Button>
          </CardContent>
        </Card>
      </div>

      {/* Resultados */}
      {searchResults.length > 0 && (
        <div className="max-w-2xl mx-auto space-y-6">
          <h2 className="text-2xl font-semibold text-center">
            Seus Pedidos
          </h2>
          
          {searchResults.map((order, index) => (
            <motion.div
              key={order.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.3, delay: index * 0.1 }}
            >
              <Card className="overflow-hidden">
                <CardHeader className="pb-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <CardTitle className="text-lg">Pedido #{order.id}</CardTitle>
                      <p className="text-sm text-muted-foreground">
                        {formatDate(order.created_at)}
                      </p>
                    </div>
                    <div className="flex items-center gap-2">
                      {getStatusIcon(order.status)}
                      <Badge className={getStatusColor(order.status)}>
                        {getStatusText(order.status)}
                      </Badge>
                    </div>
                  </div>
                </CardHeader>
                
                <CardContent className="space-y-4">
                  {/* Informações do Cliente */}
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4 p-4 bg-muted/20 rounded-lg">
                    <div>
                      <p className="text-sm font-medium text-muted-foreground">Cliente</p>
                      <p className="font-medium">{order.customer_name}</p>
                    </div>
                    <div>
                      <p className="text-sm font-medium text-muted-foreground">Telefone</p>
                      <p className="font-medium">{order.customer_phone}</p>
                    </div>
                    {order.customer_address && (
                      <div className="md:col-span-2">
                        <p className="text-sm font-medium text-muted-foreground">Endereço</p>
                        <p className="font-medium">{order.customer_address}</p>
                      </div>
                    )}
                  </div>

                  {/* Itens do Pedido */}
                  {order.items && order.items.length > 0 && (
                    <div>
                      <p className="font-medium mb-2">Itens do Pedido:</p>
                      <div className="space-y-2">
                        {order.items.map((item, itemIndex) => (
                          <div key={itemIndex} className="flex justify-between items-center p-2 bg-muted/10 rounded">
                            <div>
                              <p className="font-medium">{item.name}</p>
                              <p className="text-sm text-muted-foreground">
                                Quantidade: {item.quantity}
                              </p>
                            </div>
                            <p className="font-semibold">
                              R$ {(item.price * item.quantity).toFixed(2)}
                            </p>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}

                  {/* Total e Forma de Pagamento */}
                  <div className="flex justify-between items-center pt-4 border-t">
                    <div>
                      {order.payment_method && (
                        <p className="text-sm text-muted-foreground">
                          Pagamento: <span className="capitalize">{order.payment_method}</span>
                        </p>
                      )}
                    </div>
                    <div className="text-right">
                      <p className="text-lg font-bold text-primary">
                        Total: R$ {order.total?.toFixed(2) || '0,00'}
                      </p>
                    </div>
                  </div>

                  {/* Barra de Progresso */}
                  <div className="space-y-2">
                    <p className="text-sm font-medium">Progresso do Pedido:</p>
                    <div className="flex items-center justify-between">
                      {['em_preparo', 'pronto', 'saiu_para_entrega', 'entregue'].map((status, statusIndex) => {
                        const isActive = ['em_preparo', 'pronto', 'saiu_para_entrega', 'entregue'].indexOf(order.status) >= statusIndex
                        const isCurrent = order.status === status
                        
                        return (
                          <div key={status} className="flex flex-col items-center">
                            <div className={`w-8 h-8 rounded-full flex items-center justify-center ${
                              isActive ? 'bg-primary text-primary-foreground' : 'bg-muted text-muted-foreground'
                            } ${isCurrent ? 'ring-2 ring-primary ring-offset-2' : ''}`}>
                              {getStatusIcon(status)}
                            </div>
                            <p className="text-xs mt-1 text-center max-w-16">
                              {getStatusText(status)}
                            </p>
                          </div>
                        )
                      })}
                    </div>
>>>>>>> branch-11
                  </div>
                </CardContent>
              </Card>
            </motion.div>
<<<<<<< HEAD
          )}
        </motion.div>
      </div>
=======
          ))}
        </div>
      )}

      {/* Estado vazio */}
      {searchPhone && searchResults.length === 0 && !searching && (
        <div className="text-center py-12">
          <p className="text-muted-foreground">
            Nenhum pedido encontrado para este telefone.
          </p>
        </div>
      )}

      {/* Instruções */}
      {!searchPhone && (
        <div className="max-w-2xl mx-auto">
          <Card>
            <CardContent className="p-8 text-center space-y-4">
              <div className="w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center mx-auto">
                <Search className="h-8 w-8 text-primary" />
              </div>
              <h3 className="text-xl font-semibold">Como consultar seu pedido</h3>
              <div className="space-y-2 text-muted-foreground">
                <p>1. Digite o número do telefone usado no pedido</p>
                <p>2. Clique em "Consultar" para ver seus pedidos</p>
                <p>3. Acompanhe o status em tempo real</p>
              </div>
            </CardContent>
          </Card>
        </div>
      )}
>>>>>>> branch-11
    </div>
  )
}

export default OrderStatus
