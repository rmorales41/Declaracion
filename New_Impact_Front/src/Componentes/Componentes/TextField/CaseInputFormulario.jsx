import React from "react";
import useTooltipCustom from '../Tooltip/Tooltip';
import "./inputFormulario.css"

const InputFormulario = ({classe, nombreLabel, input, titlelabel, titleInput, icono ,errores}) => {
  const TooltipCustom = useTooltipCustom();// Para renderizar el componente useTooltipCustom

  return (
  <>
     <div className={classe}>
      <label className="form-label label_formularios" style={{display:"flex", color:"rgb(63, 63, 63)"}}>{nombreLabel}</label>
        <div className="input-group has-validation">

          {icono && ( // Validar si hay un icono
            <TooltipCustom title={titlelabel}>
              <span className="input-group-text">
                {icono}
              </span>  
            </TooltipCustom>
          )} 
            {/*Este es input*/}
              {input}
            {/*Muestra errores si los tiene*/}
            <small className="invalid-feedback" id="helpId" >
              <i className="bi bi-exclamation-circle"> {errores}</i>
            </small>
        </div>
    </div>
  </>
  );
}

export default InputFormulario;