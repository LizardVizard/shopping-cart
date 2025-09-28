import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { useState, useContext } from 'react'

import { RouterProvider, createBrowserRouter } from 'react-router'

import './index.css'

import reactLogo from "./assets/react.svg"
import App from './App.jsx'

// import routes from './routes.jsx'
import createRouter from './router.jsx'

const catalogue = [
  { id: 1, name: "Item1", stock: 1 },
  { id: 2, name: "Item3", image: reactLogo, stock: 9834 },
]

// import { CartContext } from './CartContext.jsx'

// const router = createBrowserRouter(routes)


const Main = () => {
  // const [catalogue, setCaralogue] = useState([
  //   { id: 1, name: "Item1", quantity: 1 },
  //   { id: 2, name: "Item3", quantity: 9834 },
  // ])
  // const cart = useContext(CartContext)
  const [cart, setCart] = useState([{ id: 0, name: "context test", quantity: 2, price: 10.50 }])
  // const [cart, setCart] = useState([])

  const handleItemQuantityChange = (itemId, itemQuantity) => {

    // const itemQuantity = Number(quantity)
    //
    // if (itemQuantity < 1 || isNaN(itemQuantity)) {
    //   // handleItemDelete(itemId)
    //   return
    // }

    setCart(cart.map((item) =>
      item.id === itemId ?
        { ...item, quantity: itemQuantity } :
        item
    ))
  }

  const handleItemDelete = (itemId) => {
    setCart(cart.filter((item) => item.id !== itemId))
  }

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
    catalogue,
    cart,
    handleItemQuantityChange,
    handleItemDelete,
    handleItemAddOrModify
  })



  return (

    // <CartContext value={cart}>
    <RouterProvider router={router} />
    // </CartContext>
  )

}

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <Main />
  </StrictMode>,
)
