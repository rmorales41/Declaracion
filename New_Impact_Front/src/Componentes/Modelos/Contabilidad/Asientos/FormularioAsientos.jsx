import React, { useState, useEffect } from 'react';
import "./FormularioAsientos.css";
import InputFormulario from "../../../Componentes/TextField/inputFormulario";
import Botones from "../../../Componentes/Boton/BotonesGuardarYCancelar";
import ValidaRestricciones from '../../../../Hooks/ValidaRestricciones';
import SinAccesoAlFormulario from '../../../Componentes/Errores/SinAccesoAlFormulario';
import AuthServices from '../../../../Servicios/AuthServices';
import SwitchFormulario from '../../../Componentes/TextField/SwitchFormulario';
import SelectAutoCompleteFormulario from "../../../Componentes/TextField/SelectAutoCompleteFormulario";
import CalendarioFormulario from '../../../Componentes/TextField/CalendarioFormulario';
import TextAreaFormulario from '../../../Componentes/TextField/TextareaFormulario';
import VistaCatalogoExistentes from "../Catalogo/VistaCatalogoExistentes";
import Tabla from "../../../Componentes/DataTable/GridAsientos"
import CaseInputFormulario from '../../../Componentes/TextField/CaseInputFormulario';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import {faFont} from '@fortawesome/free-solid-svg-icons'; 
import useTooltipCustom from '../../../Componentes/Tooltip/Tooltip';
import ModalForm from "./ModalForm"
import Tooltip from '@mui/material/Tooltip';
import TablaAsiento from "../../../Componentes/DataTable/Tabla";
import CaseModal from "../../../Componentes/Modales/ModalesPersonalizados/ModalCase";
import Visor from "../../../Componentes/Modales/ModalesPersonalizados/Visor";

import TipoDeCambioNuevo from "../../Configuraciones/TipoCambio/TipoDeCambioNuevo";

const FormularioAsientos = (props) => {
const { 
  manejoCambioImput,
  nuevo,
  editar,
  asiento,
  setAsiento,
  idFormulario,
  errores,
  eventoObtenerFecha,
  propsTipo_Documento,
  propsOrigen,
  propsTipoAsiento,
  propsCatalogo,
  eventoCambioDeSelect,
  valorTipoDocumento, 
  valorOrigen,
  valorTipoAsiento,
  eventoAbrirModalCase,
  formato,
  mostrarCatalogoContable,
  listaCatalogos,
  selectedCuenta,
  setSelectedCuenta,
  setIdCatalogo,
  catalogo,
  setCatalogo,
  eventoCerrarModalCase,
  setErrores,
  manejoImputFormato,
  inputFormatiado,
  eventoRefrescarListas,
  idCatalogo,
  eventoCambioSelectCuenta,
  setValorCatalogoSeleccionado,
  valorCatalogoSeleccionado,
  nuevaFilaDeAsiento,
  encabezados,
  filas,
  setFilas,
  tipo_Cambio,
  rowsTablaCuadrados,
  columnsTablaCuadrados,
  abrirTotales,
  cerrarTotales,
  mostrarTotales,
  saldoFaltante,
  saldoExtranjeroFaltante,
  nombreCampoFaltante,
  tipoDiferencial,
  requiereOrigen,
  asientoCuadrado,
  cantidadDecimales,

  mostrarAlerta,
  setMostrarAlerta,
  alertaEliminar,
  setAlertaEliminar,
  agregarTipoDeCambio, 
  cerrarAgregarTipoDeCambio,
  abrirAgregarTipoDeCambio,

  lista_tipo_Documento,
  listaTipoAsiento,
  listaCatalogosMovimientos,
  listaOrigen,


  } = props; // Extrae las props recibidas desde el componente PaisesNuevo

  const [sinPermisos, setSinPermisos] = useState(false);  
  const [restricciones, setRestricciones] = useState([]);
  const tituloNuevo = "Registrar Nuevo Asiento contable";
  const tituloEditar = `Editar asiento contable ${asiento.Codigo_Asiento}`;
  const ruta = `/MantenimientoAsientos/${idFormulario}`
  const TooltipCustom = useTooltipCustom();// Para renderizar el componente useTooltipCustom
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

  //Atajos del teclado
  const atajosDelTeclado = (event) => {
    // Verificar si la tecla presionada es shift + 1 (código de tecla 49)
    if (event.shiftKey && event.keyCode === 49) { // 49 es el código de tecla para "1"
      eventoAbrirModalCase();
    }

    //Shift + s o S
    if (event.shiftKey && (event.key === "S" || event.key === "s")) {
      abrirTotales(); // Llama a la función para abrir el modal o realizar la acción deseada
    }
  };

  // Es para el valor de la ceunta de catalogo
  useEffect(() => {
    if (idCatalogo && selectedCuenta) {
      setValorCatalogoSeleccionado(
        propsCatalogo.options[
          propsCatalogo.options.indexOf(propsCatalogo.options.find(
            option => option.IDContabilidad_Catalogo === idCatalogo))]);
      setAsiento(prevAsiento => ({...prevAsiento, IDContabilidad_Catalogo : idCatalogo}));
    }
  }, [idCatalogo, propsCatalogo.options, selectedCuenta, setAsiento, setValorCatalogoSeleccionado]);

// Son las propiedades para el modal de información adicional.
  const propsParaModalForm = {
    manejoCambioImput, 
    restricciones ,
    editar,
    asiento,
  }

return (  
    <div className="container_formuario" onKeyDown={atajosDelTeclado} tabIndex={1}>
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
                            nuevaFilaDeAsiento()
                            }} 
                            className="row g-1 needs-validation my-3 form_formuario">
                              
