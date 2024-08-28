import React, { useEffect, useState } from "react";
import { useParams} from "react-router-dom";
import AuthServices from '../../../../Servicios/AuthServices';
import CompaniaPaisesServicios from '../../../../Servicios/ConpaniaServicios/CompaniaPaisesServicios';
import CompaniaIdiomaServicios from "../../../../Servicios/ConpaniaServicios/CompaniaIdiomaServicios";
import FormularioCompaniaPaises from "./FormularioPaises";
import ModalConfirmar from '../../../Componentes/Modales/ModalesSweetalert2/ModalConfirmar';
import LoadingAleatorio from "../../../Componentes/Loading/LoadingAleatorio";
import ValidaRestricciones from "../../../../Hooks/ValidaRestricciones";
import ModalSuccess from "../../../Componentes/Modales/ModalesSweetalert2/ModalSuccess"

const PaisesEditar= () => {
  const { IDPais, idFormulario } = useParams(); //es el id de companiaPaises
 
  const InicializaCompaniaPaises = {
    IDPais: null,
    Nombre: " ",
    Codigo_Area: " ", 
    Observaciones: " ",
    Abreviatura: " ",
    Simbolo_Moneda: " ",
    Nombre_Moneda: " ",
    Moneda_Base_Comparacion: 0,
    Url_Banco_Central: " ",
    Usuario_Conexion_BC: " ",
    Clave_Conexion_Bc: " ",
    Correo_Conexion: " ",
    ISO: " ",
    Compania_Idioma: " ",
  } 

  const [companiaPaises, setCompaniaPaises] = useState(InicializaCompaniaPaises);
  const [actualizar, setActualizar] = useState(null);
  const [companiaIdioma, setCompaniaIdioma] = useState([]);
  const [mostarModal, setMostarModal] = useState(false); 
  const [companiaPaisesArray, setCompaniaPaisesArray] = useState([]);
  const [errores, setErrores] = useState({});
  const [defaul, setDefaul] = useState(false)
  const [cargando, setCargando] = useState(false);//Muestra o no el Loading
  const [existenteOriginal, setExistenteOriginal] = useState("")

//---------- Maneja los cambios en los inputs ----------
const manejoCambioImput = event => {
  const { name, value } = event.target;
  setCompaniaPaises({ ...companiaPaises, [name]: value });
}

//---------- Maneja los cambios del input del select ----------
const manejoImputValidacion = event => {
  manejoCambioImput(event);
  setErrores(validarPaisesExistentes(companiaPaises));
}

//---------- Metodo para buscar por id compañia pais ----------
const buscarPor = IDPais => {
  const token = AuthServices.getAuthToken();// Trae el token de local store
  if (!ValidaRestricciones.ValidarToken(token)) {return;}//valida el token
  setCargando(true);// Acá, llama o invoca el componente Loading Aleatorio, poniento la const en true

      CompaniaPaisesServicios.setAuthToken(token);
      CompaniaPaisesServicios.findBy(IDPais)//Invoca el endpoid del backend 
            .then(response => {
              const datos = response.data;
              setCompaniaPaises(datos);
              setExistenteOriginal(datos.Nombre)
              setCargando(false);// Oculta el componente Loading Aleatorio poniendo la const en false
            })
            .catch(e => {
              setCargando(false);// Oculta el componente Loading Aleatorio poniendo la const en false
              ValidaRestricciones.capturaDeErrores(e); 
            });
     
};

//Evento para cuando se confirma el eliminar en el modal
const eventoConfirmar = () => {
  if(actualizar) modificar()//Invoca o llama el metodo modificar Si la variable actualizar no es null 
  setMostarModal(false);// Limpiar el estado después de confirmar
};

//Evento para cuando se cancela el editar en el modal
const eventoCancelar = () => {
  setMostarModal(false)
};

  //---------- Metodo para editar o modificar las Compañias Paises ----------
const modificar = (e) => {
  const token = AuthServices.getAuthToken(); //Trae el token de local store
  if (!ValidaRestricciones.ValidarToken(token)) {return;}//valida el token
  setCargando(true);// Acá, llama o invoca el componente Loading Aleatorio, poniento la const en true

  var data = {
    IDPais: companiaPaises.IDPais,
    Nombre: companiaPaises.Nombre ? companiaPaises.Nombre : null,
    Codigo_Area: companiaPaises.Codigo_Area ? companiaPaises.Codigo_Area : null,
    Observaciones: companiaPaises.Observaciones ? companiaPaises.Observaciones : null,
    Abreviatura: companiaPaises.Abreviatura ? companiaPaises.Abreviatura : null,
    Simbolo_Moneda: companiaPaises.Simbolo_Moneda ? companiaPaises.Simbolo_Moneda : null,
    Nombre_Moneda: companiaPaises.Nombre_Moneda ? companiaPaises.Nombre_Moneda : null,
    Moneda_Base_Comparacion: companiaPaises.Moneda_Base_Comparacion ? companiaPaises.Moneda_Base_Comparacion : null,
    Url_Banco_Central: companiaPaises.Url_Banco_Central ? companiaPaises.Url_Banco_Central : null,
    Usuario_Conexion_BC: companiaPaises.Usuario_Conexion_BC ? companiaPaises.Usuario_Conexion_BC : null,
    Clave_Conexion_Bc: companiaPaises.Clave_Conexion_Bc ? companiaPaises.Clave_Conexion_Bc : null,
    Correo_Conexion: companiaPaises.Correo_Conexion ? companiaPaises.Correo_Conexion : null,
    ISO: companiaPaises.ISO ? companiaPaises.ISO : null,
    Compania_Idioma: companiaPaises.Compania_Idioma.IDIdioma ? companiaPaises.Compania_Idioma.IDIdioma : companiaPaises.Compania_Idioma ,
  };

    CompaniaPaisesServicios.setAuthToken(token);
    setErrores(validarPaisesExistentes(companiaPaises));// Válida si hay ya países con el nombre que le está mandando por el input  
      
      CompaniaPaisesServicios.update(companiaPaises.IDPais, data)//Invoca el endpoid del backend 
              .then(response => {
                setCargando(false);// Oculta el componente Loading Aleatorio poniendo la const en false
              })
              .catch(e => {
                console.error(data);
                setCargando(false);// Oculta el componente Loading Aleatorio poniendo la const en false
                ValidaRestricciones.capturaDeErrores(e);
              });
       
 };

//Invoca modal ModalConfirmar
const editar = () => {
  setActualizar(companiaPaises.IDPais)
  setErrores(validarPaisesExistentes(companiaPaises));// Válida si hay ya países con el nombre que le está mandando por el input 
  if (Object.keys(errores).length === 0 ){// Válida si hay errores, si hay, no se edita el registro
    setMostarModal(true)//Invoca el moda ModalConfirmar 
  }else{
    ModalSuccess.modalCapturaDeWarning(errores.Nombre); // Modal para mostrar los errores capturados que devuelve el backend
    setCargando(false);
  }
};

//----Método para get o listar para validar si ya existe el nombre de un pais existente
const paisesExistentes = () => {
  const token = AuthServices.getAuthToken();// Trae el token de local store
  if (!ValidaRestricciones.ValidarToken(token)) {return;}//valida el token
  setCargando(true);// Acá, llama o invoca el componente Loading Aleatorio, poniento la const en true

    CompaniaPaisesServicios.setAuthToken(token); // Le manda el token al CompaniaIdiomaServicios para envialo en el encabezado de la consulta del endpoind
    CompaniaPaisesServicios.ListarExistentesPaises() // Invoca o llama el metodo listar o el get de todo de servicios Compañia Idioma sin paginación 
      .then(response => {
        setCompaniaPaisesArray(response.data); // Guada lo que se devolvió del back-end en la variable companiaIdioma que es un array
        setCargando(false);// Oculta el componente Loading Aleatorio poniendo la const en false
      })
      .catch(e => {
        setCargando(false);// Oculta el componente Loading Aleatorio poniendo la const en false
        ValidaRestricciones.capturaDeErrores(e);
      });
 
};

//----Método para get o listar para el select de idiomas
const  getListIdiomas = () => {
  const token = AuthServices.getAuthToken();// Trae el token de local store
  if (!ValidaRestricciones.ValidarToken(token)) {return;}//valida el token
  setCargando(true);// Acá, llama o invoca el componente Loading Aleatorio, poniento la const en true

    CompaniaIdiomaServicios.setAuthToken(token); // Le manda el token al CompaniaIdiomaServicios para envialo en el encabezado de la consulta del endpoind
    CompaniaIdiomaServicios.selectListarIdiomas() // Invoca o llama el metodo listar o el get de todo de servicios Compañia Idioma sin paginación 
      .then(response => {
        setCompaniaIdioma(response.data); // Guada lo que se devolvió del back-end en la variable companiaIdioma que es un array
        setCargando(false);// Oculta el componente Loading Aleatorio poniendo la const en false
      })
      .catch(e => {
        setCargando(false);// Oculta el componente Loading Aleatorio poniendo la const en false
        ValidaRestricciones.capturaDeErrores(e);
      });
  
};

//----Método para validar algun campo y si ya existe el campo a validar
const validarPaisesExistentes = (Paises) => {
  let errores = {} // Se declara un objeto de errores, para ir almacenando los errores
  companiaPaisesArray.forEach(listaforEach => {// Se hace un forEach de la variable 
    if (listaforEach.Nombre === Paises.Nombre) {// Busca en el Array la variable si ya existe 
      if(existenteOriginal !== Paises.Nombre)errores.Nombre = "El nombre de país ya existe, digite otro diferente"; // Si ya existe el nombre en el array se guarda un mesnaje para mostrarlo como error
    }
  })
  return errores; // Devuelve los errores 
}

//Renderiza la vista cada que ve un cambio en la variable IDPais
useEffect(() => {
  getListIdiomas();// Invoca o llama el metodo listar de idiomas cada que se renderiza la pagina
  paisesExistentes();// Invoca o llama el metodo listar de paises Existentescada cada que se renderiza la pagina 
  if(IDPais)  buscarPor(IDPais);//Realiza el metodo buscarPor id
}, [IDPais]);

//Son las propiedades que se le va a pasar al formulario
const propsParaFormulario = {
  manejoCambioImput,
  editar,
  companiaPaises, 
  setCompaniaPaises,
  companiaIdioma,
  errores,
  manejoImputValidacion,
  defaul, 
  setDefaul,
  idFormulario,
};
  
return(
  <>
   {/*Invoca al formulario y le pasa propiedades*/}
    <FormularioCompaniaPaises  {...propsParaFormulario}/>
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

      {/*Muestra el Loading aleatorio con colores aleatorios y el SVG de New Impact*/}
      <LoadingAleatorio mostrar={cargando}/>
  </>
  );
};


export default PaisesEditar;