import React, { useState, useEffect } from "react";
import {useParams} from 'react-router-dom';
import AuthServices from '../../../../Servicios/AuthServices';
import DatafonosServicios from '../../../../Servicios/ContabilidadServicios/DatafonosServicios';
import LoadingAleatorio from "../../../Componentes/Loading/LoadingAleatorio";
import ModalSuccess from "../../../Componentes/Modales/ModalesSweetalert2/ModalSuccess"
import ValidaRestricciones from '../../../../Hooks/ValidaRestricciones';
import FormularioDatafonos from "./FormularioDatafonos";
import CuentasBancariasServicios from '../../../../Servicios/ContabilidadServicios/CuentasBancariasServicios'; 
import BancosServicios from "../../../../Servicios/ConfiguracionServicios/BancosServicios";
import PlanillaFuncionariosServicios from "../../../../Servicios/PlanillaServicios/PlanillaFuncionariosServicios";

const DatafonosNuevo = () => {
  const { idFormulario } = useParams(); //es el id del formulario para buscar las restricciones 

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
const [codigo_compania, setCodigo_compania] = useState(0);
const [validacion, setValidacion] = useState(false);
const [cargando, setCargando] = useState(false);//Muestra o no el Loading
const [errores, setErrores] = useState({});
const [lista, setLista] =  useState([]);//Lista del datafono
const [listaDeCuentas_Bancarias, setListaDeCuentas_Bancarias] = useState([]);
const [listaDeBancos, setListaDeBancos] = useState([]);
const [listaDeFuncionarios, setListaFuncionarios] = useState([]);


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


//---------- Metodo para crear un nuevo compañia pais ----------
const nuevo = (e) => {
  const token = AuthServices.getAuthToken();// Trae el token de local store
  if (!ValidaRestricciones.ValidarToken(token)) {return;}//valida el token
  setCargando(true);// Acá, llama o invoca el componente Loading Aleatorio, poniento la const en true

  setErrores(validarExistentes(datafono.Identificador));// Válida si hay ya existe el campo a validar que se esta mandando por el input 
  if (Object.keys(errores).length !== 0 ){// Válida si hay errores, si hay, no se agrega un nuevo registro
    setCargando(false);
    ModalSuccess.modalCapturaDeWarning(errores.Nombre); // Modal para mostrar los errores 
    return;
  }

  var data = { // Le agrega todos los datos a la variable data
    IDContabildiad_Datafonos  : datafono.IDContabildiad_Datafonos,
    Identificador             : datafono.Identificador,
    Comision                  : datafono.Comision,
    IDContabilidad_Cuentas_Bancarias    : datafono.IDContabilidad_Cuentas_Bancarias,
    IDConfiguracion_Bancos    : datafono.IDConfiguracion_Bancos,
    IDPlanilla_Funcionarios   : datafono.IDPlanilla_Funcionarios,
    IDCompania                : codigo_compania,
  };

    DatafonosServicios.setAuthToken(token);
    DatafonosServicios.create(data) // Invoca o llama el metodo create o registrar de servicios 
        .then(response => {
            setValidacion(true);
            setCargando(false);// Oculta el componente Loading Aleatorio poniendo la const en false
            limpiaCampos();// Limpia todos los campos
            ModalSuccess.modalSuccesscorrectamente("Se agregó correctamente el Origen y destino");// Modal para que muestre que se agregó correctamente
        }).catch(e => {
            console.error(data);
            setCargando(false); // Desactiva el componente de carga
            getListaDatafonos(data.IDCompania);
            getListaCuentas_Bancarias(data.IDCompania);
            getListaDeBanco(data.IDCompania);
            ValidaRestricciones.capturaDeErrores(e);  
        });
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


//Limpia todos los campos si se guarda los datos bien
const limpiaCampos = () => {
  setDatafono(InicializaDatafonos);
  setValidacion(false);
  setCargando(false);// Oculta el componente Loading Aleatorio poniendo la const en false
}


// Renderiza la página y hace el get de listar 
useEffect(() => {
  const codigoCompaniaAuth = parseInt(AuthServices.getCodigoCompania());
  setCodigo_compania(codigoCompaniaAuth);

  if(codigoCompaniaAuth){
    getListaDatafonos(codigoCompaniaAuth);//Llama ala lista para validar regidtrod existentes
    getListaCuentas_Bancarias(codigoCompaniaAuth);
    getListaDeBanco(codigoCompaniaAuth);
    getListaDeFuncionarios(codigoCompaniaAuth);
  }
  if(validacion)limpiaCampos();
// eslint-disable-next-line
}, [validacion]); 


//----Método para validar algun campo y si ya existe el campo a validar
const validarExistentes = (validar) => {
  let errores = {} // Se declara un objeto de errores, para ir almacenando los errores
  lista.forEach(listaforEach => {// Se hace un forEach de la variable 
    if (listaforEach.Identificador === validar) {// Busca en el Array la variable si ya existe 
      errores.Nombre = "El Identificador ya existe. Por favor, ingrese un Identificador diferente"; // Si ya existe en el array se guarda un mensaje para mostrarlo como error
    }
  })
  return errores; // Devuelve los errores 
}


// Función genérica para manejar cambios en selects con mapeo personalizado para el objeto asiento
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


//Son las propiedades a formulario
const propsParaFormulario = {
  manejoCambioImput,
  nuevo,
  datafono,
  setDatafono,
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
};

  return (  
    <>
      {/*Invoca al formulario y le pasa propiedades*/}
      <FormularioDatafonos  {...propsParaFormulario}/>

      {/*Muestra el Loading aleatorio con colores aleatorios y el SVG de New Impact */}
      <LoadingAleatorio mostrar={cargando}/>

    </>
    )
}

export default DatafonosNuevo;