import React, { useEffect, useState } from "react";
import { useParams} from "react-router-dom";
import AuthServices from '../../../../Servicios/AuthServices';
import OrigenDestinoServicios from '../../../../Servicios/ContabilidadServicios/OrigenDestinoServicios';
import FormularioOrigenDestino from "./FormularioOrigenDestino";
import ModalConfirmar from '../../../Componentes/Modales/ModalesSweetalert2/ModalConfirmar';
import LoadingAleatorio from "../../../Componentes/Loading/LoadingAleatorio";
import ValidaRestricciones from "../../../../Hooks/ValidaRestricciones"
import ModalSuccess from "../../../Componentes/Modales/ModalesSweetalert2/ModalSuccess"

const OrigenDestinoEditar = () => {
  const { Id, idFormulario } = useParams(); //es el id de companiaPaises

  const InicializaOrigenDestino = {
    IDContabilidad_Origen: null,
    Codigo:"",
    Descripcion: "",
    Estado: true,
    Observaciones: "",
    IDCompania: 0,
  }
   
  const [origenDestino, setOrigenDestino] = useState(InicializaOrigenDestino);
  const [actualizar, setActualizar] = useState(null);
  const [mostarModal, setMostarModal] = useState(false); 
  const [defaul, setDefaul] = useState(false)
  const [cargando, setCargando] = useState(false);//Muestra o no el Loading
  const [errores, setErrores] = useState({});
  const [lista, setLista] =  useState([]);
  const [existenteOriginal, setExistenteOriginal] = useState("")

// Renderiza la página y hace el get de listar 
useEffect(() => {
  const codigoCompaniaAuth = parseInt(AuthServices.getCodigoCompania());
  setOrigenDestino({ ...origenDestino, IDCompania: codigoCompaniaAuth});
  if(Id) buscarPor(Id, codigoCompaniaAuth);//Realiza el metodo buscarPor id
  if(codigoCompaniaAuth) getList(codigoCompaniaAuth);
  
// eslint-disable-next-line
}, [Id]); 

//---------- Maneja los cambios en los inputs ----------
const manejoCambioImput = event => {
  const { name, value } = event.target;
  setOrigenDestino({ ...origenDestino, [name]: value });
}

//---------- Maneja los cambios del input para validar el campo si ya extiste ----------
const manejoImputValidacion = event => {
  manejoCambioImput(event);
  setErrores(validarExistentes(origenDestino));
} 

//---------- Metodo para buscar por id ----------
const buscarPor = (id, codigo_compania) => {
  const token = AuthServices.getAuthToken(); // Trae el token de local store
  if (!ValidaRestricciones.ValidarToken(token)) {return;}//valida el token
  setCargando(true); // Acá, llama o invoca el componente Loading Aleatorio, poniendo la const en true

    OrigenDestinoServicios.setAuthToken(token);
    OrigenDestinoServicios.findBy(id, codigo_compania) // Invoca el endpoint del backend 
      .then(response => {
        setOrigenDestino(response.data);
        setExistenteOriginal(response.data.Codigo)
        setCargando(false); // Oculta el componente Loading Aleatorio poniendo la const en false
      })
      .catch(e => {
        setCargando(false); // Oculta el componente Loading Aleatorio poniendo la const en false
        ValidaRestricciones.capturaDeErrores(e); 
      });
};


//Invoca modal ModalConfirmar modificar 
const editar = () => {
  setActualizar(origenDestino.IDContabilidad_Origen)// Válida si hay ya existe el campo a validar que se esta mandando por el input 
  
  setErrores(validarExistentes(origenDestino));// Válida si hay ya existe el campo a validar que se esta mandando por el input 
  if (Object.keys(errores).length !== 0 ){// Válida si hay errores, si hay, no se agrega un nuevo registro
    ModalSuccess.modalCapturaDeWarning(errores.Nombre); // Modal para mostrar los errores capturados que devuelve el backend
    return;
  }
 
  setMostarModal(true)//Invoca el moda ModalConfirmar 
};

//Evento para cuando se confirma el si quiere editar el registro en el modal
const eventoConfirmar = () => {
  if(actualizar)modificar();//Invoca o llama el metodo modificar
  setMostarModal(false);// Limpiar el estado después de confirmar
};

//Evento para cuando se cancela el editar en el modal
const eventoCancelar = () => {
  setMostarModal(false);
};

//---------- Metodo para editar o modificar ----------
const modificar = () => {
    const token = AuthServices.getAuthToken(); //Trae el token de local store
    if (!ValidaRestricciones.ValidarToken(token)) {return;}//valida el token
    setCargando(true);// Acá, llama o invoca el componente Loading Aleatorio, poniento la const en true
  
    var data = { // Le agrega todos los datos a la variable data
      IDContabilidad_Origen: origenDestino.IDContabilidad_Origen,
      Codigo: origenDestino.Codigo,
      Descripcion: origenDestino.Descripcion ? origenDestino.Descripcion :  null,
      Estado: origenDestino.Estado,
      Observaciones: origenDestino.Observaciones ? origenDestino.Observaciones : null,
      IDCompania: origenDestino.IDCompania.IDCompania,
    };
  
          OrigenDestinoServicios.setAuthToken(token);
          OrigenDestinoServicios.update(origenDestino.IDContabilidad_Origen, data)//Invoca el endpoid del backend 
                .then(response => {
                  setCargando(false);// Oculta el componente Loading Aleatorio poniendo la const en false
                })
                .catch(e => {
                  // Muestra los mensajes personalizados del backend
                  console.error(data);
                  setCargando(false); // Desactiva el componente de carga
                  ValidaRestricciones.capturaDeErrores(e); 
                });
};

//----Método para get o listar 
const  getList = (codigo_compania) => {
  const token = AuthServices.getAuthToken();// Trae el token de local store
  if (!ValidaRestricciones.ValidarToken(token)) {return;}//valida el token
  setCargando(true);// Acá, llama o invoca el componente Loading Aleatorio, poniento la const en true

  OrigenDestinoServicios.setAuthToken(token); // Le manda el token al encabezado de la consulta del endpoind
  OrigenDestinoServicios.getAll(codigo_compania) // Invoca o llama el metodo listar o el get de todo de servicios  
      .then(response => {
        setLista(response.data); // Guada lo que se devolvió del back-end en la variable que es un array
        setCargando(false);// Oculta el componente Loading Aleatorio poniendo la const en false
      })
      .catch(e => {
        setCargando(false);// Oculta el componente Loading Aleatorio poniendo la const en false
        //ValidaRestricciones.capturaDeErrores(e);//Valida y devulve los errores del back end
        console.error(e)
      });
}

//----Método para validar algun campo y si ya existe el campo a validar
const validarExistentes = (origenDestino) => {
  let errores = {} // Se declara un objeto de errores, para ir almacenando los errores
  lista.forEach(listaforEach => {// Se hace un forEach de la variable 
    if (listaforEach.Codigo === origenDestino.Codigo) {// Busca en el Array la variable si ya existe 
       if(existenteOriginal !== origenDestino.Codigo)errores.Nombre = "El código de origen y destino ya existe. Por favor, ingrese un código diferente"; // Si ya existe en el array se guarda un mensaje para mostrarlo como error      
    }
  })
  return errores; // Devuelve los errores 
}

//Son las propiedades que se le va a pasar al formulario
const propsParaFormulario = {
  manejoCambioImput,
  editar,
  origenDestino,
  defaul, 
  setDefaul,
  setOrigenDestino,
  idFormulario,
  manejoImputValidacion,
  errores,
};
  
return(
  <>
   {/*Invoca al formulario y le pasa propiedades   */}
   <FormularioOrigenDestino  {...propsParaFormulario}/>

     {/*Muestra el modal de sweetalert2 ModalConfirmar y le manda los mensajes por propiedades*/}
     <ModalConfirmar
            title="¿Estás seguro de guardar los cambios?"
            text="¡No podrás revertir esta acción!"
            icon="warning"
            confirmButtonText="¡Sí, guardar!"
            cancelButtonText="No, cancelar!"
            onConfirm={eventoConfirmar}
            onCancel={eventoCancelar}
            successTitle="¡Guardado!"
            successText="Se guardaron los cambios correctamente."
            successIcon="success"
            dismissTitle="Cancelado"
            dismissText="No se guardó ningún cambio."
            dismissIcon="error"
            show={mostarModal}
          />

    {/*Muestra el Loading aleatorio con colores aleatorios y el SVG de New Impact     */}
    <LoadingAleatorio mostrar={cargando}/>
  </>
  );
};


export default OrigenDestinoEditar;