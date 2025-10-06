import { useEffect, useState } from 'react'
import { useApp } from '../contexts/AppContext'
import { Button } from '@/components/ui/button'
import { Card, CardContent } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Bell, BellOff, Volume2, VolumeX } from 'lucide-react'
import { motion, AnimatePresence } from 'framer-motion'

const NotificationSystem = () => {
  const { state } = useApp()
  const [lastOrderCount, setLastOrderCount] = useState(state.orders.length)
  const [notifications, setNotifications] = useState([])
  const [soundEnabled, setSoundEnabled] = useState(true)
  const [notificationsEnabled, setNotificationsEnabled] = useState(true)

  // Função para reproduzir som de notificação
  const playNotificationSound = () => {
    if (!soundEnabled) return
    
    try {
      // Criar um tom de notificação usando Web Audio API
      const audioContext = new (window.AudioContext || window.webkitAudioContext)()
      const oscillator = audioContext.createOscillator()
      const gainNode = audioContext.createGain()
      
      oscillator.connect(gainNode)
      gainNode.connect(audioContext.destination)
      
      oscillator.frequency.setValueAtTime(800, audioContext.currentTime)
      oscillator.frequency.setValueAtTime(600, audioContext.currentTime + 0.1)
      oscillator.frequency.setValueAtTime(800, audioContext.currentTime + 0.2)
      
      gainNode.gain.setValueAtTime(0.3, audioContext.currentTime)
      gainNode.gain.exponentialRampToValueAtTime(0.01, audioContext.currentTime + 0.3)
      
      oscillator.start(audioContext.currentTime)
      oscillator.stop(audioContext.currentTime + 0.3)
    } catch (error) {
      console.log('Erro ao reproduzir som:', error)
    }
  }

  // Função para mostrar notificação do navegador
  const showBrowserNotification = (order) => {
    if (!notificationsEnabled || !('Notification' in window)) return
    
    if (Notification.permission === 'granted') {
      const notification = new Notification('Novo Pedido - Divino Sabor', {
        body: `Pedido #${order.id} - R$ ${order.total.toFixed(2)}`,
        icon: '/favicon.ico',
        badge: '/favicon.ico',
        tag: `order-${order.id}`,
        requireInteraction: true
      })
      
      notification.onclick = () => {
        window.focus()
        notification.close()
      }
      
      setTimeout(() => notification.close(), 10000)
    }
  }

  // Função para adicionar notificação na interface
  const addNotification = (order) => {
    const notification = {
      id: Date.now(),
      orderId: order.id,
      message: `Novo pedido #${order.id} - R$ ${order.total.toFixed(2)}`,
      timestamp: new Date(),
      type: order.type
    }
    
    setNotifications(prev => [notification, ...prev.slice(0, 4)]) // Manter apenas 5 notificações
    
    // Remover notificação após 10 segundos
    setTimeout(() => {
      setNotifications(prev => prev.filter(n => n.id !== notification.id))
    }, 10000)
  }

  // Solicitar permissão para notificações
  const requestNotificationPermission = async () => {
    if (!('Notification' in window)) {
      alert('Este navegador não suporta notificações')
      return
    }
    
    if (Notification.permission === 'default') {
      const permission = await Notification.requestPermission()
      if (permission === 'granted') {
        setNotificationsEnabled(true)
      }
    }
  }

  // Monitorar novos pedidos
  useEffect(() => {
    if (state.orders.length > lastOrderCount) {
      const newOrders = state.orders.slice(lastOrderCount)
      
      newOrders.forEach(order => {
        playNotificationSound()
        showBrowserNotification(order)
        addNotification(order)
      })
    }
    
    setLastOrderCount(state.orders.length)
  }, [state.orders.length, lastOrderCount, soundEnabled, notificationsEnabled])

  // Inicializar permissões ao montar o componente
  useEffect(() => {
    if ('Notification' in window && Notification.permission === 'default') {
      requestNotificationPermission()
    }
  }, [])

  const removeNotification = (id) => {
    setNotifications(prev => prev.filter(n => n.id !== id))
  }

  return (
    <>
      {/* Controles de Notificação */}
      <div className="fixed top-20 right-4 z-40 flex gap-2">
        <Button
          variant="outline"
          size="icon"
          onClick={() => setSoundEnabled(!soundEnabled)}
          className={`${soundEnabled ? 'bg-green-50 border-green-200' : 'bg-red-50 border-red-200'}`}
          title={soundEnabled ? 'Desativar som' : 'Ativar som'}
        >
          {soundEnabled ? (
            <Volume2 className="h-4 w-4 text-green-600" />
          ) : (
            <VolumeX className="h-4 w-4 text-red-600" />
          )}
        </Button>
        
        <Button
          variant="outline"
          size="icon"
          onClick={() => {
            if (notificationsEnabled) {
              setNotificationsEnabled(false)
            } else {
              requestNotificationPermission()
            }
          }}
          className={`${notificationsEnabled ? 'bg-green-50 border-green-200' : 'bg-red-50 border-red-200'}`}
          title={notificationsEnabled ? 'Desativar notificações' : 'Ativar notificações'}
        >
          {notificationsEnabled ? (
            <Bell className="h-4 w-4 text-green-600" />
          ) : (
            <BellOff className="h-4 w-4 text-red-600" />
          )}
        </Button>
      </div>

      {/* Lista de Notificações */}
      <div className="fixed top-32 right-4 z-30 space-y-2 max-w-sm">
        <AnimatePresence>
          {notifications.map((notification) => (
            <motion.div
              key={notification.id}
              initial={{ opacity: 0, x: 300, scale: 0.8 }}
              animate={{ opacity: 1, x: 0, scale: 1 }}
              exit={{ opacity: 0, x: 300, scale: 0.8 }}
              transition={{ duration: 0.3 }}
            >
              <Card className="food-shadow border-l-4 border-l-primary">
                <CardContent className="p-4">
                  <div className="flex justify-between items-start">
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-1">
                        <Bell className="h-4 w-4 text-primary" />
                        <Badge variant="secondary" className="text-xs">
                          {notification.type === 'delivery' ? 'Delivery' : 'Balcão'}
                        </Badge>
                      </div>
                      <p className="text-sm font-medium">{notification.message}</p>
                      <p className="text-xs text-muted-foreground">
                        {notification.timestamp.toLocaleTimeString('pt-BR')}
                      </p>
                    </div>
                    <Button
                      variant="ghost"
                      size="icon"
                      className="h-6 w-6 text-muted-foreground hover:text-foreground"
                      onClick={() => removeNotification(notification.id)}
                    >
                      ×
                    </Button>
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          ))}
        </AnimatePresence>
      </div>
    </>
  )
}

export default NotificationSystem