{/* --------------------------------------- Encabezados del Asiento --------------------------------------- */}  
                            <div className="card-body row g-3 needs-validation my-2 ">
                               {/*Campo Codigo_Asiento*/}
                               <InputFormulario
                                    classe={"col-auto position-relative"}
                                    type={"text"}
                                    nombreLabel={"Código del Asiento."}
                                    titlelabel={"El campo Código del Asiento contable es basado en el día, mes y los últimos tres dígitos del año de la fecha del asiento, junto con el indicador del tipo de asiento seleccionado."}
                                    icono={<i className="bi bi-123"></i>}
                                    id={"Codigo_Asiento"}
                                    name={"Codigo_Asiento"}
                                    titleInput={"Digite el Código del Asiento contable"}
                                    restricciones={restricciones}
                                    editarONuevo={props.editar}
                                    maxLength={"11"}
                                    placeholder="000/0000000"
                                    value={asiento.Codigo_Asiento}
                                    disabled={true}
                               />  

                              {/*Campo Fecha_Asiento*/}
                              <CalendarioFormulario
                                    classe={"col-auto position-relative"}
                                    titlelabel={"Ejemplo de la Fecha del Asiento :"}
                                    id={"Fecha_Asiento"}
                                    name={"Fecha_Asiento"}
                                    nombreLabel={"Fecha del Asiento"}
                                    value={asiento.Fecha_Asiento}
                                    onChange={(date) => eventoObtenerFecha(date, "Fecha_Asiento")}
                                    restricciones={restricciones}
                                    editarONuevo={props.editar}
                                    required = {true}
                                />  

                               {/*Campo IDContabilidad_Tipo_Asiento*/}
                              <SelectAutoCompleteFormulario
                                    classe={"col-auto position-relative"}
                                    nombreLabel={"Tipo de Asiento"}
                                    titlelabel={"Seleccione un Tipo de Asiento"}
                                    icono={<i className="bi bi-journal-check"></i>}
                                    id={"IDContabilidad_Tipo_Asiento"}
                                    name={"IDContabilidad_Tipo_Asiento"}
                                    label = {asiento.IDContabilidad_Tipo_Asiento ? asiento.IDContabilidad_Tipo_Asiento.Descripcion  : "Seleccione una opción"} 
                                    ancho = {220} 
                                    defaultProps={propsTipoAsiento}
                                    onChange={(event, value) => eventoCambioDeSelect(event, value, "IDContabilidad_Tipo_Asiento", valorTipoAsiento)}
                                    errores={errores.Nombre}
                                    restricciones={restricciones}
                                    editarONuevo={props.editar}
                                    valueAutocomplete = { 
                                      asiento.IDContabilidad_Tipo_Asiento
                                      ? listaTipoAsiento.find(option => option.IDContabilidad_Tipo_Asiento === asiento.IDContabilidad_Tipo_Asiento)
                                      : null
                                    }
                                    required = {true}
                               />               

                               {/*Campo Concepto*/}
                              <TextAreaFormulario
                                    classe={"col-md-4 position-relative"}
                                    nombreLabel={"Concepto del asiento"}
                                    titlelabel={"Ejemplo del Concepto del asiento:"}
                                    icono={ <i className="bi bi-alphabet-uppercase"></i>}
                                    id={"Concepto"}
                                    name={"Concepto"}
                                    titleInput={"Digite el Concepto del asiento"}
                                    onBlur={manejoCambioImput}
                                    restricciones={restricciones}
                                    editarONuevo={props.editar}
                                    row={"1"}
                                    required = {true}
                               />

                              {/*Campo Diferencial*/}
                              <SwitchFormulario
                                    classe={"col-md-3 position-relative campoDiferencial"}
                                    nombreLabel={"Diferencial"}
                                    titlelabel={"Seleccione si requiere Diferencial. ¡Una vez seleccionado el tipo de diferencial y añadido un registro, no se puede modificar el diferencial a menos que la tabla esté vacía y se seleccione de nuevo el diferencial.!"}
                                    icono={<i className="bi bi-calculator"></i>}
                                    id={"Diferencial"}
                                    name={"Diferencial"}
                                    value={asiento.Diferencial}
                                    onChange={(isChecked) => {
                                      setAsiento(prevObjeto => ({
                                        ...prevObjeto,
                                        Diferencial: isChecked
                                      }));
                                    }}
                                    textStart={"No"} 
                                    textEnd={"Si"}
                                    restricciones={restricciones}
                                    editarONuevo={props.editar}
                                    disabled={filas.length > 0}
                                />

                              </div>
                              <hr/>

