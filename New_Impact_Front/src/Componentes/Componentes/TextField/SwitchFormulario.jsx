import React, {useState, useEffect} from "react";
import useTooltipCustom from '../Tooltip/Tooltip';
import "./SwitchFormulario.css"
import SwitchAnt from './AntSwitch';

const SwitchFormulario = ({
  classe, nombreLabel, titlelabel, icono, errores, id, name, value,  onChange, onBlur, onKeyUp, 
  required, restricciones, editarONuevo, onFocus, onMouseEnter, onMouseLeave, onClickSpan,
  classeSpan, disabled, textStart, textEnd
}) => {
  const TooltipCustom = useTooltipCustom();// Para renderizar el componente useTooltipCustom
  const [lectura, setLectura] = useState(false);
  const [noVisible, setNoVisible] = useState(false);
  const [soloLectura, setSoloLectura] = useState(false);

  //Válida las restricciones que tenga el usuario 
  useEffect(() => {
    if(editarONuevo){//Valida si es para el formulario editar
      if(restricciones){
          if(restricciones.formulario){
              if(restricciones.formulario.restriccion_form === "Lectura"){
                  setSoloLectura(true)
              }else{
                  setSoloLectura(false)
              }
            const restriccionId = restricciones.formulario.campos.find(restriccionActual => restriccionActual.nombre === id);
              if (restriccionId){
                const restriccionForm = restriccionId.restriccion_field;
                    const restriccionEstado = {// Definir un objeto para mapear los valores de restricción a las funciones de estado
                      "Lectura": setLectura,
                      "Novisible": setNoVisible
                    };
                    if (restriccionEstado.hasOwnProperty(restriccionForm)) {// Verificar si el valor de restricción está en el objeto, y si es así, llamar a la función de estado correspondiente
                      restriccionEstado[restriccionForm](true);//Si encuentra un restriccionEstado lo pone en true
                    } else {// Si el valor no está en el objeto, establecer todas las variables de estado en false
                      setLectura(false);
                      setNoVisible(false);
                    }
              } 
          }
      } 
    }
  }, [editarONuevo,restricciones, id]);
  
  return (
    <div className={classe}>

      {/*Este es titulo que va arriba input*/}
      <label className="form-label label_formularios" style={{display:"flex", color:"rgb(63, 63, 63)"}}>{nombreLabel}</label>

        {/*Este es el Icono que va antes del input*/}
        <div className="input-group has-validation">
        {icono && (
            <TooltipCustom title={titlelabel}>
             <span 
                  className={`input-group-text ${classeSpan}`} 
                  onClick={onClickSpan} 
                  style={{marginRight:"2%"}}
             >
                {icono}
              </span>
            </TooltipCustom>
          )}

            {/*Este es Switch*/}
              <SwitchAnt 
                  id={id}
                  name={name}
                  textStart={textStart}
                  textEnd={textEnd}
                  defaultChecked={value}
                  onChange={onChange}
                  onBlur={onBlur}
                  onKeyUp={onKeyUp}
                  required={required} 
                  onFocus={onFocus}
                  onMouseEnter={onMouseEnter}
                  onMouseLeave={onMouseLeave}
                  disabled={lectura || noVisible || soloLectura || disabled}
               />
            {/*Muestra errores si los tiene*/}
            { errores  ? ( 
              <small className="invalid-feedback" id="helpId" >
                <i className="bi bi-exclamation-circle" style={{fontSize:"16px"}}> {errores}</i>
              </small>
            ):
              <></>
            }
        </div>

    </div>
  );
}

export default SwitchFormulario;
