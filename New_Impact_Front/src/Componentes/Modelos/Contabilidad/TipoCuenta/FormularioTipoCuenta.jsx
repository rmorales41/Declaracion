import React, { useState, useEffect } from 'react';
import "./FormularioTipoCuenta.css";
import InputFormulario from "../../../Componentes/TextField/inputFormulario";
import Botones from "../../../Componentes/Boton/BotonesGuardarYCancelar";
import ValidaRestricciones from '../../../../Hooks/ValidaRestricciones';
import SinAccesoAlFormulario from '../../../Componentes/Errores/SinAccesoAlFormulario';
import AuthServices from '../../../../Servicios/AuthServices';
import SwitchFormulario from '../../../Componentes/TextField/SwitchFormulario';

const FormularioTipoCuenta = (props) => {
const { 
  manejoCambioImput,
  nuevo,
  editar,
  tipoCuenta,
  setTipoCuenta,
  idFormulario,
  manejoImputValidacion,
  errores,
  } = props; // Extrae las props recibidas desde el componente PaisesNuevo

const manejoEventoSubmit = editar ? editar : nuevo; // Determina qué función debe ejecutar el formulario en función de la prop "modificar"
  const [sinPermisos, setSinPermisos] = useState(false);  
  const [restricciones, setRestricciones] = useState([]);
  const tituloNuevo = "Registrar Nuevo tipo de cuenta contable";
  const tituloEditar = `Editar tipo de cuenta contable ${tipoCuenta.Identificador}`;
  const ruta = `/MantenimientoTipoCuenta/${idFormulario}`

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

                                {/*Campo Identificador*/}
                                <InputFormulario
                                    classe={"col-md-2 position-relative"}
                                    type={"text"}
                                    nombreLabel={"Identificador"}
                                    titlelabel={"Ejemplo de Identificador:"}
                                    icono={<i className="bi bi-123"></i>}
                                    id={"Identificador"}
                                    name={"Identificador"}
                                    titleInput={"Digite el Identificador del tipo de cuenta contable"}
                                    value={tipoCuenta.Identificador}
                                    onChange={manejoImputValidacion}
                                    onBlur={manejoImputValidacion}
                                    onKeyUp={manejoImputValidacion}
                                    errores={errores.Nombre}
                                    restricciones={restricciones}
                                    editarONuevo={props.editar}
                                    maxLength={"2"}
                                    required = {true}
                                />

                                {/*Campo Detalle*/}
                                <InputFormulario
                                    classe={"col-md-3 position-relative"}
                                    type={"text"}
                                    nombreLabel={"Detalle"}
                                    titlelabel={"Ejemplo del Detalle de tipo de cuenta:"}
                                    icono={<i className="bi bi-123"></i>}
                                    id={"Detalle"}
                                    name={"Detalle"}
                                    titleInput={"Digite el Detalle del tipo de cuenta contable"}
                                    value={tipoCuenta.Detalle}
                                    onChange={manejoCambioImput}
                                    onKeyUp={manejoCambioImput}
                                    restricciones={restricciones}
                                    editarONuevo={props.editar}
                                    maxLength={"25"}
                                    required = {true}
                                />


                                {/*Campo Origen_Destino*/}
                                <SwitchFormulario
                                    classe={"col-auto position-relative"}
                                    nombreLabel={"Permiete Origen y Destino"}
                                    titlelabel={"Seleccione si permite Origen y Destino"}
                                    icono={<i className="bi bi-bar-chart-steps"></i>}
                                    id={"Origen_Destino"}
                                    name={"Origen_Destino"}
                                    value={tipoCuenta.Origen_Destino}
                                    onChange={(isChecked) => {
                                      setTipoCuenta(prevObjeto => ({
                                        ...prevObjeto,
                                        Origen_Destino: isChecked
                                      }));
                                    }}
                                    textStart={"No"} 
                                    textEnd={"Si"}
                                    restricciones={restricciones}
                                    editarONuevo={props.editar}
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


export default FormularioTipoCuenta;