import * as React from 'react';
import TextField from '@mui/material/TextField';
import Autocomplete from '@mui/material/Autocomplete';
import Stack from '@mui/material/Stack';

export default function SelectAutoComplete({label, ancho, defaultProps, onChange }) {

  return (
    <Stack spacing={1} sx={{ width: ancho }}>
      <Autocomplete
        {...defaultProps}
        id="clear-on-escape"
        clearOnEscape
        onChange={onChange} 
        renderInput={(params) => (
          <TextField {...params} label={label} variant="standard" />
        )}
      />
      
    </Stack>
  );
}

