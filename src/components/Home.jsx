import { Link } from 'react-router-dom'
import { Button } from '@/components/ui/button'
import { Card, CardContent } from '@/components/ui/card'
import { Clock, Star, Truck } from 'lucide-react'
import { motion } from 'framer-motion'
import logoImage from '../assets/WhatsAppImage2025-10-05at19.58.33.jpeg'

const Home = () => {
  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-background to-primary/5">
      {/* Hero Section */}
      <section className="container mx-auto px-4 py-16 text-center">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          className="space-y-8"
        >
          {/* Logo */}
          <div className="flex justify-center">
            <div className="relative">
              <div className="absolute inset-0 bg-primary/20 rounded-full blur-xl animate-pulse"></div>
              <img 
                src={logoImage} 
                alt="Divino Sabor Logo" 
                className="relative h-32 w-32 rounded-full object-cover border-4 border-primary/20 shadow-2xl"
              />
            </div>
          </div>

          {/* Título Principal */}
          <div className="space-y-4">
            <h1 className="text-5xl md:text-7xl font-bold bg-gradient-to-r from-primary via-secondary to-primary bg-clip-text text-transparent">
              Divino Sabor
            </h1>
            <p className="text-xl md:text-2xl text-muted-foreground max-w-2xl mx-auto leading-relaxed">
              Experimente o melhor da culinária artesanal com nossos lanches, petiscos e espetinhos irresistíveis
            </p>
          </div>

          {/* Botões de Ação */}
          <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
            <Button asChild size="lg" className="text-lg px-8 py-6 shadow-lg hover:shadow-xl transition-all">
              <Link to="/menu">
                <span className="mr-2">🍽️</span>
                Ver Cardápio
              </Link>
            </Button>
            <Button asChild variant="outline" size="lg" className="text-lg px-8 py-6 shadow-lg hover:shadow-xl transition-all">
              <Link to="/status">
                <span className="mr-2">📋</span>
                Status do Pedido
              </Link>
            </Button>
          </div>
        </motion.div>
      </section>

      {/* Features Section */}
      <section className="container mx-auto px-4 py-16">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.2 }}
          className="text-center space-y-12"
        >
          <div className="space-y-4">
            <h2 className="text-3xl md:text-4xl font-bold">
              Por que escolher o <span className="text-primary">Divino Sabor</span>?
            </h2>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
              Tradição, qualidade e sabor em cada mordida
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            <Card className="p-6 text-center shadow-lg hover:shadow-xl transition-all">
              <CardContent className="pt-6">
                <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-primary/10 flex items-center justify-center">
                  <Star className="h-8 w-8 text-primary" />
                </div>
                <h3 className="text-xl font-semibold mb-3">Qualidade Premium</h3>
                <p className="text-muted-foreground">
                  Ingredientes frescos e selecionados para o melhor sabor.
                </p>
              </CardContent>
            </Card>

            <Card className="p-6 text-center shadow-lg hover:shadow-xl transition-all">
              <CardContent className="pt-6">
                <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-primary/10 flex items-center justify-center">
                  <Clock className="h-8 w-8 text-primary" />
                </div>
                <h3 className="text-xl font-semibold mb-3">Entrega Rápida</h3>
                <p className="text-muted-foreground">
                  Seu pedido entregue com agilidade e cuidado.
                </p>
              </CardContent>
            </Card>

            <Card className="p-6 text-center shadow-lg hover:shadow-xl transition-all">
              <CardContent className="pt-6">
                <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-primary/10 flex items-center justify-center">
                  <Truck className="h-8 w-8 text-primary" />
                </div>
                <h3 className="text-xl font-semibold mb-3">Delivery Confiável</h3>
                <p className="text-muted-foreground">
                  Acompanhe seu pedido em tempo real até a sua porta.
                </p>
              </CardContent>
            </Card>
          </div>
        </motion.div>
      </section>

      {/* Contact Section */}
      <section className="container mx-auto px-4 py-16 bg-muted/30">
        <div className="text-center space-y-4 mb-8">
          <h2 className="text-3xl md:text-4xl font-bold">
            Fale Conosco
          </h2>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            Estamos prontos para atender você.
          </p>
        </div>
        
        <div className="max-w-xl mx-auto space-y-6">
          <Card className="p-6 shadow-lg">
            <CardContent className="pt-6 space-y-4">
              <div className="flex items-center space-x-4">
                <span className="text-2xl">📍</span>
                <div>
                  <h3 className="font-semibold">Endereço</h3>
                  <p className="text-muted-foreground">Rua Barbacena, 333 - Parque Imperatriz, Foz do Iguaçu - PR</p>
                </div>
              </div>
              <div className="flex items-center space-x-4">
                <span className="text-2xl">📞</span>
                <div>
                  <h3 className="font-semibold">WhatsApp</h3>
                  <p className="text-muted-foreground">(45) 98804-6464</p>
                </div>
              </div>
              <div className="flex items-center space-x-4">
                <span className="text-2xl">⏰</span>
                <div>
                  <h3 className="font-semibold">Horário</h3>
                  <p className="text-muted-foreground">Segunda a Domingo: 18:00 às 23:30</p>
                </div>
              </div>
            </CardContent>
          </Card>
          <Button asChild size="lg" className="w-full text-lg py-6 shadow-lg hover:shadow-xl transition-all">
            <a href="https://wa.me/5545988046464" target="_blank" rel="noopener noreferrer">
              Fazer Pedido via WhatsApp
            </a>
          </Button>
        </div>
      </section>
    </div>
  )
}

export default Home
