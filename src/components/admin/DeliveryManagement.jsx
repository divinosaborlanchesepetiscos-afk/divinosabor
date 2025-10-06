import { useState } from 'react'
import { useApp } from '../../contexts/AppContext'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Switch } from '@/components/ui/switch'
import { Badge } from '@/components/ui/badge'
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog'
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table'
import { Plus, Edit, Trash2, Save, X, User, Phone, Truck } from 'lucide-react'
import { motion } from 'framer-motion'

const DeliveryManagement = () => {
  const { state, addDeliveryPerson, updateDeliveryPerson, deleteDeliveryPerson } = useApp()
  const [isAddModalOpen, setIsAddModalOpen] = useState(false)
  const [editingPerson, setEditingPerson] = useState(null)
  const [formData, setFormData] = useState({
    name: '',
    phone: '',
    available: true
  })

  const resetForm = () => {
    setFormData({
      name: '',
      phone: '',
      available: true
    })
    setEditingPerson(null)
  }

  const handleInputChange = (field, value) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }))
  }

  const handleSubmit = (e) => {
    e.preventDefault()
    
    if (!formData.name.trim() || !formData.phone.trim()) {
      alert('Por favor, preencha todos os campos obrigatórios.')
      return
    }

    if (editingPerson) {
      await updateDeliveryPerson({ ...formData, id: editingPerson.id })
    } else {
      await addDeliveryPerson(formData)
    }

    resetForm()
    setIsAddModalOpen(false)
  }

  const handleEdit = (person) => {
    setEditingPerson(person)
    setFormData({
      name: person.name,
      phone: person.phone,
      available: person.available
    })
    setIsAddModalOpen(true)
  }

  const handleDelete = async (personId) => {
    if (confirm("Tem certeza que deseja excluir este entregador?")) {
      await deleteDeliveryPerson(personId)
    }
  }

  const toggleAvailability = async (person) => {
    await updateDeliveryPerson({ ...person, available: !person.available })
  }

  const getActiveDeliveries = (personId) => {
    return state.orders.filter(order => 
      order.deliveryPerson?.id === personId && 
      (order.status === 'saiu_entrega' || order.status === 'pronto')
    ).length
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
      {/* Header com botão de adicionar */}
      <motion.div variants={itemVariants} className="flex justify-between items-center">
        <div>
          <h2 className="text-2xl font-bold">Gerenciar Entregadores</h2>
          <p className="text-muted-foreground">
            Cadastre e gerencie a equipe de entregadores
          </p>
        </div>
        
        <Dialog open={isAddModalOpen} onOpenChange={setIsAddModalOpen}>
          <DialogTrigger asChild>
            <Button 
              className="divino-gradient hover:opacity-90 text-white"
              onClick={() => {
                resetForm()
                setIsAddModalOpen(true)
              }}
            >
              <Plus className="h-4 w-4 mr-2" />
              Adicionar Entregador
            </Button>
          </DialogTrigger>
          
          <DialogContent className="sm:max-w-[400px]">
            <DialogHeader>
              <DialogTitle>
                {editingPerson ? 'Editar Entregador' : 'Adicionar Novo Entregador'}
              </DialogTitle>
            </DialogHeader>
            
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="name" className="flex items-center gap-2">
                  <User className="h-4 w-4" />
                  Nome Completo *
                </Label>
                <Input
                  id="name"
                  value={formData.name}
                  onChange={(e) => handleInputChange('name', e.target.value)}
                  placeholder="Ex: João Silva"
                  required
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="phone" className="flex items-center gap-2">
                  <Phone className="h-4 w-4" />
                  Telefone/WhatsApp *
                </Label>
                <Input
                  id="phone"
                  value={formData.phone}
                  onChange={(e) => handleInputChange('phone', e.target.value)}
                  placeholder="(45) 99999-9999"
                  required
                />
              </div>

              <div className="flex items-center space-x-2">
                <Switch
                  id="available"
                  checked={formData.available}
                  onCheckedChange={(checked) => handleInputChange('available', checked)}
                />
                <Label htmlFor="available">Disponível para entregas</Label>
              </div>

              <div className="flex gap-2 pt-4">
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => {
                    resetForm()
                    setIsAddModalOpen(false)
                  }}
                  className="flex-1"
                >
                  <X className="h-4 w-4 mr-2" />
                  Cancelar
                </Button>
                <Button 
                  type="submit"
                  className="flex-1 divino-gradient hover:opacity-90 text-white"
                >
                  <Save className="h-4 w-4 mr-2" />
                  {editingPerson ? 'Atualizar' : 'Adicionar'}
                </Button>
              </div>
            </form>
          </DialogContent>
        </Dialog>
      </motion.div>

      {/* Estatísticas rápidas */}
      <motion.div variants={itemVariants}>
        <div className="grid md:grid-cols-3 gap-4">
          <Card>
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-muted-foreground">Total de Entregadores</p>
                  <p className="text-2xl font-bold">{state.deliveryPersons.length}</p>
                </div>
                <User className="h-8 w-8 text-primary" />
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-muted-foreground">Disponíveis</p>
                  <p className="text-2xl font-bold text-green-500">
                    {state.deliveryPersons.filter(p => p.available).length}
                  </p>
                </div>
                <Truck className="h-8 w-8 text-green-500" />
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-muted-foreground">Em Entrega</p>
                  <p className="text-2xl font-bold text-blue-500">
                    {state.orders.filter(order => order.status === 'saiu_entrega').length}
                  </p>
                </div>
                <Truck className="h-8 w-8 text-blue-500" />
              </div>
            </CardContent>
          </Card>
        </div>
      </motion.div>

      {/* Tabela de entregadores */}
      <motion.div variants={itemVariants}>
        <Card>
          <CardHeader>
            <CardTitle>Lista de Entregadores</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="overflow-x-auto">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Nome</TableHead>
                    <TableHead>Telefone</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead>Entregas Ativas</TableHead>
                    <TableHead>Ações</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {state.deliveryPersons.length === 0 ? (
                    <TableRow>
                      <TableCell colSpan={5} className="text-center py-8 text-muted-foreground">
                        Nenhum entregador cadastrado
                      </TableCell>
                    </TableRow>
                  ) : (
                    state.deliveryPersons.map((person) => {
                      const activeDeliveries = getActiveDeliveries(person.id)
                      
                      return (
                        <TableRow key={person.id}>
                          <TableCell>
                            <div className="flex items-center gap-2">
                              <div className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center">
                                <User className="h-4 w-4 text-primary" />
                              </div>
                              <span className="font-medium">{person.name}</span>
                            </div>
                          </TableCell>
                          <TableCell>
                            <div className="flex items-center gap-2">
                              <Phone className="h-4 w-4 text-muted-foreground" />
                              <span>{person.phone}</span>
                            </div>
                          </TableCell>
                          <TableCell>
                            <div className="flex items-center gap-2">
                              <Switch
                                checked={person.available}
                                onCheckedChange={() => toggleAvailability(person)}
                                size="sm"
                              />
                              <Badge 
                                variant={person.available ? "default" : "secondary"}
                                className={person.available ? "bg-green-500" : ""}
                              >
                                {person.available ? 'Disponível' : 'Indisponível'}
                              </Badge>
                            </div>
                          </TableCell>
                          <TableCell>
                            <div className="flex items-center gap-2">
                              <Truck className="h-4 w-4 text-muted-foreground" />
                              <span className={activeDeliveries > 0 ? "font-semibold text-blue-600" : ""}>
                                {activeDeliveries}
                              </span>
                            </div>
                          </TableCell>
                          <TableCell>
                            <div className="flex gap-2">
                              <Button
                                variant="outline"
                                size="icon"
                                onClick={() => handleEdit(person)}
                              >
                                <Edit className="h-4 w-4" />
                              </Button>
                              <Button
                                variant="outline"
                                size="icon"
                                onClick={() => handleDelete(person.id)}
                                className="text-destructive hover:text-destructive"
                                disabled={activeDeliveries > 0}
                              >
                                <Trash2 className="h-4 w-4" />
                              </Button>
                            </div>
                          </TableCell>
                        </TableRow>
                      )
                    })
                  )}
                </TableBody>
              </Table>
            </div>
          </CardContent>
        </Card>
      </motion.div>
    </motion.div>
  )
}

export default DeliveryManagement
