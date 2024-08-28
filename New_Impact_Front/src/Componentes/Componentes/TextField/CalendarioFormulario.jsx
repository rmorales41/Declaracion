import React, {useState, useEffect} from "react";
import useTooltipCustom from '../Tooltip/Tooltip';
import "./CalendarioFormulario.css"
import { DemoContainer } from '@mui/x-date-pickers/internals/demo';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { DatePicker } from '@mui/x-date-pickers/DatePicker';
import Alert from '@mui/material/Alert';
import dayjs from 'dayjs';

const CalendarioFormulario = ({
  classe, 
  nombreLabel, 
  errores, 
  id, 
  name, 
  titleInput, 
  value,  
  onChange, 
  required, 
  restricciones, 
  editarONuevo,
  disabled,  
  onBlur,
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
        {/*Este es el Icono que va antes del input*/}
        <TooltipCustom title={titleInput}> 
          <div className="input-group has-validation">
              {/*Este es input*/}
              <LocalizationProvider dateAdapter={AdapterDayjs} >
                <DemoContainer components={['DatePicker']}>
                  <DatePicker 
                    id={id}
                    name={name}
                    label={nombreLabel} 
                    onChange={onChange} 
                    onBlur={onBlur}
                    value={value ? dayjs(value) : null}
                    isRequired={required} 
                    disabled={lectura || noVisible || soloLectura || disabled}
                    slotProps={{
                      textField: {
                        required: required,
                      },
                    }}
                    format="DD/MM/YYYY" // Formato de la fecha español, si la quita el formato original es MM/DD/YYYY
                    />
                </DemoContainer>
              </LocalizationProvider>
          </div>
        </TooltipCustom>
      
        {/*Muestra errores si los tiene*/}
        {errores && (
          <Alert severity="error">{errores}</Alert>
        )}

    </div>
  );
}

export default CalendarioFormulario;
