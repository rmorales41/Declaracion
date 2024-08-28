import React, { useState, useEffect } from 'react';
import "./FormularioCuentasBancarias.css";
import InputFormulario from "../../../Componentes/TextField/inputFormulario";
import Botones from "../../../Componentes/Boton/BotonesGuardarYCancelar";
import ValidaRestricciones from '../../../../Hooks/ValidaRestricciones';
import SinAccesoAlFormulario from '../../../Componentes/Errores/SinAccesoAlFormulario';
import AuthServices from '../../../../Servicios/AuthServices';
import SwitchFormulario from '../../../Componentes/TextField/SwitchFormulario';
import SelectAutoCompleteFormulario from "../../../Componentes/TextField/SelectAutoCompleteFormulario";
import VistaCatalogoExistentes from "../Catalogo/VistaCatalogoExistentes";

const FormularioCuentasBancarias = (props) => {
const { 
  manejoCambioImput,
  manejoImputValidacion,
  nuevo,
  editar,
  cuentaBancarias,
  setCuentaBancarias,
  idFormulario,
  listaCatalogosMovimientos,
  listaBancos,

  listaCatalogos,
  formato,
  errores,
  setErrores,
  propsCatalogo,
  propsBancos,
  valorBancos,
  eventoCambioDeSelect,


  catalogo,
  setCatalogo,
  contable,
  setContable,
  cuentasxCobrar,
  setCuentasxCobrar,

  selectedCuenta,
  setSelectedCuenta,
  selectedContable,
  setSelectedContable,
  selectedCuentasxCobrar, 
  setSelectedCuentasxCobrar,

  idCatalogo,
  setIdCatalogo,
  idCatalogoContable,
  setIdCatalogoContable,
  idCatalogoCuentasxCobrar, 
  setIdCatalogoCuentasxCobrar,

  valorCatalogoSeleccionado,
  setValorCatalogoSeleccionado,
  valorCatalogoSeleccionadoContable,
  setValorCatalogoSeleccionadoContable,
  valorCatalogoSeleccionadoCuentasxCobrar,
  setValorCatalogoSeleccionadoCuentasxCobrar,

  eventoCambioSelectCuenta,
  eventoCambioSelectCuentaContable,
  eventoCambioSelectCuentaxCobrar,

  eventoAbrirModalCase,
  eventoAbrirCuentaContable,
  eventoAbrirCuentasxCobrar,
  eventoCerrarModalCase,
  eventoCerrarCuentaContable,
  eventoCerrarCuentasxCobrar,
  mostrarCatalogoContable,
  mostrarCatalogoContableContable,
  mostrarCatalogoContableCuentasxCobrar,

  inputFormatiado,
  inputFormatiadoContable, 
  inputFormatiadoCuentasxCobrar, 

  manejoImputFormato,
  manejoImputFormatoContable,
  manejoImputFormatoCuentasxCobrar,
  } = props; // Extrae las props recibidas desde el componente PaisesNuevo

const manejoEventoSubmit = editar ? editar : nuevo; // Determina qué función debe ejecutar el formulario en función de la prop "modificar"
  const [sinPermisos, setSinPermisos] = useState(false);  
  const [restricciones, setRestricciones] = useState([]);
  const tituloNuevo = "Registrar cuenta bancaria";
  const tituloEditar = `Editar cuenta bancaria`;
  const ruta = `/MantenimientoCuentasBancarias/${idFormulario}`

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

  
// Es para el valor de la cuenta de catalogo IDContabilidad_Catalogo
 useEffect(() => {
    if (idCatalogo && selectedCuenta) {
      setValorCatalogoSeleccionado(
        propsCatalogo.options[propsCatalogo.options.indexOf(propsCatalogo.options.find(
          option => option.IDContabilidad_Catalogo === idCatalogo))]);
      setCuentaBancarias(prevAsiento => ({ ...prevAsiento, IDContabilidad_Catalogo: idCatalogo}));
    }
}, [idCatalogo, propsCatalogo.options, selectedCuenta, setCuentaBancarias, setValorCatalogoSeleccionado]);

// Es para el valor de la cuenta de Contable IDCuenta_Contable
useEffect(() => {
    if (idCatalogoContable && selectedContable) {
        setValorCatalogoSeleccionadoContable(
          propsCatalogo.options[ propsCatalogo.options.indexOf(propsCatalogo.options.find(
              option => option.IDContabilidad_Catalogo === idCatalogoContable))]);
        setCuentaBancarias(prevAsiento => ({ ...prevAsiento, IDCuenta_Contable: idCatalogoContable}));
    }
}, [idCatalogoContable, propsCatalogo.options, selectedContable, setCuentaBancarias, setValorCatalogoSeleccionadoContable]);

// Es para el valor de la cuenta de Contable IDCuentasxCobrar_Banco
useEffect(() => {
  if (idCatalogoCuentasxCobrar && selectedCuentasxCobrar) {
    setValorCatalogoSeleccionadoCuentasxCobrar(
        propsCatalogo.options[propsCatalogo.options.indexOf(propsCatalogo.options.find(
            option => option.IDContabilidad_Catalogo === idCatalogoCuentasxCobrar))]);
    setCuentaBancarias(prevAsiento => ({ ...prevAsiento, IDCuentasxCobrar_Banco: idCatalogoCuentasxCobrar}));
  }
}, [idCatalogoCuentasxCobrar, propsCatalogo.options, selectedCuentasxCobrar, setCuentaBancarias, setValorCatalogoSeleccionadoCuentasxCobrar]);


  return (  
    <div className="container_formuario">
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
                              
                               {/*Campo Cuenta_Numero*/}
                               <InputFormulario
                                    classe={"col-md-3 position-relative"}
                                    type={"text"}
                                    nombreLabel={"Número de cuenta"}
                                    titlelabel={"Ejemplo de Número de cuenta: "}
                                    icono={<i className="bi bi-123"></i>}
                                    id={"Cuenta_Numero"}
                                    name={"Cuenta_Numero"}
                                    titleInput={"Ingrese el Número de cuenta."}
                                    restricciones={restricciones}
                                    editarONuevo={props.editar}
                                    value={cuentaBancarias.Cuenta_Numero}
                                    onBlur={manejoImputValidacion}
                                    onChange={manejoImputValidacion}
                                    onKeyUp={manejoImputValidacion}
                                    maxLength={"20"}
                                    errores={errores.Nombre}
                                    required = {true}
                                />


                              {/*Campo Iban*/}
                               <InputFormulario
                                    classe={"col-auto position-relative"}
                                    type={"text"}
                                    nombreLabel={"Iban"}
                                    titlelabel={"Ejemplo de Iban: "}
                                    icono={<i className="bi bi-123"></i>}
                                    id={"Iban"}
                                    name={"Iban"}
                                    titleInput={"Ingrese el Iban."}
                                    restricciones={restricciones}
                                    editarONuevo={props.editar}
                                    value={cuentaBancarias.Iban}
                                    onBlur={manejoCambioImput}
                                    onChange={manejoCambioImput}
                                    maxLength={"23"}
                                    required = {false}
                                />


                              {/*Campo Cheque*/}
                               <InputFormulario
                                    classe={"col-auto position-relative"}
                                    type={"number"}
                                    nombreLabel={"Cheque"}
                                    titlelabel={"Ejemplo de cheque: 12345678. Además, no puede contener decimales."}
                                    icono={<i className="bi bi-123"></i>}
                                    id={"Cheque"}
                                    name={"Cheque"}
                                    titleInput={"Ingrese un Cheque."}
                                    restricciones={restricciones}
                                    editarONuevo={props.editar}
                                    value={cuentaBancarias.Cheque}
                                    onBlur={manejoCambioImput}
                                    onChange={manejoCambioImput}
                                    maxLength={"23"}
                                    min={"0"} 
                                    max={"9999999999"} 
                                    step={"1"}
                                    required = {false}
                                />


                             {/*Campo IDCuenta_Contable Cuenta del Catalogo Contable IDCuenta_Contable */}                     
                              <SelectAutoCompleteFormulario
                                    classe={"col-auto position-relative"}
                                    nombreLabel={"Cuenta Contable"}
                                    //onClicklabel={eventoRefrescarListas}
                                    titleOnClicklabel={"Haz clic para actualizar todos los select."}
                                    titlelabel={"Haz clic aquí para abrir el visor con las cuentas existentes, o haz doble clic sobre el campo para desplegar igualmente el visor de cuentas"}
                                    onClickSpan={eventoAbrirCuentaContable }
                                    onDoubleClick={eventoAbrirCuentaContable}
                                    icono={<i className="bi bi-cash-coin"></i>}
                                    id={"IDCuenta_Contable"}
                                    name={"IDCuenta_Contable"}
                                    label = {cuentaBancarias.IDCuenta_Contable ? cuentaBancarias.IDCuenta_Contable.Cuenta_Formateada : formato} 
                                    ancho = {220} 
                                    defaultProps={propsCatalogo}
                                    onChange={eventoCambioSelectCuentaContable}
                                    restricciones={restricciones}
                                    editarONuevo={props.editar}
                                    valueAutocomplete={
                                      valorCatalogoSeleccionadoContable ? valorCatalogoSeleccionadoContable :
                                      cuentaBancarias.IDCuenta_Contable ?
                                      listaCatalogosMovimientos.find(option => option.IDContabilidad_Catalogo === cuentaBancarias.IDCuenta_Contable)
                                      : null
                                    }
                                    onInputChange={manejoImputFormatoContable} 
                                    inputValue={selectedContable ? selectedContable : inputFormatiadoContable }
                                    required = {true}
                                />    
                                

                              {/*Campo IDCuentasxCobrar_Banco Cuenta del Catalogo IDCuentasxCobrar_Banco*/}                         
                              <SelectAutoCompleteFormulario
                                    classe={"col-auto position-relative"}
                                    nombreLabel={"Cuentas por cobrar banco"}
                                    //onClicklabel={eventoRefrescarListas}
                                    titleOnClicklabel={"Haz clic para actualizar todos los select."}
                                    titlelabel={"Haz clic aquí para abrir el visor con las cuentas existentes, o haz doble clic sobre el campo para desplegar igualmente el visor de cuentas"}
                                    onClickSpan={eventoAbrirCuentasxCobrar}
                                    onDoubleClick={eventoAbrirCuentasxCobrar}
                                    icono={<i className="bi bi-cash-coin"></i>}
                                    id={"IDCuentasxCobrar_Banco"}
                                    name={"IDCuentasxCobrar_Banco"}
                                    label = {cuentaBancarias.IDCuentasxCobrar_Banco ? cuentaBancarias.IDCuentasxCobrar_Banco.Cuenta_Formateada : formato} 
                                    ancho = {220} 
                                    defaultProps={propsCatalogo}
                                    onChange={eventoCambioSelectCuentaxCobrar}
                                    restricciones={restricciones}
                                    editarONuevo={props.editar}
                                    valueAutocomplete={
                                      valorCatalogoSeleccionadoCuentasxCobrar ?
                                      valorCatalogoSeleccionadoCuentasxCobrar : 
                                      cuentaBancarias.IDCuentasxCobrar_Banco ?
                                      listaCatalogosMovimientos.find(option => option.IDContabilidad_Catalogo === cuentaBancarias.IDCuentasxCobrar_Banco)
                                      : null
                                    }
                                    onInputChange={manejoImputFormatoCuentasxCobrar} 
                                    inputValue={selectedCuentasxCobrar ? selectedCuentasxCobrar : inputFormatiadoCuentasxCobrar }
                                    required = {false}
                               />
                                

                              {/*Campo IDContabilidad_Catalogo Cuenta del Catalogo Contable IDContabilidad_Catalogo*/}                         
                              <SelectAutoCompleteFormulario
                                    classe={"col-auto position-relative"}
                                    nombreLabel={"Cuenta del catálogo"}
                                    //onClicklabel={eventoRefrescarListas}
                                    titleOnClicklabel={"Haz clic para actualizar todos los select."}
                                    titlelabel={"Haz clic aquí para abrir el visor con las cuentas existentes, o haz doble clic sobre el campo para desplegar igualmente el visor de cuentas"}
                                    onClickSpan={eventoAbrirModalCase}
                                    onDoubleClick={eventoAbrirModalCase}
                                    icono={<i className="bi bi-cash-coin"></i>}
                                    id={"IDContabilidad_Catalogo"}
                                    name={"IDContabilidad_Catalogo"}
                                    label = {cuentaBancarias.IDContabilidad_Catalogo ? cuentaBancarias.IDContabilidad_Catalogo.Cuenta_Formateada : formato} 
                                    ancho = {220} 
                                    defaultProps={propsCatalogo}
                                    onChange={eventoCambioSelectCuenta}
                                    restricciones={restricciones}
                                    editarONuevo={props.editar}
                                    valueAutocomplete={
                                      valorCatalogoSeleccionado ?
                                      valorCatalogoSeleccionado : 
                                      cuentaBancarias.IDCuenta_Contable ?
                                      listaCatalogosMovimientos.find(option => option.IDContabilidad_Catalogo === cuentaBancarias.IDContabilidad_Catalogo)
                                      : null
                                    }
                                    onInputChange={manejoImputFormato} 
                                    inputValue={selectedCuenta ? selectedCuenta : inputFormatiado }
                                    required = {false}
                                />


                              {/*Campo IDConfiguracion_Bancos*/}
                              <SelectAutoCompleteFormulario
                                    classe={"col-auto position-relative"}
                                    nombreLabel={"Bancos"}
                                    titlelabel={"Seleccione un banco"}
                                    icono={<i className="bi bi-bank2"></i>}
                                    id={"IDConfiguracion_Bancos"}
                                    name={"IDConfiguracion_Bancos"}
                                    label = {cuentaBancarias.IDConfiguracion_Bancos ? cuentaBancarias.IDConfiguracion_Bancos.Descripcion  : "Seleccione una opción"} 
                                    ancho = {220} 
                                    defaultProps={propsBancos}
                                    onChange={(event, value) => eventoCambioDeSelect(event, value, "IDConfiguracion_Bancos", valorBancos)}
                                    restricciones={restricciones}
                                    editarONuevo={props.editar}
                                    valueAutocomplete = { 
                                        cuentaBancarias.IDConfiguracion_Bancos
                                        ? listaBancos.find(option => option.IDConfiguracion_Bancos === cuentaBancarias.IDConfiguracion_Bancos)
                                        : null
                                    }
                                    required = {true}
                                   
                               />


                              {/*Campo Moneda*/}
                              <SwitchFormulario
                                    classe={"col-md-4 position-relative campoDiferencial"}
                                    nombreLabel={"Tipo de moneda"}
                                    titlelabel={"Seleccione si la moneda es local o extranjera."}
                                    icono={<i className="bi bi-currency-exchange"></i>}
                                    id={"Moneda"}
                                    name={"Moneda"}
                                    value={cuentaBancarias.Moneda}
                                    onChange={(isChecked) => {setCuentaBancarias(prevObjeto => ({...prevObjeto, Moneda: isChecked}));}}
                                    textStart={"Extranjera"} 
                                    textEnd={"Local"}
                                    restricciones={restricciones}
                                    editarONuevo={props.editar}
                                />


                              {/*Campo Tiene_Datafonos*/}
                              <SwitchFormulario
                                    classe={"col-md-3 position-relative campoDiferencial"}
                                    nombreLabel={"Datáfono"}
                                    titlelabel={"Seleccione si tiene Datáfono."}
                                    icono={<i className="bi bi-credit-card-2-back"></i>}
                                    id={"Tiene_Datafonos"}
                                    name={"MoTiene_Datafonosneda"}
                                    value={cuentaBancarias.Tiene_Datafonos}
                                    onChange={(isChecked) => {
                                      setCuentaBancarias(prevObjeto => ({
                                        ...prevObjeto,
                                        Tiene_Datafonos: isChecked
                                      }));
                                    }}
                                    textStart={"No"} 
                                    textEnd={"Si"}
                                    restricciones={restricciones}
                                    editarONuevo={props.editar}
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

          {/*Muestra el modal con los catalogos existentes IDContabilidad_Catalogo*/}
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

          {/*Muestra el modal con los catalogos existentes IDCuenta_Contable*/}
          <VistaCatalogoExistentes
              lista={listaCatalogos}
              mostrarModalCase={mostrarCatalogoContableContable}
              eventoCerrarModalCase={eventoCerrarCuentaContable }
              setSelectedCuenta={setSelectedContable}
              setIdCatalogo={setIdCatalogoContable}
              setErrores={setErrores}
              catalogo={contable}
              setCatalogo={setContable}
              paraAsiento={true}
          />

            {/*Muestra el modal con los catalogos existentes IDCuenta_Contable*/}
            <VistaCatalogoExistentes
              lista={listaCatalogos}
              mostrarModalCase={mostrarCatalogoContableCuentasxCobrar}
              eventoCerrarModalCase={eventoCerrarCuentasxCobrar}
              setSelectedCuenta={setSelectedCuentasxCobrar}
              setIdCatalogo={setIdCatalogoCuentasxCobrar}
              setErrores={setErrores}
              catalogo={cuentasxCobrar}
              setCatalogo={setCuentasxCobrar}
              paraAsiento={true}
          />
          
    </div>
    );
};


export default FormularioCuentasBancarias;