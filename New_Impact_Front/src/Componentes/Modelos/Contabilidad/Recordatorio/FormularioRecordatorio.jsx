import React, { useState, useEffect } from 'react';
import "./FormularioRecordatorio.css";
import InputFormulario from "../../../Componentes/TextField/inputFormulario";
import TextAreaFormulario from '../../../Componentes/TextField/TextareaFormulario';
import Botones from "../../../Componentes/Boton/BotonesGuardarYCancelar";
import ValidaRestricciones from '../../../../Hooks/ValidaRestricciones';
import SinAccesoAlFormulario from '../../../Componentes/Errores/SinAccesoAlFormulario';
import AuthServices from '../../../../Servicios/AuthServices';
import useTooltipCustom  from '../../../Componentes/Tooltip/Tooltip';
import RestriccionesXFormularios from "../../../../Servicios/UsuariosServicios/RestriccionesXFormularios"

const FormularioRecordatorio = (props) => {
const { 
  manejoCambioImput,
  nuevo,
  editar,
  recordatorio,
  idFormulario,
  llamadoDesdeUnModal,
  onClickCancelar,
  remove,
  Id,
  modificar,
  } = props; // Extrae las props recibidas desde el componente PaisesNuevo

const manejoEventoSubmit = editar ? editar : nuevo; // Determina qué función debe ejecutar el formulario en función de la prop "modificar"
  const [sinPermisos, setSinPermisos] = useState(false);  
  const [restricciones, setRestricciones] = useState([]);
  const tituloNuevo = "Registrar recordatorio.";
  const tituloEditar = `Editar recordatorio `;
  const ruta = `/MantenimientoRecordatorio/${idFormulario}`
  const TooltipCustom = useTooltipCustom();// Para renderizar el componente useTooltipCustom 
  const [general, setGeneral] = useState(false);

  //Se válida las restricciones cada vez que se refresca la página o se cambia el idFormulario
  useEffect(() => {
    const obtenerRestricciones = async () => {
      try {
        const codigo_compania =  AuthServices.getCodigoCompania();
        const data = await ValidaRestricciones.validar(idFormulario, codigo_compania);//Invoca o llama el hook para validaciones de restricciones por usuarios
        setRestricciones(data);// La constante restricciones guarda lo que devuelve el hook, en este caso las restricciones que es un array
        setSinPermisos(false); // Tiene acceso a este formulario
      } catch (error) {
        console.error(error);
        setSinPermisos(true); // No Tiene acceso a este formulario, y muestra un mensaje de advertencia
      }
    };
    obtenerRestricciones();
  }, [idFormulario]);


  //Válida que el usuario tenga restricciones
  useEffect(() => {
    const restriccionesXFormularios = () => {
      const token = AuthServices.getAuthToken()// Trae el token que se gurdo en el localStores cuando se logueo
      const codigo_compania = AuthServices.getCodigoCompania();
      if (!ValidaRestricciones.ValidarToken(token)) {return;}//valida el token

        RestriccionesXFormularios.setAuthToken(token);
        RestriccionesXFormularios.getRestricciones(idFormulario, codigo_compania)
          .then(response => {
            const restriccionForm = response.data.formulario.restriccion_form;
            const restriccionEstado = {// Definir un objeto para mapear los valores de restricción a las funciones de estado
              "General": setGeneral,
            };
              if (restriccionEstado.hasOwnProperty(restriccionForm)) { // Verificar si el valor de restricción está en el objeto, y si es así, llamar a la función de estado correspondiente
                restriccionEstado[restriccionForm](true);
              } else { // Si el valor no está en el objeto, establecer todas las variables de estado en false
                setGeneral(false);
              }
            setSinPermisos(false)
          })
          .catch(e => {//try catch
            setSinPermisos(true)
            ValidaRestricciones.capturaDeErrores(e);
          });
    };
    restriccionesXFormularios();
  }, [idFormulario]);
  
 
  return (  
    <div className="container_formuario" >
        {!sinPermisos ? (
        <>
            <div className="card">
                <div className="card-body">
                {props.editar ?  
                    <h3 className="h3_title">{tituloEditar}</h3> 
                    :
                    <h3 className="h3_title">{tituloNuevo}</h3>
                }
                    <blockquote className="blockquote mb-0 ">
                        <form onSubmit={ (e) => {
                            e.preventDefault ()
                            manejoEventoSubmit ()
                            }} 
                            className="row g-3 needs-validation my-3 form_formuario">
                              
                               {/*Campo Frecuencia_Dias*/}
                               <InputFormulario
                                    classe={"col-auto position-relative"}
                                    type={"number"}
                                    nombreLabel={"Frecuencias de días."}
                                    titlelabel={"Ejemplo de Frecuencias de días: 15"}
                                    icono={<i className="bi bi-calendar-date"></i>}
                                    id={"Frecuencia_Dias"}
                                    name={"Frecuencia_Dias"}
                                    titleInput={"Ingrese la frecuencia con la que desea recibir el recordatorio."}
                                    value={recordatorio.Frecuencia_Dias}
                                    onChange={manejoCambioImput}
                                    onBlur={manejoCambioImput}
                                    restricciones={restricciones}
                                    editarONuevo={props.editar}
                                    min={"0"} 
                                    max={"9999999999"} 
                                    required = {true}
                                />

                              {/*Campo Observaciones*/}
                              <TextAreaFormulario
                                    classe={"col-auto position-relative"}
                                    nombreLabel={"Observaciones del recordatorio."}
                                    titlelabel={"Ejemplo de Observaciones."}
                                    icono={<i className="bi bi-alphabet-uppercase"></i>}
                                    id={"Observaciones"}
                                    name={"Observaciones"}
                                    titleInput={"Digite las observaciones del recordatorio."}
                                    value={recordatorio.Observaciones}
                                    onChange={manejoCambioImput}
                                    onBlur={manejoCambioImput}
                                    restricciones={restricciones}
                                    editarONuevo={props.editar}
                                    row={"1"}
                               />
 
                            {/*Botones gurdar nuevo registro o guardar cambios y cancelar*/}
                            <Botones
                                editar={props.editar ? "Clic para guardar los cambios del registro" : "Clic para guardar el nuevo registro"}
                                ruta={llamadoDesdeUnModal ? null : ruta}
                                restricciones = {restricciones}
                                onClickCancelar={llamadoDesdeUnModal ? onClickCancelar : null }
                                cuerpo={
                                  <>
                                   {modificar ? 
                                    (<>
                                    {/*Boton de eliminar con checks seleccionados*/}
                                      <div className="btns-opciones">
                                        <TooltipCustom title="Clic para eliminar todos los registros seleccionados"> 
                                        <button
                                            className="btn btn-danger"
                                            onClick={(e) => {
                                              e.preventDefault();
                                              if (general) remove(Id); // Llamar a la función `remove` con el ID si `general` es verdadero
                                            }}
                                            disabled={!general}
                                            style={{ marginRight:"-6%", 
                                              fontFamily: "var(--fontFamily-drawer)", 
                                              fontSize: "calc(var(--fontSize-drawer) - 2px)"
                                            }} 
                                        >
                                          <i className="bi bi-trash3"></i> Eliminar
                                        </button>
                                          </TooltipCustom>
                                      </div>
                                    </>):(<></>)}
                                  </>
                                }
                            />

                           
                        </form>
                    </blockquote>

                </div>
            </div>
        </>
        ):(
        <>
            {/*En el caso que no tenga permiso de ver del todo el formulario*/}
            <SinAccesoAlFormulario/>
        </>
        )}

    </div>
    );
};


export default FormularioRecordatorio;