import * as React from 'react';
import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import DialogContentText from '@mui/material/DialogContentText';
import DialogTitle from '@mui/material/DialogTitle';
import BotonCancelar from '../../Boton/BotonCancelar';
import BotonGuardar from '../../Boton/BotonGuardar';

export default function FormDialog({
  handleClose,
  open,
  dialogTitle,
  dialogContentText,
  cuerpo,
  typeButton,
  ButtonText,
  onSubmit,
  disableBackdropClick ,
  restricciones,
}) {

  const handleDialogClose = (event, reason) => {
    if (disableBackdropClick && reason === 'backdropClick') {
      return;
    }
    handleClose();
  };

  return (
    <React.Fragment>
      <Dialog
        open={open}
        onClose={handleDialogClose}
        PaperProps={{
          component: 'form',
          onSubmit: (event) => {
            event.preventDefault();
            onSubmit();
          },
        }}
      >
        <DialogTitle>{dialogTitle}</DialogTitle>
        <DialogContent>
          <DialogContentText>
            {dialogContentText}
          </DialogContentText>
          {cuerpo}
        </DialogContent>
        <DialogActions>
          <BotonCancelar onClickCancelar={handleClose}/>
          <BotonGuardar type={typeButton} restricciones = {restricciones}/>
          
        </DialogActions>
      </Dialog>
    </React.Fragment>
  );
}