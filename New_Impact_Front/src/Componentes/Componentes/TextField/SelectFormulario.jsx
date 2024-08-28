import React,{useEffect, useState} from "react"
import useTooltipCustom from '../Tooltip/Tooltip';
import "./SelectFormulario.css"

const SelectFormulario = (
  { editar, classeDiv, label, title, icono, name, id, titleSelect, selectOption, onClick, 
    onBlur, onChangeEditar, defaul, setDefaul, value,  detalle, onMouseDown, onMouseUp, 
    onChangeNuevo, mapEditar, mapNuevo, error, restricciones, editarONuevo, tituloNuevo,
    disabled
  }) =>{

  const TooltipCustom = useTooltipCustom();// Para renderizar el componente useTooltipCustom
  const [lectura, setLectura] = useState(false);
  const [noVisible, setNoVisible] = useState(false);
  const [soloLectura, setSoloLectura] = useState(false);

  //Validaciones por cada campo
  useEffect(() => {
    if(editarONuevo){//Valida si es para el formulario editar
        if(restricciones){
            if(restricciones.formulario){// Siempre se tiene que validar si viene vacío restricciones.formulario, para que no dé error.
                if(restricciones.formulario.restriccion_form === "Lectura"){
                    setSoloLectura(true)
                }else{
                    setSoloLectura(false)
                }
              const restriccionId = restricciones.formulario.campos.find(restriccionActual => restriccionActual.nombre === id);
                if (restriccionId){// Siempre se tiene que validar si viene vacío restriccionId
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

  return(
        <>
          { editar ? 
              <>{/*Campo Seleccionar para editar registro*/}
                <div className={classeDiv}>
                  <label className="form-label label_formularioPaises">{label}</label>
                    <div className="input-group has-validation">
                        <TooltipCustom title={title}>
                          <span className="input-group-text">
                            {icono}
                           </span>
                        </TooltipCustom>
                        {!noVisible ? (
                            <select className="form-select selected_formularioPaises"
                              name={name}
                              id={id}
                              title={titleSelect}
                              onClick={onClick}
                              onBlur={onBlur}
                              onChange={ (event)=>{
                                onChangeEditar(event)
                                setDefaul(true)
                              }}
                              defaultValue = ' '
                              disabled={lectura || noVisible || soloLectura || disabled}//Desactiva el select si solo tiene permisos de lectura y no visible
                              required> 
                              {!defaul ?  
                                  <option 
                                     value={value}
                                  >
                                    {detalle}
                                  </option>
                                : <> </>}
                              {/*Si la variable default es false, muestras el option selectOption, a lo contrario, solo muestra lo del map*/}
                              {/*!defaul ? <option value = " " selected>{selectOption}</option> : <> </>*/}
                              {mapEditar}
                          </select>        
                       ) : (<>
                          <input 
                            type="password" 
                            className="form-control" 
                            value={value}
                            disabled={lectura || noVisible}//Desactiva el select si solo tiene permisos de lectura y no visible
                            />
                       </>)}              
                    </div>
                </div>
              </> 
        : 
              <>{/*Campo Seleccionar para nuevo registro*/}
              
              <div className={classeDiv}>
                  <label className="form-label label_formularioPaises">{label}</label>
                    <div className="input-group has-validation">
                      <TooltipCustom  title={tituloNuevo}>
                        <span className="input-group-text">
                          {icono}
                        </span>
                      </TooltipCustom>
                      {/*Válida errorsinSeleccionar.sinSeleccionar, si trae algo, le agrega la clase is-invalid a la claseform-select selected_formularioPaises en lo contrario, solo llama la clase form-select selected_formularioPaises*/}
                      <select className={
                          ((error) ? 
                            "form-select selected_formularioPaises is-invalid" 
                          :
                            "form-select selected_formularioPaises")} 
                              name={name}
                              id={id}
                              title={titleSelect}
                              onClick={ (event)=>{ onClick(event) }}
                              onBlur={ (event)=>{ onBlur(event)}}
                              onMouseDown={ (event)=>{ onMouseDown(event) }}
                              onMouseUp={ (event)=>{ onMouseUp(event)}}
                              onChange={ (event)=>{
                                onChangeNuevo(event)
                                setDefaul(true)
                              }}
                              defaultValue = ' '
                              required> 
                              {!defaul ? <option value = " " selected>{selectOption}</option> : <> </>}
                              {mapNuevo}

                      </select>
                       
                      {/* Muestra el mensaje de error si existe */}
                        {error && (
                          <small className="invalid-feedback" id="helpId">
                            <i className="bi bi-exclamation-circle"> {error}</i>
                          </small>
                        )}            
                    </div>
                </div>
              </> 
          }

      </>
  )};

export default SelectFormulario;