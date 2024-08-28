import React from "react"
import {Link} from 'react-router-dom';
import useTooltipCustom  from '../../Componentes/Tooltip/Tooltip';
import "./BotonCancelar.css"

const BotonCancelar = ({ruta, onClickCancelar}) =>{
  const TooltipCustom = useTooltipCustom();// Para renderizar el componente useTooltipCustom 

  return (
    <TooltipCustom title="Clic para cancelar y volver a la tabla de registros">
        <Link className="btn btn-cancelar"
            onClick={onClickCancelar}
            to={ruta}>
            <i className="bi bi-x-circle "> </i>Cancelar
        </Link>
     </TooltipCustom>
)}

export default BotonCancelar
