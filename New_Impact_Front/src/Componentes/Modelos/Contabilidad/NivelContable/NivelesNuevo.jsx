import React, { useState, useEffect } from "react";
import {useParams} from 'react-router-dom';
import AuthServices from '../../../../Servicios/AuthServices';
import NivelesServicios from '../../../../Servicios/ContabilidadServicios/NivelesServicios';
import LoadingAleatorio from "../../../Componentes/Loading/LoadingAleatorio";
import ModalSuccess from "../../../Componentes/Modales/ModalesSweetalert2/ModalSuccess"
import ValidaRestricciones from '../../../../Hooks/ValidaRestricciones';
import FormularioNiveles from "./FormularioNiveles";

const NivelesNuevo = () => {
  const { idFormulario } = useParams(); //es el id del formulario para buscar las restricciones 

const InicializaNiveles = {
  IDContabilidad_Niveles: null,
  Nivel:0,
  Nombre_Nivel: "",
  IDCompania: 0,
}

const [niveles, setNiveles] = useState(InicializaNiveles);
const [codigo_compania, setCodigo_compania] = useState(0);
const [validacion, setValidacion] = useState(false);
const [cargando, setCargando] = useState(false);//Muestra o no el Loading
const [lista, setLista] =  useState([]);
const [errores, setErrores] = useState({});

//---------- Maneja los cambios en los inputs ----------
const manejoCambioImput = event => {
  const { name, value } = event.target;
  setNiveles({ ...niveles, [name]: value });
}

//---------- Maneja los cambios del input para validar el campo si ya extiste ----------
const manejoImputValidacion = event => {
  manejoCambioImput(event);
  setErrores(validarExistentes(niveles));
} 

//---------- Metodo para crear un nuevo compañia pais ----------
const nuevo = (e) => {
  const token = AuthServices.getAuthToken();// Trae el token de local store
  if (!ValidaRestricciones.ValidarToken(token)) {return;}//valida el token
  setCargando(true);// Acá, llama o invoca el componente Loading Aleatorio, poniento la const en true

  setErrores(validarExistentes(niveles));// Válida si hay ya existe el campo a validar que se esta mandando por el input 
  if (Object.keys(errores).length !== 0 ){// Válida si hay errores, si hay, no se agrega un nuevo registro
    setCargando(false);
    ModalSuccess.modalCapturaDeWarning(errores.Nombre); // Modal para mostrar los errores capturados que devuelve el backend
    return;
  }
  
          var data = { // Le agrega todos los datos a la variable data
            IDContabilidad_Niveles: niveles.IDContabilidad_Origen,
            Nivel: niveles.Nivel,
            Nombre_Nivel: niveles.Nombre_Nivel ? niveles.Nombre_Nivel :  null,
            IDCompania: codigo_compania,
          };

          NivelesServicios.setAuthToken(token);
          NivelesServicios.create(data) // Invoca o llama el metodo create o registrar de servicios 
                .then(response => {
                  setNiveles(
                    {
                      IDContabilidad_Niveles:response.data.IDContabilidad_Niveles, 
                      Nivel: response.data.Nivel,
                      Nombre_Nivel: response.data.Nombre_Nivel, 
                      IDCompania:response.data.IDCompania, 
                  });
                  setValidacion(true);
                  setCargando(false);// Oculta el componente Loading Aleatorio poniendo la const en false
                  limpiaCampos();// Limpia todos los campos
                  ModalSuccess.modalSuccesscorrectamente("Se agregó correctamente el nuevo nivel contable");// Modal para que muestre que se agregó correctamente
                })
                .catch(e => {
                  // Muestra los mensajes personalizados del backend
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

  NivelesServicios.setAuthToken(token); // Le manda el token al encabezado de la consulta del endpoind
  NivelesServicios.getAll(codigo_compania) // Invoca o llama el metodo listar o el get de todo de servicios  
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
  setNiveles(InicializaNiveles);
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

//Son las propiedades a formulario
const propsParaFormulario = {
  manejoCambioImput,
  nuevo,
  niveles,
  setNiveles,
  idFormulario,
  manejoImputValidacion,
  errores,
}; 

//----Método para validar algun campo y si ya existe el campo a validar
const validarExistentes = (niveles) => {
  let errores = {} // Se declara un objeto de errores, para ir almacenando los errores
  lista.forEach(listaforEach => {// Se hace un forEach de la variable 
    if (listaforEach.Nivel === parseInt(niveles.Nivel)) {// Busca en el Array la variable si ya existe 
      errores.Nombre = "El nivel contable: " +niveles.Nivel +" ya existe. Por favor, ingrese uno diferente"; // Si ya existe en el array se guarda un mensaje para mostrarlo como error
    }
  })
  return errores; // Devuelve los errores 
}

  return (  
    <>
      {/*Invoca al formulario y le pasa propiedades*/}
      <FormularioNiveles {...propsParaFormulario}/>

      {/*Muestra el Loading aleatorio con colores aleatorios y el SVG de New Impact */}
      <LoadingAleatorio mostrar={cargando}/>
    </>
    )
}

export default NivelesNuevo;