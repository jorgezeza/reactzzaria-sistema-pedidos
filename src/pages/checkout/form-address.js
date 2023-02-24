import React, { useState, useEffect, useReducer, useRef } from 'react'
import t from 'prop-types'
import {
  Button,
  CircularProgress,
  Grid,
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle
} from '@material-ui/core'
import TextField from './text-field'

function FormAddress ({ onUpdate = () => { } }) {
  const [cep, setCep] = useState('')
  const [fetchingCep, setFetchingCep] = useState(false)
  const [addressState, dispatch] = useReducer(reducer, initialState)
  const numberField = useRef()
  const addressField = useRef()

  const [open, setOpen] = useState(false)

  const fields = [
    {
      label: 'Rua',
      xs: 9,
      name: 'address',
      inputRef: addressField
    },

    {
      label: 'Número',
      xs: 3,
      name: 'number',
      inputRef: numberField
    },

    {
      label: 'Bairro',
      xs: 12,
      name: 'district'
    },

    {
      label: 'Complemento',
      xs: 12,
      name: 'complement'
    },

    {
      label: 'Cidade',
      xs: 9,
      name: 'city'
    },

    {
      label: 'Estado',
      xs: 3,
      name: 'state'
    }
  ]

  const CEPModalError = () => {
    // https://mui.com/material-ui/react-dialog/#alerts
    const toDeny = () => {
      setCep('')
      setOpen(false)
    }

    const toAccept = () => {
      dispatch({
        type: 'FAILED_BUT_ACCEPTED',
        payload: { name: 'code', value: cep }
      })
      setOpen(false)
    }
    return (
      <div>
        <Dialog
          open={open}
          onClose={toDeny}
          aria-labelledby='alert-dialog-title'
          aria-describedby='alert-dialog-description'
        >
          <DialogTitle id='alert-dialog-title'>
            CEP não encontrado !
          </DialogTitle>
          <DialogContent>
            <DialogContentText id='alert-dialog-description'>
              Deseja utilizar esse CEP ?
            </DialogContentText>
          </DialogContent>
          <DialogActions>
            <Button onClick={toDeny}>Não</Button>
            <Button onClick={toAccept} autoFocus>Sim</Button>
          </DialogActions>
        </Dialog>
      </div>
    )
  }

  useEffect(() => {
    onUpdate(addressState)
  }, [addressState, onUpdate])

  useEffect(() => {
    async function fetchAddress () {
      if (cep.length < 9) {
        return
      }

      setFetchingCep(true)
      const data = await fetch(`https://apps.widenet.com.br/busca-cep/api/cep/${cep}.json`)
      setFetchingCep(false)

      if (!data.ok) {
        dispatch({ type: 'RESET' })
        addressField.current.focus()
        return
      }

      const result = await data.json()

      if (!result.ok) {
        dispatch({
          type: 'FAIL',
          payload: {
            error: result.message
          }
        })
        setOpen(true)
        return
      }

      dispatch({
        type: 'UPDATE_FULL_ADDRESS',
        payload: result
      })

      numberField.current.focus()
    }
    fetchAddress()
  }, [cep])

  function handleChangeCep (e) {
    setCep(cepMask(e.target.value))
  }

  function cepMask (value) {
    return value
      .replace(/\D+/g, '')
      .replace(/(\d{5})(\d)/, '$1-$2')
      .replace(/(-\d{3})\d+?$/, '$1')
  }

  function handleChangeField (e) {
    const { name, value } = e.target

    dispatch({
      type: 'UPDATE_FIELD',
      payload: { name, value }
    })
  }

  return (
    <>
      <CEPModalError />
      <Grid container spacing={2} alignItems='center'>
        <TextField
          label='CEP'
          xs={4}
          autoFocus
          value={cep}
          onChange={handleChangeCep}
          error={!!addressState.error}
        />
        <Grid item xs={8}>
          {fetchingCep && <CircularProgress size={20} />}
        </Grid>

        {fields.map((field) => (
          <TextField
            {...field}
            key={field.name}
            value={addressState[field.name]}
            onChange={handleChangeField}
            autoFocus={field.autoFocus}
            disabled={fetchingCep}
          />
        ))}
      </Grid>
    </>
  )
}

FormAddress.propTypes = {
  onUpdate: t.func
}

function reducer (state, action) {
  if (action.type === 'UPDATE_FULL_ADDRESS') {
    return {
      ...state,
      ...action.payload,
      error: null
    }
  }

  if (action.type === 'UPDATE_FIELD') {
    return {
      ...state,
      [action.payload.name]: action.payload.value
    }
  }

  if (action.type === 'FAIL') {
    return {
      ...initialState,
      error: action.payload.error
    }
  }

  if (action.type === 'FAILED_BUT_ACCEPTED') {
    return {
      ...state,
      [action.payload.name]: action.payload.value
    }
  }

  if (action.type === 'RESET') {
    return initialState
  }

  return state
}

const initialState = {
  code: '',
  address: '',
  number: '',
  district: '',
  complement: '',
  city: '',
  state: '',
  error: null
}

export default FormAddress
