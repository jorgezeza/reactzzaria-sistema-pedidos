import React, { createContext, useState } from 'react'
import t from 'prop-types'
import uuidv4 from 'uuid/v4'
import firebase, { db } from 'services/firebase'
import { useAuth } from 'hooks'

const OrderContext = createContext()

function OrderProvider ({ children }) {
  const [pizzas, addPizza] = useState([])
  const [orderInProgress, setOrderInProgress] = useState(false)
  const [phone, addPhone] = useState('')
  const [address, addAddress] = useState({})
  const { userInfo } = useAuth()

  function addPizzaToOrder (pizza) {
    if (orderInProgress) {
      return addPizza((pizzas) => pizzas.concat(newPizza(pizza)))
    }

    setOrderInProgress(true)
    addPizza([newPizza(pizza)])
  }

  function newPizza (pizza) {
    return {
      id: uuidv4(),
      ...pizza
    }
  }

  function removePizzaFromOrder (id) {
    addPizza((pizzas) => pizzas.filter(p => p.id !== id))
  }

  console.log('PIZZAS', pizzas)
  console.log('ENDEREÇO', address)
  console.log('TELEFONE', phone)

  async function sendOrder () {
    try {
      await db.collection('orders').add({
        userId: userInfo.user.uid,
        creatAt: firebase.firestore.FieldValue.serverTimestamp(),

        address,
        phone,
        pizzas: pizzas.map(pizza => ({
          size: pizza.pizzaSize,
          flavours: pizza.pizzaFlavours,
          price: pizza.pizzaFlavours.values,
          quantity: pizza.quantity
        }))
      })
    } catch (e) {
      console.log('Erro ao salvar pedido:', e)
    }

    setOrderInProgress(false)
  }

  return (
    <OrderContext.Provider value={{
      order: {
        pizzas,
        address,
        phone
      },
      addPizzaToOrder,
      removePizzaFromOrder,
      addAddress,
      addPhone,
      sendOrder
    }}>
      {children}
    </OrderContext.Provider>
  )
}

OrderProvider.propTypes = {
  children: t.node.isRequired
}

export { OrderProvider, OrderContext }
