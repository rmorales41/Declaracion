import * as React from 'react';
import { styled, alpha } from '@mui/material/styles';
import Menu from '@mui/material/Menu';
import MenuItem from '@mui/material/MenuItem';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faAngleDown } from '@fortawesome/free-solid-svg-icons';

import Tooltip from '@mui/material/Tooltip';
import "./BotoneraOpciones.css"

const StyledMenu = styled((props) => (
  <Menu
    elevation={0}
    anchorOrigin={{
      vertical: 'bottom',
      horizontal: 'right',
    }}
    transformOrigin={{
      vertical: 'top',
      horizontal: 'right',
    }}
    {...props}
  />
))(({ theme }) => ({
  '& .MuiPaper-root': {
    borderRadius: 6,
    marginTop: theme.spacing(1),
    minWidth: 180,
    color: theme.palette.grey[200],
    backgroundColor: theme.palette.mode === 'light' ? '#444' : theme.palette.background.default,
    boxShadow:
      'rgb(255, 255, 255) 0px 0px 0px 0px, rgba(0, 0, 0, 0.05) 0px 0px 0px 1px, rgba(0, 0, 0, 0.1) 0px 10px 15px -3px, rgba(0, 0, 0, 0.05) 0px 4px 6px -2px',
    '& .MuiMenu-list': {
      padding: '4px 0',
    },
    '& .MuiMenuItem-root': {
      '& .MuiSvgIcon-root': {
        fontSize: 18,
        color: theme.palette.text.secondary,
        marginRight: theme.spacing(1.5),
      },
      '&:active': {
        backgroundColor: alpha(
          theme.palette.primary.main,
          theme.palette.action.selectedOpacity,
        ),
      },
    },
  },
}));

export default function CustomizedMenus({ items, idUnico }) {
  const [anchorEl, setAnchorEl] = React.useState(null);
  const open = Boolean(anchorEl);

  const handleClick = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const handleClose = () => {
    setAnchorEl(null);
  };

  return (
    <div>
      <Tooltip title="Click para abrir las opciones.">
        <button 
          className="btn btn-menu-BotoneraOpciones"
          id="demo-customized-button"
          aria-controls={open ? 'demo-customized-menu' : undefined}
          aria-haspopup="true"
          aria-expanded={open ? 'true' : undefined}
          variant="contained"
          //disableElevation
          onClick={handleClick} 
        >
          Opciones <FontAwesomeIcon icon={faAngleDown} />
        </button>
      </Tooltip>
      <StyledMenu
        id="demo-customized-menu"
        MenuListProps={{'aria-labelledby': 'demo-customized-button',}}
        anchorEl={anchorEl}
        open={open}
        onClose={handleClose}
        sx={{ height: '300px' }} // Aquí especificas la altura deseada
      >
        {items.map((item, index) => (
          <MenuItem 
            key={index} 
            className="menu-item-BotoneraOpciones"
            disableRipple
            onClick={() => {handleClose(); if(item.onClick) item.onClick();}}>
              {item.icon && <span style={{ marginRight: '8px' }}>{item.icon}</span>}
              {item.text}
          </MenuItem>
        ))}

      </StyledMenu>
    </div>
  );
}
