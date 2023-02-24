import React, { useCallback, useEffect, useState } from 'react'
import { BiFoodMenu } from 'react-icons/bi'
import { MdDelete, MdOutlineDeliveryDining } from 'react-icons/md'
import { BsCheckCircle } from 'react-icons/bs'
import {
  Button,
  Card as MaterialCard,
  CardActions,
  CardContent,
  CardHeader,
  CardMedia as MaterialCardMedia,
  IconButton,
  Typography
} from '@material-ui/core'
import Divider from './divider'
import styled from 'styled-components'
import { toMoney } from 'utils'

import { useOrder } from 'hooks'
import DeleteModal from './deleteModal'
import { H4, H5 } from './title'

const ShoppingCart = () => {
  const { order } = useOrder()
  const [hasPizza, setHasPizza] = useState(true)
  let [countPizzas, setCountPizzas] = useState(1)
  const [openModal, setOpenModal] = useState(false)
  const [idPizza, setIDPizza] = useState()

  useEffect(() => {
    setHasPizza(Boolean(order.pizzas.length))
  }, [order.pizzas])

  const getTheHighestPrice = useCallback((pizzasFlavours) => {
    const arrPrices = pizzasFlavours.map(flavourItem => {
      return flavourItem.price
    })

    const theBigestPrice = arrPrices.sort().pop()

    return theBigestPrice * countPizzas
  }, [countPizzas])

  const handlePlusAndMinusButton = (id, plusOrMinus) => {
    plusOrMinus
      ? setCountPizzas(countPizzas += 1)
      : setCountPizzas(countPizzas -= 1)

    if (countPizzas < 1) {
      handleDelete(id)
    }
  }

  const handleDelete = (id) => {
    setIDPizza(id)
    setOpenModal(true)
  }

  return (
    <>
      <Card>
        <CardHeaderWrapper
          avatar={
            <IconFoodMenu />
          }
          title='Meu Pedido'
        />

        <NewDivider />

        {
          !hasPizza && <CardEmptyOrder>
            <MdOutlineDeliveryDining size='200' />
            <H4>Seu pedido está vazio</H4>
            <H5>Adicione Itens</H5>
          </CardEmptyOrder>
        }

        {
          order.pizzas.map((pizza) => {
            const { id, pizzaSize, pizzaFlavours } = pizza
            const { name: pizzaSizeName } = pizzaSize
            return (
              <CardContentWrapper key={id}>
                <CardMedia />

                <CardPizzaName>
                  <CardContent>
                    <SizePizzaTypography>{`Pizza ${pizzaSizeName}`}</SizePizzaTypography>
                    {
                      pizzaFlavours.map((flavour) => {
                        return <Typography key={flavour.id} >{flavour.name}</Typography>
                      })
                    }
                  </CardContent>
                  <IconButtonDelete
                    aria-label='delete'
                    onClick={() => handleDelete(pizza.id)}
                  >
                    <MdDelete />
                  </IconButtonDelete>
                </CardPizzaName>
                <CardPlusAndMinus>
                  <div>
                    <PlusAndMinusButton onClick={() => handlePlusAndMinusButton(id, 0)} >-</PlusAndMinusButton>
                    <Counter>{countPizzas}</Counter>
                    <PlusAndMinusButton onClick={() => handlePlusAndMinusButton(id, 1)} >+</PlusAndMinusButton>
                  </div>
                  <ValueTypography>{toMoney(getTheHighestPrice(pizzaFlavours))}</ValueTypography>
                </CardPlusAndMinus>

                <NewDivider />

              </CardContentWrapper>
            )
          })}
        {
          hasPizza && <CardFooterWrapper>
            <CardFooterValueOrder>
              <Typography>
                Valor Total do pedido <span>R$45,00</span>
              </Typography>
            </CardFooterValueOrder>
            <ButtonFinishedOrder >
              <BsCheckCircle />
              <Typography>Finalzar Pedido</Typography>
            </ButtonFinishedOrder>
          </CardFooterWrapper>
        }
      </Card >
      {openModal && <DeleteModal id={idPizza} setOpenModal={setOpenModal} setCountPizzas={setCountPizzas} />}
    </>
  )
}

const CardHeaderWrapper = styled(CardHeader)`
  && {
    padding-bottom: 0;
  }
    && span {
      font-size: 1.5rem;
    }
`

const IconFoodMenu = styled(BiFoodMenu)`
  font-size: 2rem;
`

const Card = styled(MaterialCard)`
  && {
    position: fixed;
    top: 8.438rem;
    right: 1.875rem;
    bottom: 6rem;
    left: auto;
    max-width: 18.75rem;
    overflow-y: scroll;
  }
`

const CardMedia = styled(MaterialCardMedia).attrs({
  component: 'img',
  image: '/fake-data/images/pizza-frango-catupiry.png'
})`
  && {
    border-radius: 50%;
    height: 7rem;
    margin: 0 0  0 1rem;
    width: 7rem;
  }
`

const CardPlusAndMinus = styled(CardContent)`
  & {
    padding: 0px !important;
  }
`

const NewDivider = styled(Divider)`
  && {
    margin: 1.5rem 0 1.5rem 0;
  }
`

const CardContentWrapper = styled.div`
  display: flex;
  flex-wrap: wrap;
  justify-content: center;
`

const CardPizzaName = styled.div`
  display: flex;
  align-items: center;
`

const CardFooterWrapper = styled(CardActions)`
  width: 100%;
  flex-direction: column;
`

const CardFooterValueOrder = styled.div`
  display: block;
  width: 100%;
  padding: 1rem;
  border-radius: 1rem;
  background: #e57373;
  text-align: center;

    && span {
      font-weight: 500;
    }
`

const CardEmptyOrder = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
`

const Counter = styled.span`
  display: inline;
  padding: 0.438rem 0.625rem;
  border-radius: 0px;
  margin: 0;
  background: #E2E2E2;
  border-radius: 0.2rem;
`

const SizePizzaTypography = styled(Typography).attrs({
  variant: 'h5'
})`
  && {
    font-weight: 600;
  }
`

const IconButtonDelete = styled(IconButton)`
  && {
    width: 3rem;
    height: 3rem;
  }
`

const PlusAndMinusButton = styled(Button)`
  && {
    min-width: 2rem;
    min-height: 2rem;
    padding: 5px;
  }

    && span {
      font-size: 1.5rem;
      height: 20px;
    }
`

const ValueTypography = styled(Typography)`
  && {
    margin-top: 1rem;
    text-align: center;
  }
`

const ButtonFinishedOrder = styled(Button).attrs({
  variant: 'contained'
})`
  && {
    width: 100%;
    margin-top: 1rem;
    border-radius: 1rem;
    padding: 0;
    background: #00c853};

    && span {
      padding: 1rem;
      font-size: 2rem;
      gap: 0.85rem;
    }

    &&:hover {
      background: #76ff03;
    }
  }
`

export default ShoppingCart
