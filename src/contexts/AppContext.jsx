import { createContext, useContext, useReducer, useEffect, useCallback } from 'react'
import { supabase } from '../supabaseClient'

// Estado inicial
const initialState = {
  products: [
    // Espetinhos
    { id: 1, name: 'Espetinho de Carne', category: 'espetinhos', price: 9.00, description: '', image: '/api/placeholder/300/200', available: true },
    { id: 2, name: 'Espetinho de Carne com Bacon', category: 'espetinhos', price: 9.00, description: '', image: '/api/placeholder/300/200', available: true },
    { id: 3, name: 'Espetinho de Carne com Legumes', category: 'espetinhos', price: 9.00, description: '', image: '/api/placeholder/300/200', available: true },
    { id: 4, name: 'Espetinho de Cafta', category: 'espetinhos', price: 9.00, description: '', image: '/api/placeholder/300/200', available: true },
    { id: 5, name: 'Espetinho de Coração', category: 'espetinhos', price: 9.00, description: '', image: '/api/placeholder/300/200', available: true },
    { id: 6, name: 'Espetinho de Linguiça', category: 'espetinhos', price: 9.00, description: '', image: '/api/placeholder/300/200', available: true },
    { id: 7, name: 'Espetinho de Frango com Bacon', category: 'espetinhos', price: 9.00, description: '', image: '/api/placeholder/300/200', available: true },
    { id: 8, name: 'Espetinho de Tulipa', category: 'espetinhos', price: 9.00, description: '', image: '/api/placeholder/300/200', available: true },
    { id: 9, name: 'Espetinho de Queijo', category: 'espetinhos', price: 9.00, description: '', image: '/api/placeholder/300/200', available: true },
    { id: 10, name: 'Espetinho de Pão de Alho', category: 'espetinhos', price: 9.00, description: '', image: '/api/placeholder/300/200', available: true },

    // Porções
    { id: 11, name: 'Calabresa (0.5 Kg)', category: 'porcoes', price: 25.00, description: '', image: '/api/placeholder/300/200', available: true },
    { id: 12, name: 'Calabresa (1 Kg)', category: 'porcoes', price: 45.00, description: '', image: '/api/placeholder/300/200', available: true },
    { id: 13, name: 'Tulipa (0.5 Kg)', category: 'porcoes', price: 25.00, description: '', image: '/api/placeholder/300/200', available: true },
    { id: 14, name: 'Tulipa (1 Kg)', category: 'porcoes', price: 40.00, description: '', image: '/api/placeholder/300/200', available: true },
    { id: 15, name: 'Frango a passarinho (0.5 Kg)', category: 'porcoes', price: 25.00, description: '', image: '/api/placeholder/300/200', available: true },
    { id: 16, name: 'Frango a passarinho (1 Kg)', category: 'porcoes', price: 40.00, description: '', image: '/api/placeholder/300/200', available: true },
    { id: 17, name: 'Batata frita (0.5 Kg)', category: 'porcoes', price: 20.00, description: '', image: '/api/placeholder/300/200', available: true },
    { id: 18, name: 'Batata frita (1 Kg)', category: 'porcoes', price: 35.00, description: '', image: '/api/placeholder/300/200', available: true },
    { id: 19, name: 'Polenta frita (0.5 Kg)', category: 'porcoes', price: 20.00, description: '', image: '/api/placeholder/300/200', available: true },
    { id: 20, name: 'Polenta frita (1 Kg)', category: 'porcoes', price: 35.00, description: '', image: '/api/placeholder/300/200', available: true },
    { id: 21, name: 'Anéis de cebola (0.5 Kg)', category: 'porcoes', price: 25.00, description: '', image: '/api/placeholder/300/200', available: true },
    { id: 22, name: 'Anéis de cebola (1 Kg)', category: 'porcoes', price: 40.00, description: '', image: '/api/placeholder/300/200', available: true },
    { id: 23, name: 'Tilápia (0.5 Kg)', category: 'porcoes', price: 35.00, description: '', image: '/api/placeholder/300/200', available: true },
    { id: 24, name: 'Tilápia (1 Kg)', category: 'porcoes', price: 60.00, description: '', image: '/api/placeholder/300/200', available: true },
    { id: 25, name: 'Pastelzinho (10 unidades)', category: 'porcoes', price: 20.00, description: '', image: '/api/placeholder/300/200', available: true },

    // Pastéis
    { id: 26, name: 'Pastel de Carne', category: 'pasteis', price: 10.00, description: '', image: '/api/placeholder/300/200', available: true },
    { id: 27, name: 'Pastel de Carne com Ovo', category: 'pasteis', price: 10.00, description: '', image: '/api/placeholder/300/200', available: true },
    { id: 28, name: 'Pastel de Frango', category: 'pasteis', price: 10.00, description: '', image: '/api/placeholder/300/200', available: true },
    { id: 29, name: 'Pastel de Frango com Catupiri', category: 'pasteis', price: 10.00, description: '', image: '/api/placeholder/300/200', available: true },
    { id: 30, name: 'Pastel de Pizza', category: 'pasteis', price: 10.00, description: '', image: '/api/placeholder/300/200', available: true },
    { id: 31, name: 'Pastel de Queijo', category: 'pasteis', price: 10.00, description: '', image: '/api/placeholder/300/200', available: true },

    // Cervejas
    { id: 32, name: 'Original litrinho / lata', category: 'cervejas', price: 6.00, description: '', image: '/api/placeholder/300/200', available: true },
    { id: 33, name: 'Original 600 ml', category: 'cervejas', price: 10.00, description: '', image: '/api/placeholder/300/200', available: true },
    { id: 34, name: 'Original 1 litro', category: 'cervejas', price: 16.00, description: '', image: '/api/placeholder/300/200', available: true },
    { id: 35, name: 'Brama / Antártica / Bud / Skol 1 litro', category: 'cervejas', price: 8.00, description: '', image: '/api/placeholder/300/200', available: true },
    { id: 36, name: 'Heineken long neck / lata', category: 'cervejas', price: 8.00, description: '', image: '/api/placeholder/300/200', available: true },
    { id: 37, name: 'Amstel 1 litro', category: 'cervejas', price: 10.00, description: '', image: '/api/placeholder/300/200', available: true },
    { id: 38, name: 'Heineken 600 ml', category: 'cervejas', price: 14.00, description: '', image: '/api/placeholder/300/200', available: true },
    { id: 39, name: 'Brama / Skol / Antártica / Bud / Amstel litrinho e lata', category: 'cervejas', price: 5.00, description: '', image: '/api/placeholder/300/200', available: true },

    // Refrigerantes e Sucos
    { id: 40, name: 'Água', category: 'bebidas', price: 3.00, description: '', image: '/api/placeholder/300/200', available: true },
    { id: 41, name: 'Água com gás', category: 'bebidas', price: 3.00, description: '', image: '/api/placeholder/300/200', available: true },
    { id: 42, name: 'Mini refrigerante', category: 'bebidas', price: 3.00, description: '', image: '/api/placeholder/300/200', available: true },
    { id: 43, name: 'Suco Dell Valle', category: 'bebidas', price: 3.00, description: '', image: '/api/placeholder/300/200', available: true },
    { id: 44, name: 'Tubaína', category: 'bebidas', price: 5.00, description: '', image: '/api/placeholder/300/200', available: true },
    { id: 45, name: 'Coca-Cola 2L retornável', category: 'bebidas', price: 12.00, description: '', image: '/api/placeholder/300/200', available: true },
    { id: 46, name: 'Coca-Cola 2L', category: 'bebidas', price: 14.00, description: '', image: '/api/placeholder/300/200', available: true },
    { id: 47, name: 'Fanta / Sprite / Laranja / Uva 2L', category: 'bebidas', price: 13.00, description: '', image: '/api/placeholder/300/200', available: true },
    { id: 48, name: 'Guaraná / Framboesa / Abacaxi 2L', category: 'bebidas', price: 10.00, description: '', image: '/api/placeholder/300/200', available: true },
    { id: 49, name: 'Refrigerante lata', category: 'bebidas', price: 5.00, description: '', image: '/api/placeholder/300/200', available: true },
    { id: 50, name: 'Energético', category: 'bebidas', price: 14.00, description: '', image: '/api/placeholder/300/200', available: true },

    // X Gaúcho
    { id: 51, name: 'X Salada', category: 'x-gaucho', price: 28.00, description: 'Pão, maionese, hambúrguer caseiro, ovo, milho, ervilha, queijo, presunto, tomate e alface', image: '/api/placeholder/300/200', available: true },
    { id: 52, name: 'X Bacon', category: 'x-gaucho', price: 30.00, description: 'Pão, maionese, hambúrguer caseiro, ovo, milho, ervilha, queijo, presunto, tomate, alface e bacon', image: '/api/placeholder/300/200', available: true },
    { id: 53, name: 'X Calabresa', category: 'x-gaucho', price: 30.00, description: 'Pão, maionese, hambúrguer caseiro, ovo, milho, ervilha, queijo, presunto, tomate, alface e calabresa', image: '/api/placeholder/300/200', available: true },
    { id: 54, name: 'X Coração', category: 'x-gaucho', price: 30.00, description: 'Pão, maionese, hambúrguer caseiro, ovo, milho, ervilha, queijo, presunto, tomate, alface e coração', image: '/api/placeholder/300/200', available: true },
    { id: 55, name: 'X Frango', category: 'x-gaucho', price: 30.00, description: 'Pão, maionese, hambúrguer caseiro de frango, ovo, milho, ervilha, queijo, presunto, tomate e alface', image: '/api/placeholder/300/200', available: true },
    { id: 56, name: 'X Divino Sabor', category: 'x-gaucho', price: 35.00, description: 'Pão, maionese, hambúrguer caseiro, ovo, milho, ervilha, queijo, presunto, tomate, alface, bacon, calabresa e coração de frango', image: '/api/placeholder/300/200', available: true }
  ],
  orders: [],
  cart: [],
  deliveryPersons: [],
  orderCounter: 1, // Será gerenciado pelo Supabase (sequência ou UUID)
  user: null, // Para autenticação do Supabase
  loading: true,
  error: null,
}

