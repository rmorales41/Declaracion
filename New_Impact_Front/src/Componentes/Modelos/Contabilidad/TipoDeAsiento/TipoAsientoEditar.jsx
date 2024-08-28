import React, { useEffect, useState } from "react";
import { useParams} from "react-router-dom";
import AuthServices from '../../../../Servicios/AuthServices';
import TipoAsientoServicios from '../../../../Servicios/ContabilidadServicios/TipoAsientoServicios';
import LoadingAleatorio from "../../../Componentes/Loading/LoadingAleatorio";
import ValidaRestricciones from "../../../../Hooks/ValidaRestricciones"
import ModalSuccess from "../../../Componentes/Modales/ModalesSweetalert2/ModalSuccess"
import FormularioTipoAsiento from "./FormularioTipoAsiento";
import {titleUpdate, mensajeUpdate, confirmarButtonUpdate, 
  cancelarButtonUpdate, successTitleUpdate, successTextUpdate
}from '../../../../Variables/variables';

const TipoAsientoEditar = () => {
const { Id, idFormulario } = useParams(); //es el id de companiaPaises

const InicializaTipoAsiento = {
    IDContabilidad_Tipo_Asiento: null,
    Descripcion: "",
    Indicador: "",
    IDCompania: 0,
}
  
const [tipoAsiento, setTipoAsiento] = useState(InicializaTipoAsiento);
const [defaul, setDefaul] = useState(false)
const [cargando, setCargando] = useState(false);//Muestra o no el Loading
const [errores, setErrores] = useState({});
const [lista, setLista] =  useState([]);
const [existenteOriginal, setExistenteOriginal] = useState("")

// Renderiza la página y hace el get de listar 
useEffect(() => {
  const codigoCompaniaAuth = parseInt(AuthServices.getCodigoCompania());
  setTipoAsiento({ ...tipoAsiento, IDCompania: codigoCompaniaAuth});
  if(Id) buscarPor(Id, codigoCompaniaAuth);//Realiza el metodo buscarPor id
  if(codigoCompaniaAuth)getList(codigoCompaniaAuth);
// eslint-disable-next-line
}, [Id]); 

//---------- Maneja los cambios en los inputs ----------
const manejoCambioImput = event => {
  const { name, value } = event.target;
  setTipoAsiento({ ...tipoAsiento, [name]: value });
}

//---------- Maneja los cambios del input para validar el campo si ya extiste ----------
const manejoImputValidacion = event => {
  manejoCambioImput(event);
  setErrores(validarExistentes(tipoAsiento.Indicador));
} 

//---------- Metodo para buscar por id ----------
const buscarPor = (id, codigo_compania) => {
  const token = AuthServices.getAuthToken(); // Trae el token de local store
  if (!ValidaRestricciones.ValidarToken(token)) {return;}//valida el token
  setCargando(true); // Acá, llama o invoca el componente Loading Aleatorio, poniendo la const en true

  TipoAsientoServicios.setAuthToken(token);
  TipoAsientoServicios.findBy(id, codigo_compania) // Invoca el endpoint del backend 
      .then(response => {
        setTipoAsiento(response.data);
        setExistenteOriginal(response.data.Indicador)
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
    if (!ValidaRestricciones.ValidarToken(token)) {return;}//valida el token
    setErrores(validarExistentes(tipoAsiento.Indicador));// Válida si hay ya existe el campo a validar que se esta mandando por el input 
    if (Object.keys(errores).length !== 0 ){// Válida si hay errores, si hay, no se agrega un nuevo registro
      setCargando(false); // Desactiva el componente de carga
      ModalSuccess.modalCapturaDeWarning(errores.Nombre); // Modal para mostrar los errores capturados que devuelve el backend
      return;
    }
    //Muestra el modal para confirmar cambio o no
    ModalSuccess.modalConfirmar(titleUpdate, mensajeUpdate, confirmarButtonUpdate, cancelarButtonUpdate, successTitleUpdate, successTextUpdate)
        .then((confirmed) => {
            if(confirmed){// Si se confirma se modifica el registro
                var data = { // Le agrega todos los datos a la variable data
                  IDContabilidad_Tipo_Asiento: tipoAsiento.IDContabilidad_Tipo_Asiento,
                  Descripcion: tipoAsiento.Descripcion,
                  Indicador: tipoAsiento.Indicador,
                  IDCompania: tipoAsiento.IDCompania.IDCompania,
                };
                setCargando(true); // Activa el componente de carga
                TipoAsientoServicios.setAuthToken(token);
                TipoAsientoServicios.update(tipoAsiento.IDContabilidad_Tipo_Asiento, data)//Invoca el endpoid del backend 
                    .then(response => {
                        setCargando(false);// Oculta el componente Loading Aleatorio poniendo la const en false
                    }).catch(e => {
                      // Muestra los mensajes personalizados del backend
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

  TipoAsientoServicios.setAuthToken(token); // Le manda el token al encabezado de la consulta del endpoind
  TipoAsientoServicios.getAll(codigo_compania) // Invoca o llama el metodo listar o el get de todo de servicios  
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
const validarExistentes = (validar) => {
  let errores = {} // Se declara un objeto de errores, para ir almacenando los errores
  lista.forEach(listaforEach => {// Se hace un forEach de la variable 
    if (listaforEach.Indicador === validar) {// Busca en el Array la variable si ya existe 
      if(existenteOriginal !== validar)   errores.Nombre = "El indicador: " + validar +" ya existe. Por favor, ingrese uno diferente"; // Si ya existe en el array se guarda un mensaje para mostrarlo como error
    }
  })
  return errores; // Devuelve los errores 
}

//Son las propiedades que se le va a pasar al formulario
const propsParaFormulario = {
  manejoCambioImput,
  editar,
  tipoAsiento,
  defaul, 
  setDefaul,
  setTipoAsiento,
  idFormulario,
  manejoImputValidacion,
  errores,
};
  
return(
  <>
    {/*Invoca al formulario y le pasa propiedades*/}
    <FormularioTipoAsiento {...propsParaFormulario} />


    {/*Muestra el Loading aleatorio con colores aleatorios y el SVG de New Impact     */}
    <LoadingAleatorio mostrar={cargando}/>
  </>
  );
};


export default TipoAsientoEditar;