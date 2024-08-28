import React, { useEffect, useState } from "react";
import { useParams} from "react-router-dom";
import AuthServices from '../../../../Servicios/AuthServices';
import FormularioDatafonos from "./FormularioDatafonos";
import LoadingAleatorio from "../../../Componentes/Loading/LoadingAleatorio";
import ValidaRestricciones from "../../../../Hooks/ValidaRestricciones"
import ModalSuccess from "../../../Componentes/Modales/ModalesSweetalert2/ModalSuccess"
import {titleUpdate, mensajeUpdate, confirmarButtonUpdate,  cancelarButtonUpdate, successTitleUpdate, successTextUpdate,}from '../../../../Variables/variables';
import DatafonosServicios from '../../../../Servicios/ContabilidadServicios/DatafonosServicios';
import CuentasBancariasServicios from '../../../../Servicios/ContabilidadServicios/CuentasBancariasServicios'; 
import BancosServicios from "../../../../Servicios/ConfiguracionServicios/BancosServicios";
import PlanillaFuncionariosServicios from "../../../../Servicios/PlanillaServicios/PlanillaFuncionariosServicios";

const DatafonosEditar = () => {
  const {Id, idFormulario } = useParams(); //es el id de companiaPaises

  const InicializaDatafonos = {
    IDContabildiad_Datafonos: null,
    Identificador:"",
    Comision: 0,
    IDContabilidad_Cuentas_Bancarias: "",
    IDConfiguracion_Bancos: "",
    IDPlanilla_Funcionarios: "",
    IDCompania: 0,
  }

  const [datafono, setDatafono] = useState(InicializaDatafonos);
  const [cargando, setCargando] = useState(false);//Muestra o no el Loading
  const [errores, setErrores] = useState({});
  const [existenteOriginal, setExistenteOriginal] = useState("")
  const [lista, setLista] =  useState([]);//Lista del datafono
  const [listaDeCuentas_Bancarias, setListaDeCuentas_Bancarias] = useState([]);
  const [listaDeBancos, setListaDeBancos] = useState([]);
  const [listaDeFuncionarios, setListaFuncionarios] = useState([]);


// Renderiza la página y hace el get de listar 
useEffect(() => {
  const codigoCompaniaAuth = parseInt(AuthServices.getCodigoCompania());
  setDatafono({ ...datafono, IDCompania: codigoCompaniaAuth});
  if(Id) buscarPor(Id, codigoCompaniaAuth);//Realiza el metodo buscarPor id
// eslint-disable-next-line
}, [Id]); 


//---------- Maneja los cambios en los inputs ----------
const manejoCambioImput = event => {
  const { name, value } = event.target;
  setDatafono({ ...datafono, [name]: value });
}


//---------- Maneja los cambios del input para validar el campo si ya extiste ----------
const manejoImputValidacion = event => {
  const { value } = event.target;
  manejoCambioImput(event);
  setErrores(validarExistentes(value));
} 


//---------- Metodo para buscar por id ----------
const buscarPor = async (id, codigo_compania) => {
  const token = AuthServices.getAuthToken(); // Trae el token de local store
  if (!ValidaRestricciones.ValidarToken(token)) return; // Valida el token
  setCargando(true); // Muestra el componente de carga

  try {
    DatafonosServicios.setAuthToken(token);
    const response = await DatafonosServicios.findBy(id, codigo_compania); // Invoca el endpoint del backend
    const respuesta = response.data;
    setExistenteOriginal(respuesta.Identificador);
    
    const dataModificada = { // Modifica solo los campos necesarios y deja los demás igual, esto se hace mas que nada para los SelectAutoCompleteFormulario
      ...respuesta, 
      IDContabilidad_Cuentas_Bancarias: respuesta.IDContabilidad_Cuentas_Bancarias?.IDContabilidad_Cuentas_Bancarias || null,
      IDConfiguracion_Bancos: respuesta.IDConfiguracion_Bancos?.IDConfiguracion_Bancos || null,
      IDPlanilla_Funcionarios: respuesta.IDPlanilla_Funcionarios?.IDPlanilla_Funcionarios || null,
    };

    setDatafono(dataModificada);
  } catch (e) {
    ValidaRestricciones.capturaDeErrores(e); 
  } finally {
    setCargando(false); // Oculta el componente de carga
  }
};


//---------- Metodo para editar o modificar ----------
const editar = async () => {
  const token = AuthServices.getAuthToken();
  if (!ValidaRestricciones.ValidarToken(token)) return;
  const erroresActuales = validarExistentes(datafono.Identificador);
  setErrores(erroresActuales);
  if (Object.keys(erroresActuales).length !== 0) {
      setCargando(false);
      ModalSuccess.modalCapturaDeWarning(erroresActuales.Nombre);
      return;
  }

  const confirmado = await ModalSuccess.modalConfirmar(titleUpdate, mensajeUpdate, confirmarButtonUpdate, cancelarButtonUpdate, successTitleUpdate, successTextUpdate);
  if (!confirmado) return;
  setCargando(true);

  const data = {
      IDContabildiad_Datafonos: datafono.IDContabildiad_Datafonos,
      Identificador: datafono.Identificador,
      Comision: datafono.Comision,
      IDContabilidad_Cuentas_Bancarias: datafono.IDContabilidad_Cuentas_Bancarias,
      IDConfiguracion_Bancos: datafono.IDConfiguracion_Bancos,
      IDPlanilla_Funcionarios: datafono.IDPlanilla_Funcionarios,
      IDCompania: datafono.IDCompania.IDCompania,
  };

    try {
        DatafonosServicios.setAuthToken(token);
        await DatafonosServicios.update(datafono.IDContabildiad_Datafonos, data);
    } catch (e) {
        console.error(data);
        ValidaRestricciones.capturaDeErrores(e);
    } finally {
        setCargando(false);
    }
};


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


const getListaDatafonos = (codigo_compania) => getList(codigo_compania, DatafonosServicios, setLista);
const getListaCuentas_Bancarias = (codigo_compania) => getList(codigo_compania, CuentasBancariasServicios, setListaDeCuentas_Bancarias);
const getListaDeBanco = (codigo_compania) => getList(codigo_compania, BancosServicios, setListaDeBancos);
const getListaDeFuncionarios = (codigo_compania) => getList(codigo_compania, PlanillaFuncionariosServicios, setListaFuncionarios);


// Función genérica para manejar cambios en selects con mapeo personalizado para los SelectAutoCompleteFormulario
const eventoCambioDeSelect = (event, value, field, mapValueToField) => {
  setDatafono(prevAsiento => ({ ...prevAsiento,[field]: value ? mapValueToField(value) : "" }));
};


const propsCuentas_Bancarias = {
  options: listaDeCuentas_Bancarias,
  getOptionLabel: (option) => `${option.Cuenta_Numero}`,
};


const propsBancos = {
  options: listaDeBancos,
  getOptionLabel: (option) => `${option.Descripcion}`,
};

const propsFuncionarios = {
  options: listaDeFuncionarios,
  getOptionLabel: (option) => `${option.Nombre}`,
};


const valorCuentas_Bancarias = value => value.IDContabilidad_Cuentas_Bancarias;
const valorBancos = value => value.IDConfiguracion_Bancos;
const valorFuncionarios = value => value.IDPlanilla_Funcionarios;

//Se renderiza los get o listar, cada ves que se refresca la pagina
useEffect(()=>{
  const codigoCompaniaAuth = AuthServices.getCodigoCompania();
  if(codigoCompaniaAuth){
    getListaDatafonos(codigoCompaniaAuth)
    getListaCuentas_Bancarias(codigoCompaniaAuth)
    getListaDeBanco(codigoCompaniaAuth)
    getListaDeFuncionarios(codigoCompaniaAuth)
  }
// eslint-disable-next-line react-hooks/exhaustive-deps
},[])


//----Método para validar algun campo y si ya existe el campo a validar
const validarExistentes = (validar) => {
  let errores = {} // Se declara un objeto de errores, para ir almacenando los errores
  lista.forEach(listaforEach => {// Se hace un forEach de la variable 
    if (listaforEach.Identificador === validar) {// Busca en el Array la variable si ya existe 
      if(existenteOriginal !== validar)errores.Nombre = errores.Nombre = "El Identificador " + validar + " ya existe. Por favor, ingrese un Identificador diferente"; // Si ya existe en el array se guarda un mensaje para mostrarlo como error
    }
  })
  return errores; // Devuelve los errores 
}



//Son las propiedades que se le va a pasar al formulario
const propsParaFormulario = {
  manejoCambioImput,
  editar,
  datafono,
  idFormulario,
  setDatafono,
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
};

  
return(
  <>
    {/*Invoca al formulario y le pasa propiedades   */}
    <FormularioDatafonos  {...propsParaFormulario}/>

    {/*Muestra el Loading aleatorio con colores aleatorios y el SVG de New Impact     */}
    <LoadingAleatorio mostrar={cargando}/>
  </>
  );
};


export default DatafonosEditar;