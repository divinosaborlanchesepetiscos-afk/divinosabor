import { useState } from 'react'
import { useApp } from '../../contexts/AppContext'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Switch } from '@/components/ui/switch'
import { Badge } from '@/components/ui/badge'
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog'
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table'
import { Plus, Edit, Trash2, Save, X } from 'lucide-react'
import { motion } from 'framer-motion'

const ProductManagement = () => {
  const { state, addProduct, updateProduct, deleteProduct } = useApp()
  const [isAddModalOpen, setIsAddModalOpen] = useState(false)
  const [editingProduct, setEditingProduct] = useState(null)
  const [formData, setFormData] = useState({
    name: '',
    category: 'cheese',
    price: '',
    description: '',
    available: true
  })

  const categories = [
    { id: 'cheese', name: 'Cheese Burgers' },
    { id: 'petiscos', name: 'Petiscos' },
    { id: 'espetinhos', name: 'Espetinhos' },
    { id: 'bebidas', name: 'Bebidas' }
  ]

  const resetForm = () => {
    setFormData({
      name: '',
      category: 'cheese',
      price: '',
      description: '',
      available: true
    })
    setEditingProduct(null)
  }

  const handleInputChange = (field, value) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }))
  }

  const handleSubmit = (e) => {
    e.preventDefault()
    
    if (!formData.name.trim() || !formData.price || !formData.description.trim()) {
      alert('Por favor, preencha todos os campos obrigatórios.')
      return
    }

    const productData = {
      ...formData,
      price: parseFloat(formData.price)
    }

    if (editingProduct) {
      await updateProduct({ ...productData, id: editingProduct.id })
    } else {
      await addProduct(productData)
    }

    resetForm()
    setIsAddModalOpen(false)
  }

  const handleEdit = (product) => {
    setEditingProduct(product)
    setFormData({
      name: product.name,
      category: product.category,
      price: product.price.toString(),
      description: product.description,
      available: product.available
    })
    setIsAddModalOpen(true)
  }

  const handleDelete = async (productId) => {
    if (confirm("Tem certeza que deseja excluir este produto?")) {
      await deleteProduct(productId)
    }
  }

  const toggleAvailability = async (product) => {
    await updateProduct({ ...product, available: !product.available })
  }

  const getCategoryName = (categoryId) => {
    return categories.find(cat => cat.id === categoryId)?.name || categoryId
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
          <h2 className="text-2xl font-bold">Gerenciar Produtos</h2>
          <p className="text-muted-foreground">
            Adicione, edite ou remova produtos do cardápio
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
              Adicionar Produto
            </Button>
          </DialogTrigger>
          
          <DialogContent className="sm:max-w-[500px]">
            <DialogHeader>
              <DialogTitle>
                {editingProduct ? 'Editar Produto' : 'Adicionar Novo Produto'}
              </DialogTitle>
            </DialogHeader>
            
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="name">Nome do Produto *</Label>
                <Input
                  id="name"
                  value={formData.name}
                  onChange={(e) => handleInputChange('name', e.target.value)}
                  placeholder="Ex: X-Bacon Divino"
                  required
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="category">Categoria *</Label>
                <Select value={formData.category} onValueChange={(value) => handleInputChange('category', value)}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {categories.map((category) => (
                      <SelectItem key={category.id} value={category.id}>
                        {category.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label htmlFor="price">Preço (R$) *</Label>
                <Input
                  id="price"
                  type="number"
                  step="0.01"
                  min="0"
                  value={formData.price}
                  onChange={(e) => handleInputChange('price', e.target.value)}
                  placeholder="0.00"
                  required
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="description">Descrição *</Label>
                <Textarea
                  id="description"
                  value={formData.description}
                  onChange={(e) => handleInputChange('description', e.target.value)}
                  placeholder="Descreva os ingredientes e características do produto..."
                  rows={3}
                  required
                />
              </div>

              <div className="flex items-center space-x-2">
                <Switch
                  id="available"
                  checked={formData.available}
                  onCheckedChange={(checked) => handleInputChange('available', checked)}
                />
                <Label htmlFor="available">Produto disponível</Label>
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
                  {editingProduct ? 'Atualizar' : 'Adicionar'}
                </Button>
              </div>
            </form>
          </DialogContent>
        </Dialog>
      </motion.div>

      {/* Estatísticas rápidas */}
      <motion.div variants={itemVariants}>
        <div className="grid md:grid-cols-4 gap-4">
          {categories.map((category) => {
            const categoryProducts = state.products.filter(p => p.category === category.id)
            const availableCount = categoryProducts.filter(p => p.available).length
            
            return (
              <Card key={category.id}>
                <CardContent className="p-4">
                  <div className="text-center">
                    <h3 className="font-semibold">{category.name}</h3>
                    <p className="text-2xl font-bold text-primary">
                      {availableCount}/{categoryProducts.length}
                    </p>
                    <p className="text-xs text-muted-foreground">disponíveis</p>
                  </div>
                </CardContent>
              </Card>
            )
          })}
        </div>
      </motion.div>

      {/* Tabela de produtos */}
      <motion.div variants={itemVariants}>
        <Card>
          <CardHeader>
            <CardTitle>Lista de Produtos</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="overflow-x-auto">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Nome</TableHead>
                    <TableHead>Categoria</TableHead>
                    <TableHead>Preço</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead>Ações</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {state.products.length === 0 ? (
                    <TableRow>
                      <TableCell colSpan={5} className="text-center py-8 text-muted-foreground">
                        Nenhum produto cadastrado
                      </TableCell>
                    </TableRow>
                  ) : (
                    state.products.map((product) => (
                      <TableRow key={product.id}>
                        <TableCell>
                          <div>
                            <p className="font-medium">{product.name}</p>
                            <p className="text-sm text-muted-foreground line-clamp-1">
                              {product.description}
                            </p>
                          </div>
                        </TableCell>
                        <TableCell>
                          <Badge variant="outline">
                            {getCategoryName(product.category)}
                          </Badge>
                        </TableCell>
                        <TableCell>
                          <span className="font-medium">
                            R$ {product.price.toFixed(2)}
                          </span>
                        </TableCell>
                        <TableCell>
                          <div className="flex items-center gap-2">
                            <Switch
                              checked={product.available}
                              onCheckedChange={() => toggleAvailability(product)}
                              size="sm"
                            />
                            <Badge 
                              variant={product.available ? "default" : "secondary"}
                              className={product.available ? "bg-green-500" : ""}
                            >
                              {product.available ? 'Disponível' : 'Indisponível'}
                            </Badge>
                          </div>
                        </TableCell>
                        <TableCell>
                          <div className="flex gap-2">
                            <Button
                              variant="outline"
                              size="icon"
                              onClick={() => handleEdit(product)}
                            >
                              <Edit className="h-4 w-4" />
                            </Button>
                            <Button
                              variant="outline"
                              size="icon"
                              onClick={() => handleDelete(product.id)}
                              className="text-destructive hover:text-destructive"
                            >
                              <Trash2 className="h-4 w-4" />
                            </Button>
                          </div>
                        </TableCell>
                      </TableRow>
                    ))
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

export default ProductManagement
