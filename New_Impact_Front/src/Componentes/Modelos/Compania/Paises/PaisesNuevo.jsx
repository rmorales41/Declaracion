import React, { useState, useEffect } from "react";
import {useParams} from 'react-router-dom';
import FormularioCompaniaPaises from "./FormularioPaises";
import AuthServices from '../../../../Servicios/AuthServices';
import CompaniaPaisesServicios from '../../../../Servicios/ConpaniaServicios/CompaniaPaisesServicios';
import CompaniaIdiomaServicios from "../../../../Servicios/ConpaniaServicios/CompaniaIdiomaServicios";
import LoadingAleatorio from "../../../Componentes/Loading/LoadingAleatorio";
import ValidaRestricciones from "../../../../Hooks/ValidaRestricciones";
import ModalSuccess from "../../../Componentes/Modales/ModalesSweetalert2/ModalSuccess"

const PaisesNuevo = () => {
  
  const { idFormulario } = useParams(); //es el id del formulario para buscar las restricciones 

const InicializaCompaniaPaises = {
  IDPais: null,
  Nombre: "",
  Codigo_Area: "",
  Observaciones: "",
  Abreviatura: "",
  Simbolo_Moneda: "",
  Nombre_Moneda: "",
  Moneda_Base_Comparacion: 0,
  Url_Banco_Central: "",
  Usuario_Conexion_BC: "",
  Clave_Conexion_Bc: "",
  Correo_Conexion: "",
  ISO: "",
  Compania_Idioma: "",
}

const [companiaPaises, setCompaniaPaises] = useState(InicializaCompaniaPaises);
const [companiaIdioma, setCompaniaIdioma] = useState([]);
const [idioma, setIdioma] = useState(null);
const [companiaPaisesArray, setCompaniaPaisesArray] = useState([]);
const [errores, setErrores] = useState({});
const [errorsinSeleccionar, setErrorsinSeleccionar] = useState({});
const [validacion, setValidacion] = useState(false);
const [defaul, setDefaul] = useState(false)
const [cargando, setCargando] = useState(false);//Muestra o no el Loading

//---------- Maneja los cambios en los inputs ----------
const manejoCambioImput = event => {
  const { name, value } = event.target;
  setCompaniaPaises({ ...companiaPaises, [name]: value });
}

//---------- Maneja los cambios del input del select ----------
const manejoImputIdioma = event => {
  manejoCambioImput(event);
  setErrorsinSeleccionar(validarSeleccionIdioma(defaul));
}

//---------- Maneja los cambios del input del select ----------
const manejoImputValidacion = event => {
  manejoCambioImput(event);
  setErrores(validarPaisesExistentes(companiaPaises));
} 

//---------- Metodo para crear un nuevo compañia pais ----------
const nuevo = (e) => {
  const token = AuthServices.getAuthToken();// Trae el token de local store
  if (!ValidaRestricciones.ValidarToken(token)) {return;}//valida el token
  setCargando(true);// Acá, llama o invoca el componente Loading Aleatorio, poniento la const en true

      CompaniaPaisesServicios.setAuthToken(token);
      setErrores(validarPaisesExistentes(companiaPaises));// Válida si hay ya países con el nombre que le está mandando por el input 
      setErrorsinSeleccionar(validarSeleccionIdioma(defaul));// Válida si selecciono algún idioma
     
      if (Object.keys(errores).length !== 0 || Object.keys(errorsinSeleccionar).length !== 0){// Válida si hay errores, si hay, no se agrega un nuevo registro
        setCargando(false);// Oculta el componente Loading Aleatorio poniendo la const en false
          if(Object.keys(errores).length !== 0) ModalSuccess.modalCapturaDeWarning(errores.Nombre); // Modal para mostrar los errores capturados que devuelve el backend
        return;
      }

        // Le agrega todos los datos a la variable data
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
          Compania_Idioma: idioma
        };
          CompaniaPaisesServicios.create(data) // Invoca o llama el metodo create o registrar de servicios Compañia Paises 
              .then(response => {
                setCompaniaPaises({Nombre:response.data.Nombre, Codigo_Area: response.data.Codigo_Area, Observaciones: response.data.Observaciones});
                setValidacion(true)
                setCargando(false);// Oculta el componente Loading Aleatorio poniendo la const en false
                limpiaCampos();// Limpia todos los campos
                ModalSuccess.modalSuccesscorrectamente("Se agregó correctamente el pais");// Modal para que muestre que se agregó correctamente  
              })
              .catch(e => {
                setCargando(false);// Oculta el componente Loading Aleatorio poniendo la const en false
                ValidaRestricciones.capturaDeErrores(e);
              })
   
  };

