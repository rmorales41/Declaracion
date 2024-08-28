import React, { useState, useEffect  } from "react";
import {useParams, useNavigate} from 'react-router-dom';
import AuthServices from '../../../../Servicios/AuthServices';
import AsientosServicios from '../../../../Servicios/ContabilidadServicios/AsientosServicios';
import LoadingAleatorio from "../../../Componentes/Loading/LoadingAleatorio";
import ModalSuccess from "../../../Componentes/Modales/ModalesSweetalert2/ModalSuccess"
import ValidaRestricciones from '../../../../Hooks/ValidaRestricciones';
import FormularioAsientos from "./FormularioAsientos";
import TipoDocumentoServicios from "../../../../Servicios/ConfiguracionServicios/TipoDocumentoServicios/TipoDocumentoServicios"
import TipoDeCambioServicios from "../../../../Servicios/ConfiguracionServicios/TipoDeCambioServicios/TipoDeCambioServicios"
import EventoManejoInputFormato from "../../../../Hooks/EventoManejoInputFormato"
import CatalogoServicios from '../../../../Servicios/ContabilidadServicios/CatalogoServicios';
import OrigenDestinoServicios from '../../../../Servicios/ContabilidadServicios/OrigenDestinoServicios';
import TipoAsientoServicios from '../../../../Servicios/ContabilidadServicios/TipoAsientoServicios';
import Autocomplete from '@mui/material/Autocomplete';
import TextField from '@mui/material/TextField';
import Stack from '@mui/material/Stack';
import Tooltip from '@mui/material/Tooltip';
import TipoDeCambio from "../../../../Hooks/TipoDeCambio";
import Swal from 'sweetalert2';
import "./AsientosNuevo.css"
import { format } from 'date-fns';
import ParametrosServicios from "../../../../Servicios/ConpaniaServicios/ParametrosServicios";
import obtenerContabilidadConfiguracion from "../../../../Hooks/ContabilidadConfiguracion";

const moment = require('moment');

