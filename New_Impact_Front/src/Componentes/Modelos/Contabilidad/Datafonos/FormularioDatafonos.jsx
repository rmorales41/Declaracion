import React, { useState, useEffect } from 'react';
import "./FormularioDatafonos.css";
import InputFormulario from "../../../Componentes/TextField/inputFormulario";
import Botones from "../../../Componentes/Boton/BotonesGuardarYCancelar";
import ValidaRestricciones from '../../../../Hooks/ValidaRestricciones';
import SinAccesoAlFormulario from '../../../Componentes/Errores/SinAccesoAlFormulario';
import AuthServices from '../../../../Servicios/AuthServices';
import SelectAutoCompleteFormulario from "../../../Componentes/TextField/SelectAutoCompleteFormulario";

const FormularioDatafonos = (props) => {
const { 
  manejoCambioImput,
  nuevo,
  editar,
  datafono,
  idFormulario,
  manejoImputValidacion,
  errores,
  eventoCambioDeSelect, 
  propsCuentas_Bancarias, 
  listaDeCuentas_Bancarias,
  valorCuentas_Bancarias,
  propsBancos,            
  listaDeBancos,     
  valorBancos,
  propsFuncionarios,
  listaDeFuncionarios,
  valorFuncionarios,
 
  } = props; // Extrae las props recibidas desde el componente PaisesNuevo

const manejoEventoSubmit = editar ? editar : nuevo; // Determina qué función debe ejecutar el formulario en función de la prop "modificar"
  const [sinPermisos, setSinPermisos] = useState(false);  
  const [restricciones, setRestricciones] = useState([]);
  const tituloNuevo = "Registrar Datafonos";
  const tituloEditar = `Editar Datafono ${datafono.Identificador}`;
  const ruta = `/MantenimientoDatafonos/${idFormulario}`

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
                                    classe={"col-md-4 position-relative"}
                                    type={"text"}
                                    nombreLabel={"Identificador"}
                                    titlelabel={"Ejemplo del Identificador:"}
                                    icono={<i className="bi bi-123"></i>}
                                    id={"Identificador"}
                                    name={"Identificador"}
                                    titleInput={"Digite el Identificador del datafono"}
                                    value={datafono.Identificador}
                                    onChange={manejoImputValidacion}
                                    onBlur={manejoImputValidacion}
                                    onKeyUp={manejoImputValidacion}
                                    errores={errores.Nombre}
                                    restricciones={restricciones}
                                    editarONuevo={props.editar}
                                    maxLength={"50"}
                                    required = {true}
                                />


                                {/*Campo Comision*/}
                                <InputFormulario
                                    classe={"col-md-auto position-relative "}
                                    type={"number"}
                                    nombreLabel={"Comision"}
                                    titlelabel={"Ejemplo de la Comision:"}
                                    icono={<i className="bi bi-percent"></i>}
                                    id={"Comision"}
                                    name={"Comision"}
                                    titleInput={"Digite la comision"}
                                    value={datafono.Comision}
                                    onChange={manejoCambioImput}
                                    onBlur={manejoCambioImput}
                                    restricciones={restricciones}
                                    editarONuevo={props.editar}
                                    min={"0"} 
                                    max={"9999999999999"} 
                                    step={"0.001"}
                                  />  
                                

                                {/*Campo IDContabilidad_Cuentas_Bancarias */}                     
                                <SelectAutoCompleteFormulario
                                      classe={"col-auto position-relative"}
                                      nombreLabel={"Cuenta bancaria"}
                                      titlelabel={"Seleccione la cuenta bancaria"}
                                      icono={<i className="bi bi-credit-card"></i>}
                                      id={"IDContabilidad_Cuentas_Bancarias"}
                                      name={"IDContabilidad_Cuentas_Bancarias"}
                                      label = {datafono.IDContabilidad_Cuentas_Bancarias ? datafono.IDContabilidad_Cuentas_Bancarias.Cuenta_Numero  : "Seleccione una opción"} 
                                      ancho = {220} 
                                      defaultProps={propsCuentas_Bancarias}
                                      onChange={(event, value) => eventoCambioDeSelect(event, value, "IDContabilidad_Cuentas_Bancarias", valorCuentas_Bancarias)}
                                      restricciones={restricciones}
                                      editarONuevo={props.editar}
                                      valueAutocomplete = { 
                                          datafono.IDContabilidad_Cuentas_Bancarias
                                          ? listaDeCuentas_Bancarias.find(option => option.IDContabilidad_Cuentas_Bancarias === datafono.IDContabilidad_Cuentas_Bancarias) 
                                          : null
                                      }
                                  />  


                                {/*Campo IDConfiguracion_Bancos */}    
                                <SelectAutoCompleteFormulario
                                      classe={"col-auto position-relative"}
                                      nombreLabel={"Banco"}
                                      titlelabel={"Seleccione el banco"}
                                      icono={<i className="bi bi-bank2"></i>}
                                      id={"IDConfiguracion_Bancos"}
                                      name={"IDConfiguracion_Bancos"}
                                      label = {datafono.IDConfiguracion_Bancos ? datafono.IDConfiguracion_Bancos.Descripcion  : "Seleccione una opción"} 
                                      ancho = {220} 
                                      defaultProps={propsBancos}
                                      onChange={(event, value) => eventoCambioDeSelect(event, value, "IDConfiguracion_Bancos", valorBancos)}
                                      restricciones={restricciones}
                                      editarONuevo={props.editar}
                                      valueAutocomplete ={ 
                                          datafono.IDConfiguracion_Bancos
                                          ? listaDeBancos.find(option => option.IDConfiguracion_Bancos === datafono.IDConfiguracion_Bancos) 
                                          : null
                                      }
                                  /> 


                                {/*Campo IDPlanilla_Funcionarios */}    
                                <SelectAutoCompleteFormulario
                                      classe={"col-auto position-relative"}
                                      nombreLabel={"Funcionario"}
                                      titlelabel={"Seleccione un Funcionario"}
                                      icono={<i className="bi bi-person-vcard"></i>}
                                      id={"IDPlanilla_Funcionarios"}
                                      name={"IDPlanilla_Funcionarios"}
                                      label = {datafono.IDPlanilla_Funcionarios ? datafono.IDPlanilla_Funcionarios.Descripcion  : "Seleccione una opción"} 
                                      ancho = {220} 
                                      defaultProps={propsFuncionarios}
                                      onChange={(event, value) => eventoCambioDeSelect(event, value, "IDPlanilla_Funcionarios", valorFuncionarios)}
                                      restricciones={restricciones}
                                      editarONuevo={props.editar}
                                     valueAutocomplete = {
                                          datafono.IDPlanilla_Funcionarios
                                          ? listaDeFuncionarios.find(option => option.IDPlanilla_Funcionarios === datafono.IDPlanilla_Funcionarios) 
                                          : null
                                     }
                                      required = {true}
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


export default FormularioDatafonos;