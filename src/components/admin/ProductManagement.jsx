import React, { useState } from 'react'
import { useApp } from '../../hooks/useApp'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Switch } from '@/components/ui/switch'
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog'
import { Plus, Edit, Trash2, Upload, X } from 'lucide-react'
import { supabase } from '../../lib/supabase'

const categories = [
  { id: 'espetinhos', name: 'Espetinhos' },
  { id: 'porcoes', name: 'Porções' },
  { id: 'pasteis', name: 'Pastéis' },
  { id: 'cervejas', name: 'Cervejas' },
  { id: 'bebidas', name: 'Bebidas' },
  { id: 'x-gaucho', name: 'X Gaúcho' },
]

const ProductForm = ({ product, onClose }) => {
  const { addProduct, updateProduct } = useApp()
  const [formData, setFormData] = useState({
    name: product?.name || '',
    description: product?.description || '',
    price: product?.price || 0,
    category: product?.category || categories[0].id,
    available: product?.available ?? true,
    imageFile: null,
    imagePath: product?.image || '',
  })
  const [loading, setLoading] = useState(false)

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value,
    }))
  }

  const handleSelectChange = (value) => {
    setFormData(prev => ({ ...prev, category: value }))
  }

  const handleSwitchChange = (checked) => {
    setFormData(prev => ({ ...prev, available: checked }))
  }

  const handleFileChange = (e) => {
    setFormData(prev => ({ ...prev, imageFile: e.target.files[0] }))
  }

  const uploadImage = async (file) => {
    if (!file) return formData.imagePath

    const fileExt = file.name.split('.').pop()
    const fileName = `${Date.now()}.${fileExt}`
    const filePath = `${fileName}`

    const { error: uploadError } = await supabase.storage
      .from('menu-images')
      .upload(filePath, file)

    if (uploadError) {
      throw uploadError
    }

    return filePath
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setLoading(true)

    try {
      let imagePath = formData.imagePath
      if (formData.imageFile) {
        imagePath = await uploadImage(formData.imageFile)
      }

      const productData = {
        name: formData.name,
        description: formData.description,
        price: parseFloat(formData.price),
        category: formData.category,
        available: formData.available,
        image: imagePath,
      }

      if (product) {
        await updateProduct({ ...productData, id: product.id })
      } else {
        await addProduct(productData)
      }

      onClose()
    } catch (error) {
      console.error('Erro ao salvar produto:', error)
      alert('Erro ao salvar produto: ' + error.message)
    } finally {
      setLoading(false)
    }
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div className="grid grid-cols-2 gap-4">
        <div className="space-y-2">
          <Label htmlFor="name">Nome</Label>
          <Input
            id="name"
            name="name"
            value={formData.name}
            onChange={handleChange}
            required
          />
        </div>
        <div className="space-y-2">
          <Label htmlFor="price">Preço (R$)</Label>
          <Input
            id="price"
            name="price"
            type="number"
            step="0.01"
            value={formData.price}
            onChange={handleChange}
            required
          />
        </div>
      </div>

      <div className="space-y-2">
        <Label htmlFor="description">Descrição</Label>
        <Textarea
          id="description"
          name="description"
          value={formData.description}
          onChange={handleChange}
          required
        />
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div className="space-y-2">
          <Label htmlFor="category">Categoria</Label>
          <Select name="category" value={formData.category} onValueChange={handleSelectChange}>
            <SelectTrigger>
              <SelectValue placeholder="Selecione a categoria" />
            </SelectTrigger>
            <SelectContent>
              {categories.map(cat => (
                <SelectItem key={cat.id} value={cat.id}>{cat.name}</SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
        <div className="flex items-center space-x-2 pt-6">
          <Switch
            id="available"
            checked={formData.available}
            onCheckedChange={handleSwitchChange}
          />
          <Label htmlFor="available">Disponível</Label>
        </div>
      </div>

      <div className="space-y-2">
        <Label htmlFor="image">Imagem</Label>
        <Input
          id="image"
          name="image"
          type="file"
          accept="image/*"
          onChange={handleFileChange}
        />
        {formData.imagePath && (
          <div className="mt-2 flex items-center space-x-2">
            <img src={formData.imagePath} alt="Imagem Atual" className="w-16 h-16 object-cover rounded" />
            <p className="text-sm text-muted-foreground">Imagem atual carregada.</p>
          </div>
        )}
      </div>

      <Button type="submit" className="w-full" disabled={loading}>
        {loading ? 'Salvando...' : product ? 'Salvar Alterações' : 'Adicionar Produto'}
      </Button>
    </form>
  )
}

const ProductManagement = () => {
  const { state, deleteProduct } = useApp()
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [selectedProduct, setSelectedProduct] = useState(null)

  const handleEdit = (product) => {
    setSelectedProduct(product)
    setIsModalOpen(true)
  }

  const handleAdd = () => {
    setSelectedProduct(null)
    setIsModalOpen(true)
  }

  const handleDelete = (productId) => {
    if (confirm('Tem certeza que deseja deletar este produto?')) {
      deleteProduct(productId)
    }
  }

  const handleCloseModal = () => {
    setIsModalOpen(false)
    setSelectedProduct(null)
  }

  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between">
        <CardTitle>Gerenciamento de Produtos</CardTitle>
        <Dialog open={isModalOpen} onOpenChange={setIsModalOpen}>
          <DialogTrigger asChild>
            <Button onClick={handleAdd}>
              <Plus className="h-4 w-4 mr-2" />
              Adicionar Produto
            </Button>
          </DialogTrigger>
          <DialogContent className="sm:max-w-[425px]">
            <DialogHeader>
              <DialogTitle>{selectedProduct ? 'Editar Produto' : 'Adicionar Novo Produto'}</DialogTitle>
            </DialogHeader>
            <ProductForm product={selectedProduct} onClose={handleCloseModal} />
          </DialogContent>
        </Dialog>
      </CardHeader>
      <CardContent>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Imagem</TableHead>
              <TableHead>Nome</TableHead>
              <TableHead>Categoria</TableHead>
              <TableHead>Preço</TableHead>
              <TableHead>Disponível</TableHead>
              <TableHead className="text-right">Ações</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {state.products.map(product => (
              <TableRow key={product.id}>
                <TableCell>
                  <img 
                    src={product.image || '/api/placeholder/50/50'} 
                    alt={product.name} 
                    className="w-10 h-10 object-cover rounded"
                  />
                </TableCell>
                <TableCell className="font-medium">{product.name}</TableCell>
                <TableCell>{categories.find(c => c.id === product.category)?.name || 'N/A'}</TableCell>
                <TableCell>R$ {product.price.toFixed(2)}</TableCell>
                <TableCell>{product.available ? 'Sim' : 'Não'}</TableCell>
                <TableCell className="text-right">
                  <Button variant="ghost" size="icon" onClick={() => handleEdit(product)}>
                    <Edit className="h-4 w-4" />
                  </Button>
                  <Button variant="ghost" size="icon" onClick={() => handleDelete(product.id)}>
                    <Trash2 className="h-4 w-4 text-red-500" />
                  </Button>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </CardContent>
    </Card>
  )
}

export default ProductManagement
