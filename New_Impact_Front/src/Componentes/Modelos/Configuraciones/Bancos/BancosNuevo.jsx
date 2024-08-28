import React, { useState, useEffect } from "react";
import {useParams} from 'react-router-dom';
import AuthServices from '../../../../Servicios/AuthServices';
import BancosServicios from "../../../../Servicios/ConfiguracionServicios/BancosServicios";
import LoadingAleatorio from "../../../Componentes/Loading/LoadingAleatorio";
import ModalSuccess from "../../../Componentes/Modales/ModalesSweetalert2/ModalSuccess"
import ValidaRestricciones from '../../../../Hooks/ValidaRestricciones';
import FormularioBancos from "./FormularioBancos";

const BancosNuevo = () => {

const { idFormulario } = useParams(); //es el id del formulario para buscar las restricciones 

const InicializaBancos = {
  IDConfiguracion_Bancos:null,
  Descripcion: "",
  Estatal: false,
  Pago_Automatico_Salarios: false,
  Correo: "",
  Contacto: "",
  Codigo_Bancario: "",
  Codigo_Empresa:"",
  IDCompania: 0,
}

const [bancos, setBancos] = useState(InicializaBancos);
const [codigo_compania, setCodigo_compania] = useState(0);
const [validacion, setValidacion] = useState(false);
const [cargando, setCargando] = useState(false);//Muestra o no el Loading

//---------- Maneja los cambios en los inputs ----------
const manejoCambioImput = event => {
  const { name, value } = event.target;
  setBancos({ ...bancos, [name]: value });
}

//---------- Metodo para crear un nuevo compañia pais ----------
const nuevo = (e) => {
  const token = AuthServices.getAuthToken();// Trae el token de local store
  if (!ValidaRestricciones.ValidarToken(token)) return;//valida el token
  setCargando(true);// Acá, llama o invoca el componente Loading Aleatorio, poniento la const en true

          var data = { // Le agrega todos los datos a la variable data
              IDConfiguracion_Bancos:bancos.IDConfiguracion_Bancos,
              Descripcion:      bancos.Descripcion,
              Estatal:          bancos.Estatal,
              Pago_Automatico_Salarios:   bancos.Pago_Automatico_Salarios,
              Correo:            bancos.Correo,
              Contacto:          bancos.Contacto,
              Codigo_Bancario:   bancos.Codigo_Bancario,
              Codigo_Empresa:    bancos.Codigo_Empresa,
              IDCompania:        codigo_compania,
          };

          BancosServicios.setAuthToken(token);
          BancosServicios.create(data) // Invoca o llama el metodo create o registrar de servicios 
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
  setBancos(InicializaBancos);
  setValidacion(false);
  setCargando(false);// Oculta el componente Loading Aleatorio poniendo la const en false
}

// Renderiza la página y hace el get de listar 
useEffect(() => {
  const codigoCompaniaAuth = parseInt(AuthServices.getCodigoCompania());
  setCodigo_compania(codigoCompaniaAuth);
  if(validacion)limpiaCampos();
// eslint-disable-next-line
}, [validacion]); 
 
//Son las propiedades a formulario
const propsParaFormulario = {
  manejoCambioImput,
  nuevo,
  bancos,
  setBancos,
  idFormulario,
}; 

  return (  
    <>
      {/*Invoca al formulario y le pasa propiedades*/}
      <FormularioBancos {...propsParaFormulario} />

      {/*Muestra el Loading aleatorio con colores aleatorios y el SVG de New Impact */}
      <LoadingAleatorio mostrar={cargando}/>
    </>
    )
}

export default BancosNuevo;