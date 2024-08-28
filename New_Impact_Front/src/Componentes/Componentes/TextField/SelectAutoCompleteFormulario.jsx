import React, {useState, useEffect} from "react";
import useTooltipCustom from '../Tooltip/Tooltip';
import "./SelectAutoCompleteFormulario.css"
import TextField from '@mui/material/TextField';
import Autocomplete from '@mui/material/Autocomplete';
import Stack from '@mui/material/Stack';

const SelectAutoCompleteFormulario = ({
  classe, 
  nombreLabel, 
  titlelabel, 
  icono,  
  errores, 
  id, 
  name, 
  titleInput,
  value,  
  required,
  restricciones, 
  editarONuevo,
  onChange, 
  onClickSpan,
  classeSpan,
  disabled, 
  label, 
  ancho, 
  defaultProps,
  onInputChange,
  inputValue,
  onClicklabel,
  defaultValue,
  valueAutocomplete,
  titleOnClicklabel,
  onDoubleClick,
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
      <TooltipCustom title={titleOnClicklabel}>
        <label onClick={onClicklabel} 
        className={`form-label label_SelectAutoCompleteFormulario ${onClicklabel ? 'pointer-cursor' : ''}`}
        style={{display:"flex", color:"rgb(63, 63, 63)"}}>{nombreLabel}</label>
      </TooltipCustom> 
        {/*Este es el Icono que va antes del input*/}
        <div className="input-group has-validation">
            <TooltipCustom title={titlelabel}>
             <span 
                className={`input-group-text classeSpanSelect ${classeSpan}`} 
                onClick={onClickSpan} 
                style={{marginLeft:"-0.500rem"}}
            >
                {icono}
              </span>
            </TooltipCustom>

            {/*Este es input*/} 
            {!noVisible ? (
                  <TooltipCustom title={titleInput}>
                      <Stack  sx={{ width: ancho }} className="is-invalid">
                          <Autocomplete
                              {...defaultProps}
                              id={id}
                              name={name} 
                              clearOnEscape
                              onChange={onChange} 
                              defaultValue={defaultValue}
                              onInputChange={onInputChange}
                              inputValue={inputValue}
                              value={valueAutocomplete}
                              renderInput={(params) => (
                                    <TextField 
                                      {...params} 
                                      label={label} 
                                      required={required} 
                                      variant="standard"
                                      id={id}
                                      name={name} 
                                      onDoubleClick={onDoubleClick}
                                    />
                              )}
                              disabled={lectura || noVisible || soloLectura || disabled}
                          />
                              
                      </Stack>

                      {/* Muestra el mensaje de error si existe */}
                     
                    </TooltipCustom>
              ) : (<>
                      <input 
                          type="password" 
                          className="form-control" 
                          value={value}
                          disabled={lectura || noVisible}//Desactiva el select si solo tiene permisos de lectura y no visible
                      />
              </>)}     

              {/*Muestra errores si los tiene*/}
              {errores && (
                <small className="invalid-feedback" id="helpId">
                    <i className="bi bi-exclamation-circle"> {errores}</i>
                </small>
              )}
        </div> 
    </div>
  );
}

export default SelectAutoCompleteFormulario;