const AsientosNuevo = () => {
  const { idFormulario } = useParams(); //es el id del formulario para buscar las restricciones 

const InicializaAsiento = {
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

const [asiento, setAsiento] = useState(InicializaAsiento);
const [codigo_compania, setCodigo_compania] = useState(0);
const [validacion, setValidacion] = useState(false);
const [cargando, setCargando] = useState(false);//Muestra o no el Loading
const [errores, setErrores] = useState({});
const [catalogo, setCatalogo] = useState(null)
const [mostrarCatalogoContable, setMostrarCatalogoContable] = useState(false);
const [formato, setFormato ] = useState("");//Formato de la cuenta ejemplo: xxxx-xxxx-xxx-xx
const [selectedCuenta, setSelectedCuenta] = useState('');
const [idCatalogo, setIdCatalogo] = useState(0);
const [listaCatalogos, setListaCatalogos] = useState([])
const [listaCatalogosMovimientos, setListaCatalogosMovimientos] = useState([])
const [lista_tipo_Documento, setLista_tipo_Documento] = useState([])
const [listaOrigen, setListaOrigen] = useState([])
const [listaTipoAsiento, setListaTipoAsiento] = useState([])
const [tipo_Cambio, setTipo_Cambio] = useState(null)
const [inputFormatiado, setInputFormatiado] = useState('');
const [valorCatalogoSeleccionado, setValorCatalogoSeleccionado] = useState(null);
const [filas, setFilas] = useState([]);
const [codigoDelAsiento, setCodigoDelAsiento] = useState(null);
const [totalDebitosLocal, setTotalDebitosLocal] =  useState(0);
const [totalCreditosLocal, setTotalCreditosLocal] =  useState(0);
const [totalDebitosExtranjeros, setTotalDebitosExtranjeros] =  useState(0);
const [totalCreditosExtranjeros, setTotalCreditosExtranjeros] =  useState(0);
const [mostrarTotales, setMostrarTotale] = useState(false);
const [saldoFaltante, setSaldoFaltante] = useState(0);
const [saldoExtranjeroFaltante, setSaldoExtranjeroFaltante] = useState(0);
const [nombreCampoFaltante, setNombreCampoFaltante] = useState("");
const [tipoDiferencial, setTipoDiferencial] = useState(false);//False es moneda local y true es moneda extranjera
const [asientoCuadrado, setAsientoCuadrado] = useState(false);//Si el asiento no es cuadrado = false no guarda el asiento, si esta cuadrado = si permite guardar
const [requiereOrigen, setRequiereOrigen] = useState(false);//Valida si la cuenta seleccionada requiere origen y destino 
const [cantidadDecimales, setCantidadDecimales] = useState(6);//Valida si la cuenta seleccionada requiere origen y destino 
const [mostrarAlerta, setMostrarAlerta] = useState(false);// Es para mostrar cuando se agrega un asiento correctamente
const [alertaEliminar, setAlertaEliminar] = useState(false); // Es para mostrar cuando se elimina un asiento correctamente
const [agregarTipoDeCambio, setAgregarTipoDeCambio] = useState(false);
const navigate = useNavigate();

const abrirAgregarTipoDeCambio = () => setAgregarTipoDeCambio(true)
const cerrarAgregarTipoDeCambio = () => setAgregarTipoDeCambio(false)


//Agrega una nueva fila en el grid de asientos
const nuevaFilaDeAsiento = (event) => {

  const newRow = {
    id                          : Date.now(),
    Codigo_Asiento              : asiento.Codigo_Asiento,
    Concepto                    : asiento.Concepto,
    Fecha_Comprobante           : asiento.Fecha_Comprobante ? moment(asiento.Fecha_Comprobante).toDate() : null,
    Fecha_Asiento               : asiento.Fecha_Asiento ? moment(asiento.Fecha_Asiento).toDate() : null,
    Fecha_Sistema		            : asiento.Fecha_Sistema ? asiento.Fecha_Sistema: null , 
    Numero_Comprobante          : asiento.Numero_Comprobante,
    Numero_Largo                : asiento.Numero_Largo ? asiento.Numero_Largo: null,
    Tipo_Comprobante            : asiento.Tipo_Comprobante,
    Aplica_Comprobante          : asiento.Aplica_Comprobante  ? asiento.Aplica_Comprobante : null , 
    Aplica_Comprobante_Largo    : asiento.Aplica_Comprobante_Largo ? asiento.Aplica_Comprobante_Largo: null , 
    Debito_Local                : asiento.Debito_Local,
    Credito_Local               : asiento.Credito_Local,
    Mayorizado			            : asiento.Mayorizado , 
    Debito_Extranjero           : asiento.Debito_Extranjero,
    Credito_Extranjero          : asiento.Credito_Extranjero,
    Dolar                       : tipo_Cambio ? parseFloat(tipo_Cambio.Venta).toFixed(2) : parseFloat(asiento.tipo_Cambio).toFixed(2),
    Detalle_Asiento             : asiento.Detalle_Asiento? asiento.Detalle_Asiento:null ,   
    Asiento_Modificado          : asiento.Asiento_Modificado  ,  
    Usuario_Creador             : asiento.Usuario_Creador ? asiento.Usuario_Creador: null ,               
    Diferencial                 : asiento.Diferencial ,              
    Observaciones               : asiento.Observaciones ? asiento.Observaciones: null , 
    Observacion_Tecnica         : asiento.Observacion_Tecnica ? asiento.Observacion_Tecnica: null , 
    Origen_Datos                : asiento.Origen_Datos ? asiento.Origen_Datos: null ,   
    IDOrigen_Datos              : asiento.IDOrigen_Datos  ,
    // Foreign Key
    IDCompania                  : codigo_compania, 
    IDConfiguracion_Tipo_Documento    : asiento.IDConfiguracion_Tipo_Documento, 
    IDConfiguracion_Tipo_Cambio       : asiento.IDConfiguracion_Tipo_Cambio, 
    IDContabilidad_Tipo_Asiento       : asiento.IDContabilidad_Tipo_Asiento, 
    IDContabilidad_Origen             : asiento.IDContabilidad_Origen ? asiento.IDContabilidad_Origen : null, 
    IDContabilidad_Catalogo           : asiento.IDContabilidad_Catalogo,
  };
  setMostrarAlerta(true)//Muestra la alerta que se guardo correctamente
  setFilas([...filas, newRow]);
 
  //Limpia los campos del objeto asiento que son necesarios limpiar, los otros quedan con el mismo valor 
  setAsiento({
    Codigo_Asiento: asiento.Codigo_Asiento,
    Concepto: asiento.Concepto,
    Fecha_Comprobante: asiento.Fecha_Comprobante,
    Fecha_Asiento: asiento.Fecha_Asiento,
    Fecha_Sistema: "", 
    Numero_Comprobante: "",
    Numero_Largo: "",
    Tipo_Comprobante: asiento.Tipo_Comprobante,
    Aplica_Comprobante: "",
    Aplica_Comprobante_Largo: "",
    Debito_Local: 0,
    Credito_Local: 0,
    Mayorizado:0, 
    Debito_Extranjero: 0,
    Credito_Extranjero: 0,
    Dolar: 0,
    Detalle_Asiento: asiento.Detalle_Asiento,   
    Asiento_Modificado: false,
    Usuario_Creador: "",               
    Diferencial: asiento.Diferencial,             
    Observaciones: "", 
    Observacion_Tecnica: "",
    Origen_Datos: "", 
    IDOrigen_Datos: 0, 
    Automatico: 0, 
    //Foreign Keys    
    IDCompania: 0,
    IDConfiguracion_Tipo_Documento: asiento.IDConfiguracion_Tipo_Documento,
    IDConfiguracion_Tipo_Cambio: asiento.IDConfiguracion_Tipo_Cambio,
    IDContabilidad_Tipo_Asiento: asiento.IDContabilidad_Tipo_Asiento,
    IDContabilidad_Origen: asiento.IDContabilidad_Origen,
    IDContabilidad_Catalogo: asiento.IDContabilidad_Catalogo
  }
  ); // Clear input fields.reset()
  //Limpia los campos de los inputs, se limpian de esta manera porque si los campos tiene la propiedad value se vulve muy lento el onChange
  if(asiento.Numero_Comprobante)document.getElementById("Numero_Comprobante").value = '';
  if(asiento.Numero_Largo)document.getElementById("Numero_Largo").value = '';
  if(asiento.Debito_Local || asiento.Debito_Local === 0 )document.getElementById("Debito_Local").value = '';
  if(asiento.Credito_Local || asiento.Credito_Local === 0) document.getElementById("Credito_Local").value = '';
  if(asiento.Debito_Extranjero || asiento.Debito_Extranjero === 0)document.getElementById("Debito_Extranjero").value = '';
  if(asiento.Credito_Extranjero || asiento.Credito_Extranjero === 0)document.getElementById("Credito_Extranjero").value = '';
};
 

//---------- Maneja los cambios en los inputs ----------
const manejoCambioImput = event => {
  setMostrarAlerta(false)//oculta el mensaje o alerta de que se agrego correctamente
  const { name, value } = event.target;
  setAsiento({ ...asiento, [name]: value });

  //Esto lo que hace es manejar los eventos de los campos creditos y debitos locales como extranjeros, pra que haga las converciones y se limpien los campos contrarios 
    const tipoCambio = tipo_Cambio ? tipo_Cambio.Venta : 1;
      if(name === "Debito_Local" || name === "Credito_Local"){
        const colonesADolares = TipoDeCambio.convertirColonesADolares(value, tipoCambio); // Hace la comvercion de colones a dolares
        const valorDebitoOCredito = tipo_Cambio ? colonesADolares : 1 // si tipo de cambio esta vacio se agrega un 1 al valor

            if(name === "Debito_Local" && value > 0){
              document.getElementById("Credito_Local").value = 0;
              document.getElementById("Credito_Extranjero").value = 0;
              setAsiento(prevAsiento => ({...prevAsiento, Credito_Local: 0 }));
              setAsiento(prevAsiento => ({...prevAsiento, Credito_Extranjero: 0 }));
              if(!asiento.Diferencial){//Valida que no sea diferencial
                document.getElementById("Debito_Extranjero").value =  valorDebitoOCredito
                setAsiento(prevAsiento => ({...prevAsiento, Debito_Extranjero : valorDebitoOCredito}));
              }else{
                document.getElementById("Debito_Extranjero").value =  0
                setAsiento(prevAsiento => ({...prevAsiento, Debito_Extranjero : 0}));
              }
            }

            if(name === "Credito_Local" && value > 0){
              document.getElementById("Debito_Local").value = 0;
              document.getElementById("Debito_Extranjero").value = 0;
              setAsiento(prevAsiento => ({...prevAsiento, Debito_Local: 0 }));
              setAsiento(prevAsiento => ({...prevAsiento, Debito_Extranjero: 0 }));
              if(!asiento.Diferencial){//Valida que no sea diferencial
                document.getElementById("Credito_Extranjero").value = valorDebitoOCredito;
                setAsiento(prevAsiento => ({...prevAsiento, Credito_Extranjero : valorDebitoOCredito}));
              }else{
                document.getElementById("Credito_Extranjero").value = 0;
                setAsiento(prevAsiento => ({...prevAsiento, Credito_Extranjero : 0}));
              }
            }
      }

      if(name === "Debito_Extranjero" || name === "Credito_Extranjero"){
        const dolaresAColones = TipoDeCambio.convertirDolaresAColones(value, tipoCambio); // Hace la comvercion de colones a dolares
        const valorDebitoOCreditoExtranjero = tipo_Cambio ? dolaresAColones : 1 // si tipo de cambio esta vacio se agrega un 1 al valor
          if(name === "Debito_Extranjero" && value > 0){
            document.getElementById("Credito_Local").value = 0;
            document.getElementById("Credito_Extranjero").value = 0;
            setAsiento(prevAsiento => ({...prevAsiento, Credito_Local: 0 }));
            setAsiento(prevAsiento => ({...prevAsiento, Credito_Extranjero: 0 }));
            if(!asiento.Diferencial){//Valida que no sea diferencial
              document.getElementById("Debito_Local").value =  valorDebitoOCreditoExtranjero
              setAsiento(prevAsiento => ({...prevAsiento, Debito_Local : valorDebitoOCreditoExtranjero}));
            }else{
              document.getElementById("Debito_Local").value =  0
              setAsiento(prevAsiento => ({...prevAsiento, Debito_Local : 0}));
            }
          }
        
          if(name === "Credito_Extranjero" && value > 0){
            document.getElementById("Debito_Local").value = 0;
            document.getElementById("Debito_Extranjero").value = 0;
            setAsiento(prevAsiento => ({...prevAsiento, Debito_Extranjero: 0 }));
            setAsiento(prevAsiento => ({...prevAsiento, Debito_Local: 0 }));
            if(!asiento.Diferencial){//Valida que no sea diferencial
              document.getElementById("Credito_Local").value = valorDebitoOCreditoExtranjero;
              setAsiento(prevAsiento => ({...prevAsiento, Credito_Local : valorDebitoOCreditoExtranjero}));
            }else{
              document.getElementById("Credito_Local").value = 0;
              setAsiento(prevAsiento => ({...prevAsiento, Credito_Local : 0}));
            }
          }
      }
}


//Pasa observando el tipo de cambio por si cambia de fecha despues de agregar los debitos y creditos
useEffect(()=>{
  const tipoCambio = tipo_Cambio ? tipo_Cambio.Venta : 1;//Si el tipo de cambio no tiene valor es 1
  const debitoLocal = document.getElementById("Debito_Local").value//Trae el valor del campo debito local
  const creditoLocal = document.getElementById("Credito_Local").value// Trae el valor del campo credito local

  if(debitoLocal > 0 ){//Valida que el cambo de debito local tenga algun valor
    const colonesADolares = TipoDeCambio.convertirColonesADolares(debitoLocal, tipoCambio); // Hace la comvercion de colones a dolares
    const valorDebitoOCredito = tipo_Cambio ? colonesADolares : 1 // si tipo de cambio esta vacio se agrega un 1 al valor
    if(!asiento.Diferencial){//Valida que sea o no diferencial
      document.getElementById("Debito_Extranjero").value =  valorDebitoOCredito
      setAsiento(prevAsiento => ({...prevAsiento, Debito_Extranjero : valorDebitoOCredito}));
    }
  }

  if(creditoLocal > 0 ){//Valida que el cambo de cridito local tenga algun valor
    const colonesADolares = TipoDeCambio.convertirColonesADolares(creditoLocal, tipoCambio); // Hace la comvercion de colones a dolares
    const valorDebitoOCredito = tipo_Cambio ? colonesADolares : 1 // si tipo de cambio esta vacio se agrega un 1 al valor
    if(!asiento.Diferencial){//Valida que sea o no diferencial
      document.getElementById("Credito_Extranjero").value =  valorDebitoOCredito
      setAsiento(prevAsiento => ({...prevAsiento, Credito_Extranjero : valorDebitoOCredito}));
    }
  }

},[tipo_Cambio,asiento.Diferencial])


// Función genérica para manejar cambios en fechas convertirDolaresAColones
const eventoObtenerFecha = async (date, field) => {
  if (!date || isNaN(date)){//Valida que la fecha no venga vacia
    const updatedState = { [field]: null };
    if (field === "Fecha_Asiento") {
      setAsiento(prevAsiento => ({ ...prevAsiento, ...updatedState }));
    } else {
      setAsiento(prevAsiento => ({ ...prevAsiento, ...updatedState }));
    }
    return;
  }

  const formattedDate = date.format('YYYY-MM-DD');

  if (field === "Fecha_Asiento") {
    const fechaCierre = await obtenerContabilidadConfiguracion.obtenerContabilidadConfiguracion();
    if (formattedDate <= fechaCierre[0].Ultimo_Cierre) {
      setAsiento(prevAsiento => ({ ...prevAsiento, [field]: null }));
      ModalSuccess.modalCapturaDeWarning("No se puede seleccionar una fecha anterior a la fecha del último cierre.");
    } else {
      setAsiento(prevAsiento => ({ ...prevAsiento, [field]: formattedDate }));
    }
  } else {
    setAsiento(prevAsiento => ({ ...prevAsiento, [field]: formattedDate }));
  }
};


//Arrays que se muestran en los SelectAutoComplete que se les pasa a los SelectAutoComplete por props
 const propsTipo_Documento = {
  options: lista_tipo_Documento,
  getOptionLabel: (option) => option.Descripcion,
};

const propsOrigen = {
  options: listaOrigen,
  getOptionLabel: (option) => `${option.Codigo} | ${option.Descripcion}`,
};

const propsTipoAsiento = {
  options: listaTipoAsiento,
  getOptionLabel: (option) => option.Descripcion,
};

const propsCatalogo = {
  options: listaCatalogosMovimientos,
  getOptionLabel: (option) => `${option.Cuenta_Formateada} | ${option.Nombre_Cuenta}`,
};


//Se usa este evento solo para el campo cuenta de catalogo
const eventoCambioSelectCuenta = (event, value) => {
  setMostrarAlerta(false)//oculta el mensaje o alerta de que se agrego correctamente
  if (value) {
      setValorCatalogoSeleccionado(value)
      setSelectedCuenta(`${value.Cuenta_Formateada} | ${value.Nombre_Cuenta}`);//value.Cuenta_Formateada
      setAsiento(prevAsiento => ({
        ...prevAsiento,
        IDContabilidad_Catalogo: value.IDContabilidad_Catalogo
      }));
      setIdCatalogo("")
  } else {
      setSelectedCuenta("");
      setIdCatalogo("")
      setValorCatalogoSeleccionado(null)
      setAsiento(prevAsiento => ({
        ...prevAsiento,
        IDContabilidad_Catalogo: " "
      }));
  }
};


//Se usa para que cada ves que este digitando una letra sea con el formato correcto
const manejoImputFormato = (event, value) => {
  setMostrarAlerta(false)//oculta el mensaje o alerta de que se agrego correctamente
  setSelectedCuenta("");
  const { formattedValue } = EventoManejoInputFormato.eventoSelectFormato(event, value, formato);
  setInputFormatiado(formattedValue);
};


// Función genérica para manejar cambios en selects con mapeo personalizado
const eventoCambioDeSelect = (event, value, field, mapValueToField) => {
  setMostrarAlerta(false)//oculta el mensaje o alerta de que se agrego correctamente
  setAsiento(prevAsiento => ({
    ...prevAsiento,
    [field]: value ? mapValueToField(value) : ""
  }));
};


// Funciones del valor que desea tener al seleccionar el regsitro en el select Autocompletado
const valorTipoDocumento = value => value.IDConfiguracion_Tipo_Documento;
const valorOrigen = value => value.IDContabilidad_Origen;
const valorTipoAsiento = value => value.IDContabilidad_Tipo_Asiento;
const eventoAbrirModalCase = () => setMostrarCatalogoContable(true);//Cierra el Modal de la lista del catálogo contable 
const eventoCerrarModalCase = () => setMostrarCatalogoContable(false);//Cierra el Modal de la lista del catálogo contable 


// Es un evento para volve a realizar todos lo endpoid que sean get all o listar
const eventoRefrescarListas = ()=>{
  const codigoCompaniaAuth = parseInt(AuthServices.getCodigoCompania());
  if(codigoCompaniaAuth){
    getListTipoDocumento(codigoCompaniaAuth);
    getListCatalogo(codigoCompaniaAuth);
    getOrigenYDestino(codigoCompaniaAuth);
    getTipoAsiento(codigoCompaniaAuth);
    getListCatalogosConMovimientos(codigoCompaniaAuth);
  }
}


//Invoca el hook que tiene una funcio para trae solo el formato que se va usar en el input de Cuenta
useEffect(()=>{
  const cargarFormato = async () => {
    try { 
      const { formato } = await EventoManejoInputFormato.obtenerFormato();
      setFormato(formato);
    } catch (e) {
      console.error(e)
      //ValidaRestricciones.capturaDeErrores(e);
    }
  };
  cargarFormato();
},[catalogo])


//----Método genérica para obtener listas para get o listar, Funcion o metodo generico para listar o get all
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
const getListCatalogo = (codigo_compania) => getList(codigo_compania, CatalogoServicios, setListaCatalogos);
const getOrigenYDestino = (codigo_compania) => getList(codigo_compania, OrigenDestinoServicios, setListaOrigen);
const getTipoAsiento = (codigo_compania) => getList(codigo_compania, TipoAsientoServicios, setListaTipoAsiento);
const getListCatalogosConMovimientos = (codigo_compania) => getList(codigo_compania, CatalogoServicios, setListaCatalogosMovimientos, CatalogoServicios.getAllFiltrado_movimientos(codigo_compania));


//---- Método para obtener el tipo de cambio por fecha. Si no se encuentra ningún tipo de cambio para la fecha especificada, se muestra un modal que permite agregar el tipo de cambio manualmente.
const obtenerTipoDeCambioPorFecha = (codigo_compania, fecha) => {
  const token = AuthServices.getAuthToken();// Trae el token de local store
  if (!ValidaRestricciones.ValidarToken(token)) return;//valida el token
    TipoDeCambioServicios.setAuthToken(token); // Le manda el token al encabezado de la consulta del endpoind
    TipoDeCambioServicios.searchbydate(codigo_compania, fecha) // Invoca o llama el metodo listar o el get de todo de servicios  
      .then(response => {
          setTipo_Cambio(response.data)
          cerrarAgregarTipoDeCambio() 
          if(response.data){
            setAsiento(prevAsiento => ({...prevAsiento,
              IDConfiguracion_Tipo_Cambio: response.data.IDConfiguracion_Tipo_Cambio 
            }));
          }
          
      })
      .catch(e => {
        setTipo_Cambio(null)//Pone en null el tipo de cambio
        console.error(e)//Manda por consola un error que devulve el back end
        abrirAgregarTipoDeCambio();// Si no se encuentra ningún tipo de cambio para la fecha especificada, se abre un modal que permite registrar el tipo de cambio.
      });
};


//Renderiza la página y hace los diferentes gets de listar 
useEffect(() => {
  const codigoCompaniaAuth = parseInt(AuthServices.getCodigoCompania());
  setCodigo_compania(codigoCompaniaAuth);
  const configuracionCompania =  AuthServices.getCompaniaConfig();//Se trae todas las configuraion de la compañia que esta guardado en el local stores
  
  if(configuracionCompania){
    const decimalesCant = configuracionCompania.Decimales_Globales_Precios; //Asiga los desimales que tiene la configuracion de la compañia
    const usarDesimales = decimalesCant > 0 ? `0.${'0'.repeat(decimalesCant - 1)}1` : "1";
    setCantidadDecimales(usarDesimales);
  }

  if(codigoCompaniaAuth){
    getListTipoDocumento(codigoCompaniaAuth);
    getListCatalogo(codigoCompaniaAuth);
    getOrigenYDestino(codigoCompaniaAuth);
    getTipoAsiento(codigoCompaniaAuth);
    getListCatalogosConMovimientos(codigoCompaniaAuth);
  }
  
  if (validacion)limpiaCampos();
// eslint-disable-next-line
}, [validacion]); 


//Le recomienda el codigo de asiento por el Indicador del tipo de asiento y Fecha_Asiento
useEffect(()=>{
  //Valida  si los campos de fecha de asiento y el tipo de asiento estan llenos para armar el codigo de asiento
  if(asiento.Fecha_Asiento && asiento.IDContabilidad_Tipo_Asiento ){//&& !asiento.Codigo_Asiento
      const IndicadorTA = listaTipoAsiento.find(option => option.IDContabilidad_Tipo_Asiento === asiento.IDContabilidad_Tipo_Asiento)?.Indicador;
      const fecha = asiento.Fecha_Asiento;
      const año = fecha.slice(0, 4); // Extraer los primeros cuatro caracteres que representan el año
      const mes = fecha.slice(5, 7); // Extraer los caracteres del mes
      const dia = fecha.slice(8, 10); // Extraer los caracteres del día
      const ultimosTresDigitos = año.slice(-3); 
      const TIndicadorTARellenado = IndicadorTA.padStart(3, '0');
      const codigoDelAsiento = TIndicadorTARellenado + dia + mes + ultimosTresDigitos;
      const codigoFormateado =  EventoManejoInputFormato.formatiarDato(codigoDelAsiento);
      setAsiento(prevAsiento => ({
        ...prevAsiento,
        Codigo_Asiento: codigoFormateado
      }));
      setCodigoDelAsiento(codigoFormateado)
  }
},[asiento.Codigo_Asiento, asiento.Fecha_Asiento, asiento.IDContabilidad_Tipo_Asiento, listaTipoAsiento])


//Se trae el tipo de cambio cada ves que se modifica el campo Fecha_Comprobante
useEffect(()=>{
  const codigoCompaniaAuth = parseInt(AuthServices.getCodigoCompania());
  setCodigo_compania(codigoCompaniaAuth);
  if(asiento.Fecha_Comprobante)obtenerTipoDeCambioPorFecha(codigoCompaniaAuth, asiento.Fecha_Comprobante);
// eslint-disable-next-line
},[asiento.Fecha_Comprobante])


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
    tipoDiferencial
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
}, [asiento.Diferencial, filas, tipoDiferencial]);