// Reducer para gerenciar as ações
const appReducer = (state, action) => {
  switch (action.type) {
    case 'SET_LOADING':
      return { ...state, loading: action.payload }
    case 'SET_ERROR':
      return { ...state, error: action.payload }
    case 'SET_USER':
      return { ...state, user: action.payload }
    case 'SET_PRODUCTS':
      return { ...state, products: action.payload }
    case 'ADD_PRODUCT':
      return { ...state, products: [...state.products, action.payload] }
    case 'UPDATE_PRODUCT':
      return {
        ...state,
        products: state.products.map((product) =>
          product.id === action.payload.id ? action.payload : product
        ),
      }
    case 'DELETE_PRODUCT':
      return {
        ...state,
        products: state.products.filter((product) => product.id !== action.payload),
      }
    case 'SET_ORDERS':
      return { ...state, orders: action.payload }
    case 'ADD_ORDER':
      return { ...state, orders: [...state.orders, action.payload] }
    case 'UPDATE_ORDER_STATUS':
      return {
        ...state,
        orders: state.orders.map((order) =>
          order.id === action.payload.id ? { ...order, status: action.payload.status } : order
        ),
      }
    case 'DELETE_ORDER':
      return { ...state, orders: state.orders.filter((order) => order.id !== action.payload) }
    case 'SET_DELIVERY_PERSONS':
      return { ...state, deliveryPersons: action.payload }
    case 'ADD_DELIVERY_PERSON':
      return { ...state, deliveryPersons: [...state.deliveryPersons, action.payload] }
    case 'UPDATE_DELIVERY_PERSON':
      return {
        ...state,
        deliveryPersons: state.deliveryPersons.map((person) =>
          person.id === action.payload.id ? action.payload : person
        ),
      }
    case 'DELETE_DELIVERY_PERSON':
      return {
        ...state,
        deliveryPersons: state.deliveryPersons.filter((person) => person.id !== action.payload),
      }
    case 'ADD_TO_CART':
      const existingItem = state.cart.find((item) => item.id === action.payload.id)
      if (existingItem) {
        return {
          ...state,
          cart: state.cart.map((item) =>
            item.id === action.payload.id ? { ...item, quantity: item.quantity + 1 } : item
          ),
        }
      }
      return {
        ...state,
        cart: [...state.cart, { ...action.payload, quantity: 1 }],
      }
    case 'REMOVE_FROM_CART':
      return {
        ...state,
        cart: state.cart.filter((item) => item.id !== action.payload),
      }
    case 'UPDATE_CART_QUANTITY':
      return {
        ...state,
        cart: state.cart
          .map((item) =>
            item.id === action.payload.id ? { ...item, quantity: action.payload.quantity } : item
          )
          .filter((item) => item.quantity > 0),
      }
    case 'CLEAR_CART':
      return { ...state, cart: [] }
    default:
      return state
  }
}

