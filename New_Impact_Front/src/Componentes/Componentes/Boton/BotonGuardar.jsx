import  React,{ useEffect, useState } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faFloppyDisk} from '@fortawesome/free-solid-svg-icons'; 
import useTooltipCustom  from '../../Componentes/Tooltip/Tooltip';

const BotonGuardar = ({editar, restricciones, onClick, sinSubmit, nombre}) => {
  const TooltipCustom = useTooltipCustom();// Para renderizar el componente useTooltipCustom 
  const [soloLectura, setSoloLectura] = useState(false)
  let guardar;

  if (nombre) {
    guardar = nombre;
  } else {
    guardar = (
      <>
        <FontAwesomeIcon icon={faFloppyDisk} /> Guardar
      </>
    );
  }

  //Válida si tiene restricciones para que desactive el botón guardar, siempre se debe de verificar si viene vacío restricciones.formulario
  useEffect(()=>{
    if(editar){
      if(restricciones){
        if(restricciones.formulario){
          if(restricciones.formulario.restriccion_form === "Lectura"){
              setSoloLectura(true)
          }else{
              setSoloLectura(false)
          }
        }
      }
   }
  },[editar, restricciones])

  return (
    <TooltipCustom  title={editar}>
      <button className="btn btn-success "
          style={{ marginRight:"1%", 
                  fontFamily: "var(--fontFamily-drawer)", 
                  fontSize: "calc(var(--fontSize-drawer) - 2px)"
                }} 
          type={sinSubmit ? "button" : "submit"}
          disabled={soloLectura}
          onClick={onClick}
      >
           {guardar}
      </button>
    </TooltipCustom>
  
  );
}

export default BotonGuardar;



