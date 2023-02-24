import React, { useState } from 'react'
import { useOrder } from 'hooks'
import t from 'prop-types'

import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogContentText,
  DialogActions,
  Button
} from '@material-ui/core'

const DeleteModal = ({ id, setOpenModal, setCountPizzas }) => {
  const { removePizzaFromOrder } = useOrder()
  const [open, setOpen] = useState(true)

  const handleClick = () => {
    removePizzaFromOrder(id)
    setOpen(false)
    setOpenModal(false)
  }

  const handleClose = () => {
    setOpen(false)
    setCountPizzas(1)
    setOpenModal(false)
  }

  return (
    <>
      <Dialog
        open={open}
        onClose={handleClose}
        aria-labelledby='alert-dialog-title'
        aria-describedby='alert-dialog-description'
      >
        <DialogTitle id='alert-dialog-title'>
          {'Remover Item do Pedido ?'}
        </DialogTitle>

        <DialogContent>
          <DialogContentText id='alert-dialog-description'>
            Deseja remover esse item do seu pedido ?
          </DialogContentText>
        </DialogContent>

        <DialogActions>
          <Button onClick={handleClick}>Sim, Remover item!</Button>
          <Button onClick={handleClose} autoFocus>Não</Button>
        </DialogActions>
      </Dialog>
    </>
  )
}

DeleteModal.propTypes = {
  id: t.string.isRequired,
  setOpenModal: t.func.isRequired,
  setCountPizzas: t.func.isRequired
}

export default DeleteModal
