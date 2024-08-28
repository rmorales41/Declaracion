import React, { useState, useEffect } from "react";
import {useParams} from 'react-router-dom';
import AuthServices from '../../../../Servicios/AuthServices';
import TipoDeCambioServicios from '../../../../Servicios/ConfiguracionServicios/TipoDeCambioServicios/TipoDeCambioServicios';
import LoadingAleatorio from "../../../Componentes/Loading/LoadingAleatorio";
import ModalSuccess from "../../../Componentes/Modales/ModalesSweetalert2/ModalSuccess"
import ValidaRestricciones from '../../../../Hooks/ValidaRestricciones';
import FormularioTipoDeCambio from "./FormularioTipoDeCambio";
import { format } from 'date-fns';

const TipoDeCambioNuevo = ({llamadoDesdeUnModal, onClickCancelar}) => {
  const { idFormulario } = useParams(); //es el id del formulario para buscar las restricciones 

const InicializaTipoDeCambio = {
  IDConfiguracion_Tipo_Cambio: null,
  Fecha: "",
  Compra: 0,
  Venta: 0,
  Personalizado: 0,
  Usuario: "",
  Fecha_Proceso: "",
  IDCompania: null,
}
 
const [tipoDeCambio, setTipoDeCambio] = useState(InicializaTipoDeCambio);
const [codigo_compania, setCodigo_compania] = useState(0);
const [validacion, setValidacion] = useState(false);
const [cargando, setCargando] = useState(false);//Muestra o no el Loading
const [lista, setLista] =  useState([]);
const [errores, setErrores] = useState({});
const [cantidadDecimales, setCantidadDecimales] = useState(6);//Valida si la cuenta seleccionada requiere origen y destino 

//---------- Maneja los cambios en los inputs ----------
const manejoCambioImput = event => {
  const { name, value } = event.target;
  setTipoDeCambio({ ...tipoDeCambio, [name]: value });
}

// Función genérica para manejar cambios en fechas convertirDolaresAColones
const eventoObtenerFecha = async (date, field) => {
  if (!date || isNaN(date)){//Valida que la fecha no venga vacia
    setTipoDeCambio(prevAsiento => ({...prevAsiento,[field]: null}));
    return
  }

  const formattedDate = date.format('YYYY-MM-DD');
  setTipoDeCambio(prevAsiento => ({...prevAsiento,[field]: formattedDate}));
  setErrores(validarExistentes(formattedDate));

};

//---------- Metodo para crear un nuevo compañia pais ----------
const nuevo = (e) => {
  const token = AuthServices.getAuthToken();// Trae el token de local store
  if (!ValidaRestricciones.ValidarToken(token)) {return;}//valida el token
  setCargando(true);// Acá, llama o invoca el componente Loading Aleatorio, poniento la const en true

  setErrores(validarExistentes(tipoDeCambio.Fecha));// Válida si hay ya existe el campo a validar que se esta mandando por el input 
  if (Object.keys(errores).length !== 0 ){// Válida si hay errores, si hay, no se agrega un nuevo registro
    setCargando(false);
    ModalSuccess.modalCapturaDeWarning(errores.Nombre); // Modal para mostrar los errores capturados que devuelve el backend
    return;
  }
          var data = { // Le agrega todos los datos a la variable data
            IDConfiguracion_Tipo_Cambio: tipoDeCambio.IDConfiguracion_Tipo_Cambio,
            Fecha: tipoDeCambio.Fecha,
            Compra: tipoDeCambio.Compra,
            Venta: tipoDeCambio.Venta,
            Personalizado: tipoDeCambio.Personalizado,
            Usuario: 0,
            Fecha_Proceso: format(Date.now(), 'yyyy-MM-dd'),
            IDCompania: codigo_compania,
          };
          //TipoDeCambioServicios.setAuthToken(token);
          TipoDeCambioServicios.create(data) // Invoca o llama el metodo create o registrar de servicios 
                .then(response => {
                  setTipoDeCambio({
                    IDConfiguracion_Tipo_Cambio: response.data.IDConfiguracion_Tipo_Cambio,
                    Fecha: response.data.Fecha,
                    Compra: response.data.Compra,
                    Venta: response.data.Venta,
                    Personalizado: response.data.Personalizado,
                    Usuario: response.data.Usuario,
                    Fecha_Proceso: response.data.Fecha_Proceso,
                    IDCompania: codigo_compania,
                  });

                  setValidacion(true);
                  setCargando(false);// Oculta el componente Loading Aleatorio poniendo la const en false
                  limpiaCampos();// Limpia todos los campos
                  ModalSuccess.modalSuccesscorrectamente("Se agregó correctamente el tipo de cambio");// Modal para que muestre que se agregó correctamente
                })
                .catch(e => {
                  // Muestra los mensajes personalizados del backend}
                  console.error(data);
                  setCargando(false); // Desactiva el componente de carga
                  getList(data.IDCompania);
                  ValidaRestricciones.capturaDeErrores(e);  
                });
            };

//----Método para get o listar 
const  getList = (codigo_compania) => {
  const token = AuthServices.getAuthToken();// Trae el token de local store
  if (!ValidaRestricciones.ValidarToken(token)) {return;}//valida el token
  setCargando(true);// Acá, llama o invoca el componente Loading Aleatorio, poniento la const en true

  TipoDeCambioServicios.setAuthToken(token); // Le manda el token al encabezado de la consulta del endpoind
  TipoDeCambioServicios.getAll(codigo_compania) // Invoca o llama el metodo listar o el get de todo de servicios  
      .then(response => {
        setLista(response.data); // Guada lo que se devolvió del back-end en la variable que es un array
        setCargando(false);// Oculta el componente Loading Aleatorio poniendo la const en false
      })
      .catch(e => {
        setCargando(false);// Oculta el componente Loading Aleatorio poniendo la const en false
        console.error(e)
        //ValidaRestricciones.capturaDeErrores(e);//Valida y devulve los errores del back end
      });
};

//Limpia todos los campos si se guarda los datos bien
const limpiaCampos = () => {
  setTipoDeCambio(InicializaTipoDeCambio);
  setValidacion(false);
  setCargando(false);// Oculta el componente Loading Aleatorio poniendo la const en false
}

// Renderiza la página y hace el get de listar 
useEffect(() => {
  const codigoCompaniaAuth = parseInt(AuthServices.getCodigoCompania());
  setCodigo_compania(codigoCompaniaAuth);

  if(codigoCompaniaAuth)getList(codigoCompaniaAuth);//Llama ala lista de Origenes Y destinos para validar codigos existentes
  if(validacion)limpiaCampos();

// eslint-disable-next-line
}, [validacion]); 



//----Método para validar algun campo y si ya existe el campo a validar
const validarExistentes = (fecha) => {
  let errores = {} // Se declara un objeto de errores, para ir almacenando los errores
  lista.forEach(listaforEach => {// Se hace un forEach de la variable 
    if (listaforEach.Fecha === fecha) {// Busca en el Array la variable si ya existe 
      errores.Nombre = "La fecha: " + fecha +" ya existe. Por favor, ingrese una diferente"; // Si ya existe en el array se guarda un mensaje para mostrarlo como error
    }
  })
  return errores; // Devuelve los errores 
}

//Renderiza la página y hace los diferentes gets de listar, esto para que cuando se ingresa o se refresca la pagina
useEffect(() => {
  const codigoCompaniaAuth = parseInt(AuthServices.getCodigoCompania());
  setCodigo_compania(codigoCompaniaAuth);
  const configuracionCompania =  AuthServices.getCompaniaConfig();//Se trae todas las configuraion de la compañia que esta guardado en el local stores
  
  if(configuracionCompania){//Valida que haya una cnfiguracion de compañia
    const decimalesCant = configuracionCompania.Decimales_Globales_Precios; //Asiga los desimales que tiene la configuracion de la compañia
    const usarDesimales = decimalesCant > 0 ? `0.${'0'.repeat(decimalesCant - 1)}1` : "1";
    setCantidadDecimales(usarDesimales);
  }

// eslint-disable-next-line
}, []); 

//Son las propiedades a formulario
const propsParaFormulario = {
  manejoCambioImput,
  nuevo,
  tipoDeCambio,
  setTipoDeCambio,
  idFormulario,
  errores,
  eventoObtenerFecha,
  cantidadDecimales,
  llamadoDesdeUnModal,
  onClickCancelar,
}; 

  return (  
    <>
      {/*Invoca al formulario y le pasa propiedades*/}
      <FormularioTipoDeCambio {...propsParaFormulario} />

      {/*Muestra el Loading aleatorio con colores aleatorios y el SVG de New Impact */}
      <LoadingAleatorio mostrar={cargando}/>
    </>
    )
}

export default TipoDeCambioNuevo;