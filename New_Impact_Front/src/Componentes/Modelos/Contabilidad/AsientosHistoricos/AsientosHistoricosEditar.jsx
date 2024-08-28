import React, { useEffect, useState } from "react";
import { useParams} from "react-router-dom";
import AuthServices from '../../../../Servicios/AuthServices';
import AsientosHistoricosServicios from "../../../../Servicios/ContabilidadServicios/AsientosHistoricosServicios"
import ValidaRestricciones from "../../../../Hooks/ValidaRestricciones"
import LoadingAleatorio from "../../../Componentes/Loading/LoadingAleatorio";
import FormularioAsientosHistoricosEditar from "./FormularioAsientosHistoricosEditar"; 
import TipoDocumentoServicios from "../../../../Servicios/ConfiguracionServicios/TipoDocumentoServicios/TipoDocumentoServicios"
import CatalogoServicios from '../../../../Servicios/ContabilidadServicios/CatalogoServicios';
import TipoDeCambio from "../../../../Hooks/TipoDeCambio";
import CatalogoHooks from "../../../../Hooks/CatalogoHooks";
import Tooltip from '@mui/material/Tooltip';

const AsientosHistoricosEditar = () => {
  const {id, idFormulario} = useParams(); //es el id de companiaPaises

  //Es el objeto que forma el encabezado
  const InicializaAsientoEncabezado = {
    Codigo_Asiento: "", 
    Concepto: "",
    Fecha_Asiento: null,    
    Diferencial: false,             
    //Foreign Keys    
    IDCompania: 0,
    IDConfiguracion_Tipo_Documento: "", 
    IDContabilidad_Tipo_Asiento: "", 
  }

  //Es el objeto que forma el asiento con detalles y encabezados
  const InicializaAsientoDetalle = {
    Codigo_Asiento: "", 
    Concepto: "",
    Fecha_Comprobante: null,
    Fecha_Asiento: null,  
    Fecha_Sistema: null, 
    Numero_Comprobante: "", 
    Numero_Largo: "", 
    Tipo_Comprobante: "",  
    Aplica_Comprobante: "",
    Aplica_Comprobante_Largo: "",
    Debito_Local: 0,
    Credito_Local: 0, 
    Mayorizado:0, 
    Debito_Extranjero: 0, 
    Credito_Extranjero: 0, 
    Dolar: 0,
    Detalle_Asiento: "",   
    Asiento_Modificado: false,
    Usuario_Creador: "",               
    Diferencial: false,             
    Observaciones: "", 
    Observacion_Tecnica: "",
    Origen_Datos: "", 
    IDOrigen_Datos: 0, 
    Automatico: 0, 
    //Foreign Keys    
    IDCompania: 0,
    IDConfiguracion_Tipo_Documento: "", 
    IDConfiguracion_Tipo_Cambio: "", 
    IDContabilidad_Tipo_Asiento: "", 
    IDContabilidad_Origen: "",
    IDContabilidad_Catalogo: "",
  }
  
const [encabezadoAsiento, setEncabezadoAsiento] = useState(InicializaAsientoEncabezado);
const [asiento, setAsiento] = useState(InicializaAsientoDetalle); 
const [cargando, setCargando] = useState(false);//Muestra o no el Loading
const [filas, setFilas] = useState([]);//Es el array que se muestra en el grid
const [listaCatalogosMovimientos, setListaCatalogosMovimientos] = useState([])
const [lista_tipo_Documento, setLista_tipo_Documento] = useState([])
const [totalDebitosLocal, setTotalDebitosLocal] =  useState(0);
const [totalCreditosLocal, setTotalCreditosLocal] =  useState(0);
const [totalDebitosExtranjeros, setTotalDebitosExtranjeros] =  useState(0);
const [totalCreditosExtranjeros, setTotalCreditosExtranjeros] =  useState(0);
const [mostrarTotales, setMostrarTotale] = useState(false);
const [saldoFaltante, setSaldoFaltante] = useState(0);
const [saldoExtranjeroFaltante, setSaldoExtranjeroFaltante] = useState(0);
const [nombreCampoFaltante, setNombreCampoFaltante] = useState("");
const [asientoCuadrado, setAsientoCuadrado] = useState(false);//Si el asiento no es cuadrado = false no guarda el asiento, si esta cuadrado = si permite guardar
const [mostrarAlerta, setMostrarAlerta] = useState(false);// Es para mostrar cuando se agrega un asiento correctamenteconst [alertaEliminar, setAlertaEliminar] = React.useState(false); // Es para mostrar cuando se elimina un asiento correctamente


//Eventos para el modal de totales de la tabla
const abrirTotales = () =>  setMostrarTotale(true)//Evento para abrir o mostrar el modal con los totales o saldos de debitos y creditos locales como extranjeros
const cerrarTotales = () =>  setMostrarTotale(false)//Evento para cerrar el modal con los totales o saldos de debitos y creditos locales como extranjeros

// Renderiza la página y hace el get de listar 
useEffect(() => {
  const codigoCompaniaAuth = parseInt(AuthServices.getCodigoCompania());
  setAsiento({ ...asiento, IDCompania: codigoCompaniaAuth});
  if(id)buscarPor(id, codigoCompaniaAuth);//Realiza el metodo buscarPor id
// eslint-disable-next-line
}, []); 


//---------- Metodo para buscar por codigoAsiento, concepto, fechaAsiento, iDTipoAsiento y codigo_compania ----------
const buscarPor = async (id, codigo_compania) => {
  const token = AuthServices.getAuthToken(); // Trae el token de local storage
  if (!ValidaRestricciones.ValidarToken(token)) return; // Valida el token
  setCargando(true); // Muestra el componente Loading
  try {
    AsientosHistoricosServicios.setAuthToken(token);
    const response = await AsientosHistoricosServicios.individualFiltered(codigo_compania, id); // Invoca el endpoint del backend
    const respuesta = response.data;
    if (respuesta.length > 0) {
      const [firstItem] = respuesta;
      const codigoDelAsiento = firstItem.Codigo_Asiento;
      const codigoAsientoFormateado = `${codigoDelAsiento.slice(0, 3)}/${codigoDelAsiento.slice(3)}`; // Formatear el Codigo_Asiento

      const encabezadoAsientoConCodigoFormateado = {
        ...firstItem,
        Codigo_Asiento: codigoAsientoFormateado,
        IDContabilidad_Tipo_Asiento: firstItem.IDContabilidad_Tipo_Asiento?.Descripcion ?? null
      };
      
      setEncabezadoAsiento(encabezadoAsientoConCodigoFormateado); // Asignar el objeto con el código formateado

      const transformedData = await Promise.all(respuesta.map(async (item) => {
        const cuenta = await CatalogoHooks.obtenerCuentaFormatiada(item.IDContabilidad_Catalogo.IDContabilidad_Catalogo);
        const cuentaFormateada = cuenta?.Cuenta_Formateada
        return {
          ...item,
          id: item.IDContabilidad_Asiento_Historico,
          Fecha_Comprobante: new Date(item.Fecha_Comprobante),
          IDConfiguracion_Tipo_Documento: item.IDConfiguracion_Tipo_Documento?.Descripcion ?? null,
          IDContabilidad_Catalogo: item.IDContabilidad_Catalogo ? cuentaFormateada : null,
          IDContabilidad_Origen: item.IDContabilidad_Origen?.Descripcion ?? null,
          IDCompania: item.IDCompania?.IDCompania ?? null,
          IDConfiguracion_Tipo_Cambio: item.IDConfiguracion_Tipo_Cambio?.IDConfiguracion_Tipo_Cambio ?? null
        };
      }));

      setFilas(transformedData);
    }
  } catch (error) {
    console.error(error);
  } finally {
    setCargando(false); // Oculta el componente Loading
  }
};


//Funcion o metodo generico para listar o get all
const getList = async (codigo_compania, servicio, setLista, servicioAux) => {
  const token = AuthServices.getAuthToken(); // Trae el token del local store
  if (!ValidaRestricciones.ValidarToken(token)) return; // Valida el token
  setCargando(true); // Muestra el componente Loading
  try {
    servicio.setAuthToken(token); // Le manda el token al encabezado de la consulta del endpoint
    const response = await (servicioAux ? servicioAux : servicio.getAll(codigo_compania)); // Invoca el método listar o el get de todo de servicios
    setLista(response.data); // Guarda lo que se devolvió del back-end en la variable que es un array
  } catch (e) {
    console.error(e);
  } finally {
    setCargando(false); // Oculta el componente Loading
  }
};


const getListTipoDocumento = (codigo_compania) => getList(codigo_compania, TipoDocumentoServicios, setLista_tipo_Documento);
const getListCatalogosConMovimientos = (codigo_compania) => getList(codigo_compania, CatalogoServicios, setListaCatalogosMovimientos, CatalogoServicios.getAllFiltrado_movimientos(codigo_compania));


//Renderiza la página y hace los diferentes gets de listar, esto para que cuando se ingresa o se refresca la pagina
useEffect(() => {
  const codigoCompaniaAuth = parseInt(AuthServices.getCodigoCompania());
  if(codigoCompaniaAuth){//Valida que haya un codigo de compañia
    getListTipoDocumento(codigoCompaniaAuth);
    getListCatalogosConMovimientos(codigoCompaniaAuth);
  }
// eslint-disable-next-line
}, []); 

//-----------------------------------Grid y tabla de totales
//Encabezado del grid de asientos
const encabezados = [
  {field: 'IDConfiguracion_Tipo_Documento', headerName: 'Tipo de Documento', editable: false, },
  {field: 'Tipo_Comprobante', headerName: 'Tipo de Comprobante',  editable: false, type: 'text'},
  {field: 'Numero_Comprobante', headerName: 'Número del Comprobante', editable: false, type: 'text'},
  {field: 'Fecha_Comprobante', headerName: 'Fecha de Comprobante', type: 'date', editable: false},
  {field: 'IDContabilidad_Catalogo', headerName: 'Cuenta del Catálogo',  editable: false, 
    renderCell: (params) =>  (
      <Tooltip title={`${params.value} - ${listaCatalogosMovimientos.find(option => option.Cuenta_Formateada === params.value)?.Nombre_Cuenta }`} >
        <span className="csutable-cell-trucate">{params.value}</span>
       </Tooltip>
    ),
  },
  {field: 'IDContabilidad_Origen', headerName: 'Origen', editable: false,},
  {field: 'Debito_Local', headerName: 'Débito Local', type: 'number', align: 'left',headerAlign: 'left', editable: false,},
  {field: 'Credito_Local', headerName: 'Crédito Local', type: 'number', align: 'left',headerAlign: 'left', editable: false,},
  {field: 'Debito_Extranjero', headerName: 'Débito Extranjero', type: 'number', align: 'left',headerAlign: 'left', editable: false , },
  {field: 'Credito_Extranjero', headerName: 'Crédito Extranjero', type: 'number', align: 'left',headerAlign: 'left', editable:false ,},
  {field: 'Detalle_Asiento', headerName: 'Detalle del Asiento',  editable: false, type: 'text'}, 
  {field: 'Numero_Largo', headerName: 'Número Largo', editable: false,type: 'text' },
];


//Encabezado que muestra la tabla de creditos y debitos locales y extrajeros
const columnsTablaCuadrados = [
  { field: 'Debito_local', headerName: 'Debitos local' },
  { field: 'Credito_Local', headerName: 'Creditos Local' },
  { field: 'Debito_Extranjero', headerName: 'Debitos Extranjero',  },
  { field: 'Credito_Extranjero', headerName: 'Creditos Extranjero',  },
];


//Filas de la tabla que mustra el total de creditos y debitos locales y extranjeros
const rowsTablaCuadrados = [
  { id: 1, Debito_local: totalDebitosLocal, Credito_Local: totalCreditosLocal, Debito_Extranjero: totalDebitosExtranjeros, Credito_Extranjero: totalCreditosExtranjeros},
];


//Observa el array filas y realiza la suma total de los creditos y debitos extranjeros y locales, Ademas, valida que el asiento este cuadrado
useEffect(() => {
  // Calcula las sumas de los totales de débito y crédito (local y extranjero)
  const nuevaSumaTotales = filas.reduce((sumas, fila) => ({
    Debito_Local: sumas.Debito_Local + parseFloat(fila.Debito_Local || 0),
    Credito_Local: sumas.Credito_Local + parseFloat(fila.Credito_Local || 0),
    Debito_Extranjero: sumas.Debito_Extranjero + parseFloat(fila.Debito_Extranjero || 0),
    Credito_Extranjero: sumas.Credito_Extranjero + parseFloat(fila.Credito_Extranjero || 0),
  }), {
    Debito_Local: 0,
    Credito_Local: 0,
    Debito_Extranjero: 0,
    Credito_Extranjero: 0,
  });

  // Aplica decimales a los totales calculados 
  const totalDebitosLocales = TipoDeCambio.decimalesUtilizados(nuevaSumaTotales.Debito_Local);
  const totalCreditosLocales = TipoDeCambio.decimalesUtilizados(nuevaSumaTotales.Credito_Local);
  const totalDebitosExtranjeros = TipoDeCambio.decimalesUtilizados(nuevaSumaTotales.Debito_Extranjero);
  const totalCreditosExtranjeros = TipoDeCambio.decimalesUtilizados(nuevaSumaTotales.Credito_Extranjero);

  // Actualiza los estados de los totales (sólo si son mayores a 0)
  setTotalDebitosLocal(totalDebitosLocales > 0 ? totalDebitosLocales : 0);
  setTotalCreditosLocal(totalCreditosLocales > 0 ? totalCreditosLocales : 0);
  setTotalDebitosExtranjeros(totalDebitosExtranjeros > 0 ? totalDebitosExtranjeros : 0);
  setTotalCreditosExtranjeros(totalCreditosExtranjeros > 0 ? totalCreditosExtranjeros : 0);

  // Función para verificar si los totales están equilibrados y calcular los faltantes
  const checkBalance = (localDebits, localCredits, foreignDebits, foreignCredits) => {
    if (localDebits === localCredits && foreignDebits === foreignCredits) {
      return { balanced: true, missing: 0, missingForeign: 0, fieldMissing: "" };
    }

    const missing = TipoDeCambio.decimalesUtilizados(Math.abs(localDebits - localCredits));
    const missingForeign = TipoDeCambio.decimalesUtilizados(Math.abs(foreignDebits - foreignCredits));
    const fieldMissing = localDebits > localCredits || foreignDebits > foreignCredits ? "Crédito" : "Débito";

    return { balanced: false, missing, missingForeign, fieldMissing };
  };

 // Llama a la función checkBalance para determinar el balance y los faltantes
  const { balanced, missing, missingForeign, fieldMissing } = checkBalance(
    totalDebitosLocales,
    totalCreditosLocales,
    totalDebitosExtranjeros,
    totalCreditosExtranjeros,
    asiento.Diferencial,
  );

  // Actualiza los estados con los resultados de checkBalance
  setSaldoFaltante(missing);
  setSaldoExtranjeroFaltante(missingForeign);
  setNombreCampoFaltante(fieldMissing)
  setAsientoCuadrado(balanced);

 // Maneja el caso cuando no hay filas
  if (filas.length === 0) {
    setTotalDebitosLocal(0);
    setTotalCreditosLocal(0);
    setTotalDebitosExtranjeros(0);
    setTotalCreditosExtranjeros(0);
    setAsientoCuadrado(false);
  }
}, [asiento.Diferencial, filas]);


//Son las propiedades que se le va a pasar al formulario
const propsParaFormulario = {
  asiento,
  encabezadoAsiento,
  idFormulario,
  //------------
  filas,
  setFilas, 
  encabezados, 
  abrirTotales, 
  listaCatalogosMovimientos, 
  mostrarTotales, 
  cerrarTotales, 
  rowsTablaCuadrados, 
  columnsTablaCuadrados, 
  saldoFaltante, 
  saldoExtranjeroFaltante, 
  nombreCampoFaltante, 
  asientoCuadrado,
  lista_tipo_Documento,
  mostrarAlerta, 
  setMostrarAlerta,
  getListCatalogosConMovimientos,
};
  
return(
  <>
   {/*Invoca al formulario y le pasa propiedades     */}
    <FormularioAsientosHistoricosEditar {...propsParaFormulario}/>

    {/*Muestra el Loading aleatorio con colores aleatorios y el SVG de New Impact     */}
    <LoadingAleatorio mostrar={cargando}/>
  </>
  );
};


export default AsientosHistoricosEditar;