import React from 'react';
import Snackbar from '@mui/material/Snackbar';

function CustomSnackbar({ open, handleClose, message }) {
  return (
    <Snackbar
      anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}
      open={open}
      onClose={handleClose}
      message={message}
    />
  );
}

export default CustomSnackbar;