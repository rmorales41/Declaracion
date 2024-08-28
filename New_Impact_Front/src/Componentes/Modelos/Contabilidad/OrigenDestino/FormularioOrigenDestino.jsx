import React, { useState, useEffect } from 'react';
import "./FormularioOrigenDestino.css";
import InputFormulario from "../../../Componentes/TextField/inputFormulario";
import TextAreaFormulario from "../../../Componentes/TextField/TextareaFormulario";
import Botones from "../../../Componentes/Boton/BotonesGuardarYCancelar";
import ValidaRestricciones from '../../../../Hooks/ValidaRestricciones';
import SinAccesoAlFormulario from '../../../Componentes/Errores/SinAccesoAlFormulario';
import SwitchFormulario from '../../../Componentes/TextField/SwitchFormulario';
import AuthServices from '../../../../Servicios/AuthServices';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import {faPowerOff} from '@fortawesome/free-solid-svg-icons'; 

const FormularioOrigenDestino = (props) => {
const { 
  manejoCambioImput,
  nuevo,
  editar,
  origenDestino,
  idFormulario,
  setOrigenDestino,
  manejoImputValidacion,
  errores,
 
  } = props; // Extrae las props recibidas desde el componente PaisesNuevo

const manejoEventoSubmit = editar ? editar : nuevo; // Determina qué función debe ejecutar el formulario en función de la prop "modificar"
  const [sinPermisos, setSinPermisos] = useState(false);  
  const [restricciones, setRestricciones] = useState([]);
  const tituloNuevo = "Registrar Nuevo Origen  y Destino";
  const tituloEditar = `Editar Origen y Destino ${origenDestino.Descripcion}`;
  const ruta = `/MantenimientoOrigenDestino/${idFormulario}`

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

                                {/*Campo Codigo*/}
                                <InputFormulario
                                    classe={"col-md-4 position-relative"}
                                    type={"text"}
                                    nombreLabel={"Código del Origen y destinto"}
                                    titlelabel={"Ejemplo del Código del Origen y destinto:"}
                                    icono={<i className="bi bi-123"></i>}
                                    id={"Codigo"}
                                    name={"Codigo"}
                                    titleInput={"Digite el Código del Origen y destinto"}
                                    value={origenDestino.Codigo}
                                    onChange={manejoImputValidacion}
                                    onBlur={manejoImputValidacion}
                                    onKeyUp={manejoImputValidacion}
                                    errores={errores.Nombre}
                                    restricciones={restricciones}
                                    editarONuevo={props.editar}
                                    maxLength={"10"}
                                    required = {true}
                                />

                                {/*Campo Descripcion*/}
                                <InputFormulario
                                    classe={"col-md-4 position-relative"}
                                    type={"text"}
                                    nombreLabel={"Descripción del Origen y destinto"}
                                    titlelabel={"Ejemplo de la descripción del Origen y destinto:"}
                                    icono={ <i className="bi bi-pencil-square"></i>}
                                    id={"Descripcion"}
                                    name={"Descripcion"}
                                    titleInput={"Digite la descripción del Origen y destinto"}
                                    value={origenDestino.Descripcion}
                                    onChange={manejoCambioImput}
                                    restricciones={restricciones}
                                    editarONuevo={props.editar}
                                    maxLength={"180"}
                                    required = {true}
                                />

                                {/*Campo Estado*/}
                                <SwitchFormulario
                                    classe={"col-md-3 position-relative"}
                                    nombreLabel={"Estado"}
                                    titlelabel={"Ejemplo de Estado: "}
                                    icono={<FontAwesomeIcon icon={faPowerOff}/>}
                                    id={"Estado"}
                                    name={"Estado"}
                                    value={props.editar ? origenDestino.Estado : true }
                                    onChange={(isChecked) => {
                                      setOrigenDestino(prevObjeto => ({
                                        ...prevObjeto,
                                        Estado: isChecked
                                      }));
                                    }}
                                    textStart={"Inactivo"} 
                                    textEnd={"Activo"}
                                    disabled={false}
                                    restricciones={restricciones}
                                    editarONuevo={props.editar}
                                />

                                {/*Campo Observaciones*/}
                                <TextAreaFormulario
                                    classe={"col-md-5 position-relative"}
                                    nombreLabel={"Observaciones del Origen y destinto "}
                                    titlelabel={"Ejemplo de las Observaciones de Origen y destinto:"}
                                    icono={<i className="bi bi-pencil-square"></i>}
                                    id={"Observaciones"}
                                    name={"Observaciones"}
                                    titleInput={"Digite las Observaciones del Origen y destinto"}
                                    value={origenDestino.Observaciones}
                                    onChange={manejoCambioImput}
                                    restricciones={restricciones}
                                    editarONuevo={props.editar}
                                    row={"1"}
                                />

 
                            {/*Botones gurdar nuevo registro o guardar cambios y cancelar */}
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


export default FormularioOrigenDestino;