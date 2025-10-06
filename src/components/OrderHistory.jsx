import { useState } from 'react'
import { useApp } from '../contexts/AppContext'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Badge } from '@/components/ui/badge'
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog'
import { Separator } from '@/components/ui/separator'
import { History, Search, Repeat, MessageSquare, Clock } from 'lucide-react'
import { motion } from 'framer-motion'

const OrderHistory = () => {
  const { state, dispatch } = useApp()
  const [searchPhone, setSearchPhone] = useState('')
  const [customerOrders, setCustomerOrders] = useState([])
  const [isDialogOpen, setIsDialogOpen] = useState(false)

  const searchCustomerOrders = () => {
    if (!searchPhone.trim()) {
      alert('Por favor, digite um número de telefone')
      return
    }

    const orders = state.orders.filter(order => 
      order.customerInfo?.phone?.includes(searchPhone.replace(/\D/g, ''))
    )

    setCustomerOrders(orders.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt)))
  }

  const reorderItems = (order) => {
    // Limpar carrinho atual
    dispatch({ type: 'CLEAR_CART' })
    
    // Adicionar itens do pedido anterior ao carrinho
    order.items.forEach(item => {
      const product = state.products.find(p => p.id === item.id)
      if (product && product.available) {
        for (let i = 0; i < item.quantity; i++) {
          dispatch({ type: 'ADD_TO_CART', payload: product })
        }
      }
    })

    setIsDialogOpen(false)
    alert('Itens adicionados ao carrinho! Você pode revisar e fazer o pedido.')
  }

  const formatPhone = (phone) => {
    const cleaned = phone.replace(/\D/g, '')
    if (cleaned.length === 11) {
      return `(${cleaned.slice(0, 2)}) ${cleaned.slice(2, 7)}-${cleaned.slice(7)}`
    }
    return phone
  }

  const getStatusColor = (status) => {
    const colors = {
      em_preparo: 'bg-yellow-500',
      pronto: 'bg-green-500',
      saiu_entrega: 'bg-blue-500',
      entregue: 'bg-green-600'
    }
    return colors[status] || 'bg-gray-500'
  }

  const getStatusLabel = (status) => {
    const labels = {
      em_preparo: 'Em Preparo',
      pronto: 'Pronto',
      saiu_entrega: 'Saiu para Entrega',
      entregue: 'Entregue'
    }
    return labels[status] || status
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
    <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
      <DialogTrigger asChild>
        <Button variant="outline" className="flex items-center gap-2">
          <History className="h-4 w-4" />
          Histórico de Pedidos
        </Button>
      </DialogTrigger>
      
      <DialogContent className="sm:max-w-[700px] max-h-[80vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <History className="h-5 w-5" />
            Histórico de Pedidos
          </DialogTitle>
        </DialogHeader>

        <motion.div
          variants={containerVariants}
          initial="hidden"
          animate="visible"
          className="space-y-6"
        >
          {/* Busca por telefone */}
          <motion.div variants={itemVariants}>
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Buscar Pedidos</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="flex gap-4">
                  <Input
                    placeholder="Digite seu telefone (ex: 45999999999)"
                    value={searchPhone}
                    onChange={(e) => setSearchPhone(e.target.value)}
                    className="flex-1"
                  />
                  <Button 
                    onClick={searchCustomerOrders}
                    className="divino-gradient hover:opacity-90 text-white"
                  >
                    <Search className="h-4 w-4 mr-2" />
                    Buscar
                  </Button>
                </div>
              </CardContent>
            </Card>
          </motion.div>

          {/* Resultados da busca */}
          {customerOrders.length > 0 && (
            <motion.div variants={itemVariants}>
              <Card>
                <CardHeader>
                  <CardTitle className="text-lg">
                    Pedidos Encontrados ({customerOrders.length})
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {customerOrders.map((order) => (
                      <motion.div
                        key={order.id}
                        variants={itemVariants}
                        className="border rounded-lg p-4 hover:bg-muted/50 transition-colors"
                      >
                        <div className="flex justify-between items-start mb-3">
                          <div>
                            <h3 className="font-semibold">Pedido #{order.id}</h3>
                            <p className="text-sm text-muted-foreground flex items-center gap-1">
                              <Clock className="h-3 w-3" />
                              {new Date(order.createdAt).toLocaleString('pt-BR')}
                            </p>
                            <p className="text-sm">
                              Cliente: {order.customerInfo?.name} - {formatPhone(order.customerInfo?.phone || '')}
                            </p>
                          </div>
                          <div className="text-right">
                            <Badge 
                              className={`${getStatusColor(order.status)} text-white mb-2`}
                            >
                              {getStatusLabel(order.status)}
                            </Badge>
                            <p className="font-semibold">R$ {order.total.toFixed(2)}</p>
                            <Badge variant="outline" className="mt-1">
                              {order.type === 'delivery' ? 'Delivery' : 'Balcão'}
                            </Badge>
                          </div>
                        </div>

                        <div className="mb-3">
                          <h4 className="font-medium mb-2 text-sm">Itens do Pedido:</h4>
                          <div className="space-y-1">
                            {order.items.map((item, index) => (
                              <div key={index} className="flex justify-between text-sm">
                                <span>{item.quantity}x {item.name}</span>
                                <span>R$ {(item.price * item.quantity).toFixed(2)}</span>
                              </div>
                            ))}
                          </div>
                        </div>

                        {order.customerInfo?.observations && (
                          <div className="mb-3">
                            <h4 className="font-medium mb-1 text-sm">Observações:</h4>
                            <p className="text-sm text-muted-foreground">
                              {order.customerInfo.observations}
                            </p>
                          </div>
                        )}

                        <Separator className="my-3" />

                        <div className="flex gap-2 flex-wrap">
                          <Button
                            size="sm"
                            variant="outline"
                            onClick={() => reorderItems(order)}
                            className="flex items-center gap-1"
                          >
                            <Repeat className="h-3 w-3" />
                            Pedir Novamente
                          </Button>
                          
                          <Button
                            size="sm"
                            variant="outline"
                            onClick={() => {
                              const message = `Olá! Gostaria de repetir o pedido #${order.id}:\n\n${order.items.map(item => `${item.quantity}x ${item.name}`).join('\n')}\n\nTotal: R$ ${order.total.toFixed(2)}`
                              const whatsappUrl = `https://wa.me/5545988046464?text=${encodeURIComponent(message)}`
                              window.open(whatsappUrl, '_blank')
                            }}
                            className="flex items-center gap-1"
                          >
                            <MessageSquare className="h-3 w-3" />
                            WhatsApp
                          </Button>
                        </div>
                      </motion.div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          )}

          {/* Mensagem quando não há resultados */}
          {searchPhone && customerOrders.length === 0 && (
            <motion.div variants={itemVariants}>
              <Card>
                <CardContent className="text-center py-8">
                  <Search className="h-12 w-12 mx-auto mb-4 text-muted-foreground opacity-50" />
                  <p className="text-muted-foreground">
                    Nenhum pedido encontrado para este telefone
                  </p>
                  <p className="text-sm text-muted-foreground mt-2">
                    Verifique se o número está correto ou tente apenas os últimos dígitos
                  </p>
                </CardContent>
              </Card>
            </motion.div>
          )}

          {/* Instruções iniciais */}
          {!searchPhone && (
            <motion.div variants={itemVariants}>
              <Card>
                <CardContent className="text-center py-8">
                  <History className="h-12 w-12 mx-auto mb-4 text-primary opacity-50" />
                  <p className="text-muted-foreground">
                    Digite seu telefone para ver o histórico de pedidos
                  </p>
                  <p className="text-sm text-muted-foreground mt-2">
                    Você poderá repetir pedidos anteriores facilmente
                  </p>
                </CardContent>
              </Card>
            </motion.div>
          )}
        </motion.div>
      </DialogContent>
    </Dialog>
  )
}

export default OrderHistory
