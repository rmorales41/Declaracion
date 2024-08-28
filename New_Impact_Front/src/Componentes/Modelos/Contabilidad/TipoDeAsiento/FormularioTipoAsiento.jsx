import React, { useState, useEffect } from 'react';
import "./FormularioTipoAsiento.css";
import InputFormulario from "../../../Componentes/TextField/inputFormulario";
import Botones from "../../../Componentes/Boton/BotonesGuardarYCancelar";
import ValidaRestricciones from '../../../../Hooks/ValidaRestricciones';
import SinAccesoAlFormulario from '../../../Componentes/Errores/SinAccesoAlFormulario';
import AuthServices from '../../../../Servicios/AuthServices';

const FormularioTipoAsiento = (props) => {
const { 
  manejoCambioImput,
  nuevo,
  editar,
  tipoAsiento,
  idFormulario,
  manejoImputValidacion,
  errores,
  } = props; // Extrae las props recibidas desde el componente PaisesNuevo

const manejoEventoSubmit = editar ? editar : nuevo; // Determina qué función debe ejecutar el formulario en función de la prop "modificar"
  const [sinPermisos, setSinPermisos] = useState(false);  
  const [restricciones, setRestricciones] = useState([]);
  const tituloNuevo = "Registrar tipo de asiento.";
  const tituloEditar = `Editar tipo de asiento `;
  const ruta = `/MantenimientoTipoAsiento/${idFormulario}`

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
                              
                                {/*Campo Descripcion*/}
                                <InputFormulario
                                    classe={"col-auto position-relative"}
                                    type={"text"}
                                    nombreLabel={"Descripción"}
                                    titlelabel={"Ejemplo de la Descripción"}
                                    icono={ <i className="bi bi-translate"> </i>}
                                    id={"Descripcion"}
                                    name={"Descripcion"}
                                    titleInput={"Ingrese la descripción del tipo de asiento."}
                                    value={tipoAsiento.Descripcion}
                                    onChange={manejoCambioImput}
                                    onBlur={manejoCambioImput}
                                    restricciones={restricciones}
                                    editarONuevo={props.editar}
                                    maxLength={"50"}
                                    required = {true}
                                />

                                {/*Campo Indicador*/}
                                <InputFormulario
                                    classe={"col-md-3 position-relative"}
                                    type={"text"}
                                    nombreLabel={"Indicador."}
                                    titlelabel={"Ejemplo de Indicador: 015"}
                                    icono={<i className="bi bi-123"></i>}
                                    id={"Indicador"}
                                    name={"Indicador"}
                                    titleInput={"Ingrese el Indicador del tipo de asiento."}
                                    value={tipoAsiento.Indicador}
                                    onChange={manejoImputValidacion}
                                    onBlur={manejoImputValidacion}
                                    onKeyUp={manejoImputValidacion}
                                    restricciones={restricciones}
                                    editarONuevo={props.editar}
                                    maxLength={"3"}
                                    errores={errores.Nombre}
                                    required = {true}
                                />

                            {/*Botones gurdar nuevo registro o guardar cambios y cancelar*/}
                            <Botones
                                editar={props.editar ? "Clic para guardar los cambios del registro" : "Clic para guardar el nuevo registro"}
                                ruta={ruta}
                                restricciones = {restricciones}
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


export default FormularioTipoAsiento;