# 🍔 Divino Sabor - Sistema de Pedidos

Sistema completo de gerenciamento de pedidos para a lanchonete Divino Sabor, desenvolvido com React e tecnologias modernas.

## ✨ Funcionalidades

### 👥 Para Clientes
- **Cardápio Interativo**: Navegação por categorias (Cheese Burgers, Petiscos, Espetinhos, Bebidas)
- **Carrinho de Compras**: Adicionar/remover itens com controle de quantidade
- **Filtros Avançados**: Busca por nome e faixa de preço
- **Histórico de Pedidos**: Consulta e repetição de pedidos anteriores
- **Integração WhatsApp**: Finalização de pedidos via WhatsApp
- **Status em Tempo Real**: Acompanhamento do status do pedido

### 🔧 Para Administradores
- **Gerenciamento de Pedidos**: Controle completo do fluxo de pedidos
- **CRUD de Produtos**: Cadastro, edição e remoção de produtos
- **Gestão de Entregadores**: Controle de equipe de delivery
- **Relatórios e Analytics**: Gráficos de vendas, produtos mais vendidos
- **Configurações**: Personalização de horários, taxas e notificações
- **Backup/Restore**: Exportação e importação de dados

### 🔔 Sistema de Notificações
- **Notificações Sonoras**: Alertas para novos pedidos
- **Notificações do Navegador**: Alertas visuais em tempo real
- **Controles de Preferência**: Ativar/desativar sons e notificações

## 🛠️ Tecnologias Utilizadas

- **Frontend**: React 18 + Vite
- **Styling**: Tailwind CSS + shadcn/ui
- **Ícones**: Lucide React
- **Gráficos**: Recharts
- **Animações**: Framer Motion
- **Roteamento**: React Router DOM
- **Estado**: Context API + useReducer
- **PWA**: Manifest + Service Worker ready

## 🎨 Design System

### Paleta de Cores
- **Primária**: `#F59E0B` (Dourado)
- **Secundária**: `#EF4444` (Vermelho)
- **Accent**: `#FB923C` (Laranja)
- **Background**: Adaptável (claro/escuro)

### Tipografia
- **Fonte Principal**: Inter (sistema)
- **Hierarquia**: Bem definida com tamanhos responsivos

## 📱 Responsividade

O sistema foi desenvolvido com abordagem **mobile-first**:
- **Mobile**: 320px - 768px
- **Tablet**: 768px - 1024px
- **Desktop**: 1024px+

## 🚀 Como Executar

### Pré-requisitos
- Node.js 18+
- npm ou pnpm

### Instalação
```bash
# Clone o repositório
git clone [url-do-repositorio]

# Entre no diretório
cd divino-sabor

# Instale as dependências
npm install

# Execute em modo desenvolvimento
npm run dev

# Build para produção
npm run build
```

## 📂 Estrutura do Projeto

```
src/
├── components/           # Componentes React
│   ├── admin/           # Componentes administrativos
│   ├── ui/              # Componentes base (shadcn/ui)
│   └── ...              # Componentes principais
├── contexts/            # Context API
├── assets/              # Imagens e recursos
└── main.jsx            # Ponto de entrada
```

## 🔧 Configuração

### Variáveis de Ambiente
```env
# WhatsApp Business
VITE_WHATSAPP_NUMBER=5545988046464

# Configurações da loja
VITE_STORE_NAME="Divino Sabor"
VITE_STORE_ADDRESS="Rua Barbacena, 333 - Parque Imperatriz, Foz do Iguaçu - PR"
```

## 📊 Funcionalidades Técnicas

### Persistência de Dados
- **LocalStorage**: Armazenamento local de pedidos, produtos e configurações
- **Context API**: Gerenciamento de estado global
- **Backup/Restore**: Sistema de exportação/importação JSON

### Performance
- **Lazy Loading**: Carregamento sob demanda
- **Memoização**: Otimização de re-renders
- **Animações**: Transições suaves com Framer Motion

### Acessibilidade
- **ARIA Labels**: Suporte a leitores de tela
- **Navegação por Teclado**: Totalmente acessível
- **Contraste**: Cores com boa legibilidade

## 🎯 Roadmap

- [ ] Integração com API de pagamentos
- [ ] Sistema de cupons e promoções
- [ ] Notificações push
- [ ] App mobile nativo
- [ ] Integração com delivery apps

## 📄 Licença

Este projeto foi desenvolvido para a lanchonete Divino Sabor.

## 👨‍💻 Desenvolvido por

Sistema desenvolvido com foco na experiência do usuário e eficiência operacional.

---

**Divino Sabor** - *Os melhores sabores da cidade!* 🍔✨
