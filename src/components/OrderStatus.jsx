import React, { useState } from 'react'
import { useApp } from '../contexts/AppContext'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Badge } from '@/components/ui/badge'
import { Search, Clock, CheckCircle, Truck, ChefHat } from 'lucide-react'
import { motion } from 'framer-motion'

const OrderStatus = () => {
  const { state } = useApp()
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
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          )}
        </motion.div>
      </div>
    </div>
  )
}

export default OrderStatus
