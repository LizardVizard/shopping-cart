import { useState } from 'react'

import { RouterProvider } from 'react-router'

import './index.css'

import createRouter from './router.jsx'


const App = (testing = false) => {
  const [cart, setCart] = useState([])

  // For cart page
  const handleItemQuantityChange = (itemId, itemQuantity) => {
    setCart(cart.map((item) =>
      item.id === itemId ?
        { ...item, quantity: itemQuantity } :
        item
    ))
  }

  const handleItemDelete = (itemId) => {
    setCart(cart.filter((item) => item.id !== itemId))
  }

  // For shopping page
  const handleItemAddOrModify = (targetItem, quantity) => {
    const cartItem = cart.find(item => item.id === targetItem.id)

    if (cartItem) {
      setCart(cart.map(item =>
        item.id === cartItem.id ?
          { ...item, quantity: item.quantity + quantity } :
          item
      ))
    } else {
      setCart([...cart, { ...targetItem, quantity: quantity }])
    }
  }

  const router = createRouter({
    cart,
    handleItemQuantityChange,
    handleItemDelete,
    handleItemAddOrModify,
    testing
  })



  return (
    <RouterProvider router={router} />
  )

}

export default App
