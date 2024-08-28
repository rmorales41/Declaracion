import React, {useState, useEffect} from "react";
import "./inputFormulario.css"
import Radio from '@mui/material/Radio';
import RadioGroup from '@mui/material/RadioGroup';
import FormControlLabel from '@mui/material/FormControlLabel';
import FormControl from '@mui/material/FormControl';
import FormLabel from '@mui/material/FormLabel';
import Alert from '@mui/material/Alert';
import "./RadioButtonFormulario.css"

const RadioButtonFormulario = ({
  value1,value2, classe, nombreLabel, errores, id, name, label1, label2, labelPlacement1, labelPlacement2, 
  onChange, onBlur,required, restricciones, editarONuevo, disabled, title, ancho, titulo, nombreSpan, 
  selectedValue, onValueChange
}) => {
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
    <div className={classe} style={{ width: ancho }}> {/* Aplica el ancho aquí */}

      {/*Este es titulo que va arriba input*/}
      <label className="form-label label_formularios" style={{display:"flex", color:"rgb(63, 63, 63)"}}>{nombreLabel}</label>

        {/*Este es el Icono que va antes del input*/}
        <div className="input-group has-validation">
          <span 
            className={`input-group-text span-RadioButton`} 
          >
            {nombreSpan}
          </span>
            {/*Este radio button*/}
              <FormControl component="fieldset" required={required}>
              <FormLabel id="demo-form-control-label-placement">{titulo}</FormLabel>
              <RadioGroup
                  row
                  name="position"
                  value={selectedValue}
                  onChange={(e) => onValueChange(e.target.value === 'true')}
                >
              
                <FormControlLabel
                  value={value1}
                  control={<Radio />}
                  label={label1}
                  labelPlacement={labelPlacement1}
                  title={title}
                  id={id}
                  name={name}
                  disabled={lectura || noVisible || soloLectura || disabled}
                  onChange={onChange}
                  onBlur={onBlur}
                  
                />

                <FormControlLabel
                  value={value2}
                  control={<Radio />}
                  label={label2}
                  labelPlacement={labelPlacement2}
                  title={title}
                  id={id}
                  name={name}
                  disabled={lectura || noVisible || soloLectura || disabled}
                  onChange={onChange}
                  onBlur={onBlur}
                />
              
              </RadioGroup>
            </FormControl>
          {/*Muestra errores si los tiene*/}
          {errores && (
            <Alert severity="error">{errores}</Alert>
          )}

        </div>

    </div>
  );
}

export default RadioButtonFormulario;