{/* --------------------------------------- Detalles del Asiento --------------------------------------- */}  
                            <div className="card-body row g-3 needs-validation separadorForm ">

                              {/*Campo IDConfiguracion_Tipo_Documento*/}
                               <SelectAutoCompleteFormulario
                                    classe={"col-auto position-relative"}
                                    nombreLabel={"Tipo de Documento"}
                                    titlelabel={"Seleccione un tipo de documento"}
                                    icono={<FontAwesomeIcon icon={faFont}/>}
                                    id={"IDConfiguracion_Tipo_Documento"}
                                    name={"IDConfiguracion_Tipo_Documento"}
                                    label = {asiento.IDConfiguracion_Tipo_Documento ? asiento.IDConfiguracion_Tipo_Documento.Descripcion  : "Seleccione una opción"} 
                                    ancho = {220} 
                                    defaultProps={propsTipo_Documento}
                                    onChange={(event, value) => eventoCambioDeSelect(event, value, "IDConfiguracion_Tipo_Documento", valorTipoDocumento)}
                                    errores={errores.Nombre}
                                    restricciones={restricciones}
                                    valueAutocomplete = { 
                                      asiento.IDConfiguracion_Tipo_Documento
                                      ? lista_tipo_Documento.find(option => option.IDConfiguracion_Tipo_Documento === asiento.IDConfiguracion_Tipo_Documento)
                                      : null
                                    }
                                    editarONuevo={props.editar}
                                    
                               /> 

                              {/*Campo Tipo_Comprobante*/}
                              <InputFormulario
                                    ancho={"130px"}
                                    classe={"position-relative"}
                                    type={"text"}
                                    nombreLabel={"Tipo de Comprobante"}
                                    titlelabel={"Ejemplo del Tipo de Comprobante del asiento contable:"}
                                    icono={<i className="bi bi-123"></i>}
                                    id={"Tipo_Comprobante"}
                                    name={"Tipo_Comprobante"}
                                    titleInput={"Digite el Tipo de Comprobante del asiento contable"}
                                    onBlur={manejoCambioImput}
                                    restricciones={restricciones}
                                    editarONuevo={props.editar}
                                    maxLength={"8"}
                                    //required = {true}
                                /> 
                              
                              {/*Campo Numero_Comprobante*/}
                              <InputFormulario
                                    classe={"col-auto position-relative"}
                                    type={"text"}
                                    nombreLabel={"Número de Comprobante"}
                                    titlelabel={"Ejemplo de Número de Comprobante del asiento contable:"}
                                    icono={<i className="bi bi-123"></i>}
                                    id={"Numero_Comprobante"}
                                    name={"Numero_Comprobante"}
                                    titleInput={"Digite el Número de Comprobante del asiento contable"}
                                    restricciones={restricciones}
                                    editarONuevo={props.editar}
                                    maxLength={"20"}
                                    onBlur={manejoCambioImput}
                               />  
                               
                               {/*Boton para desplegar modal con el numero largo */}
                               <CaseInputFormulario
                                  classe={"col-auto position-relative"}
                                  //nombreLabel={"Información adicional "}
                                  input={
                                    <ModalForm props={propsParaModalForm}/>
                                  }
                                />

                               {/*Campo Fecha_Comprobante*/}
                              <CalendarioFormulario
                                    classe={"col-auto position-relative"}
                                    titlelabel={"Ejemplo de la Fecha del Comprobante :"}
                                    id={"Fecha_Comprobante"}
                                    name={"Fecha_Comprobante"}
                                    nombreLabel={"Fecha del Comprobante"}
                                    value={asiento.Fecha_Comprobante}
                                    onChange={(date) => eventoObtenerFecha(date, "Fecha_Comprobante")}
                                    restricciones={restricciones}
                                    editarONuevo={props.editar}
                                    
                                />  

                            {/* Muestra el tipo de cambio*/} 
                                <CaseInputFormulario
                                  classe={"col-auto position-relative"}
                                  nombreLabel={"Tipo de cambio"}
                                  titlelabel={"El tipo de cambio está asociado con la fecha del comprobante seleccionado. Si no se especifica un tipo de cambio, se utilizará un valor predeterminado de 1 en los campos de debito y credito extranjero."}
                                  icono={<i className="bi bi-currency-exchange"> </i>}
                                  input={ 
                                    <>
                                       <Tooltip title={"El tipo de cambio está asociado con la fecha del comprobante seleccionado. Si no se especifica un tipo de cambio, se utilizará un valor predeterminado de 1 en los campos de debito y credito extranjero."}>
                                          <span className="input-group-text">{tipo_Cambio ? tipo_Cambio.Venta : 1}</span>
                                       </Tooltip>
                                    </>
                                  }
                                />

                              {/*Campo IDContabilidad_Catalogo Cuenta del Catalogo Contable*/}                         
                              <SelectAutoCompleteFormulario
                                    classe={"col-auto position-relative"}
                                    nombreLabel={"Cuenta del Catálogo Contable"}
                                    onClicklabel={eventoRefrescarListas}
                                    titleOnClicklabel={"Haz clic para actualizar todos los select."}
                                    titlelabel={"Haz clic aquí para abrir el visor con las cuentas existentes, o utiliza el atajo del teclado (Shift + 1), o haz doble clic sobre el campo para desplegar igualmente el visor de cuentas"}
                                    onClickSpan={eventoAbrirModalCase}
                                    onDoubleClick={eventoAbrirModalCase}
                                    icono={<i className="bi bi-cash-coin"></i>}
                                    id={"IDContabilidad_Catalogo"}
                                    name={"IDContabilidad_Catalogo"}
                                    label = {asiento.IDContabilidad_Catalogo ? asiento.IDContabilidad_Catalogo.Cuenta_Formateada : formato} 
                                    ancho = {220} 
                                    defaultProps={propsCatalogo}
                                    onChange={eventoCambioSelectCuenta}
                                    errores={errores.Nombre}
                                    restricciones={restricciones}
                                    editarONuevo={props.editar}
                                    valueAutocomplete={
                                      valorCatalogoSeleccionado ?
                                      valorCatalogoSeleccionado : 
                                      asiento.IDContabilidad_Catalogo ?
                                      listaCatalogosMovimientos.find(option => option.IDContabilidad_Catalogo === asiento.IDContabilidad_Catalogo)
                                      : null
                                    }
                                    onInputChange={manejoImputFormato} 
                                    inputValue={selectedCuenta ? selectedCuenta : inputFormatiado }
                                /> 

                              {/*Campo IDContabilidad_Origen}*/}
                              <SelectAutoCompleteFormulario
                                    classe={"col-auto position-relative"}
                                    nombreLabel={"Origen"}
                                    titlelabel={"Seleccione el origen"}
                                    icono={<i className="bi bi-arrows-fullscreen"></i>}
                                    id={"IDContabilidad_Origen"}
                                    name={"IDContabilidad_Origen"}
                                    label = {asiento.IDContabilidad_Origen ? asiento.IDContabilidad_Origen.Descripcion  : "Seleccione una opción"} 
                                    ancho = {220} 
                                    defaultProps={propsOrigen}
                                    onChange={(event, value) => eventoCambioDeSelect(event, value, "IDContabilidad_Origen", valorOrigen)}
                                    errores={errores.Nombre}
                                    restricciones={restricciones}
                                    editarONuevo={props.editar}
                                    valueAutocomplete = { 
                                      asiento.IDContabilidad_Origen
                                      ? listaOrigen.find(option => option.IDContabilidad_Origen === asiento.IDContabilidad_Origen)
                                      : null
                                    }
                                    disabled={!requiereOrigen}
                               />   
                            </div>

