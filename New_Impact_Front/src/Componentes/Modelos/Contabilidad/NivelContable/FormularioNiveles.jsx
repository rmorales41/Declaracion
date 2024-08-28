import React, { useState, useEffect } from 'react';
import "./FormularioNiveles.css";
import InputFormulario from "../../../Componentes/TextField/inputFormulario";
import Botones from "../../../Componentes/Boton/BotonesGuardarYCancelar";
import ValidaRestricciones from '../../../../Hooks/ValidaRestricciones';
import SinAccesoAlFormulario from '../../../Componentes/Errores/SinAccesoAlFormulario';
import AuthServices from '../../../../Servicios/AuthServices';

const FormularioNiveles = (props) => {
const { 
  manejoCambioImput,
  nuevo,
  editar,
  niveles,
  idFormulario,
  manejoImputValidacion,
  errores,
 
  } = props; // Extrae las props recibidas desde el componente PaisesNuevo

const manejoEventoSubmit = editar ? editar : nuevo; // Determina qué función debe ejecutar el formulario en función de la prop "modificar"
  const [sinPermisos, setSinPermisos] = useState(false);  
  const [restricciones, setRestricciones] = useState([]);
  const tituloNuevo = "Registrar Nuevo nivel contable";
  const tituloEditar = `Editar nivel contable ${niveles.niveles}`;
  const ruta = `/MantenimientoNiveles/${idFormulario}`

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

                                {/*Campo Nivel*/}
                                <InputFormulario
                                    classe={"col-md-3 position-relative"}
                                    type={"number"}
                                    nombreLabel={"Nivel contable"}
                                    titlelabel={"Ejemplo del Nivel contable:"}
                                    icono={<i className="bi bi-123"></i>}
                                    id={"Nivel"}
                                    name={"Nivel"}
                                    titleInput={"Digite el Nivel contable"}
                                    value={niveles.Nivel}
                                    onChange={manejoImputValidacion}
                                    onBlur={manejoImputValidacion}
                                    onKeyUp={manejoImputValidacion}
                                    errores={errores.Nombre}
                                    restricciones={restricciones}
                                    editarONuevo={props.editar}
                                    min={"1"} 
                                    max={"25"} 
                                    step={"1"}
                                    required = {true}
                                />

                                {/*Campo Nombre_Nivel*/}
                                <InputFormulario
                                    classe={"col-md-4 position-relative"}
                                    type={"text"}
                                    nombreLabel={"Nombre del nivel contable"}
                                    titlelabel={"Ejemplo del Nombre del nivel contable:"}
                                    icono={<i className="bi bi-alphabet-uppercase"></i>}
                                    id={"Nombre_Nivel"}
                                    name={"Nombre_Nivel"}
                                    titleInput={"Digite el Nombre del nivel contable"}
                                    value={niveles.Nombre_Nivel}
                                    onChange={manejoCambioImput}
                                    restricciones={restricciones}
                                    editarONuevo={props.editar}
                                    maxLength={"30"}
                                    required = {false}
                                />


                            {/*Botones gurdar nuevo registro o guardar cambios y cancelar 30*/}
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


export default FormularioNiveles;