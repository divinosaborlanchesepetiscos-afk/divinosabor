import { useState } from 'react'
import { useApp } from '../hooks/useApp'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group'
import { Separator } from '@/components/ui/separator'
import { Badge } from '@/components/ui/badge'
import { 
  Dialog, 
  DialogContent, 
  DialogDescription, 
  DialogHeader, 
  DialogTitle, 
  DialogTrigger 
} from '@/components/ui/dialog'
import { 
  ShoppingCart, 
  CreditCard, 
  Banknote, 
  MapPin, 
  Phone, 
  User, 
  CheckCircle,
  X
} from 'lucide-react'
import { motion } from 'framer-motion'

const Checkout = ({ isOpen, onClose }) => {
  const { state, getTotalCartValue, createOrder, dispatch } = useApp()
  const [customerInfo, setCustomerInfo] = useState({
    name: '',
    phone: '',
    address: '',
    observations: ''
  })
  const [paymentMethod, setPaymentMethod] = useState('dinheiro')
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [orderSuccess, setOrderSuccess] = useState(false)

  const handleInputChange = (field, value) => {
    setCustomerInfo(prev => ({
      ...prev,
      [field]: value
    }))
  }

  const handleSubmitOrder = async () => {
    if (!customerInfo.name || !customerInfo.phone || !customerInfo.address) {
      alert('Por favor, preencha todos os campos obrigatórios.')
      return
    }

    if (state.cart.length === 0) {
      alert('Seu carrinho está vazio.')
      return
    }

    setIsSubmitting(true)

    try {
      const orderData = {
        customer_name: customerInfo.name,
        customer_phone: customerInfo.phone,
        customer_address: customerInfo.address,
        observations: customerInfo.observations,
        items: state.cart,
        total: getTotalCartValue(),
        paymentMethod: paymentMethod,
        status: 'pendente'
      }

      const result = await createOrder(orderData)
      
      if (result) {
        setOrderSuccess(true)
        // Limpar formulário
        setCustomerInfo({
          name: '',
          phone: '',
          address: '',
          observations: ''
        })
        setPaymentMethod('dinheiro')
        
        // Fechar modal após 3 segundos
        setTimeout(() => {
          setOrderSuccess(false)
          onClose()
        }, 3000)
      }
    } catch (error) {
      console.error('Erro ao criar pedido:', error)
      alert('Erro ao finalizar pedido. Tente novamente.')
    } finally {
      setIsSubmitting(false)
    }
  }

  const formatPhone = (value) => {
    // Remove tudo que não é número
    const numbers = value.replace(/\D/g, '')
    
    // Aplica a máscara (XX) XXXXX-XXXX
    if (numbers.length <= 11) {
      return numbers.replace(/(\d{2})(\d{5})(\d{4})/, '($1) $2-$3')
    }
    return value
  }

  if (orderSuccess) {
    return (
      <Dialog open={isOpen} onOpenChange={onClose}>
        <DialogContent className="sm:max-w-md">
          <div className="text-center space-y-4 py-8">
            <motion.div
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ type: "spring", duration: 0.5 }}
            >
              <CheckCircle className="h-16 w-16 text-green-500 mx-auto" />
            </motion.div>
            <div>
              <h3 className="text-lg font-semibold">Pedido Realizado com Sucesso!</h3>
              <p className="text-muted-foreground">
                Seu pedido foi enviado e será preparado em breve.
              </p>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    )
  }

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <ShoppingCart className="h-5 w-5" />
            Finalizar Pedido
          </DialogTitle>
          <DialogDescription>
            Preencha seus dados para finalizar o pedido
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-6">
          {/* Resumo do Pedido */}
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Resumo do Pedido</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {state.cart.map((item) => (
                  <div key={item.id} className="flex justify-between items-center">
                    <div className="flex-1">
                      <p className="font-medium">{item.name}</p>
                      <p className="text-sm text-muted-foreground">
                        R$ {item.price.toFixed(2)} x {item.quantity}
                      </p>
                    </div>
                    <Badge variant="secondary">
                      R$ {(item.price * item.quantity).toFixed(2)}
                    </Badge>
                  </div>
                ))}
                <Separator />
                <div className="flex justify-between items-center font-semibold text-lg">
                  <span>Total:</span>
                  <span className="text-primary">R$ {getTotalCartValue().toFixed(2)}</span>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Dados do Cliente */}
          <Card>
            <CardHeader>
              <CardTitle className="text-lg flex items-center gap-2">
                <User className="h-5 w-5" />
                Dados do Cliente
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="name">Nome Completo *</Label>
                  <Input
                    id="name"
                    placeholder="Seu nome completo"
                    value={customerInfo.name}
                    onChange={(e) => handleInputChange('name', e.target.value)}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="phone">Telefone *</Label>
                  <Input
                    id="phone"
                    placeholder="(XX) XXXXX-XXXX"
                    value={customerInfo.phone}
                    onChange={(e) => handleInputChange('phone', formatPhone(e.target.value))}
                    maxLength={15}
                  />
                </div>
              </div>
              <div className="space-y-2">
                <Label htmlFor="address" className="flex items-center gap-2">
                  <MapPin className="h-4 w-4" />
                  Endereço de Entrega *
                </Label>
                <Textarea
                  id="address"
                  placeholder="Rua, número, bairro, cidade..."
                  value={customerInfo.address}
                  onChange={(e) => handleInputChange('address', e.target.value)}
                  rows={3}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="observations">Observações</Label>
                <Textarea
                  id="observations"
                  placeholder="Alguma observação especial para o pedido..."
                  value={customerInfo.observations}
                  onChange={(e) => handleInputChange('observations', e.target.value)}
                  rows={2}
                />
              </div>
            </CardContent>
          </Card>

          {/* Forma de Pagamento */}
          <Card>
            <CardHeader>
              <CardTitle className="text-lg flex items-center gap-2">
                <CreditCard className="h-5 w-5" />
                Forma de Pagamento
              </CardTitle>
            </CardHeader>
            <CardContent>
              <RadioGroup value={paymentMethod} onValueChange={setPaymentMethod}>
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="dinheiro" id="dinheiro" />
                  <Label htmlFor="dinheiro" className="flex items-center gap-2 cursor-pointer">
                    <Banknote className="h-4 w-4" />
                    Dinheiro
                  </Label>
                </div>
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="cartao" id="cartao" />
                  <Label htmlFor="cartao" className="flex items-center gap-2 cursor-pointer">
                    <CreditCard className="h-4 w-4" />
                    Cartão (Débito/Crédito)
                  </Label>
                </div>
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="pix" id="pix" />
                  <Label htmlFor="pix" className="flex items-center gap-2 cursor-pointer">
                    <Phone className="h-4 w-4" />
                    PIX
                  </Label>
                </div>
              </RadioGroup>
            </CardContent>
          </Card>

          {/* Botões de Ação */}
          <div className="flex gap-3">
            <Button variant="outline" onClick={onClose} className="flex-1">
              Cancelar
            </Button>
            <Button 
              onClick={handleSubmitOrder} 
              disabled={isSubmitting}
              className="flex-1"
            >
              {isSubmitting ? 'Finalizando...' : 'Confirmar Pedido'}
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  )
}

export default Checkout
