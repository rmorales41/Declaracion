import React, { useState, useEffect } from "react";
import Radio from '@mui/material/Radio';
import RadioGroup from '@mui/material/RadioGroup';
import FormControlLabel from '@mui/material/FormControlLabel';
import FormControl from '@mui/material/FormControl';
import FormLabel from '@mui/material/FormLabel';
import Alert from '@mui/material/Alert';

const GrupoRadioButtonFormulario = ({
  options, classe, nombreLabel, errores, required, restricciones, editarONuevo, 
  ancho, titulo, nombreSpan,selectedValue, onValueChange, margenb, margenl 
}) => {

  const [soloLectura, setSoloLectura] = useState(false);

  useEffect(() => {
    if (editarONuevo && restricciones && restricciones.formulario) {
      if (restricciones.formulario.restriccion_form === "Lectura") {
        setSoloLectura(true);
      } else {
        setSoloLectura(false);
      }
    }
  }, [editarONuevo, restricciones, options]);

  return (
    <div className={classe} style={{ width: ancho }}>
      <label className="form-label label_formularios" style={{ display: "flex", color: "rgb(63, 63, 63)" }}>{nombreLabel}</label>
      <div className="input-group has-validation">
        {nombreSpan && (<span className={`input-group-text span-RadioButton`}>{nombreSpan}</span>)}
        
        <FormControl required={required}>
          <FormLabel id="demo-radio-buttons-group-label">{titulo}</FormLabel>
          <RadioGroup
            aria-labelledby="demo-radio-buttons-group-label"
            name="grupo-radio-mayorizacion"
            value={selectedValue}
            onChange={(e) => onValueChange(e.target.value)}
          >
          {options.map((option, index) => {
              // Determinar si el componente debe estar deshabilitado
              let isDisabled = false;
              let isVisible = true; // Variable para controlar la visibilidad

              if (restricciones && restricciones.formulario) {
                const restriccionesXid = restricciones.formulario.campos.find(
                  restriccionActual => restriccionActual.nombre === option.id
                )?.restriccion_field;
                
                isDisabled = restriccionesXid === "Lectura";
                isVisible = restriccionesXid !== "Novisible"; // Controlar la visibilidad aquí
              }
              
              isDisabled = isDisabled || soloLectura || option.disabled;

              // Renderizar el FormControlLabel solo si isVisible es true
              return isVisible ? (
                <FormControlLabel
                  key={index}
                  value={option.value} // Asigna null al value solo cuando el componente está deshabilitado
                  control={<Radio />}
                  label={option.label}
                  labelPlacement={option.labelPlacement}
                  title={option.title}
                  id={option.id}
                  name={option.name}
                  disabled={isDisabled}
                  onChange={option.onChange}
                  onBlur={option.onBlur}
                  onMouseEnter={option.onMouseEnter}
                  onMouseLeave={option.onMouseLeave}
                  sx={{ mb: margenb, ml: margenl }} // Reducir el margen inferior entre las etiquetas
                />
              ) : null;
            })}
          </RadioGroup>
        </FormControl>
        {errores && (
          <Alert severity="error">{errores}</Alert>
        )}
      </div>
    </div>
  );
}

export default GrupoRadioButtonFormulario;