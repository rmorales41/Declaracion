import * as React from 'react';
import Box from '@mui/material/Box';
import Rating from '@mui/material/Rating';

export default function CustomizedRating({favorito,cantidad, onChange, style, size, onClick}) {
  return (
    <Box
    sx={{
      '& > legend': { mt: 2 },
      ml: 1, 
      ...style
    }}
    >
      <Rating name="customized-10" defaultValue={favorito} max={cantidad} onChange={onChange} size={size} onClick={onClick}/>
    </Box>
  );
}