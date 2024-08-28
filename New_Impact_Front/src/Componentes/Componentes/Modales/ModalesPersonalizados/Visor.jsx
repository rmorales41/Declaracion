import React, {useEffect, useState} from 'react';
import "./Visor.css"
import Tooltip from '@mui/material/Tooltip';

export default function Visor({//Estas son las props que se le manda a este componente
    cuerpo, ancho, alto, mostrarModalCase,
    eventoCerrarModalCase, ZIndex, mensaje}) {
 const [windowWidth, setWindowWidth] = useState(window.innerWidth);

  useEffect(() => {
    const handleResize = () => setWindowWidth(window.innerWidth);
    window.addEventListener('resize', handleResize);
    return () =>  window.removeEventListener('resize', handleResize);
  }, []);

//Hace el responsives
const getResponsiveWidth = () => {
    if (windowWidth > 600) return ancho;
    if (windowWidth < 600) return '80%';
    if (windowWidth < 500) return '80%';
    if (windowWidth < 400) return '85%';
};
 
  return ( 
    <>
      {mostrarModalCase && (
      <div className="card ContenedorVisor"
        style={{ height: alto, zIndex: ZIndex, width: getResponsiveWidth() }}>
          <div className="CuerpoContenedorVisor" >
            <div className='ContenedorBoton'>
            {mensaje ? (<><p style={{marginLeft:"3%", color:"#FFA500"}}>{mensaje}</p></>):(<></>)}
              <Tooltip title="Click para cerrar.">
                  <button  className='btn btnCerrarVisor' 
                    onClick={eventoCerrarModalCase}> 
                      <i className="bi bi-x-circle" style={{fontSize:"21px"}}></i>
                  </button>
              </Tooltip>
            </div>
            
            {cuerpo}
          </div>
          
      </div>
      )}

    </>
  );
}