{/* --------------------------------------- Debito y credito Local del Asiento --------------------------------------- */}  
                            <div className="card-body row g-3 needs-validation separadorForm">

                               {/*Campo Debito_Local*/}
                               <InputFormulario
                                    classe={"col-md-auto position-relative "}
                                    type={"number"}
                                    nombreLabel={"Debito Local"}
                                    titlelabel={"El campo Débito Local se bloquea si el tipo de asiento es diferencia y al menos uno de los campos extranjeros tiene un valor mayor que 0."}
                                    icono={<i className="bi bi-cash"></i>}
                                    id={"Debito_Local"}
                                    name={"Debito_Local"}
                                    titleInput={"Digite el Debito Local en asiento contable"}
                                    onBlur={manejoCambioImput}
                                    restricciones={restricciones}
                                    editarONuevo={props.editar}
                                    min={"0"} 
                                    max={"999999999999999999"} 
                                    step={cantidadDecimales}
                                    disabled={asiento.Diferencial && tipoDiferencial}
                                />  

                              {/*Campo Credito_Local*/}
                              <InputFormulario
                                    classe={"col-md-auto  position-relative"}
                                    type={"number"}
                                    nombreLabel={"Crédito Local"}
                                    titlelabel={"El campo Débito Local se bloquea si el tipo de asiento es diferencia y al menos uno de los campos extranjeros tiene un valor mayor que 0."}
                                    icono={<i className="bi bi-cash"></i>}
                                    id={"Credito_Local"}
                                    name={"Credito_Local"}
                                    titleInput={"Digite el Crédito Local en asiento contable"}
                                    onBlur={manejoCambioImput}
                                    restricciones={restricciones}
                                    editarONuevo={props.editar}
                                    min={"0"} 
                                    max={"999999999999999999"} 
                                    step={cantidadDecimales}
                                    disabled={asiento.Diferencial && tipoDiferencial}
                                />  
         

