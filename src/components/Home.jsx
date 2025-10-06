import { Link } from 'react-router-dom'
import { Button } from '@/components/ui/button'
import { Card, CardContent } from '@/components/ui/card'
import { ChefHat, Clock, MapPin, Phone, Star } from 'lucide-react'
import { motion } from 'framer-motion'
import logoImage from '../assets/logo-divino-sabor.jpeg'

const Home = () => {
  const features = [
    {
      icon: ChefHat,
      title: 'Sabor Artesanal',
      description: 'Lanches preparados com ingredientes frescos e receitas especiais'
    },
    {
      icon: Clock,
      title: 'Entrega Rápida',
      description: 'Pedidos prontos em até 30 minutos para delivery'
    },
    {
      icon: Star,
      title: 'Qualidade Premium',
      description: 'Os melhores ingredientes para uma experiência única'
    }
  ]

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
    <div className="min-h-screen">
      {/* Hero Section */}
      <section className="relative overflow-hidden bg-gradient-to-br from-secondary/20 via-background to-accent/20 cheese-pattern">
        <div className="container mx-auto px-4 py-20">
          <motion.div
            variants={containerVariants}
            initial="hidden"
            animate="visible"
            className="text-center max-w-4xl mx-auto"
          >
            <motion.div variants={itemVariants} className="mb-8">
              <img 
                src={logoImage} 
                alt="Divino Sabor" 
                className="h-32 w-32 mx-auto rounded-full object-cover food-shadow ring-4 ring-primary/20"
              />
            </motion.div>
            
            <motion.h1 
              variants={itemVariants}
              className="text-5xl md:text-7xl font-bold mb-6"
            >
              <span className="divino-text-gradient">Divino Sabor</span>
            </motion.h1>
            
            <motion.p 
              variants={itemVariants}
              className="text-xl md:text-2xl text-muted-foreground mb-8 max-w-2xl mx-auto"
            >
              Experimente o melhor da culinária artesanal com nossos lanches, petiscos e espetinhos irresistíveis
            </motion.p>
            
            <motion.div 
              variants={itemVariants}
              className="flex flex-col sm:flex-row gap-4 justify-center items-center"
            >
              <Button asChild size="lg" className="divino-gradient hover:opacity-90 text-white font-semibold px-8 py-6 text-lg hover-lift">
                <Link to="/menu">
                  <ChefHat className="mr-2 h-5 w-5" />
                  Ver Cardápio
                </Link>
              </Button>
              
              <Button asChild variant="outline" size="lg" className="px-8 py-6 text-lg hover-lift">
                <Link to="/status">
                  <Clock className="mr-2 h-5 w-5" />
                  Status do Pedido
                </Link>
              </Button>
            </motion.div>
          </motion.div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-20 bg-card">
        <div className="container mx-auto px-4">
          <motion.div
            variants={containerVariants}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            className="text-center mb-16"
          >
            <motion.h2 
              variants={itemVariants}
              className="text-3xl md:text-4xl font-bold mb-4"
            >
              Por que escolher o <span className="divino-text-gradient">Divino Sabor</span>?
            </motion.h2>
            <motion.p 
              variants={itemVariants}
              className="text-lg text-muted-foreground max-w-2xl mx-auto"
            >
              Tradição, qualidade e sabor em cada mordida
            </motion.p>
          </motion.div>

          <motion.div 
            variants={containerVariants}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            className="grid md:grid-cols-3 gap-8"
          >
            {features.map((feature, index) => (
              <motion.div key={index} variants={itemVariants}>
                <Card className="text-center p-6 hover-lift border-border/50 hover:border-primary/50 transition-colors">
                  <CardContent className="pt-6">
                    <div className="w-16 h-16 mx-auto mb-4 rounded-full divino-gradient flex items-center justify-center">
                      <feature.icon className="h-8 w-8 text-white" />
                    </div>
                    <h3 className="text-xl font-semibold mb-3">{feature.title}</h3>
                    <p className="text-muted-foreground">{feature.description}</p>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </section>

      {/* Contact Section */}
      <section className="py-20 bg-muted/30">
        <div className="container mx-auto px-4">
          <motion.div
            variants={containerVariants}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            className="max-w-4xl mx-auto"
          >
            <motion.div variants={itemVariants} className="text-center mb-12">
              <h2 className="text-3xl md:text-4xl font-bold mb-4">
                Visite nossa <span className="divino-text-gradient">Lanchonete</span>
              </h2>
              <p className="text-lg text-muted-foreground">
                Estamos prontos para atender você com o melhor sabor da região
              </p>
            </motion.div>

            <motion.div variants={itemVariants}>
              <Card className="p-8 food-shadow">
                <CardContent className="grid md:grid-cols-2 gap-8">
                  <div className="space-y-6">
                    <div className="flex items-start space-x-4">
                      <MapPin className="h-6 w-6 text-primary mt-1" />
                      <div>
                        <h3 className="font-semibold mb-1">Endereço</h3>
                        <p className="text-muted-foreground">
                          Rua Barbacena, 333 - Parque Imperatriz<br />
                          Foz do Iguaçu - PR
                        </p>
                      </div>
                    </div>
                    
                    <div className="flex items-start space-x-4">
                      <Phone className="h-6 w-6 text-primary mt-1" />
                      <div>
                        <h3 className="font-semibold mb-1">WhatsApp</h3>
                        <p className="text-muted-foreground">(45) 98804-6464</p>
                      </div>
                    </div>
                    
                    <div className="flex items-start space-x-4">
                      <Clock className="h-6 w-6 text-primary mt-1" />
                      <div>
                        <h3 className="font-semibold mb-1">Horário de Funcionamento</h3>
                        <p className="text-muted-foreground">
                          Segunda a Domingo<br />
                          18:00 às 23:30
                        </p>
                      </div>
                    </div>
                  </div>
                  
                  <div className="flex items-center justify-center">
                    <Button asChild size="lg" className="divino-gradient hover:opacity-90 text-white font-semibold px-8 py-6 text-lg hover-lift w-full">
                      <a href="https://wa.me/5545988046464" target="_blank" rel="noopener noreferrer">
                        <Phone className="mr-2 h-5 w-5" />
                        Fazer Pedido via WhatsApp
                      </a>
                    </Button>
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          </motion.div>
        </div>
      </section>
    </div>
  )
}

export default Home