//Filas de la tabla que mustra el total de creditos y debitos locales y extranjeros
const rowsTablaCuadrados = [
  { id: 1, Debito_local: totalDebitosLocal, Credito_Local: totalCreditosLocal, Debito_Extranjero: totalDebitosExtranjeros, Credito_Extranjero: totalCreditosExtranjeros},
];


//Encabezado que muestra la tabla de creditos y debitos locales y extrajeros
const columnsTablaCuadrados = [
  { field: 'Debito_local', headerName: 'Debitos local' },
  { field: 'Credito_Local', headerName: 'Creditos Local' },
  { field: 'Debito_Extranjero', headerName: 'Debitos Extranjero',  },
  { field: 'Credito_Extranjero', headerName: 'Creditos Extranjero',  },
];


//Eventos para el modal de totales de la tabla
const abrirTotales = () =>  setMostrarTotale(true)//Evento para abrir o mostrar el modal con los totales o saldos de debitos y creditos locales como extranjeros
const cerrarTotales = () =>  setMostrarTotale(false)//Evento para cerrar el modal con los totales o saldos de debitos y creditos locales como extranjeros


//Se muestra un modal para eligir el tipo de moneda ya sea local o extranjera, esto ocurre observanto asiento.Diferencial, cuando sea true se mostrara el modal
useEffect(() => {
  if (asiento.Diferencial && filas.length === 0) {
    Swal.fire({
      title: "¿Qué tipo de diferencial desea seleccionar: moneda local o moneda extranjera?",
      text: "¡Una vez seleccionado el tipo de moneda y añadido un registro, no se puede modificar el diferencial a menos que la tabla esté vacía y se seleccione de nuevo el diferencial.!",
      showCancelButton: true,
      confirmButtonColor: '#28a745',  
      confirmButtonText: 'Moneda Local',
      denyButtonColor: '#007bff',
      denyButtonText: 'Moneda Extranjera',
      cancelButtonText: 'Cancelar',
      showDenyButton: true
    }).then((result) => {
      if (result.isConfirmed) {
        setTipoDiferencial(false);
        ModalSuccess.modalSuccesscorrectamente("Moneda Local seleccionada",600); 
      } else if (result.isDenied) {
        setTipoDiferencial(true);
        ModalSuccess.modalSuccesscorrectamente("Moneda Extranjera seleccionada",600); 
      } else if (result.isDismissed && asiento.Diferencial) {
        setAsiento(prevAsiento => ({...prevAsiento, Diferencial: false}));
        Swal.fire("Tipo de diferencial cancelado.", "", "info");
      }
    });
  }
}, [asiento.Diferencial, setTipoDiferencial, setAsiento, filas.length]);


