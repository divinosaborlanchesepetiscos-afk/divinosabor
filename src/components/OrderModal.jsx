import { useState } from 'react'
import { useApp } from '../contexts/AppContext'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Separator } from '@/components/ui/separator'
import { MapPin, Phone, User, MessageSquare, CreditCard, DollarSign, QrCode } from 'lucide-react'

const OrderModal = ({ isOpen, onClose }) => {
  const { state, dispatch, getTotalCartValue, getTotalCartItems, createOrder } = useApp()
  const [orderType, setOrderType] = useState('delivery')
  const [customerInfo, setCustomerInfo] = useState({
    name: '',
    phone: '',
    address: '',
    observations: ''
  })
  const [selectedDeliveryPerson, setSelectedDeliveryPerson] = useState("")
  const [paymentMethod, setPaymentMethod] = useState("dinheiro") // Default payment method
  const [isSubmitting, setIsSubmitting] = useState(false)

  const availableDeliveryPersons = state.deliveryPersons.filter(person => person.available)

  const handleInputChange = (field, value) => {
    setCustomerInfo(prev => ({
      ...prev,
      [field]: value
    }))
  }

  const validateForm = () => {
    if (!customerInfo.name.trim()) return false
    if (!customerInfo.phone.trim()) return false
    if (orderType === 'delivery' && !customerInfo.address.trim()) return false
    // if (orderType === 'delivery' && !selectedDeliveryPerson) return false
    return true
  }

  const handleSubmit = async () => {
    if (!validateForm()) {
      alert('Por favor, preencha todos os campos obrigatórios.')
      return
    }

    setIsSubmitting(true)

    try {
      // Criar o pedido
      const deliveryPerson = orderType === 'delivery' 
        ? state.deliveryPersons.find(p => p.id.toString() === selectedDeliveryPerson)
        : null

      const createdOrder = await createOrder({
        type: orderType,
        customerInfo,
        deliveryPerson,
        items: state.cart,
        total: getTotalCartValue(),
        status: 'em_preparo',
        paymentMethod,
        createdAt: new Date().toISOString(),
        estimatedTime: 30
      })

      // Preparar mensagem para WhatsApp
      const orderItems = state.cart.map(item => 
        `${item.quantity}x ${item.name} - R$ ${(item.price * item.quantity).toFixed(2)}`
      ).join('\n')

      const deliveryInfo = orderType === 'delivery' 
        ? `\n\n📍 *Endereço de Entrega:*\n${customerInfo.address}\n\n🚚 *Entregador:* ${deliveryPerson?.name}`
        : '\n\n🏪 *Retirada no Balcão*'

      const observations = customerInfo.observations 
        ? `\n\n📝 *Observações:*\n${customerInfo.observations}`
        : ''

      const message = `🍔 *NOVO PEDIDO - DIVINO SABOR*

👤 *Cliente:* ${customerInfo.name}
📱 *Telefone:* ${customerInfo.phone}

🛒 *Itens do Pedido:*
${orderItems}

💰 *Total:* R$ ${getTotalCartValue().toFixed(2)}${deliveryInfo}${observations}

⏰ *Horário do Pedido:* ${new Date().toLocaleString('pt-BR')}`

      // Abrir WhatsApp
      const whatsappUrl = `https://wa.me/5545988046464?text=${encodeURIComponent(message)}`
      window.open(whatsappUrl, '_blank')

      // Resetar formulário e fechar modal
      setCustomerInfo({
        name: '',
        phone: '',
        address: '',
        observations: ''
      })
      setSelectedDeliveryPerson('')
      onClose()

      // Mostrar confirmação
      alert('Pedido criado com sucesso! Você será redirecionado para o WhatsApp.')

    } catch (error) {
      console.error('Erro ao criar pedido:', error)
      alert('Erro ao criar pedido. Tente novamente.')
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[500px] max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <MessageSquare className="h-5 w-5 text-primary" />
            Finalizar Pedido
          </DialogTitle>
          <DialogDescription>
            Preencha os dados para enviar seu pedido via WhatsApp
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-6">
          {/* Resumo do Pedido */}
          <div className="bg-muted/50 p-4 rounded-lg">
            <h3 className="font-semibold mb-3">Resumo do Pedido</h3>
            <div className="space-y-2 text-sm">
              {state.cart.map((item) => (
                <div key={item.id} className="flex justify-between">
                  <span>{item.quantity}x {item.name}</span>
                  <span>R$ {(item.price * item.quantity).toFixed(2)}</span>
                </div>
              ))}
            </div>
            <Separator className="my-3" />
            <div className="flex justify-between font-semibold">
              <span>Total ({getTotalCartItems()} itens):</span>
              <span>R$ {getTotalCartValue().toFixed(2)}</span>
            </div>
          </div>

          {/* Tipo de Pedido */}
          <div>
            <Label className="text-base font-semibold">Tipo de Pedido</Label>
            <RadioGroup value={orderType} onValueChange={setOrderType} className="mt-2">
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="delivery" id="delivery" />
                <Label htmlFor="delivery">Delivery</Label>
              </div>
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="balcao" id="balcao" />
                <Label htmlFor="balcao">Retirar no Balcão</Label>
              </div>
            </RadioGroup>
          </div>

          {/* Dados do Cliente */}
          <div className="space-y-4">
            <Label className="text-base font-semibold">Dados do Cliente</Label>
            
            <div className="space-y-2">
              <Label htmlFor="name" className="flex items-center gap-2">
                <User className="h-4 w-4" />
                Nome Completo *
              </Label>
              <Input
                id="name"
                value={customerInfo.name}
                onChange={(e) => handleInputChange('name', e.target.value)}
                placeholder="Digite seu nome completo"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="phone" className="flex items-center gap-2">
                <Phone className="h-4 w-4" />
                Telefone/WhatsApp *
              </Label>
              <Input
                id="phone"
                value={customerInfo.phone}
                onChange={(e) => handleInputChange('phone', e.target.value)}
                placeholder="(45) 99999-9999"
              />
            </div>

            {orderType === 'delivery' && (
              <>
                <div className="space-y-2">
                  <Label htmlFor="address" className="flex items-center gap-2">
                    <MapPin className="h-4 w-4" />
                    Endereço Completo *
                  </Label>
                  <Textarea
                    id="address"
                    value={customerInfo.address}
                    onChange={(e) => handleInputChange('address', e.target.value)}
                    placeholder="Rua, número, bairro, pontos de referência..."
                    rows={3}
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="delivery-person">Entregador *</Label>
                  <Select value={selectedDeliveryPerson} onValueChange={setSelectedDeliveryPerson}>
                    <SelectTrigger>
                      <SelectValue placeholder="Selecione um entregador" />
                    </SelectTrigger>
                    <SelectContent>
                      {availableDeliveryPersons.map((person) => (
                        <SelectItem key={person.id} value={person.id.toString()}>
                          {person.name} - {person.phone}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  {availableDeliveryPersons.length === 0 && (
                    <p className="text-sm text-muted-foreground">
                      Nenhum entregador disponível no momento
                    </p>
                  )}
                </div>
              </>
            )}

            <div className="space-y-2">
              <Label htmlFor="observations">Observações</Label>
              <Textarea
                id="observations"
                value={customerInfo.observations}
                onChange={(e) => handleInputChange("observations", e.target.value)}
                placeholder="Alguma observação especial sobre o pedido..."
                rows={2}
              />
            </div>
          </div>

          {/* Forma de Pagamento */}
          <div>
            <Label className="text-base font-semibold">Forma de Pagamento</Label>
            <RadioGroup value={paymentMethod} onValueChange={setPaymentMethod} className="mt-2 grid grid-cols-1 sm:grid-cols-3 gap-2">
              <div className="flex items-center space-x-2 border p-3 rounded-md">
                <RadioGroupItem value="dinheiro" id="dinheiro" />
                <Label htmlFor="dinheiro" className="flex items-center gap-2">
                  <DollarSign className="h-4 w-4" /> Dinheiro
                </Label>
              </div>
              <div className="flex items-center space-x-2 border p-3 rounded-md">
                <RadioGroupItem value="cartao" id="cartao" />
                <Label htmlFor="cartao" className="flex items-center gap-2">
                  <CreditCard className="h-4 w-4" /> Cartão
                </Label>
              </div>
              <div className="flex items-center space-x-2 border p-3 rounded-md">
                <RadioGroupItem value="pix" id="pix" />
                <Label htmlFor="pix" className="flex items-center gap-2">
                  <QrCode className="h-4 w-4" /> Pix
                </Label>
              </div>
            </RadioGroup>
          </div>
        </div>

        <DialogFooter className="gap-2">
          <Button variant="outline" onClick={onClose}>
            Cancelar
          </Button>
          <Button 
            onClick={handleSubmit}
            disabled={!validateForm() || isSubmitting}
            className="divino-gradient hover:opacity-90 text-white"
          >
            {isSubmitting ? 'Enviando...' : 'Enviar via WhatsApp'}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}

export default OrderModal
