import * as React from 'react';
import Menu from '@mui/material/Menu';
import MenuItem from '@mui/material/MenuItem';
import Favoritos from "../Rating/Rating";
import { Link } from 'react-router-dom';
import TooltipFlotante from "../SnackBar/TooltipFlotante"

//Es lo alto del menu favorito
const ITEM_HEIGHT = 60;

export default function LongMenu({menuFavoritos}) {

  const [anchorEl, setAnchorEl] = React.useState(null);
  const [mostrar, setMotrar] = React.useState(false)//Es para mostrar el SnackBar o el tooltips flotantes
  const [text, setText] = React.useState("")//Es la ayuda o observaciones

  const open = Boolean(anchorEl);
  const handleClick = (event) => {
    setAnchorEl(event.currentTarget);
  };
  const handleClose = () => {
    setAnchorEl(null);
  };

  //Evento para mostrar el SnackBar o el tooltips flotantes de ayuda o observaciones y le  asignar el valor de ayuda o observaciones
  const mostrarTooltipFlotante = (text) =>{
    setText(text);
    setMotrar(true)
  } 

  //--> Oculta el SnackBar o el tooltips flotantes de observaciones o ayuda
  const cerrarTooltipFlotante = () => {
    setMotrar(false)
  } 

    return (
      <div>

        {/* Es el boton de abrir o cerrar el menu de favoritos */}
        <Link
          aria-label="more"
          id="long-button"
          aria-controls={open ? 'long-menu' : undefined}
          aria-expanded={open ? 'true' : undefined}
          aria-haspopup="true"
          onClick={handleClick}
        >
            {/* Muestra la estrella del menu de favoritos */}
            <Favoritos 
              cantidad={1}  
              favorito={1}
              size={"large"}
            />
        </Link>

          {/*Muestra el menu de favoritos */}
          <Menu
            id="long-menu"
            MenuListProps={{
              'aria-labelledby': 'long-button',
            }}
            anchorEl={anchorEl}
            open={open}
            onClose={handleClose}
            PaperProps={{
              style: {
                maxHeight: ITEM_HEIGHT * 4.5,
                width: '30ch',//Ancho del menu favoritos
                backgroundColor: 'rgba(255, 255, 255, 0.8)', 
              },
            }}
          >
            
          {/*Mapea la lista con los formularios favoritos*/}
          {menuFavoritos && menuFavoritos.map((favorito) => (
            <MenuItem 
              key={favorito.id} 
              selected={favorito.nombre === 'Pyxis'} 
              onClick={handleClose}
              onMouseEnter={() => mostrarTooltipFlotante(favorito.ayuda)}
              onMouseLeave={cerrarTooltipFlotante}
            >
              <Link className='nav-link' to={favorito.ruta}> {<i className={favorito.icono } style={{marginRight:"8px"}}> </i> }{ favorito.nombre} </Link>
             
            </MenuItem>
          ))}
        </Menu>
        
        {/*Muestra el SnackBar o el tooltips flotantes con la ayuda o observaciones de cada formulario */}
        <TooltipFlotante open={mostrar} handleClose={cerrarTooltipFlotante} message={text} />
      </div>
    );
  }