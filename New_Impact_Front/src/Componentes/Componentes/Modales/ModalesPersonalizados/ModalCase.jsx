import React,{useEffect, useState}  from 'react';
import "./ModalCase.css"
import Alert from '@mui/material/Alert';
import Tooltip from '@mui/material/Tooltip';

export default function ModalCase({//Estas son las props que se le manda a este componente
    cuerpo, ancho, alto, titulo, mostrarModalCase,
    eventoCerrarModalCase, ZIndex, altoBody, overflow,
    overflowBody, alerta, marginTopContenedor}) {
 
const [windowWidth, setWindowWidth] = useState(window.innerWidth);

useEffect(() => {
   const handleResize = () => setWindowWidth(window.innerWidth);
  window.addEventListener('resize', handleResize);
  return () =>  window.removeEventListener('resize', handleResize);
}, []);

//Hace el responsives
const getResponsiveWidth = () => {
  if (windowWidth > 650) return ancho;
  if (windowWidth < 650) return '82%';
  if (windowWidth < 400) return '80%';
  if (windowWidth < 350) return '75%';
  if (windowWidth < 275) return '70%';
};

  return (  
    <>
      {mostrarModalCase && (
        <div  style={{ height:alto, overflow: overflow , zIndex: ZIndex, width: getResponsiveWidth() }} className=' ContenedorModal'>
          <div className="card cardModal"  style={{ backgroundColor: '#fff', padding: 20}}>
            <div className='encabezadoModal'>
            {titulo ? (<><h5 className="card-title tituloModal">{titulo}</h5></>):(<></>)}
                <Tooltip title="Click para cerrar.">
                  <button  className='btn btnCerrarModal' 
                    onClick={eventoCerrarModalCase}> 
                    <i className="bi bi-x-circle" style={{fontSize:"21px"}}> </i>
                  </button>
                </Tooltip>
            </div>

            <hr style={{ borderColor: 'black', marginTop:"5px" }} />
            {alerta ? (<><Alert severity="error" style={{marginTop:"-5%", marginBottom:"-1.700rem"}}>{alerta}</Alert></>):(<></>)}
            <div style={{height: altoBody ,overflow: overflowBody, marginTop: marginTopContenedor}} >
              {cuerpo}
            </div>

          </div>
        </div>
      )}

    </>
  );
}