//----Método para get o listar para el select de idiomas
const  getList = () => {
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

//----Método para get o listar para el select 
const paisesExistentes = () => {
  const token = AuthServices.getAuthToken();// Trae el token de local store
  if (!ValidaRestricciones.ValidarToken(token)) {return;}//valida el token

    CompaniaPaisesServicios.setAuthToken(token); // Le manda el token al CompaniaIdiomaServicios para envialo en el encabezado de la consulta del endpoind
    CompaniaPaisesServicios.ListarExistentesPaises() // Invoca o llama el metodo listar o el get de todo de servicios Compañia Idioma sin paginación 
      .then(response => {
        setCompaniaPaisesArray(response.data); // Guada lo que se devolvió del back-end en la variable companiaIdioma que es un array
      })
      .catch(e => {
        ValidaRestricciones.capturaDeErrores(e);
      });
  };

//----Método para validar algun campo y si ya existe una compañia paises
const validarPaisesExistentes = (Paises) => {
  let errores = {} // Se declara un objeto de errores, para ir almacenando los errores
  companiaPaisesArray.forEach(companiaPaises => {// Se hace un forEach de la variable companiaPaisesArray la cual es la respuesta el endpoind CompaniaPaisesServicios.ListarExistentesPaises en el método const paisesExistentes  
    if (companiaPaises.Nombre === Paises.Nombre) {// Busca en el Array de companiaPaises si existe ya el Nombre 
      errores.Nombre = "El nombre de país ya existe, digite otro diferente"; // Si ya existe el nombre en el array se guarda un mesnaje para mostrarlo como error
    }
  })
  return errores; // Devuelve los errores 
}

//----Método para validar si se selecciono algun idioma
const validarSeleccionIdioma = (defaul) => {
  let errorsinSeleccionar = {} // Se declara un objeto de errores, para ir almacenando los errores
    if (!defaul)  errorsinSeleccionar.sinSeleccionar = "Seleccione un idioma"; // Si es false se le agrega al arrry de errores el error correspondiente
  return errorsinSeleccionar; // Devuelve los errores 
}

//Limpia todos los campos si se guarda los datos bien
const limpiaCampos = () => {
  setDefaul(false)
  setCompaniaPaises(InicializaCompaniaPaises);
  setValidacion(false);
  setCargando(false);// Oculta el componente Loading Aleatorio poniendo la const en false
}

// Renderiza la página y hace el get de toda la lista de idiomas. 
useEffect(() => {
  getList();// Invoca o llama el metodo listar cada ves que se renderiza la página, esto lo hace solo 1 ves 
  paisesExistentes();// Invoca o llama el metodo listar de paises Existentescada cada que se renderiza la pagina 
  if (validacion) {//Valida si validacion es true, para llamar limpiaCampos();
      setDefaul(false);
      limpiaCampos();
      setIdioma(null)
  }
// eslint-disable-next-line
}, [validacion]); 

//Son las propiedades a formulario
const propsParaFormulario = {
  manejoCambioImput,
  nuevo,
  companiaPaises,
  companiaIdioma,
  setIdioma,
  manejoImputIdioma,
  errores,
  manejoImputValidacion,
  defaul, 
  setDefaul,
  errorsinSeleccionar,
  setCompaniaPaises,
  idFormulario,
};

  return (  
    <>
      {/*Invoca al formulario y le pasa propiedades*/}
      <FormularioCompaniaPaises  {...propsParaFormulario}/>
      
      {/*Muestra el Loading aleatorio con colores aleatorios y el SVG de New Impact*/}
      <LoadingAleatorio mostrar={cargando}/>

    </>
    )
}

export default PaisesNuevo;