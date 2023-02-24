import React, { useState } from 'react'
import t from 'prop-types'
import styled from 'styled-components'
import { Redirect } from 'react-router-dom'
import {
  Card as MaterialCard,
  Grid,
  Typography
} from '@material-ui/core'
import {
  CardLink,
  Content as MaterialContent,
  Divider,
  Footer,
  H4,
  HeaderContent,
  PizzasGrid
} from 'ui'
import { singularOrPlural, toMoney } from 'utils'
import { HOME, CHOOSE_PIZZA_QUANTITY } from 'routes'
import { useCollection } from 'hooks'
import ShoppingCart from 'ui/shoppingCart'

const ChoosePizzaFlavours = ({ location }) => {
  const [checkboxes, setCheckboxes] = useState(() => ({}))
  const pizzasFlavours = useCollection('pizzasFlavours')

  if (!location.state) {
    return <Redirect to={HOME} />
  }

  if (!pizzasFlavours) {
    return 'Loading...'
  }

  if (pizzasFlavours.length === 0) {
    return 'Não há dados.'
  }

  const { flavours, id } = location.state.pizzaSize

  const handleChangeCheckbox = (pizzaId) => (e) => {
    if (
      checkboxesChecked(checkboxes).length === flavours &&
      e.target.checked === true
    ) {
      return
    }

    setCheckboxes((checkboxes) => {
      return {
        ...checkboxes,
        [pizzaId]: e.target.checked
      }
    })
  }

  return (
    <>
      <Content>
        <HeaderContent>
          <H4>
            Escolha até {flavours} {' '}
            {singularOrPlural(flavours, 'sabor', 'sabores')}:
          </H4>
        </HeaderContent>

        <SectionWrapper>
          <PizzasGrid>
            {pizzasFlavours.map((pizza) => (
              <Grid item key={pizza.id} xs>
                <Card checked={!!checkboxes[pizza.id]}>
                  <Label>
                    <Checkbox
                      checked={!!checkboxes[pizza.id]}
                      onChange={handleChangeCheckbox(pizza.id)}
                    />

                    <Img src={pizza.image} alt={pizza.name} />

                    <Divider />

                    <Typography>{pizza.name}</Typography>
                    <Typography variant='h5'>
                      {toMoney(pizza.value[id])}
                    </Typography>
                  </Label>
                </Card>
              </Grid>
            ))}
          </PizzasGrid>

        </SectionWrapper>

        <ShoppingCart />
      </Content>

      <Footer
        buttons={{
          back: {
            children: 'Mudar tamanho'
          },

          action: {
            to: {
              pathname: CHOOSE_PIZZA_QUANTITY,
              state: {
                ...location.state,
                pizzaFlavours: getFlavoursNameAndId({ checkboxes, pizzasFlavours }, id)
              }
            },
            children: 'Quantas pizzas?',
            disabled: checkboxesChecked(checkboxes).length === 0
          }
        }}
      />
    </>
  )
}

ChoosePizzaFlavours.propTypes = {
  location: t.object.isRequired
}

function checkboxesChecked (checkboxes) {
  return Object.values(checkboxes).filter(Boolean)
}

function getFlavoursNameAndId ({ checkboxes, pizzasFlavours }, idPrice) {
  return Object.entries(checkboxes)
    .filter(([, value]) => !!value)
    .map(([id]) => ({
      id,
      name: pizzasFlavours.find((flavour) => flavour.id === id).name,
      price: getPrice(pizzasFlavours, id, idPrice)
    }))
}

const getPrice = (pizzasFlavours, id, idPrice) => {
  let priceValue = 0
  pizzasFlavours.find((pizza) => pizza.id === id ? (priceValue = pizza.value[idPrice]) : priceValue)
  return priceValue
}

const Card = styled(MaterialCard)`
  && {
    border: 2px solid transparent;
    border-color: ${({ theme, checked }) => checked ? theme.palette.secondary.light : ''};
  }
`

const Content = styled(MaterialContent)`
  && {
    position: relative;
    max-width: 100%;
  }
`

const Label = styled(CardLink).attrs({
  component: 'label'
})``

const Checkbox = styled.input.attrs({
  type: 'checkbox'
})`
  display: none;
`

const Img = styled.img`
  width: 200px;
`

const SectionWrapper = styled.section`
  display: grid;
  grid-template-columns: 3fr 1fr;
`

export default ChoosePizzaFlavours