//Activa o desactiva el campo de origenes y destinos dependiendo de la cuenta seleccionada, si es false desactiva origenes y destinos
useEffect(()=>{
  if(asiento.IDContabilidad_Catalogo){
    const cuentaObjeto = listaCatalogosMovimientos.find(option => option.IDContabilidad_Catalogo === asiento.IDContabilidad_Catalogo);
    if(cuentaObjeto){
      if(cuentaObjeto.Requiere_Origen_Destino){
        setRequiereOrigen(true)
      }else{
        setRequiereOrigen(false)
        setAsiento(prevAsiento => ({...prevAsiento, IDContabilidad_Origen : null}));
      }
    }else{
      setRequiereOrigen(false)
      setAsiento(prevAsiento => ({...prevAsiento, IDContabilidad_Origen : null}));
    }
  }else{
    setRequiereOrigen(false)
    setAsiento(prevAsiento => ({...prevAsiento, IDContabilidad_Origen : null}));
  }
},[asiento.IDContabilidad_Catalogo, listaCatalogosMovimientos])


//---- Método para obtener la cuenta cuando se realiza un asiento automatico
const obtenerParametros = async () => {
  const codigoCompaniaAuth = parseInt(AuthServices.getCodigoCompania());
  const token = AuthServices.getAuthToken(); // Trae el token de local store
    if (!ValidaRestricciones.ValidarToken(token)) return null; // Valida el token
    ParametrosServicios.setAuthToken(token); // Le manda el token al encabezado de la consulta del endpoind
    try {
      const response = await ParametrosServicios.getAll(codigoCompaniaAuth); // Invoca el método listar o el get de servicios
      return response.data;
    } catch (e) {
      console.error(e)
      return null;
    }
};


