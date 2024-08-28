import React, { useState, useEffect } from 'react';
import "./FormularioCatalogo.css";
import InputFormulario from "../../../Componentes/TextField/inputFormulario";
import TextAreaFormulario from "../../../Componentes/TextField/TextareaFormulario";
import Botones from "../../../Componentes/Boton/BotonesGuardarYCancelar";
import ValidaRestricciones from '../../../../Hooks/ValidaRestricciones';
import SinAccesoAlFormulario from '../../../Componentes/Errores/SinAccesoAlFormulario';
import CaseInputFormulario from '../../../Componentes/TextField/CaseInputFormulario';
import Calendario from "../../../Componentes/Calendario/Calendario";
import VistaCatalogoExistentes from "./VistaCatalogoExistentes";
import AuthServices from '../../../../Servicios/AuthServices';
import SwitchFormulario from '../../../Componentes/TextField/SwitchFormulario';
import SelectAutoCompleteFormulario from "../../../Componentes/TextField/SelectAutoCompleteFormulario";

const FormularioCatalogo = (props) => {
const { 
  manejoCambioImput,
  nuevo,
  editar,
  catalogo,
  setCatalogo,
  idFormulario,
  formato,
  rellenarFormato,
  obtenerFecha,
  manejoImputValidacionExistente,
  errores,
  mostrarCatalogoContable,
  listaDeCatalogo,
  eventoCerrarModalCase,
  eventoAbrirModalCase,
  selectedCuenta, 
  setSelectedCuenta,
  validarCuentaExiste,
  setErrores,
  erroresNombre_Cuenta,
  eventoCambioDeSelect,
  propsTipo_cuenta,
  valorTipo_cuenta,
  propsNiveles,
  valorNiveles,
  listaDeTipo_cuenta,
  listaDeNiveles,
} = props; // Extrae las props recibidas desde el componente PaisesNuevo

const manejoEventoSubmit = editar ? editar : nuevo; // Determina qué función debe ejecutar el formulario en función de la prop "modificar"
  const [sinPermisos, setSinPermisos] = useState(false);  
  const [restricciones, setRestricciones] = useState([]);
  const tituloNuevo = "Registrar Nuevo Catalogo";
  const tituloEditar = `Editar Cuenta ${catalogo.Nombre_Cuenta}`;
  const ruta = `/MantenimientoCatalogo/${idFormulario}`

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
  

  const atajosDelTeclado = (event) => {
    // Verificar si la tecla presionada es ctrl + 1 (código de tecla 49)
    if (event.shiftKey && event.keyCode === 49) { // 49 es el código de tecla para "1"
      eventoAbrirModalCase();
    }
  };

  
  //Es un evento que hace que no se active la funcion (manejoImputValidacionExistente) cuando se moviliza con las teclas <- o -> del teclado
  const manejoDeTeclasCuenta = (event)=>{
    if (event.key !== 'ArrowLeft' && event.key !== 'ArrowRight') {
      manejoImputValidacionExistente(event);
    }
  }

 
  return (  
    <div className="container_formuario" onKeyDown={atajosDelTeclado} tabIndex={1} >
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
                            className=" row g-3 catalogoContainer"
                        >
                              <div className="row g-3 needs-validation my-2 form_formuarioCatalogo">
                              {/*Campo Cuenta*/}
                                <InputFormulario
                                    classe={"col-md-4 position-relative"}
                                    classeSpan={"spanInput"}
                                    onClickSpan={props.editar ? null : eventoAbrirModalCase}
                                    ondblclick={props.editar ? null : eventoAbrirModalCase}
                                    type={"text"}
                                    nombreLabel={errores.NombreCuenta ? `Cuenta ${errores.NombreCuenta}` : 'Cuenta '}
                                    titlelabel={ props.editar ? "Cuenta" : "Clic para abrir la lista de cuentas existentes o presiona las teclas (shift + 1)"}
                                    icono={<i className="bi bi-cash-coin"></i>}
                                    id={"Cuenta"}
                                    name={"Cuenta"}
                                    titleInput={"Digite la Cuenta del catálogo"}
                                    value={selectedCuenta ? selectedCuenta : catalogo.Cuenta}
                                    onChange={manejoImputValidacionExistente}
                                    onBlur={!props.editar ? rellenarFormato : null}////onBlur={manejoImputValidacionExistente}
                                    onKeyUp={manejoDeTeclasCuenta}
                                    errores={errores.Nombre}
                                    restricciones={restricciones}
                                    editarONuevo={props.editar}
                                    maxLength={formato.length}
                                    placeholder={formato}
                                    disabled={props.editar ? true : false}
                                    required={true}
                                />

                              
                              {/*Campo IDContabilidad_Niveles */}                     
                               <SelectAutoCompleteFormulario
                                    classe={"col-auto position-relative"}
                                    nombreLabel={"Nivel contable"}
                                    titlelabel={"Seleccione el Nivel contable de la cuenta a asignar"}
                                    icono={<i className="bi bi-bar-chart-steps"></i>}
                                    id={"IDContabilidad_Niveles"}
                                    name={"IDContabilidad_Niveles"}
                                    label = {catalogo.IDContabilidad_Niveles ? catalogo.IDContabilidad_Niveles.Nombre_Nivel  : "Seleccione una opción"} 
                                    ancho = {220} 
                                    defaultProps={propsNiveles}
                                    onChange={(event, value) => eventoCambioDeSelect(event, value, "IDContabilidad_Niveles", valorNiveles)}
                                    restricciones={restricciones}
                                    editarONuevo={props.editar}
                                    valueAutocomplete={ 
                                        catalogo.IDContabilidad_Niveles
                                        ? listaDeNiveles.find(option => option.IDContabilidad_Niveles === catalogo.IDContabilidad_Niveles) 
                                        : null
                                    }
                                    disabled={props.editar ? true : false}
                                    required = {true}
                              />   


                              {/*Campo IDContabilidad_Tipo_cuenta */}                     
                              <SelectAutoCompleteFormulario
                                    classe={"col-auto position-relative"}
                                    nombreLabel={"Tipo de cuenta"}
                                    titlelabel={"Seleccione el tipo de cuenta contable de la cuenta a asignar"}
                                    icono={<i className="bi bi-bar-chart-steps"></i>}
                                    id={"IDContabilidad_Tipo_cuenta"}
                                    name={"IDContabilidad_Tipo_cuenta"}
                                    label = {catalogo.IDContabilidad_Tipo_cuenta ? catalogo.IDContabilidad_Tipo_cuenta.Detalle  : "Seleccione una opción"} 
                                    ancho = {220} 
                                    defaultProps={propsTipo_cuenta}
                                    onChange={(event, value) => eventoCambioDeSelect(event, value, "IDContabilidad_Tipo_cuenta", valorTipo_cuenta)}
                                    restricciones={restricciones}
                                    editarONuevo={props.editar}
                                    valueAutocomplete = {
                                        catalogo.IDContabilidad_Tipo_cuenta
                                        ? listaDeTipo_cuenta.find(option => option.IDContabilidad_Tipo_cuenta === catalogo.IDContabilidad_Tipo_cuenta) 
                                        : null
                                    }
                                    required = {true}
                              />  

                            
                               {/*Campo Nombre_Cuenta*/}
                               <InputFormulario
                                    classe={"col-md-4 position-relative"}
                                    type={"text"}
                                    nombreLabel={"Nombre de la Cuenta"}
                                    titlelabel={"Ejemplo de Nombre de la Cuenta:"}
                                    icono={<i className="bi bi-type-h5"></i>}
                                    id={"Nombre_Cuenta"}
                                    name={"Nombre_Cuenta"}
                                    titleInput={"Digite el Nombre de la Cuenta del catálogo"}
                                    value={catalogo.Nombre_Cuenta}
                                    onChange={manejoCambioImput}
                                    onBlur={manejoCambioImput}//onBlur={manejoImputValidacionExistente}
                                    onKeyUp={manejoCambioImput}
                                    restricciones={restricciones}
                                    editarONuevo={props.editar}
                                    maxLength={"180"}
                                    errores={erroresNombre_Cuenta.Nombre}
                                    required={true}
                                />


                                {/*Campo Nombre_Idioma*/}
                                <InputFormulario
                                    classe={"col-md-4 position-relative"}
                                    type={"text"}
                                    nombreLabel={"Nombre del idioma de la Cuenta"}
                                    titlelabel={"Ejemplo del Nombre del idioma de la Cuenta:"}
                                    icono={ <i className="bi bi-translate"> </i>}
                                    id={"Nombre_Idioma"}
                                    name={"Nombre_Idioma"}
                                    titleInput={"Digite el Nombre del idioma de la Cuenta del catálogo"}
                                    value={catalogo.Nombre_Idioma}
                                    onChange={manejoCambioImput}
                                    restricciones={restricciones}
                                    editarONuevo={props.editar}
                                    maxLength={"180"}
                                />


                                {/*Campo Fecha del último movimiento*/}
                                <CaseInputFormulario
                                  classe={"col-md-4 position-relative"}
                                  input={
                                    <Calendario 
                                      nombreLabel={"Fecha del último movimiento"} 
                                      obtenerFecha={obtenerFecha}
                                      value={props.editar ? catalogo.Fecha_Ultimo_Movimiento : null}
                                      disabled={props.editar ? true : false}
                                    />
                                  }
                                />


                                {/*Campo Descripcion*/}
                                <TextAreaFormulario
                                    classe={"col-md-12 position-relative"}
                                    nombreLabel={"Descripción de la Cuenta"}
                                    titlelabel={"Ejemplo de la Descripción de la Cuenta:"}
                                    icono={ <i className="bi bi-translate"> </i>}
                                    id={"Descripcion"}
                                    name={"Descripcion"}
                                    titleInput={"Digite la Descripción de la Cuenta del catálogo"}
                                    value={catalogo.Descripcion}
                                    onChange={manejoCambioImput}
                                    restricciones={restricciones}
                                    editarONuevo={props.editar}
                                    row={"1"}
                                />
                             
                             </div>
                                
{/*----------------------------------------------------!!&!!----------------------------------------------------*/}

                             <div className=" needs-validation my-3 form_formuarioChecksCatalogo">
                                
                                {/*Campo Permite_Sub_Cuentas*/}
                                <SwitchFormulario
                                    classe={"col-auto position-relative"}
                                    nombreLabel={"Permiete Sub Cuentas"}
                                    titlelabel={"Seleccione si permite Sub Cuentas"}
                                    icono={<i className="bi bi-bar-chart-steps"></i>}
                                    id={"Permite_Sub_Cuentas"}
                                    name={"Permite_Sub_Cuentas"}
                                    value={catalogo.Permite_Sub_Cuentas}
                                    onChange={(isChecked) => {
                                      setCatalogo(prevCatalogo => ({
                                        ...prevCatalogo,
                                        Permite_Sub_Cuentas: isChecked
                                      }));
                                    }}
                                    textStart={"No"} 
                                    textEnd={"Si"}
                                    restricciones={restricciones}
                                    disabled={props.editar ? true : false}
                                    editarONuevo={props.editar}
                                />


                                {/*Campo Requiere_Origen_Destino*/}
                                <SwitchFormulario
                                    classe={"col-auto position-relative"}
                                    nombreLabel={"Permiete Origen y Destino"}
                                    titlelabel={"Seleccione si requiere Origen y Destino"}
                                    icono={<i className="bi bi-credit-card-2-back-fill"></i>}
                                    id={"Requiere_Origen_Destino"}
                                    name={"Requiere_Origen_Destino"}
                                    value={catalogo.Requiere_Origen_Destino}
                                    onChange={(isChecked) => {
                                      setCatalogo(prevCatalogo => ({
                                        ...prevCatalogo,
                                        Requiere_Origen_Destino: isChecked
                                      }));
                                    }}
                                    textStart={"No"} 
                                    textEnd={"Si"}
                                    restricciones={restricciones}
                                    editarONuevo={props.editar}
                                />
                               

                                {/*Campo Requiere_Control_Presupuestario*/}
                                <SwitchFormulario
                                    classe={"col-auto position-relative"}
                                    nombreLabel={"Control Presupuestario"}
                                    titlelabel={"Seleccione si requiere Control Presupuestario"}
                                    icono={<i className="bi bi-calculator"></i>}
                                    id={"Requiere_Control_Presupuestario"}
                                    name={"Requiere_Control_Presupuestario"}
                                    value={catalogo.Requiere_Control_Presupuestario}
                                    onChange={(isChecked) => {
                                      setCatalogo(prevCatalogo => ({
                                        ...prevCatalogo,
                                        Requiere_Control_Presupuestario: isChecked
                                      }));
                                    }}
                                    textStart={"No"} 
                                    textEnd={"Si"}
                                    restricciones={restricciones}
                                    editarONuevo={props.editar}
                                />


                                {/*Campo Permite_Transacciones*/}
                                <SwitchFormulario
                                    classe={"col-auto position-relative"}
                                    nombreLabel={"Permite Transacciones"}
                                    titlelabel={"Seleccione si permite transacciones"}
                                    icono={<i className="bi bi-lock"></i>}
                                    id={"Permite_Transacciones"}
                                    name={"Permite_Transacciones"}
                                    value={catalogo.Permite_Transacciones}
                                    onChange={(isChecked) => {
                                      setCatalogo(prevCatalogo => ({
                                        ...prevCatalogo,
                                        Permite_Transacciones: isChecked
                                      }));
                                    }}
                                    textStart={"No"} 
                                    textEnd={"Si"}
                                    restricciones={restricciones}
                                    editarONuevo={props.editar}
                                />


                                {/*Campo Visible*/}
                                <SwitchFormulario
                                    classe={"col-auto position-relative"}
                                    nombreLabel={"Permite Ser Visible"}
                                    titlelabel={"Seleccione si permite ser visible"}
                                    icono={<i className="bi bi-eye-slash"></i>}
                                    id={"Visible"}
                                    name={"Visible"}
                                    value={catalogo.Visible}
                                    onChange={(isChecked) => {
                                      setCatalogo(prevCatalogo => ({
                                        ...prevCatalogo,
                                        Visible: isChecked
                                      }));
                                    }}
                                    textStart={"No"} 
                                    textEnd={"Si"}
                                    restricciones={restricciones}
                                    editarONuevo={props.editar}
                                />
                    </div>
 
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

        <VistaCatalogoExistentes
          lista={listaDeCatalogo}
          mostrarModalCase={mostrarCatalogoContable}
          eventoCerrarModalCase={eventoCerrarModalCase}
          setSelectedCuenta={setSelectedCuenta}
          setErrores={setErrores}
          validarCuentaExiste={validarCuentaExiste}
          catalogo={catalogo}
          setCatalogo={setCatalogo}
        />

    </div>
    );
};


export default FormularioCatalogo;