// Contexto
const AppContext = createContext()

// Provider
export const AppProvider = ({ children }) => {
  const [state, dispatch] = useReducer(appReducer, initialState)

  // Funções de carregamento de dados do Supabase
  const fetchProducts = useCallback(async () => {
    dispatch({ type: 'SET_LOADING', payload: true })
    const { data, error } = await supabase.from('products').select('*')
    if (error) {
      console.error('Erro ao buscar produtos:', error)
      dispatch({ type: 'SET_ERROR', payload: error.message })
    } else {
      dispatch({ type: 'SET_PRODUCTS', payload: data || [] })
    }
    dispatch({ type: 'SET_LOADING', payload: false })
  }, [])

  const fetchOrders = useCallback(async () => {
    dispatch({ type: 'SET_LOADING', payload: true })
    const { data, error } = await supabase.from('orders').select('*')
    if (error) {
      console.error('Erro ao buscar pedidos:', error)
      dispatch({ type: 'SET_ERROR', payload: error.message })
    } else {
      dispatch({ type: 'SET_ORDERS', payload: data || [] })
    }
    dispatch({ type: 'SET_LOADING', payload: false })
  }, [])

  const fetchDeliveryPersons = useCallback(async () => {
    dispatch({ type: 'SET_LOADING', payload: true })
    const { data, error } = await supabase.from('delivery_persons').select('*')
    if (error) {
      console.error('Erro ao buscar entregadores:', error)
      dispatch({ type: 'SET_ERROR', payload: error.message })
    } else {
      dispatch({ type: 'SET_DELIVERY_PERSONS', payload: data || [] })
    }
    dispatch({ type: 'SET_LOADING', payload: false })
  }, [])

  // Efeitos para carregar dados e autenticação
  useEffect(() => {
    fetchProducts()
    fetchOrders()
    fetchDeliveryPersons()

    // Monitorar estado de autenticação
    const { data: authListener } = supabase.auth.onAuthStateChange((_event, session) => {
      dispatch({ type: 'SET_USER', payload: session?.user || null })
    })

    // Carregar usuário inicial
    supabase.auth.getSession().then(({ data: { session } }) => {
      dispatch({ type: 'SET_USER', payload: session?.user || null })
    })

    return () => {
      authListener.subscription.unsubscribe()
    }
  }, [fetchProducts, fetchOrders, fetchDeliveryPersons])

  // Funções de manipulação de dados (CRUD) com Supabase
  const addProduct = async (productData) => {
    const { data, error } = await supabase.from('products').insert([productData]).select()
    if (error) {
      console.error('Erro ao adicionar produto:', error)
      dispatch({ type: 'SET_ERROR', payload: error.message })
    } else {
      dispatch({ type: 'ADD_PRODUCT', payload: data[0] })
    }
  }

  const updateProduct = async (productData) => {
    const { data, error } = await supabase.from('products').update(productData).eq('id', productData.id).select()
    if (error) {
      console.error('Erro ao atualizar produto:', error)
      dispatch({ type: 'SET_ERROR', payload: error.message })
    } else {
      dispatch({ type: 'UPDATE_PRODUCT', payload: data[0] })
    }
  }

  const deleteProduct = async (productId) => {
    const { error } = await supabase.from('products').delete().eq('id', productId)
    if (error) {
      console.error('Erro ao deletar produto:', error)
      dispatch({ type: 'SET_ERROR', payload: error.message })
    } else {
      dispatch({ type: 'DELETE_PRODUCT', payload: productId })
    }
  }

  const createOrder = async (orderData) => {
    const { data, error } = await supabase.from("orders").insert([{...orderData, payment_method: orderData.paymentMethod}]).select()
    if (error) {
      console.error("Erro ao criar pedido:", error)
      dispatch({ type: "SET_ERROR", payload: error.message })
    } else {
      dispatch({ type: "ADD_ORDER", payload: data[0] })
      dispatch({ type: "CLEAR_CART" })
      return data[0]
    }
  }

  const updateOrderStatus = async (orderId, newStatus) => {
    const { data, error } = await supabase.from('orders').update({ status: newStatus }).eq('id', orderId).select()
    if (error) {
      console.error('Erro ao atualizar status do pedido:', error)
      dispatch({ type: 'SET_ERROR', payload: error.message })
    } else {
      dispatch({ type: 'UPDATE_ORDER_STATUS', payload: data[0] })
    }
  }

  const deleteOrder = async (orderId) => {
    const { error } = await supabase.from('orders').delete().eq('id', orderId)
    if (error) {
      console.error('Erro ao deletar pedido:', error)
      dispatch({ type: 'SET_ERROR', payload: error.message })
    } else {
      dispatch({ type: 'DELETE_ORDER', payload: orderId })
    }
  }

  const addDeliveryPerson = async (personData) => {
    const { data, error } = await supabase.from('delivery_persons').insert([personData]).select()
    if (error) {
      console.error('Erro ao adicionar entregador:', error)
      dispatch({ type: 'SET_ERROR', payload: error.message })
    } else {
      dispatch({ type: 'ADD_DELIVERY_PERSON', payload: data[0] })
    }
  }

  const updateDeliveryPerson = async (personData) => {
    const { data, error } = await supabase.from('delivery_persons').update(personData).eq('id', personData.id).select()
    if (error) {
      console.error('Erro ao atualizar entregador:', error)
      dispatch({ type: 'SET_ERROR', payload: error.message })
    } else {
      dispatch({ type: 'UPDATE_DELIVERY_PERSON', payload: data[0] })
    }
  }

  const deleteDeliveryPerson = async (personId) => {
    const { error } = await supabase.from('delivery_persons').delete().eq('id', personId)
    if (error) {
      console.error('Erro ao deletar entregador:', error)
      dispatch({ type: 'SET_ERROR', payload: error.message })
    } else {
      dispatch({ type: 'DELETE_DELIVERY_PERSON', payload: personId })
    }
  }

  // Funções auxiliares (algumas precisarão ser adaptadas para Supabase)
  const getProductsByCategory = (category) => {
    return state.products.filter((product) => product.category === category && product.available)
  }

  const getOrdersByStatus = (status) => {
    return state.orders.filter((order) => order.status === status)
  }

  const getTotalCartValue = () => {
    return state.cart.reduce((sum, item) => sum + item.price * item.quantity, 0)
  }

  const getTotalCartItems = () => {
    return state.cart.reduce((sum, item) => sum + item.quantity, 0)
  }

  const getOrdersToday = () => {
    const today = new Date().toDateString()
    return state.orders.filter(
      (order) => new Date(order.createdAt).toDateString() === today
    )
  }

  const getTodayRevenue = () => {
    return getOrdersToday().reduce((sum, order) => sum + order.total, 0)
  }

  const getMostSoldProducts = () => {
    const productSales = {}

    state.orders.forEach((order) => {
      order.items.forEach((item) => {
        if (productSales[item.id]) {
          productSales[item.id].quantity += item.quantity
        } else {
          productSales[item.id] = {
            ...item,
            quantity: item.quantity,
          }
        }
      })
    })

    return Object.values(productSales)
      .sort((a, b) => b.quantity - a.quantity)
      .slice(0, 5)
  }

  const value = {
    state,
    dispatch,
    getProductsByCategory,
    getOrdersByStatus,
    getTotalCartValue,
    getTotalCartItems,
    getOrdersToday,
    getTodayRevenue,
    getMostSoldProducts,
    // Funções CRUD com Supabase
    addProduct,
    updateProduct,
    deleteProduct,
    createOrder,
    updateOrderStatus,
    deleteOrder,
    addDeliveryPerson,
    updateDeliveryPerson,
    deleteDeliveryPerson,
  }

  return <AppContext.Provider value={value}>{children}</AppContext.Provider>
}

// Hook personalizado
export const useApp = () => {
  const context = useContext(AppContext)
  if (!context) {
    throw new Error('useApp deve ser usado dentro de AppProvider')
  }
  return context
}

export default AppContext