//---------- Metodo para crear un nuevo asiento y enviarlo al backend ----------
const nuevo = async (e) => {
  const token = AuthServices.getAuthToken(); // Trae el token de local store
  if(filas.length === 0){
    ModalSuccess.modalCapturaDeWarning("Debe haber al menos un registro agregado para poder guardar."); // Modal para mostrar los errores capturados que devuelve el backend
    return
  } 

  if (!ValidaRestricciones.ValidarToken(token)) return; // Valida el token
  setCargando(true); // Activa el componente de carga
   //Campos del encavezado requeridos, si estan vacios no hace el endpoid y manda mensaje de error
    const camposRequeridosEncabezado = {
      Codigo_Asiento: "El campo Código Asiento está vacío.",
      Concepto: "El campo Concepto está vacío.",
      Fecha_Asiento: "El campo Fecha Asiento está vacío.",
      IDContabilidad_Tipo_Asiento: "El campo Tipo de Asiento está vacío."
    };
  
    for (const [campo, mensaje] of Object.entries(camposRequeridosEncabezado)) {
      if (!asiento[campo]) {
        ModalSuccess.modalCapturaDeWarning(mensaje); // Modal para mostrar los errores 
        setCargando(false);
        return;
      }
    }

    // Modificar todos los campos del encabezado en la lista filas que se la va enviar al endpoid 
    const data = await Promise.all(filas.map(async (fila) => {
      setCargando(false);
      let formatoFechaComprobante = null
      if(!isNaN(new Date(fila.Fecha_Comprobante).getTime())){//Viene en un folmato invalido
        if(!fila.Fecha_Comprobante){//Viene vacio
          formatoFechaComprobante = null
        }else{
          formatoFechaComprobante = format(fila.Fecha_Comprobante, 'yyyy-MM-dd')
        }
      } else if(!fila.Fecha_Comprobante){//Viene vacio
        formatoFechaComprobante = null
      }
     
      return {
        ...fila,
        Codigo_Asiento      : codigoDelAsiento.replace(/\//g, ""),
        Concepto            : asiento.Concepto,
        Fecha_Asiento       : asiento.Fecha_Asiento ,
        Fecha_Comprobante   : formatoFechaComprobante,
        Diferencial         : asiento.Diferencial,  
        IDCompania          : codigo_compania,
        IDContabilidad_Tipo_Asiento       : asiento.IDContabilidad_Tipo_Asiento
      };
    }));
    setCargando(true);
 // Validar que todos los objetos en la lista data tengan todos los campos requeridos no vacíos, y le manda un mensaje de cual es el que tiene vacio
  let mensajeCampoFaltante = "";
  const campoFaltante = data.find(objeto => {
    const requiereOrigenYdestino = listaCatalogosMovimientos.find(option => option.IDContabilidad_Catalogo === objeto.IDContabilidad_Catalogo)?.Requiere_Origen_Destino;
    // Encontrar el primer campo requerido que esté vacío en algún objeto
    if (!objeto.Numero_Comprobante) {
      mensajeCampoFaltante = "El número comprobante está vacío ";
      return "El número comprobante está vacío ";
    } else if (!objeto.Fecha_Comprobante) {
      mensajeCampoFaltante = "La fecha de comprobante está vacía ";
      return "La fecha de comprobante está vacía "
    }else if (!objeto.Tipo_Comprobante) {
        mensajeCampoFaltante = "El tipo de comprobante está vacío ";
        return "El tipo de comprobante está vacío "
    }else if (!objeto.IDConfiguracion_Tipo_Documento) {
      mensajeCampoFaltante = "El tipo de documento está vacío ";
      return "El tipo de documento está vacío "
    }else if (!objeto.IDContabilidad_Catalogo) {
      mensajeCampoFaltante = "La cuenta del catalogo está vacía ";
      return "La cuenta del catalogo está vacía "
    } else if (!objeto.IDContabilidad_Origen && requiereOrigenYdestino) {
      mensajeCampoFaltante = "El origen está vacío ";
      return "El origen está vacío "
    } else if (!objeto.Detalle_Asiento || objeto.Detalle_Asiento.length < 10) {
      if (!objeto.Detalle_Asiento) {
        mensajeCampoFaltante = "El Detalle del Asiento está vacío";
      } else {
        mensajeCampoFaltante = "El Detalle del Asiento debe tener al menos 10 caracteres";
      }
      return "El Detalle del Asiento está vacío o no tiene los caractenes requeridos (10) "
    }else if (!objeto.IDConfiguracion_Tipo_Cambio) {
      mensajeCampoFaltante = "tipo de cambio está vacío ";
      return "El tipo de cambio está vacío "
    }else if(!asiento.Diferencial){
        if (objeto.Debito_Local <= 0 && objeto.Credito_Local <= 0 && objeto.Debito_Extranjero <= 0 && objeto.Credito_Extranjero <= 0) {
          mensajeCampoFaltante = "Debe haber al menos un valor distinto de cero en los campos de débito o crédito, ya sea local o extranjero.";
          return  "Debe haber al menos un valor distinto de cero en los campos de débito o crédito, ya sea local o extranjero.";
        } else{
          return null;
        }
      
    }else if(asiento.Diferencial){
      if (!tipoDiferencial && objeto.Debito_Local <= 0 && objeto.Credito_Local <= 0) {
        mensajeCampoFaltante = "Debe haber al menos un valor distinto de cero en los campos de débito o crédito local.";
        return  "Debe haber al menos un valor distinto de cero en los campos de débito o crédito local.";
      } else if (tipoDiferencial && objeto.Debito_Extranjero <= 0 && objeto.Credito_Extranjero <= 0) {
        mensajeCampoFaltante = "Debe haber al menos un valor distinto de cero en los campos de débito o crédito extranjero.";
        return  "Debe haber al menos un valor distinto de cero en los campos de débito o crédito extranjero.";
      } else{
        return null;
      }
    }else {
      return null;// entra null significa que va ningun campo vacio 
    }

  });

  if (campoFaltante) {
    let mensaje = "";
    if (campoFaltante.Numero_Comprobante) {
      mensaje = `en el asiento con El Número de Comprobante : ${campoFaltante.Numero_Comprobante}`;
    } else if (campoFaltante.Fecha_Comprobante) {
      mensaje = `en el asiento con La Fecha de Comprobante : ${format(campoFaltante.Fecha_Comprobante, 'yyyy-MM-dd')}`;
    } else if (campoFaltante.Tipo_Comprobante) {
      mensaje = `en el asiento con el tipo de Comprobante : ${campoFaltante.Tipo_Comprobante}`;
    } else if (campoFaltante.IDConfiguracion_Tipo_Documento) {
      mensaje = `en el asiento con el tipo de cuenta : ${campoFaltante.IDConfiguracion_Tipo_Documento}`;
    } else if (campoFaltante.IDContabilidad_Catalogo) {
      mensaje = `en el asiento con La cuenta : ${campoFaltante.IDContabilidad_Catalogo}`;
    } else if (campoFaltante.IDContabilidad_Origen) {
      mensaje = `en el asiento con El Origen : ${campoFaltante.IDContabilidad_Origen}`;
    } else if (campoFaltante.Detalle_Asiento) {
      mensaje = `en el asiento con El Detalle de Asiento : ${campoFaltante.Detalle_Asiento}`;
    } else if (campoFaltante.IDConfiguracion_Tipo_Cambio) {
      mensaje = `en el asiento con El Tipo de Cambio : ${campoFaltante.IDConfiguracion_Tipo_Cambio}`;
    } else{
      mensaje = `en uno de los asientos `;
    }
    ModalSuccess.modalCapturaDeWarning(`${mensajeCampoFaltante} ${mensaje}.`);
    setCargando(false);
    return; // Salir de la función o realizar alguna acción adicional según tu flujo
  }

  //Valida que el asiento este cuadrado, si no esta cuadrado no guarda
  if(!asientoCuadrado){
    setCargando(false);
    const parametrosDefaulcuenta = await obtenerParametros();//Se obtienen los parámetros de la compañía para utilizar la cuenta en la realización de asientos automáticos.
    const cuenta = parametrosDefaulcuenta ? parametrosDefaulcuenta[0].Contabilidad_Ajustes_Contables : "No tiene una cuenta asignada para crear asientos automaticos"
    const cuentaParametro = listaCatalogosMovimientos.find(option => option.IDContabilidad_Catalogo === cuenta)?.Cuenta_Formateada;
    //Si no esta cuadrado pregunta si desea que lo cuadre automaticamente, si no pues no guarda el asiento
    Swal.fire({
      title: "El asiento contable no está balanceado. ¿Desea realizar el balanceo automáticamente?",
      text: `¡Una vez balanceado el asiento, se guardará con la cuenta ${cuentaParametro} Puede modificarlo en el apartado de (Modificar asiento).!`,
      icon: "warning",
      showCancelButton: true,  
      confirmButtonText: "¡Balancear el asiento automáticamente!",
      cancelButtonText: 'Cancelar',
      customClass: {
        icon: 'custom-swal-icon'
      }
    }).then(async (result) => {
      if(result.isConfirmed){
        setTipoDiferencial(false);
         // Crear el nuevo objeto y añadirlo al array data
        let debitoLocalAuto = 0
        let creditoLocalAuto = 0
        let debitoExtranjeroAuto = 0
        let creditoExtranjeroAuto = 0

        if(nombreCampoFaltante === "Débito"){
           debitoLocalAuto = saldoFaltante
           debitoExtranjeroAuto = saldoExtranjeroFaltante
        }else if(nombreCampoFaltante === "Crédito"){
           creditoLocalAuto = saldoFaltante
           creditoExtranjeroAuto = saldoExtranjeroFaltante
        }else{
           debitoLocalAuto = 0
           creditoLocalAuto = 0
           debitoExtranjeroAuto = 0
           creditoExtranjeroAuto = 0
        }
 
        const parametrosDefaul = await obtenerParametros();//Se obtienen los parámetros de la compañía para utilizar la cuenta en la realización de asientos automáticos.
         const NuevoObjeto = {
            Codigo_Asiento: codigoDelAsiento.replace(/\//g, ""), 
            Concepto: asiento.Concepto,
            Fecha_Comprobante: format(new Date(), 'yyyy-MM-dd'),
            Fecha_Asiento: asiento.Fecha_Asiento,
            Fecha_Sistema: null, 
            Numero_Comprobante: format(new Date(), 'yyyyMMdd'),//Se le quita los - - -
            Numero_Largo: null, 
            Tipo_Comprobante: asiento.Tipo_Comprobante, 
            Aplica_Comprobante: null,
            Aplica_Comprobante_Largo: null,
            Debito_Local : debitoLocalAuto,
            Credito_Local: creditoLocalAuto, 
            Mayorizado: 0, 
            Debito_Extranjero: debitoExtranjeroAuto, 
            Credito_Extranjero: creditoExtranjeroAuto, 
            Dolar: 0,
            Detalle_Asiento: "ESTE ASIENTO FUE GENERADO AUTOMÁTICAMENTE POR EL SISTEMA DESPUÉS DE QUE EL USUARIO CONFIRMÓ EL BALANCEO AUTOMÁTICO. LOS CRÉDITOS Y DÉBITOS SE AJUSTARON PARA LOGRAR EL BALANCE REQUERIDO. NO SE REALIZÓ CONVERSIÓN CON EL TIPO DE CAMBIO DEBIDO A POSIBLES VARIACIONES EN LA FECHA DEL COMPROBANTE, LO CUAL PODRÍA AFECTAR EL BALANCE DEL ASIENTO. ",   
            Asiento_Modificado: false,
            Usuario_Creador: null,               
            Diferencial: asiento.Diferencial,             
            Observaciones: "ESTE ASIENTO FUE GENERADO AUTOMÁTICAMENTE POR EL SISTEMA DESPUÉS DE QUE EL USUARIO CONFIRMÓ EL BALANCEO AUTOMÁTICO. LOS CRÉDITOS Y DÉBITOS SE AJUSTARON PARA LOGRAR EL BALANCE REQUERIDO. NO SE REALIZÓ CONVERSIÓN CON EL TIPO DE CAMBIO DEBIDO A POSIBLES VARIACIONES EN LA FECHA DEL COMPROBANTE, LO CUAL PODRÍA AFECTAR EL BALANCE DEL ASIENTO.", 
            Observacion_Tecnica: "ESTE ASIENTO FUE GENERADO AUTOMÁTICAMENTE POR EL SISTEMA.", 
            Origen_Datos: null, 
            IDOrigen_Datos: 0, 
            Automatico: 0, 
            // Foreign Keys    
            IDCompania: codigo_compania,
            IDConfiguracion_Tipo_Documento: asiento.IDConfiguracion_Tipo_Documento,
            IDConfiguracion_Tipo_Cambio: asiento.IDConfiguracion_Tipo_Cambio, 
            IDContabilidad_Tipo_Asiento: asiento.IDContabilidad_Tipo_Asiento,
            IDContabilidad_Origen: null,
            IDContabilidad_Catalogo: parametrosDefaul ? parametrosDefaul[0].Contabilidad_Ajustes_Contables : null,
        };

        // Añadir el nuevo objeto al array data
        data.push(NuevoObjeto);
        setCargando(true); 
        AsientosServicios.setAuthToken(token);
        AsientosServicios.create(data, codigo_compania) // Invoca o llama el metodo create o registrar de servicios
          .then(response => {
            setAsiento(response.data); // Actualiza el estado con los datos recibidos del servidor
            setValidacion(true);
            setCargando(false); // Oculta el componente Loading Aleatorio poniendo la const en false
            limpiaCampos(); // Limpia todos los campos
            ModalSuccess.modalSuccesscorrectamente("Se agregó correctamente el nuevo Asiento contable"); // Modal para que muestre que se agregó correctamente
          })
          .catch(e => {
            setCargando(false); // Desactiva el componente de carga
            ValidaRestricciones.capturaDeErrores(e); // Muestra los mensajes de error
          });

      } else if (result.isDismissed ) {
        setCargando(false);
        Swal.fire("Acción cancelada.", "", "info");
        return
      }
    });
    // return y no gurada si el asiento no esta cuadrado
  }else if(asientoCuadrado){
    AsientosServicios.setAuthToken(token);
    AsientosServicios.create(data, codigo_compania) // Invoca o llama el metodo create o registrar de servicios
      .then(response => {
        setAsiento(response.data); // Actualiza el estado con los datos recibidos del servidor
        setValidacion(true);
        setCargando(false); // Oculta el componente Loading Aleatorio poniendo la const en false
        limpiaCampos(); // Limpia todos los campos
        ModalSuccess.modalSuccesscorrectamente("Se agregó correctamente el nuevo Asiento contable"); // Modal para que muestre que se agregó correctamente
      })
      .catch(e => {
        setCargando(false); // Desactiva el componente de carga
        ValidaRestricciones.capturaDeErrores(e); // Muestra los mensajes de error
      });
  }
};


//Limpia todos los campos si se guarda los datos bien
const limpiaCampos = () => {
  limpiarValues()
  setTipo_Cambio(null)
  setValorCatalogoSeleccionado(null)
  setAsiento(InicializaAsiento);//La constante asiento vuelve a hacer el objeto InicializaAsiento
  setFilas([])//Se limpia el array filas que son las que se usan para que rellene el grid
  setValidacion(false);
  setCargando(false);// Oculta el componente Loading Aleatorio poniendo la const en false
  //window.location.reload();//Esto hace se refresque toda la pagina, para que se limpie y no haya basura, ya que los Autocomplete es un poco complicado limpiarlos
}

//Se limpian asi ya que que uno lo hace por objeto asiento y valor se pega mucho en onChange
const limpiarValues = ()=>{
  if(asiento.Numero_Comprobante)document.getElementById("Numero_Comprobante").value = '';
  if(asiento.Numero_Largo)document.getElementById("Numero_Largo").value = '';
  if(asiento.Debito_Local || asiento.Debito_Local === 0 )document.getElementById("Debito_Local").value = '';
  if(asiento.Credito_Local || asiento.Credito_Local === 0) document.getElementById("Credito_Local").value = '';
  if(asiento.Debito_Extranjero || asiento.Debito_Extranjero === 0)document.getElementById("Debito_Extranjero").value = '';
  if(asiento.Credito_Extranjero || asiento.Credito_Extranjero === 0)document.getElementById("Credito_Extranjero").value = '';

  if(asiento.Concepto)document.getElementById("Concepto").value = '';
  if(asiento.Tipo_Comprobante)document.getElementById("Tipo_Comprobante").value = '';
  if(asiento.Detalle_Asiento)document.getElementById("Detalle_Asiento").value = '';
}


useEffect(() => {
  // Valida que los campos del asiento: código, fecha, tipo de asiento y concepto, ya existan. Si ya existen, se redirecciona al visor de actualización.
  const validarAsiento = async () => {
    if (asiento.Codigo_Asiento && asiento.Fecha_Asiento && asiento.IDContabilidad_Tipo_Asiento && asiento.Concepto) {
      const idReferencial = await validarAsientoExistente(
        asiento.Codigo_Asiento.replace(/\//g, ""),
        asiento.Concepto,
        asiento.Fecha_Asiento,
        asiento.IDContabilidad_Tipo_Asiento
      );
      if (idReferencial) {
        navigate(`/AsientosEditar/${idReferencial.IDUnico_Referencial}/79`);// Se redirige al visor de edición si ya existen el código, la fecha, el concepto y el tipo de asiento.
      }
    }
  };

  validarAsiento();
}, [asiento.Codigo_Asiento, asiento.Concepto, asiento.Fecha_Asiento, asiento.IDContabilidad_Tipo_Asiento, navigate]);


//---- Método para obtener el tipo de cambio por fecha 
const validarAsientoExistente = async (codigo_asiento, concepto, fecha_asiento, id_tipo_asiento) => {
  const codigoCompaniaAuth = parseInt(AuthServices.getCodigoCompania());
  const token = AuthServices.getAuthToken(); // Trae el token de local store
  if (!ValidaRestricciones.ValidarToken(token)) return null; // Valida el token
  AsientosServicios.setAuthToken(token); // Le manda el token al encabezado de la consulta del endpoind
  try {
    const response = await AsientosServicios.validaAsientoExistente(
      codigoCompaniaAuth, codigo_asiento, concepto, fecha_asiento, id_tipo_asiento
    ); // Invoca el método listar o el get de servicios
    return response.data;
  } catch (e) {
    return null;
  }
};


//Es el componente select autocomplete de tipo de documento
const AutoCompleteEditTipoDocumento = (params) => {
  const { id, field, value, api } = params;
  const handleChange = (event, newValue) => {
    const updatedValue = newValue ? newValue.IDConfiguracion_Tipo_Documento : value; // Si newValue es null, usa el valor actual
    api.setEditCellValue({ id, field, value : updatedValue}); 
  }
  
  return (                      
    <Stack sx={{ width: '100%' }} spacing={1}>
      <Autocomplete
        value={lista_tipo_Documento.find((option) => option.IDConfiguracion_Tipo_Documento === value) || null}
        onChange={handleChange}
        options={lista_tipo_Documento}
        getOptionLabel={(option) => `${option.Descripcion}`}
        renderInput={(params) => (
          <TextField
            {...params}
            variant="standard"
            fullWidth
          />
        )}
      />
    </Stack>
  );
};

//Es el componente select autocomplete de cuenta que esta en el grid de asientos 
const AutoCompleteEditCuenta = (params) => {
  const { id, field, value, api } = params;
  const handleChange = (event, newValue) => api.setEditCellValue({ id, field, value: newValue ? newValue.IDContabilidad_Catalogo : ""}); 

  return (                      
    <Stack sx={{ width: '100%' }} spacing={1}>
      <Autocomplete
        value={listaCatalogosMovimientos.find((option) => option.IDContabilidad_Catalogo === value) || null}
        onChange={handleChange}
        options={listaCatalogosMovimientos}
        getOptionLabel={(option) => `${option.Cuenta_Formateada} | ${option.Nombre_Cuenta}`}
        renderInput={(params) => (
          <TextField
            {...params}
            variant="standard"
            fullWidth
          />
        )}
      />
    </Stack>
  );
};


//Es el componente select autocomplete de origen que esta en el grid de asientos 
const AutoCompleteEditOrigen = (params) => {
  const { id, field, value, api } = params;
  const handleChange = (event, newValue) => {
    const updatedValue = newValue ? newValue.IDContabilidad_Origen : value; // Si newValue es null, usa el valor actual
   
    api.setEditCellValue({ id, field, value : updatedValue}); }
  return (                      
    <Stack sx={{ width: '100%' }} spacing={1}>
      <Autocomplete
        value={listaOrigen.find((option) => option.IDContabilidad_Origen === value)}
        onChange={handleChange}
        options={listaOrigen}
        getOptionLabel={(option) => `${option.Codigo} | ${option.Descripcion}`}
        renderInput={(params) => (
          <TextField
            {...params}
            variant="standard"
            fullWidth
          />
        )}
      />
    </Stack>
  );
};

//Encabezado del grid de asientos
const encabezados = [
  {field: 'IDConfiguracion_Tipo_Documento', headerName: 'Tipo de Documento', 
    editable: true, 
    width: 250,
    renderEditCell: AutoCompleteEditTipoDocumento,
    valueGetter: (value) => {//Lo que muestra en el select es la cuenta formateada
      const itemEditTipoAsiento = lista_tipo_Documento.find(option => option.IDConfiguracion_Tipo_Documento === value);
      return itemEditTipoAsiento ? itemEditTipoAsiento.Descripcion : value;// Si se edita una celda y no se selecciona ningún valor nuevo, la celda mantendrá su valor actual. En caso contrario, se buscará el nuevo valor seleccionado según su IDContabilidad_Catalogo.
    },
  },
  {field: 'Tipo_Comprobante', headerName: 'Tipo de Comprobante',  editable: true, type: 'text'},
  {field: 'Numero_Comprobante', headerName: 'Número del Comprobante', editable: true, type: 'text'},
  {field: 'Fecha_Comprobante', headerName: 'Fecha de Comprobante', type: 'date', editable: true},
  {field: 'IDContabilidad_Catalogo', headerName: 'Cuenta del Catálogo', 
    editable: true, 
    width: 250,
    renderCell: (params) =>  (
      <Tooltip title={`${params.value} - ${listaCatalogosMovimientos.find(option => option.Cuenta_Formateada === params.value)?.Nombre_Cuenta }`} >
        <span className="csutable-cell-trucate">{params.value}</span>
       </Tooltip>
    ),
    renderEditCell: AutoCompleteEditCuenta,
    valueGetter: (value) => {//Lo que muestra en el select es la cuenta formateada
      const itemEditCuenta = listaCatalogosMovimientos.find(option => option.IDContabilidad_Catalogo === value);
      return itemEditCuenta ? itemEditCuenta.Cuenta_Formateada : value;// Si se edita una celda y no se selecciona ningún valor nuevo, la celda mantendrá su valor actual. En caso contrario, se buscará el nuevo valor seleccionado según su IDContabilidad_Catalogo.
    },
  },
  {field: 'IDContabilidad_Origen', headerName: 'Origen', 
    width: 250,
    renderCell: (params) =>  (
      <Tooltip title={`${params.value} - ${listaOrigen.find(option => option.Descripcion === params.value)?.Codigo }`} >
        <span className="csutable-cell-trucate">{params.value}</span>
       </Tooltip>
    ),
    renderEditCell: AutoCompleteEditOrigen,
    valueGetter: (value, params) => {
      const itemEditCuenta = listaCatalogosMovimientos.find(option => option.IDContabilidad_Catalogo === params.IDContabilidad_Catalogo);
      let requiereOrigenYDestino = null
      if(itemEditCuenta){
        if(itemEditCuenta.Requiere_Origen_Destino){ //Valida que la cuenta selecionnada requiera o no un origen y destino
          requiereOrigenYDestino = true
        }else{
          requiereOrigenYDestino = false
        }
      }
      const item = listaOrigen.find(option => option.IDContabilidad_Origen === value);
      return !requiereOrigenYDestino ? null : item ? item.Descripcion : value;// Si se edita una celda y no se selecciona ningún valor nuevo, la celda mantendrá su valor actual. En caso contrario, se buscará el nuevo valor seleccionado según su IDContabilidad_Catalogo.
    },
    editable: true, 
   },
  {field: 'Debito_Local', headerName: 'Débito Local', type: 'number', align: 'left',headerAlign: 'left', 
    editable: asiento.Diferencial && tipoDiferencial ? false : true,
    valueParser: (newValue, oldValue, params) => {
      const parsedValue = parseFloat(newValue); // Convertir el nuevo valor a número
        if (parsedValue < 0) {  // Validar si el valor es negativo
          return oldValue; // Mantener el valor actual
        }
      return parsedValue;// Devolver el valor parseado si es válido
    },
  },
  {field: 'Credito_Local', headerName: 'Crédito Local', type: 'number', align: 'left',headerAlign: 'left', 
    editable: asiento.Diferencial && tipoDiferencial ? false : true,
    valueParser: (newValue, oldValue, params) => {
      const parsedValue = parseFloat(newValue); // Convertir el nuevo valor a número
        if (parsedValue < 0) {  // Validar si el valor es negativo
          return oldValue; // Mantener el valor actual
        }
      return parsedValue;// Devolver el valor parseado si es válido
    },
  },
  {field: 'Debito_Extranjero', headerName: 'Débito Extranjero', type: 'number', align: 'left',headerAlign: 'left', 
    editable: asiento.Diferencial && !tipoDiferencial ? false : true,
    valueParser: (newValue, oldValue, params) => {
      const parsedValue = parseFloat(newValue); // Convertir el nuevo valor a número
        if (parsedValue < 0) {  // Validar si el valor es negativo
          return oldValue; // Mantener el valor actual
        }
      return parsedValue;// Devolver el valor parseado si es válido
    },
  },
  {field: 'Credito_Extranjero', headerName: 'Crédito Extranjero', type: 'number', align: 'left',headerAlign: 'left', 
    editable: asiento.Diferencial && !tipoDiferencial ? false : true,
    valueParser: (newValue, oldValue, params) => {
      const parsedValue = parseFloat(newValue); // Convertir el nuevo valor a número
        if (parsedValue < 0) {  // Validar si el valor es negativo
          return oldValue; // Mantener el valor actual
        }
      return parsedValue;// Devolver el valor parseado si es válido
    },
  },
  {field: 'Detalle_Asiento', headerName: 'Detalle del Asiento',  editable: true, type: 'text'}, 
  {field: 'Numero_Largo', headerName: 'Número Largo', editable: true,type: 'text' },
];


//Son las propiedades a formulario
const propsParaFormulario = {
  manejoCambioImput,
  nuevo,
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
  listaCatalogosMovimientos,
  listaOrigen,
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

};

  return (  
    <>
      {/*Invoca al formulario y le pasa propiedades*/}
      <FormularioAsientos {...propsParaFormulario}/>

      {/*Muestra el Loading aleatorio con colores aleatorios y el SVG de New Impact */}
      <LoadingAleatorio mostrar={cargando}/>
    </>
    )
}

export default AsientosNuevo;