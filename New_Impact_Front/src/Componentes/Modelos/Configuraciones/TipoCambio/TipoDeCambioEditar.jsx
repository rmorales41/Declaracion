import React, { useEffect, useState } from "react";
import { useParams} from "react-router-dom";
import AuthServices from '../../../../Servicios/AuthServices';
import TipoDeCambioServicios from '../../../../Servicios/ConfiguracionServicios/TipoDeCambioServicios/TipoDeCambioServicios';
import FormularioTipoDeCambio from "./FormularioTipoDeCambio";
import LoadingAleatorio from "../../../Componentes/Loading/LoadingAleatorio";
import ValidaRestricciones from "../../../../Hooks/ValidaRestricciones"
import ModalSuccess from "../../../Componentes/Modales/ModalesSweetalert2/ModalSuccess"
import {titleUpdate, mensajeUpdate, confirmarButtonUpdate, cancelarButtonUpdate, successTitleUpdate, successTextUpdate} from '../../../../Variables/variables';

const TipoDeCambioEditar = () => {
  const { Id, idFormulario } = useParams(); //es el id de companiaPaises

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
  const [defaul, setDefaul] = useState(false)
  const [cargando, setCargando] = useState(false);//Muestra o no el Loading
  const [errores, setErrores] = useState({});
  const [lista, setLista] =  useState([]);
  const [existenteOriginal, setExistenteOriginal] = useState("")

// Renderiza la página y hace el get de listar 
useEffect(() => {
  const codigoCompaniaAuth = parseInt(AuthServices.getCodigoCompania());
  setTipoDeCambio({ ...tipoDeCambio, IDCompania: codigoCompaniaAuth});
  if(Id) buscarPor(Id, codigoCompaniaAuth);//Realiza el metodo buscarPor id
  if(codigoCompaniaAuth)getList(codigoCompaniaAuth);
// eslint-disable-next-line
}, [Id]); 

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

//---------- Metodo para buscar por id ----------
const buscarPor = (id, codigo_compania) => {
  const token = AuthServices.getAuthToken(); // Trae el token de local store
  if (!ValidaRestricciones.ValidarToken(token)) {return;}//valida el token
  setCargando(true); // Acá, llama o invoca el componente Loading Aleatorio, poniendo la const en true

  TipoDeCambioServicios.setAuthToken(token);
  TipoDeCambioServicios.findBy(id, codigo_compania) // Invoca el endpoint del backend 
      .then(response => {
        setTipoDeCambio(response.data);
        setExistenteOriginal(response.data.Fecha)
        setCargando(false); // Oculta el componente Loading Aleatorio poniendo la const en false
      })
      .catch(e => {
        setCargando(false); // Oculta el componente Loading Aleatorio poniendo la const en false
        ValidaRestricciones.capturaDeErrores(e); 
      });
};

//---------- Metodo para editar o modificar ----------
const editar = () => {
    const token = AuthServices.getAuthToken(); //Trae el token de local store
    if (!ValidaRestricciones.ValidarToken(token)) return;//valida el token
    setErrores(validarExistentes(tipoDeCambio.Fecha));// Válida si hay ya existe el campo a validar que se esta mandando por el input 
    if (Object.keys(errores).length !== 0 ){// Válida si hay errores, si hay, no se agrega un nuevo registro
      setCargando(false); // Desactiva el componente de carga
      ModalSuccess.modalCapturaDeWarning(errores.Nombre); // Modal para mostrar los errores capturados que devuelve el backend
      return;
    }
    //Muestra el modal para confirmar cambio o no
    ModalSuccess.modalConfirmar(titleUpdate, mensajeUpdate, confirmarButtonUpdate, cancelarButtonUpdate, successTitleUpdate, successTextUpdate)
        .then((confirmed) => {
            if (confirmed) {// Si se confirma se elimina el registro
              setCargando(true);// Acá, llama o invoca el componente Loading Aleatorio, poniento la const en true
                var data = { // Le agrega todos los datos a la variable data
                  IDConfiguracion_Tipo_Cambio   : tipoDeCambio.IDConfiguracion_Tipo_Cambio,
                  Fecha           : tipoDeCambio.Fecha,
                  Compra          : tipoDeCambio.Compra,
                  Venta           : tipoDeCambio.Venta,
                  Personalizado   : tipoDeCambio.Personalizado,
                  Usuario         : tipoDeCambio.Usuario,
                  Fecha_Proceso   : tipoDeCambio.Fecha_Proceso,
                  IDCompania      : tipoDeCambio.IDCompania,
                };
            
                TipoDeCambioServicios.setAuthToken(token);
                TipoDeCambioServicios.update(tipoDeCambio.IDConfiguracion_Tipo_Cambio, data)//Invoca el endpoid del backend 
                  .then(response => {
                      setCargando(false);// Oculta el componente Loading Aleatorio poniendo la const en false
                  })
                  .catch(e => { // Muestra los mensajes personalizados del backend
                    console.error(data);
                    setCargando(false); // Desactiva el componente de carga
                    ValidaRestricciones.capturaDeErrores(e); 
                });
            } 
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
}

//----Método para validar algun campo y si ya existe el campo a validar
const validarExistentes = (fecha) => {
  let errores = {} // Se declara un objeto de errores, para ir almacenando los errores
  lista.forEach(listaforEach => {// Se hace un forEach de la variable 
    if (listaforEach.Fecha === fecha) {// Busca en el Array la variable si ya existe 
      if(existenteOriginal !== fecha)errores.Nombre = "La fecha: " + fecha +" ya existe. Por favor, ingrese una diferente"; // Si ya existe en el array se guarda un mensaje para mostrarlo como error
    }
  })
  return errores; // Devuelve los errores 
}

//Son las propiedades que se le va a pasar al formulario
const propsParaFormulario = {
  manejoCambioImput,
  editar,
  tipoDeCambio,
  defaul, 
  setDefaul,
  setTipoDeCambio,
  idFormulario,
  errores,
  eventoObtenerFecha,
};
  
return(
  <>
    {/*Invoca al formulario y le pasa propiedades   */}
    <FormularioTipoDeCambio  {...propsParaFormulario}/>

    {/*Muestra el Loading aleatorio con colores aleatorios y el SVG de New Impact     */}
    <LoadingAleatorio mostrar={cargando}/>
  </>
  );
};


export default TipoDeCambioEditar;