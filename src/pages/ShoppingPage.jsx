import { useContext, useEffect, useState } from "react"
import { CartContext } from "../CartContext"
import ShoppingItem from "../components/ShoppingItem"

import style from "./ShoppingPage.module.css"

import placeholderImage from "/vite.svg"

function ShoppingPage({ handleItemAddOrModify }) {
  const [catalogue, setCatalogue] = useState(null)
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState("")

  useEffect(() => {
    fetch("https://fakestoreapi.com/products")
      .then((response) => {
        if (!response.ok) {
          setError("Error:" + response.status)
          throw new Error("Error:" + response.status)
        }
        return response.json()
      })
      .then(response => setCatalogue(response))
      .catch(error => {
        setError(error.message)
        console.error("An error caught during API fetch: " + error.message)
      })
      .finally(setIsLoading(false))
  }, [])


  return (
    <>
      <h1>Store</h1>
      <div className={style.container}>
        {isLoading && <h1>Loading... </h1>}
        {!isLoading && error !== "" && <h2>{error}</h2>}
        {!isLoading && catalogue && catalogue.map((item) =>

          <ShoppingItem
            key={item.id}
            name={item.title}
            price={item.price}
            image={item.image || placeholderImage}
            handleClick={(quantity) => handleItemAddOrModify(item, quantity)}
          />
        )}
      </div>
    </>
  )
}

export default ShoppingPage