{/* --------------------------------------- Debito y credito Extranjero del Asiento --------------------------------------- */}  

                              {/*Campo Debito_Extranjero*/}
                              <InputFormulario
                                    classe={"col-md-auto position-relative"}
                                    type={"number"}
                                    nombreLabel={"Débito Extranjero"}
                                    titlelabel={"El campo Débito Extranjero se bloquea si el tipo de asiento es diferencia y al menos uno de los campos locales tiene un valor mayor que 0."}
                                    icono={<i className="bi bi-currency-dollar"></i>}
                                    id={"Debito_Extranjero"}
                                    name={"Debito_Extranjero"}
                                    titleInput={"Digite el Debito extranjero en asiento contable"}
                                    onBlur={manejoCambioImput}
                                    restricciones={restricciones}
                                    editarONuevo={props.editar}
                                    min={"0"} 
                                    max={"999999999999999999"} 
                                    step={cantidadDecimales}
                                    disabled={asiento.Diferencial && !tipoDiferencial}
                                />  

                              {/*Campo Credito_Extranjero*/}
                              <InputFormulario
                                    classe={"col-md-auto position-relative"}
                                    type={"number"}
                                    nombreLabel={"Crédito Extranjero"}
                                    titlelabel={"El campo Crédito Extranjero se bloquea si el tipo de asiento es diferencia y al menos uno de los campos locales tiene un valor mayor que 0."}
                                    icono={<i className="bi bi-currency-dollar"></i>}
                                    id={"Credito_Extranjero"}
                                    name={"Credito_Extranjero"}
                                    titleInput={"Digite el Credito extranjero en asiento contable"}
                                    onBlur={manejoCambioImput}
                                    restricciones={restricciones}
                                    editarONuevo={props.editar}
                                    min={"0"} 
                                    max={"999999999999999999"} 
                                    step={cantidadDecimales}
                                    disabled={asiento.Diferencial && !tipoDiferencial}
                                />  

                              {/*Campo Detalle_Asiento*/}
                              <TextAreaFormulario
                                    classe={"col-md-4 position-relative"}
                                    nombreLabel={"Detalle del asiento"}
                                    titlelabel={"El campo Detalle del asiento es obligatorio en cada registro, no puede estar vacío y debe tener al menos 10 caracteres."}
                                    icono={<i className="bi bi-alphabet-uppercase"></i>}
                                    id={"Detalle_Asiento"}
                                    name={"Detalle_Asiento"}
                                    titleInput={"Digite el Detalle del asiento"}
                                    onBlur={manejoCambioImput}
                                    restricciones={restricciones}
                                    editarONuevo={props.editar}
                                    row={"1"}
                                    minLength={10}
                               />
                              </div>

                            <div className="card-body row g-2 needs-validation separadorForm">
                              {/*Boton agregar nuevo asiento al grid*/}
                              <CaseInputFormulario
                                  classe={"col-auto position-relative"}
                                  input={
                                    <TooltipCustom title={"Clic para agregar un nuevo asiento a la tabla"}>
                                        <button className="btn btn-agregar-asiento" type="submit">
                                            <i className="bi bi-folder-plus"></i> Agregar
                                        </button>
                                    </TooltipCustom>
                                  }
                                />
                            </div>
                              
