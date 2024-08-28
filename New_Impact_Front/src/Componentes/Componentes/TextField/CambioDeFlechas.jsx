import React from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import {faAngleRight, faAngleDown } from '@fortawesome/free-solid-svg-icons'; 
import ListItemButton from '@mui/material/ListItemButton'; 
import ListItemIcon from '@mui/material/ListItemIcon';
import Favorito from "../Rating/Rating"

function CambioDeFlechas({ open, tieneCollapse, subMenu, collapseAbierto, 
 tipo_letra, classeDelLogo, onRatingChange, menuItem, nombre, menuFavoritos
}) {

  const isFavorito = menuFavoritos && menuFavoritos.length > 0 && menuFavoritos.some(item => item.id === menuItem.id);

  const handleRatingChange = (value) => {
    onRatingChange(menuItem, value);  // Llama a la función de cambio de calificación definida en el componente padre
  };

  return (
    <>
    {!subMenu ? (<>
      {open && (<>
        <ListItemIcon sx={{ minWidth: 0, mr: open ? -1 : 'auto', justifyContent: 'center' }} />
        <ListItemButton 
            disableTypography 
            sx={{ opacity: open ? 1 : 0, fontSize: 'var(--fontSize-drawer)',  fontFamily: tipo_letra, width: open ? 'auto' : '100%', }}                                 
        >
          {nombre}
          {collapseAbierto ? (
              <><FontAwesomeIcon className={classeDelLogo} icon={faAngleDown} /></>
            ) : (
              <><FontAwesomeIcon className={classeDelLogo} icon={faAngleRight} /></>        
            )}
        </ListItemButton>
      </>)}
    </>):(<>
      {nombre}
      
      {tieneCollapse ? (
        <>
        {collapseAbierto ? (
            <><FontAwesomeIcon className={classeDelLogo} icon={faAngleDown} /></>
        ) : (
            <><FontAwesomeIcon className={classeDelLogo} icon={faAngleRight} /></>
            
        )}
        </>
      ):(
      <>
        <Favorito 
          cantidad={1}  
          favorito={isFavorito ? 1 : 0} 
          onChange={(event, value) => handleRatingChange(value)}
        />
      </>
      )}
    </>)}
    </>
  );
}

export default CambioDeFlechas;