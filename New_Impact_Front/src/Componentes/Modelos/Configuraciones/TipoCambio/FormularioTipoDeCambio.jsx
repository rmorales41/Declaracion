import React, { useState, useEffect } from 'react';
import "./FormularioTipoDeCambio.css";
import InputFormulario from "../../../Componentes/TextField/inputFormulario";
import Botones from "../../../Componentes/Boton/BotonesGuardarYCancelar";
import ValidaRestricciones from '../../../../Hooks/ValidaRestricciones';
import SinAccesoAlFormulario from '../../../Componentes/Errores/SinAccesoAlFormulario';
import AuthServices from '../../../../Servicios/AuthServices';
import CalendarioFormulario from '../../../Componentes/TextField/CalendarioFormulario';

const FormularioTipoDeCambio = (props) => {
const { 
  manejoCambioImput,
  nuevo,
  editar,
  tipoDeCambio,
  idFormulario,
  errores,
  eventoObtenerFecha,
  cantidadDecimales, 
  llamadoDesdeUnModal,
  onClickCancelar,
  } = props; // Extrae las props recibidas desde el componente PaisesNuevo

const manejoEventoSubmit = editar ? editar : nuevo; // Determina qué función debe ejecutar el formulario en función de la prop "modificar"
  const [sinPermisos, setSinPermisos] = useState(false);  
  const [restricciones, setRestricciones] = useState([]);
  const tituloNuevo = "Registrar tipo de Cambio";
  const tituloEditar = `Editar tipo de Cambio ${tipoDeCambio.Fecha}`;
  const ruta = `/MantenimientoTipoCambio/${idFormulario}`

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

                              {/*Campo Fecha*/}
                              <CalendarioFormulario
                                    classe={"col-auto position-relative"}
                                    titlelabel={"Ejemplo de la fecha tipo de cambio contable: "}
                                    id={"Fecha"}
                                    name={"Fecha"}
                                    nombreLabel={"Fecha Tipo de cambio"}
                                    value={tipoDeCambio.Fecha}
                                    onChange={(date) => eventoObtenerFecha(date, "Fecha")}
                                    restricciones={restricciones}
                                    editarONuevo={props.editar}
                                    errores={errores.Nombre}
                                    required = {true}
                                />   
                              
                               {/*Campo Compra*/}
                               <InputFormulario
                                    classe={"col-auto position-relative"}
                                    type={"number"}
                                    nombreLabel={"Compra"}
                                    titlelabel={"Ejemplo del tipo de cambio Compra: "}
                                    icono={<i className="bi bi-currency-exchange"></i>}
                                    id={"Compra"}
                                    name={"Compra"}
                                    titleInput={"Digite el tipo de cambio Compra"}
                                    value={tipoDeCambio.Compra}
                                    onChange={manejoCambioImput}
                                    onBlur={manejoCambioImput}
                                    restricciones={restricciones}
                                    editarONuevo={props.editar}
                                    min={"0"} 
                                    max={"999999999999999999"} 
                                    step={cantidadDecimales}
                                    required = {true}
                                />

                              {/*Campo Venta*/}
                               <InputFormulario
                                    classe={"col-auto position-relative"}
                                    type={"number"}
                                    nombreLabel={"Venta"}
                                    titlelabel={"Ejemplo del tipo de cambio Venta: "}
                                    icono={<i className="bi bi-currency-exchange"></i>}
                                    id={"Venta"}
                                    name={"Venta"}
                                    titleInput={"Digite el tipo de cambio Venta"}
                                    value={tipoDeCambio.Venta}
                                    onChange={manejoCambioImput}
                                    onBlur={manejoCambioImput}
                                    restricciones={restricciones}
                                    editarONuevo={props.editar}
                                    min={"0"} 
                                    max={"999999999999999999"} 
                                    step={cantidadDecimales}
                                    required = {true}
                                />

                              {/*Campo Personalizado*/}
                               <InputFormulario
                                    classe={"col-auto position-relative"}
                                    type={"number"}
                                    nombreLabel={"Personalizado"}
                                    titlelabel={"Ejemplo del tipo de cambio Personalizado: "}
                                    icono={<i className="bi bi-currency-exchange"></i>}
                                    id={"Personalizado"}
                                    name={"Personalizado"}
                                    titleInput={"Digite el tipo de cambio Personalizado"}
                                    value={tipoDeCambio.Personalizado}
                                    onChange={manejoCambioImput}
                                    onBlur={manejoCambioImput}
                                    restricciones={restricciones}
                                    editarONuevo={props.editar}
                                    min={"0"} 
                                    max={"999999999999999999"} 
                                    step={cantidadDecimales}
                                    required = {false}
                                />

                            {/*Botones gurdar nuevo registro o guardar cambios y cancelar*/}
                            <Botones
                                editar={props.editar ? "Clic para guardar los cambios del registro" : "Clic para guardar el nuevo registro"}
                                ruta={llamadoDesdeUnModal ? null : ruta}
                                restricciones = {restricciones}
                                onClickCancelar={llamadoDesdeUnModal ? onClickCancelar : null }
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


export default FormularioTipoDeCambio;