{/* --------------------------------------- Tabla o grid que va agregando los asientos con sus detalles --------------------------------------- */}
                              <div className="card" style={{paddingTop:"0.500rem"}}>
                                <Tabla
                                    rows={filas}
                                    setRows={setFilas}
                                    columns={encabezados}
                                    disableColumnMenu={false}
                                    checkboxSelection={false}
                                    pageSizeOptions={[5, 10, 20, 30, 40, 50, 60, 70, 80, 90, 100]}
                                    pageSize={20}
                                    rowHeight={45}
                                    tipo_Cambio={tipo_Cambio}
                                    asiento={asiento}
                                    abrirTotales={abrirTotales}
                                    listaCatalogosMovimientos={listaCatalogosMovimientos}
                                    listaOrigen={listaOrigen}
                                    requiereOrigen={requiereOrigen}
                                    mostrarAlerta={mostrarAlerta}
                                    setMostrarAlerta={setMostrarAlerta}
                                    alertaEliminar={alertaEliminar}
                                    setAlertaEliminar={setAlertaEliminar}
                                    abrirAgregarTipoDeCambio={abrirAgregarTipoDeCambio}
                                    lista_tipo_Documento={lista_tipo_Documento}
                                  />
                              </div>

                              <div className="card cardTableAsiento" style={{width:"580px"}}>
                                <div className="card-body cardTableAsiento">
                                  <TablaAsiento
                                      rows={rowsTablaCuadrados}
                                      columns={columnsTablaCuadrados}
                                      ancho={570}
                                      size={"small"}
                                      fontSize={13}
                                      rowHeight={20}
                                      vistaAsiento={true}
                                      saldo={saldoFaltante}
                                      saldoExtranjero={saldoExtranjeroFaltante}
                                      campoFaltante={nombreCampoFaltante}
                                      filas={filas}
                                      asientoCuadrado={asientoCuadrado}
                                    />
                                </div>
                              </div>

                            {/*Botones gurdar nuevo registro o guardar cambios y cancelar 30*/}
                            <Botones
                                editar={"Clic para guardar el nuevo registro"}
                                ruta={ruta}
                                restricciones = {restricciones}
                                onClick={nuevo}
                                sinSubmit={true}
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

        {/*Muestra el modal con los catalogos existentes*/}
        <VistaCatalogoExistentes
            lista={listaCatalogos}
            mostrarModalCase={mostrarCatalogoContable}
            eventoCerrarModalCase={eventoCerrarModalCase}
            setSelectedCuenta={setSelectedCuenta}
            setIdCatalogo={setIdCatalogo}
            setErrores={setErrores}
            catalogo={catalogo}
            setCatalogo={setCatalogo}
            paraAsiento={true}
          />

        {/*Muestra el modal con los totales del asiento, debito, credito local y extranjero*/}
        <CaseModal 
          mostrarModalCase={mostrarTotales}
          eventoCerrarModalCase={cerrarTotales}
          titulo={"Totales"}
          ancho={"635px"}
          alto={"20rem"}
          ZIndex={1000}
          cuerpo = {
            <>
              <TablaAsiento
                  rows={rowsTablaCuadrados}
                  columns={columnsTablaCuadrados}
                  ancho={570}
                  size={"small"}
                  fontSize={13}
                  rowHeight={20}
                  vistaAsiento={true}
                  saldo={saldoFaltante}
                  saldoExtranjero={saldoExtranjeroFaltante}
                  campoFaltante={nombreCampoFaltante}
                  filas={filas}
                  asientoCuadrado={asientoCuadrado}
                />
            </>
          }
        /> 
          
        {/*Muestra un modal cuando no se encuentra una fecha de comprobante en la base de datos ni en la página del banco central. Este modal permite agregar un tipo de cambio manualmente.*/}
        <Visor 
          mostrarModalCase={agregarTipoDeCambio}
          eventoCerrarModalCase={cerrarAgregarTipoDeCambio}
          ancho={"400px"}
          alto={"530px"}
          ZIndex={1000}
          altoBody={"100%"}
          overflow={"auto"}
          overflowBody={"auto"}
          mensaje={"No se encontró el tipo de cambio. Si desea, puede agregarlo manualmente."}
          cuerpo = {
            <>
              <TipoDeCambioNuevo
                 llamadoDesdeUnModal={true}
                 onClickCancelar={cerrarAgregarTipoDeCambio}
              />
            </>
          }
        />

    </div>
    );
};

export default FormularioAsientos;
