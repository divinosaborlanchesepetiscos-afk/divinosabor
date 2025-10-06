import { useState } from 'react'
import { useApp } from '../../contexts/AppContext'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import { Switch } from '@/components/ui/switch'
import { Separator } from '@/components/ui/separator'
import { Badge } from '@/components/ui/badge'
import { 
  Settings as SettingsIcon, 
  Save, 
  Download, 
  Upload, 
  Trash2,
  AlertTriangle,
  Phone,
  MapPin,
  Clock,
  DollarSign
} from 'lucide-react'
import { motion } from 'framer-motion'

const Settings = () => {
  const { state, dispatch } = useApp()
  const [settings, setSettings] = useState({
    restaurantName: 'Divino Sabor',
    phone: '(45) 98804-6464',
    address: 'Rua Barbacena, 333 - Parque Imperatriz, Foz do Iguaçu - PR',
    deliveryFee: 5.00,
    minDeliveryValue: 15.00,
    estimatedTime: 30,
    workingHours: {
      start: '18:00',
      end: '23:30'
    },
    autoAcceptOrders: false,
    soundNotifications: true,
    emailNotifications: false,
    whatsappMessage: 'Olá! Obrigado pelo seu pedido. Estamos preparando com carinho!'
  })

  const handleSettingChange = (key, value) => {
    if (key.includes('.')) {
      const [parent, child] = key.split('.')
      setSettings(prev => ({
        ...prev,
        [parent]: {
          ...prev[parent],
          [child]: value
        }
      }))
    } else {
      setSettings(prev => ({
        ...prev,
        [key]: value
      }))
    }
  }

  const saveSettings = () => {
    localStorage.setItem('divino-sabor-settings', JSON.stringify(settings))
    alert('Configurações salvas com sucesso!')
  }

  const exportData = () => {
    const data = {
      products: state.products,
      orders: state.orders,
      deliveryPersons: state.deliveryPersons,
      settings: settings,
      exportDate: new Date().toISOString()
    }

    const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' })
    const url = URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = `divino-sabor-backup-${new Date().toISOString().split('T')[0]}.json`
    document.body.appendChild(a)
    a.click()
    document.body.removeChild(a)
    URL.revokeObjectURL(url)
  }

  const importData = (event) => {
    const file = event.target.files[0]
    if (!file) return

    const reader = new FileReader()
    reader.onload = (e) => {
      try {
        const data = JSON.parse(e.target.result)
        
        if (confirm('Isso irá substituir todos os dados atuais. Tem certeza?')) {
          if (data.products) {
            data.products.forEach(product => {
              dispatch({ type: 'ADD_PRODUCT', payload: product })
            })
          }
          
          if (data.deliveryPersons) {
            data.deliveryPersons.forEach(person => {
              dispatch({ type: 'ADD_DELIVERY_PERSON', payload: person })
            })
          }
          
          if (data.settings) {
            setSettings(data.settings)
          }
          
          alert('Dados importados com sucesso!')
        }
      } catch (error) {
        alert('Erro ao importar dados. Verifique se o arquivo está correto.')
      }
    }
    reader.readAsText(file)
  }

  const clearAllData = () => {
    if (confirm('ATENÇÃO: Isso irá apagar TODOS os dados (pedidos, produtos, entregadores). Esta ação não pode ser desfeita. Tem certeza?')) {
      if (confirm('Última confirmação: Todos os dados serão perdidos permanentemente!')) {
        localStorage.removeItem('divino-sabor-state')
        localStorage.removeItem('divino-sabor-settings')
        window.location.reload()
      }
    }
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
          <h2 className="text-2xl font-bold">Configurações do Sistema</h2>
          <p className="text-muted-foreground">
            Gerencie as configurações gerais da lanchonete
          </p>
        </div>
        
        <Button 
          onClick={saveSettings}
          className="divino-gradient hover:opacity-90 text-white"
        >
          <Save className="h-4 w-4 mr-2" />
          Salvar Configurações
        </Button>
      </motion.div>

      <div className="grid lg:grid-cols-2 gap-6">
        {/* Informações da Lanchonete */}
        <motion.div variants={itemVariants}>
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <SettingsIcon className="h-5 w-5" />
                Informações da Lanchonete
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="restaurantName">Nome da Lanchonete</Label>
                <Input
                  id="restaurantName"
                  value={settings.restaurantName}
                  onChange={(e) => handleSettingChange('restaurantName', e.target.value)}
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="phone" className="flex items-center gap-2">
                  <Phone className="h-4 w-4" />
                  Telefone/WhatsApp
                </Label>
                <Input
                  id="phone"
                  value={settings.phone}
                  onChange={(e) => handleSettingChange('phone', e.target.value)}
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="address" className="flex items-center gap-2">
                  <MapPin className="h-4 w-4" />
                  Endereço Completo
                </Label>
                <Textarea
                  id="address"
                  value={settings.address}
                  onChange={(e) => handleSettingChange('address', e.target.value)}
                  rows={3}
                />
              </div>
            </CardContent>
          </Card>
        </motion.div>

        {/* Configurações de Delivery */}
        <motion.div variants={itemVariants}>
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <DollarSign className="h-5 w-5" />
                Configurações de Delivery
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="deliveryFee">Taxa de Entrega (R$)</Label>
                <Input
                  id="deliveryFee"
                  type="number"
                  step="0.01"
                  min="0"
                  value={settings.deliveryFee}
                  onChange={(e) => handleSettingChange('deliveryFee', parseFloat(e.target.value) || 0)}
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="minDeliveryValue">Valor Mínimo para Delivery (R$)</Label>
                <Input
                  id="minDeliveryValue"
                  type="number"
                  step="0.01"
                  min="0"
                  value={settings.minDeliveryValue}
                  onChange={(e) => handleSettingChange('minDeliveryValue', parseFloat(e.target.value) || 0)}
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="estimatedTime" className="flex items-center gap-2">
                  <Clock className="h-4 w-4" />
                  Tempo Estimado de Preparo (minutos)
                </Label>
                <Input
                  id="estimatedTime"
                  type="number"
                  min="1"
                  value={settings.estimatedTime}
                  onChange={(e) => handleSettingChange('estimatedTime', parseInt(e.target.value) || 30)}
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="workingStart">Horário de Abertura</Label>
                  <Input
                    id="workingStart"
                    type="time"
                    value={settings.workingHours.start}
                    onChange={(e) => handleSettingChange('workingHours.start', e.target.value)}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="workingEnd">Horário de Fechamento</Label>
                  <Input
                    id="workingEnd"
                    type="time"
                    value={settings.workingHours.end}
                    onChange={(e) => handleSettingChange('workingHours.end', e.target.value)}
                  />
                </div>
              </div>
            </CardContent>
          </Card>
        </motion.div>

        {/* Configurações de Notificações */}
        <motion.div variants={itemVariants}>
          <Card>
            <CardHeader>
              <CardTitle>Notificações</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <Label htmlFor="autoAccept">Aceitar Pedidos Automaticamente</Label>
                  <p className="text-sm text-muted-foreground">
                    Novos pedidos serão aceitos automaticamente
                  </p>
                </div>
                <Switch
                  id="autoAccept"
                  checked={settings.autoAcceptOrders}
                  onCheckedChange={(checked) => handleSettingChange('autoAcceptOrders', checked)}
                />
              </div>

              <Separator />

              <div className="flex items-center justify-between">
                <div>
                  <Label htmlFor="soundNotif">Notificações Sonoras</Label>
                  <p className="text-sm text-muted-foreground">
                    Reproduzir som ao receber novos pedidos
                  </p>
                </div>
                <Switch
                  id="soundNotif"
                  checked={settings.soundNotifications}
                  onCheckedChange={(checked) => handleSettingChange('soundNotifications', checked)}
                />
              </div>

              <div className="flex items-center justify-between">
                <div>
                  <Label htmlFor="emailNotif">Notificações por Email</Label>
                  <p className="text-sm text-muted-foreground">
                    Receber resumo diário por email
                  </p>
                </div>
                <Switch
                  id="emailNotif"
                  checked={settings.emailNotifications}
                  onCheckedChange={(checked) => handleSettingChange('emailNotifications', checked)}
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="whatsappMessage">Mensagem Automática WhatsApp</Label>
                <Textarea
                  id="whatsappMessage"
                  value={settings.whatsappMessage}
                  onChange={(e) => handleSettingChange('whatsappMessage', e.target.value)}
                  rows={3}
                  placeholder="Mensagem enviada automaticamente após receber pedidos"
                />
              </div>
            </CardContent>
          </Card>
        </motion.div>

        {/* Backup e Dados */}
        <motion.div variants={itemVariants}>
          <Card>
            <CardHeader>
              <CardTitle>Backup e Dados</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <h4 className="font-medium">Estatísticas do Sistema</h4>
                <div className="grid grid-cols-2 gap-4 text-sm">
                  <div className="flex justify-between">
                    <span>Produtos:</span>
                    <Badge variant="outline">{state.products.length}</Badge>
                  </div>
                  <div className="flex justify-between">
                    <span>Pedidos:</span>
                    <Badge variant="outline">{state.orders.length}</Badge>
                  </div>
                  <div className="flex justify-between">
                    <span>Entregadores:</span>
                    <Badge variant="outline">{state.deliveryPersons.length}</Badge>
                  </div>
                  <div className="flex justify-between">
                    <span>Faturamento Total:</span>
                    <Badge variant="outline">
                      R$ {state.orders.reduce((sum, order) => sum + order.total, 0).toFixed(2)}
                    </Badge>
                  </div>
                </div>
              </div>

              <Separator />

              <div className="space-y-3">
                <Button
                  onClick={exportData}
                  variant="outline"
                  className="w-full"
                >
                  <Download className="h-4 w-4 mr-2" />
                  Exportar Dados (Backup)
                </Button>

                <div>
                  <input
                    type="file"
                    accept=".json"
                    onChange={importData}
                    className="hidden"
                    id="import-file"
                  />
                  <Button
                    onClick={() => document.getElementById('import-file').click()}
                    variant="outline"
                    className="w-full"
                  >
                    <Upload className="h-4 w-4 mr-2" />
                    Importar Dados
                  </Button>
                </div>

                <Button
                  onClick={clearAllData}
                  variant="destructive"
                  className="w-full"
                >
                  <Trash2 className="h-4 w-4 mr-2" />
                  Limpar Todos os Dados
                </Button>
                
                <div className="flex items-start gap-2 p-3 bg-destructive/10 border border-destructive/20 rounded-lg">
                  <AlertTriangle className="h-4 w-4 text-destructive mt-0.5" />
                  <div className="text-sm">
                    <p className="font-medium text-destructive">Atenção!</p>
                    <p className="text-muted-foreground">
                      A ação de limpar dados é irreversível. Faça backup antes.
                    </p>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </motion.div>
      </div>
    </motion.div>
  )
}

export default Settings
