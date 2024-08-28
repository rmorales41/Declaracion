import React, { useState, useEffect } from "react";
import {useParams} from 'react-router-dom';
import AuthServices from '../../../../Servicios/AuthServices';
import CuentasBancariasServicios from "../../../../Servicios/ContabilidadServicios/CuentasBancariasServicios";
import LoadingAleatorio from "../../../Componentes/Loading/LoadingAleatorio";
import ModalSuccess from "../../../Componentes/Modales/ModalesSweetalert2/ModalSuccess"
import ValidaRestricciones from '../../../../Hooks/ValidaRestricciones';
import FormularioRecordatorio from "./FormularioCuentasBancarias";
import EventoManejoInputFormato from "../../../../Hooks/EventoManejoInputFormato"
import CatalogoServicios from '../../../../Servicios/ContabilidadServicios/CatalogoServicios';
import BancosServicios from "../../../../Servicios/ConfiguracionServicios/BancosServicios"

const CuentasBancariasNuevo = () => {

const { idFormulario } = useParams(); //es el id del formulario para buscar las restricciones 

const InicializaCuentaBancarias = {
  IDContabilidad_Cuentas_Bancarias: null,
  Cuenta_Numero: "",
  Iban: "",
  Cheque: 0,
  Moneda: true,
  Tiene_Datafonos: false,
  IDCuenta_Contable: "",
  IDCuentasxCobrar_Banco: "",
  IDContabilidad_Catalogo: "",
  IDConfiguracion_Bancos: "",
  IDCompania: 0,
}

const [cuentaBancarias, setCuentaBancarias] = useState(InicializaCuentaBancarias);
const [codigo_compania, setCodigo_compania] = useState(0);
const [validacion, setValidacion] = useState(false);
const [cargando, setCargando] = useState(false);//Muestra o no el Loading
const [listaCuentaBancarias, setListaCuentaBancarias] = useState([])
const [listaCatalogos, setListaCatalogos] = useState([])
const [listaCatalogosMovimientos, setListaCatalogosMovimientos] = useState([])
const [inputFormatiado, setInputFormatiado] = useState('');
const [inputFormatiadoContable, setInputFormatiadoContable] = useState('');
const [inputFormatiadoCuentasxCobrar, setInputFormatiadoCuentasxCobrar] = useState('');
const [valorCatalogoSeleccionado, setValorCatalogoSeleccionado] = useState(null);
const [valorCatalogoSeleccionadoContable, setValorCatalogoSeleccionadoContable] = useState(null);
const [valorCatalogoSeleccionadoCuentasxCobrar, setValorCatalogoSeleccionadoCuentasxCobrar] = useState(null);
const [idCatalogo, setIdCatalogo] = useState(0);
const [idCatalogoContable, setIdCatalogoContable] = useState(0);
const [idCatalogoCuentasxCobrar, setIdCatalogoCuentasxCobrar] = useState(0);
const [selectedCuenta, setSelectedCuenta] = useState('');
const [selectedContable, setSelectedContable] = useState('');
const [selectedCuentasxCobrar, setSelectedCuentasxCobrar] = useState('');
const [mostrarCatalogoContable, setMostrarCatalogoContable] = useState(false);
const [mostrarCatalogoContableContable, setMostrarCatalogoContableContable] = useState(false);
const [mostrarCatalogoContableCuentasxCobrar, setMostrarCatalogoContableCuentasxCobrar] = useState(false);
const [catalogo, setCatalogo] = useState(null)
const [contable, setContable] = useState(null)
const [cuentasxCobrar, setCuentasxCobrar] = useState(null)
const [formato, setFormato ] = useState("");//Formato de la cuenta ejemplo: xxxx-xxxx-xxx-xx
const [errores, setErrores] = useState({});
const [listaBancos, setListaBancos] = useState([])

//---------- Maneja los cambios en los inputs ----------
const manejoCambioImput = event => {
  const { name, value } = event.target;
  setCuentaBancarias({ ...cuentaBancarias, [name]: value });
}

//---------- Maneja los cambios del input para validar el campo si ya extiste ----------
const manejoImputValidacion = event => {
  manejoCambioImput(event);
  setErrores(validarExistentes(cuentaBancarias.Cuenta_Numero));
} 

//---------- Metodo para crear un nuevo compañia pais ----------
const nuevo = (e) => {
  const token = AuthServices.getAuthToken();// Trae el token de local store
  if (!ValidaRestricciones.ValidarToken(token)) return;//valida el token
  setCargando(true);// Acá, llama o invoca el componente Loading Aleatorio, poniento la const en true

  setErrores(validarExistentes(cuentaBancarias.Cuenta_Numero));// Válida si hay ya existe el campo a validar que se esta mandando por el input 
  if (Object.keys(errores).length !== 0 ){// Válida si hay errores, si hay, no se agrega un nuevo registro
    setCargando(false);
    ModalSuccess.modalCapturaDeWarning(errores.Nombre); // Modal para mostrar los errores capturados que devuelve el backend
    return;
  }

          var data = { // Le agrega todos los datos a la variable data
            IDContabilidad_Cuentas_Bancarias      : cuentaBancarias.IDContabilidad_Cuentas_Bancarias,
            Cuenta_Numero                         : cuentaBancarias.Cuenta_Numero,
            Iban                                  : cuentaBancarias.Iban ? cuentaBancarias.Iban : null,
            Cheque                                : cuentaBancarias.Cheque,
            Moneda                                : cuentaBancarias.Moneda,
            Tiene_Datafonos                       : cuentaBancarias.Tiene_Datafonos,
            IDCuenta_Contable                     : cuentaBancarias.IDCuenta_Contable,
            IDCuentasxCobrar_Banco                : cuentaBancarias.IDCuentasxCobrar_Banco ? cuentaBancarias.IDCuentasxCobrar_Banco :  null,
            IDContabilidad_Catalogo               : cuentaBancarias.IDContabilidad_Catalogo ? cuentaBancarias.IDContabilidad_Catalogo : null,
            IDConfiguracion_Bancos                : cuentaBancarias.IDConfiguracion_Bancos,
            IDCompania                            : codigo_compania,
          };

          CuentasBancariasServicios.setAuthToken(token);
          CuentasBancariasServicios.create(data) // Invoca o llama el metodo create o registrar de servicios 
                .then(response => {
                  setValidacion(true);
                  setCargando(false);// Oculta el componente Loading Aleatorio poniendo la const en false
                  limpiaCampos();// Limpia todos los campos
                  ModalSuccess.modalSuccesscorrectamente("Se agregó correctamente el nuevo recordatorio");// Modal para que muestre que se agregó correctamente
                })
                .catch(e => {
                  // Muestra los mensajes personalizados del backend}
                  console.error(data);
                  setCargando(false); // Desactiva el componente de carga
                  ValidaRestricciones.capturaDeErrores(e);  
                });
            };

//Limpia todos los campos si se guarda los datos bien
const limpiaCampos = () => {
  setValorCatalogoSeleccionado(null)
  setValorCatalogoSeleccionadoContable(null)
  setValorCatalogoSeleccionadoCuentasxCobrar(null)
  setCuentaBancarias(InicializaCuentaBancarias);
  setValidacion(false);
  setCargando(false);// Oculta el componente Loading Aleatorio poniendo la const en false
}

//----Método para validar algun campo y si ya existe el campo a validar
const validarExistentes = (validar) => {
  let errores = {} // Se declara un objeto de errores, para ir almacenando los errores
  listaCuentaBancarias.forEach(listaforEach => {// Se hace un forEach de la variable 
    if (listaforEach.Cuenta_Numero === validar) {// Busca en el Array la variable si ya existe 
      errores.Nombre = "El número de cuenta: " + validar +" ya existe. Por favor, ingrese uno diferente"; // Si ya existe en el array se guarda un mensaje para mostrarlo como error
    }
  })
  return errores; // Devuelve los errores 
}

// ---------------------------------------------- &&& ----------------------------------------------

//Invoca el hook que tiene una funcio para trae solo el formato que se va usar en el input de Cuenta
useEffect(()=>{
  const cargarFormato = async () => {
    try { 
      const { formato } = await EventoManejoInputFormato.obtenerFormato();
      setFormato(formato);
    } catch (e) {
      console.error(e)
    }
  };
  cargarFormato();
},[catalogo, contable, cuentasxCobrar])

const propsCatalogo = {
  options: listaCatalogosMovimientos,
  getOptionLabel: (option) => `${option.Cuenta_Formateada} | ${option.Nombre_Cuenta}`,
};

const propsBancos = {
  options: listaBancos,
  getOptionLabel: (option) => option.Descripcion,
};

const valorBancos = value => value.IDConfiguracion_Bancos;

// Función genérica para manejar cambios en selects con mapeo personalizado
const eventoCambioDeSelect = (event, value, field, mapValueToField) => {
  setCuentaBancarias(prevAsiento => ({
    ...prevAsiento,
    [field]: value ? mapValueToField(value) : ""
  }));
};

//Se usa este evento solo para el campo cuenta de catalogo
const eventoCambioSelectCuenta = (event, value) => {
  if (value) {
      setValorCatalogoSeleccionado(value)
      setSelectedCuenta(`${value.Cuenta_Formateada} | ${value.Nombre_Cuenta}`);//value.Cuenta_Formateada
      setCuentaBancarias(prevAsiento => ({
        ...prevAsiento,
        IDContabilidad_Catalogo: value.IDContabilidad_Catalogo
      }));
      setIdCatalogo("")
  } else {
      setSelectedCuenta("");
      setIdCatalogo("")
      setValorCatalogoSeleccionado(null)
      setCuentaBancarias(prevAsiento => ({
        ...prevAsiento,
        IDContabilidad_Catalogo: " "
      }));
  }
};

//Se usa este evento solo para el campo cuenta de catalogo IDCuenta_Contable
const eventoCambioSelectCuentaContable = (event, value) => {
  if (value) {
    setValorCatalogoSeleccionadoContable(value)
    setSelectedContable(`${value.Cuenta_Formateada} | ${value.Nombre_Cuenta}`);//value.Cuenta_Formateada
      setCuentaBancarias(prevAsiento => ({
        ...prevAsiento,
        IDCuenta_Contable: value.IDContabilidad_Catalogo
      }));
      setIdCatalogoContable("")
  } else {
      setSelectedContable("");
      setIdCatalogoContable("")
      setValorCatalogoSeleccionadoContable(null)
      setCuentaBancarias(prevAsiento => ({
        ...prevAsiento,
        IDCuenta_Contable: " "
      }));
  }
};

//Se usa este evento solo para el campo cuenta de catalogo IDCuentasxCobrar_Banco
const eventoCambioSelectCuentaxCobrar = (event, value) => {
  if (value) {
    setValorCatalogoSeleccionadoCuentasxCobrar(value)
    setSelectedCuentasxCobrar(`${value.Cuenta_Formateada} | ${value.Nombre_Cuenta}`);//value.Cuenta_Formateada
      setCuentaBancarias(prevAsiento => ({
        ...prevAsiento,
        IDCuentasxCobrar_Banco: value.IDContabilidad_Catalogo
      }));
      setIdCatalogoCuentasxCobrar("")
  } else {
    setSelectedCuentasxCobrar("");
      setIdCatalogoCuentasxCobrar("")
      setValorCatalogoSeleccionadoCuentasxCobrar(null)
      setCuentaBancarias(prevAsiento => ({
        ...prevAsiento,
        IDCuentasxCobrar_Banco: " "
      }));
  }
};

//Se usa para que cada ves que este digitando una letra sea con el formato correcto
const manejoImputFormato = (event, value) => {
  setSelectedCuenta("");
  const { formattedValue } = EventoManejoInputFormato.eventoSelectFormato(event, value, formato);
  setInputFormatiado(formattedValue);
};

//Se usa para que cada ves que este digitando una letra sea con el formato correcto
const manejoImputFormatoContable = (event, value) => {
  setSelectedContable("");
  const { formattedValue } = EventoManejoInputFormato.eventoSelectFormato(event, value, formato);
  setInputFormatiadoContable(formattedValue);
};

//Se usa para que cada ves que este digitando una letra sea con el formato correcto
const manejoImputFormatoCuentasxCobrar = (event, value) => {
  setSelectedCuentasxCobrar("");
  const { formattedValue } = EventoManejoInputFormato.eventoSelectFormato(event, value, formato);
  setInputFormatiadoCuentasxCobrar(formattedValue);
};

//----Método genérica para obtener listas para get o listar 
const  getList = (codigo_compania, servicio, setLista, servicioAux) => {
  const token = AuthServices.getAuthToken();// Trae el token de local store
  if (!ValidaRestricciones.ValidarToken(token)) return;//valida el token
  setCargando(true);// Acá, llama o invoca el componente Loading Aleatorio, poniento la const en true
  
  servicio.setAuthToken(token); // Le manda el token al encabezado de la consulta del endpoind
  if(servicioAux){
    servicio = servicioAux
  }else{
    servicio = servicio.getAll(codigo_compania)
  }
  servicio // Invoca o llama el metodo listar o el get de todo de servicios  
      .then(response => {
        setLista(response.data); // Guarda lo que se devolvió del back-end en la variable que es un array
        setCargando(false);// Oculta el componente Loading Aleatorio poniendo la const en false
      })
      .catch(e => {
        setCargando(false);// Oculta el componente Loading Aleatorio poniendo la const en false
        console.error(e)
       // ValidaRestricciones.capturaDeErrores(e);//Valida y devulve los errores del back end
      });
};

const getListCatalogo = (codigo_compania) =>  getList(codigo_compania, CatalogoServicios, setListaCatalogos);
const getListaBancos= (codigo_compania) => getList(codigo_compania, BancosServicios, setListaBancos);
const getListaCuentasBancarias = (codigo_compania) => getList(codigo_compania, CuentasBancariasServicios, setListaCuentaBancarias);

//Eventos para abrir y cerrar el visor de cuentas IDContabilidad_Catalogo
const eventoAbrirModalCase = () => setMostrarCatalogoContable(true);
const eventoCerrarModalCase = () => setMostrarCatalogoContable(false);
//Eventos para abrir y cerrar el visor de cuentas IDCuentasxCobrar_Banco
const eventoAbrirCuentaContable = () => setMostrarCatalogoContableContable(true);
const eventoCerrarCuentaContable = () => setMostrarCatalogoContableContable(false); 
//Eventos para abrir y cerrar el visor de cuentas IDCuenta_Contable
const eventoAbrirCuentasxCobrar = () => setMostrarCatalogoContableCuentasxCobrar(true);
const eventoCerrarCuentasxCobrar = () => setMostrarCatalogoContableCuentasxCobrar(false);

// Renderiza la página y hace el get de listar 
useEffect(() => {
  const codigoCompaniaAuth = parseInt(AuthServices.getCodigoCompania());
  if(codigoCompaniaAuth){
    getListaCuentasBancarias(codigoCompaniaAuth);
    setCodigo_compania(codigoCompaniaAuth);
    getListCatalogosConMovimientos(codigoCompaniaAuth);
    getListCatalogo(codigoCompaniaAuth);
    getListaBancos(codigoCompaniaAuth);
  }
  if(validacion)limpiaCampos();
// eslint-disable-next-line
}, [validacion]); 

//---- Método para obtener cuentas del catálogo con movimientos. 
// Se implementó de esta manera porque si se hacía en el método genérico getList, 
// al refrescar la página no realizaba ninguna acción y la respuesta siempre devolvía null.
const getListCatalogosConMovimientos = async (codigoCompaniaAuth) => {
  const token = AuthServices.getAuthToken(); // Trae el token de local store
    if (!ValidaRestricciones.ValidarToken(token)) return null; // Valida el token
      CatalogoServicios.setAuthToken(token); // Le manda el token al encabezado de la consulta del endpoind
    try {
      const response = await CatalogoServicios.getAllFiltrado_movimientos(codigoCompaniaAuth) //Hace el endpoid que trae ya la lista filtrada por cuentas con movimientos.
      return setListaCatalogosMovimientos(response.data);
    } catch (e) {
      console.error(e)
      return null;
    }
};

//Son las propiedades a formulario
const propsParaFormulario = {
  manejoCambioImput,
  manejoImputValidacion,
  nuevo,
  cuentaBancarias,
  setCuentaBancarias,
  idFormulario,

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

  listaBancos,
  listaCatalogosMovimientos
}; 

  return (  
    <>
      {/*Invoca al formulario y le pasa propiedades*/}
      <FormularioRecordatorio {...propsParaFormulario} />

      {/*Muestra el Loading aleatorio con colores aleatorios y el SVG de New Impact */}
      <LoadingAleatorio mostrar={cargando}/>
    </>
    )
}

export default CuentasBancariasNuevo;