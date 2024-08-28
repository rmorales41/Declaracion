import * as React from 'react';
import Box from '@mui/material/Box';
import IconButton from '@mui/material/IconButton';
import Input from '@mui/material/Input';
import InputLabel from '@mui/material/InputLabel';
import InputAdornment from '@mui/material/InputAdornment';
import FormControl from '@mui/material/FormControl';
import "./inputPassword.css";


export default function InputAdornments({id, placeholder, value, onChange, variant, icono}) {
  const [showPassword, setShowPassword] = React.useState(false);

  const handleClickShowPassword = () => setShowPassword((show) => !show);

  const handleMouseDownPassword = (event) => {
    event.preventDefault();
  };

  return (
    <Box sx={{ display: 'flex', flexWrap: 'wrap' }}>
      <div>
      <Box sx={{ display: 'flex', alignItems: 'flex-end' }}>
      {icono} {/* Aquí se pasa el icono como una prop */}
        <FormControl sx={{marginTop:"0.500rem",  width: '27ch',  }} variant={variant}>
          <InputLabel htmlFor="standard-adornment-password">{placeholder}</InputLabel>
          <Input
            id={id}
            value={value}
            onChange={onChange}
            type={showPassword ? 'text' : 'password'}
            endAdornment={
              <InputAdornment position="end">
                <IconButton
                  aria-label="toggle password visibility"
                  onClick={handleClickShowPassword}
                  onMouseDown={handleMouseDownPassword}
                  tabIndex={-1} // Esto hace que se brinque el icono del ver al hacer tab
                >
                 {showPassword ? <i className= "bi-eye logo-password"> </i> : <i className="bi-eye-slash logo-password"></i> }
                </IconButton>
              </InputAdornment>
            }
          />
        </FormControl>
        </Box>
      </div>
      
    </Box>
  );
}













      

