import { createContext, useContext, useReducer, useEffect, useCallback } from 'react'
import { supabase } from '../lib/supabase'

// Estado inicial
const initialState = {
  products: [],
  orders: [],
  cart: [],
  deliveryPersons: [],
  user: null,
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
    try {
      const { data, error } = await supabase
        .from('products')
        .select('id, name, category, price, description, available, created_at, image')
        .eq('available', true)
      
      if (error) {
        console.error('Erro ao buscar produtos:', error)
        dispatch({ type: 'SET_ERROR', payload: error.message })
      } else {
        // Processar as URLs das imagens para garantir que sejam URLs públicas completas
        const productsWithPublicUrls = data.map(product => {
          // Se a imagem existe e é uma URL válida do Supabase Storage, mantê-la
          if (product.image && product.image.startsWith('https://')) {
            return product
          }
          
          // Se a imagem existe mas não é uma URL completa, tratar como placeholder
          if (product.image && product.image !== '/api/placeholder/300/200') {
            // Tentar construir a URL pública do Supabase Storage
            const imageUrl = supabase.storage.from('product-images').getPublicUrl(product.image).data.publicUrl
            return { ...product, image: imageUrl }
          }
          
          // Se não há imagem ou é um placeholder, manter como está
          return product
        })
        
        console.log('Produtos carregados do Supabase:', productsWithPublicUrls)
        dispatch({ type: 'SET_PRODUCTS', payload: productsWithPublicUrls || [] })
      }
    } catch (error) {
      console.error('Erro na conexão com Supabase:', error)
      dispatch({ type: 'SET_ERROR', payload: 'Erro na conexão com o banco de dados' })
    }
    dispatch({ type: 'SET_LOADING', payload: false })
  }, [])

  const fetchOrders = useCallback(async () => {
    try {
      const { data, error } = await supabase.from('orders').select('*')
      if (error) {
        console.error('Erro ao buscar pedidos:', error)
        dispatch({ type: 'SET_ERROR', payload: error.message })
      } else {
        dispatch({ type: 'SET_ORDERS', payload: data || [] })
      }
    } catch (error) {
      console.error('Erro na conexão com Supabase:', error)
    }
  }, [])

  const fetchDeliveryPersons = useCallback(async () => {
    try {
      const { data, error } = await supabase.from('delivery_persons').select('*')
      if (error) {
        console.error('Erro ao buscar entregadores:', error)
        dispatch({ type: 'SET_ERROR', payload: error.message })
      } else {
        dispatch({ type: 'SET_DELIVERY_PERSONS', payload: data || [] })
      }
    } catch (error) {
      console.error('Erro na conexão com Supabase:', error)
    }
  }, [])

  // Efeitos para carregar dados e autenticação
  useEffect(() => {
    console.log('Inicializando aplicação...')
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
    try {
      const { data, error } = await supabase.from('products').insert([productData]).select()
      if (error) {
        console.error('Erro ao adicionar produto:', error)
        dispatch({ type: 'SET_ERROR', payload: error.message })
      } else {
        dispatch({ type: 'ADD_PRODUCT', payload: data[0] })
      }
    } catch (error) {
      console.error('Erro na conexão com Supabase:', error)
    }
  }

  const updateProduct = async (productData) => {
    try {
      const { data, error } = await supabase.from('products').update(productData).eq('id', productData.id).select()
      if (error) {
        console.error('Erro ao atualizar produto:', error)
        dispatch({ type: 'SET_ERROR', payload: error.message })
      } else {
        dispatch({ type: 'UPDATE_PRODUCT', payload: data[0] })
      }
    } catch (error) {
      console.error('Erro na conexão com Supabase:', error)
    }
  }

  const deleteProduct = async (productId) => {
    try {
      const { error } = await supabase.from('products').delete().eq('id', productId)
      if (error) {
        console.error('Erro ao deletar produto:', error)
        dispatch({ type: 'SET_ERROR', payload: error.message })
      } else {
        dispatch({ type: 'DELETE_PRODUCT', payload: productId })
      }
    } catch (error) {
      console.error('Erro na conexão com Supabase:', error)
    }
  }

  const createOrder = async (orderData) => {
    try {
      const { data, error } = await supabase.from("orders").insert([{
        ...orderData, 
        payment_method: orderData.paymentMethod,
        items: JSON.stringify(orderData.items),
        total: orderData.total,
        status: 'pending'
      }]).select()
      
      if (error) {
        console.error("Erro ao criar pedido:", error)
        dispatch({ type: "SET_ERROR", payload: error.message })
        return null
      } else {
        dispatch({ type: "ADD_ORDER", payload: data[0] })
        dispatch({ type: "CLEAR_CART" })
        return data[0]
      }
    } catch (error) {
      console.error('Erro na conexão com Supabase:', error)
      return null
    }
  }

  const updateOrderStatus = async (orderId, newStatus) => {
    try {
      const { data, error } = await supabase.from('orders').update({ status: newStatus }).eq('id', orderId).select()
      if (error) {
        console.error('Erro ao atualizar status do pedido:', error)
        dispatch({ type: 'SET_ERROR', payload: error.message })
      } else {
        dispatch({ type: 'UPDATE_ORDER_STATUS', payload: data[0] })
      }
    } catch (error) {
      console.error('Erro na conexão com Supabase:', error)
    }
  }

  const deleteOrder = async (orderId) => {
    try {
      const { error } = await supabase.from('orders').delete().eq('id', orderId)
      if (error) {
        console.error('Erro ao deletar pedido:', error)
        dispatch({ type: 'SET_ERROR', payload: error.message })
      } else {
        dispatch({ type: 'DELETE_ORDER', payload: orderId })
      }
    } catch (error) {
      console.error('Erro na conexão com Supabase:', error)
    }
  }

  const addDeliveryPerson = async (personData) => {
    try {
      const { data, error } = await supabase.from('delivery_persons').insert([personData]).select()
      if (error) {
        console.error('Erro ao adicionar entregador:', error)
        dispatch({ type: 'SET_ERROR', payload: error.message })
      } else {
        dispatch({ type: 'ADD_DELIVERY_PERSON', payload: data[0] })
      }
    } catch (error) {
      console.error('Erro na conexão com Supabase:', error)
    }
  }

  const updateDeliveryPerson = async (personData) => {
    try {
      const { data, error } = await supabase.from('delivery_persons').update(personData).eq('id', personData.id).select()
      if (error) {
        console.error('Erro ao atualizar entregador:', error)
        dispatch({ type: 'SET_ERROR', payload: error.message })
      } else {
        dispatch({ type: 'UPDATE_DELIVERY_PERSON', payload: data[0] })
      }
    } catch (error) {
      console.error('Erro na conexão com Supabase:', error)
    }
  }

  const deleteDeliveryPerson = async (personId) => {
    try {
      const { error } = await supabase.from('delivery_persons').delete().eq('id', personId)
      if (error) {
        console.error('Erro ao deletar entregador:', error)
        dispatch({ type: 'SET_ERROR', payload: error.message })
      } else {
        dispatch({ type: 'DELETE_DELIVERY_PERSON', payload: personId })
      }
    } catch (error) {
      console.error('Erro na conexão com Supabase:', error)
    }
  }

  // Funções auxiliares
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
      (order) => new Date(order.created_at).toDateString() === today
    )
  }

  const getTodayRevenue = () => {
    return getOrdersToday().reduce((sum, order) => sum + order.total, 0)
  }

  const getMostSoldProducts = () => {
    const productSales = {}

    state.orders.forEach((order) => {
      if (order.items && Array.isArray(order.items)) {
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
      }
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
