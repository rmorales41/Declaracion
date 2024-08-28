import * as React from 'react';
import Box from '@mui/material/Box';
import TextField from '@mui/material/TextField';
import { FaRegUser } from "react-icons/fa6";

export default function InputWithIcon({id, placeholder, value, onChange, variant}) {
  return (
    <Box sx={{ display: 'flex', flexWrap: 'wrap' }}>
    <div>
      <Box sx={{ display: 'flex', alignItems: 'flex-end' }}>
      <FaRegUser 
        style={{
          fontSize:"17px",
          marginLeft: '3.3rem',
          marginRight: '0.400rem',
          marginTop: '0.125rem', 
          marginBottom: '0.300rem'
        }}
      />
        <TextField
          id={id}
          label={placeholder}
          variant={variant}
          value={value}
          onChange={onChange}
          sx={{width: '27ch'}}
          size="small"
        />
      </Box>
      </div>
    </Box>
  
  );
}