import React, { useEffect, useState } from "react";
import { useParams} from "react-router-dom";
import AuthServices from '../../../../Servicios/AuthServices';
import BancosServicios from "../../../../Servicios/ConfiguracionServicios/BancosServicios";
import FormularioBancos from "./FormularioBancos";
import LoadingAleatorio from "../../../Componentes/Loading/LoadingAleatorio";
import ValidaRestricciones from "../../../../Hooks/ValidaRestricciones"
import ModalSuccess from "../../../Componentes/Modales/ModalesSweetalert2/ModalSuccess"
import {titleUpdate, mensajeUpdate, confirmarButtonUpdate,  cancelarButtonUpdate, successTitleUpdate, successTextUpdate,}from '../../../../Variables/variables';

const BancosEditar = () => {
  const {Id, idFormulario } = useParams(); //es el id de companiaPaises

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
  const [cargando, setCargando] = useState(false);//Muestra o no el Loading

// Renderiza la página y hace el get de listar 
useEffect(() => {
  const codigoCompaniaAuth = parseInt(AuthServices.getCodigoCompania());
  setBancos({ ...bancos, IDCompania: codigoCompaniaAuth});
  if(Id) buscarPor(Id, codigoCompaniaAuth);//Realiza el metodo buscarPor id
// eslint-disable-next-line
}, [Id]); 

//---------- Maneja los cambios en los inputs ----------
const manejoCambioImput = event => {
  const { name, value } = event.target;
  setBancos({ ...bancos, [name]: value });
}

//---------- Metodo para buscar por id ----------
const buscarPor = (id, codigo_compania) => {
  const token = AuthServices.getAuthToken(); // Trae el token de local store
  if (!ValidaRestricciones.ValidarToken(token)) {return;}//valida el token
  setCargando(true); // Acá, llama o invoca el componente Loading Aleatorio, poniendo la const en true

  BancosServicios.setAuthToken(token);
  BancosServicios.findBy(id, codigo_compania) // Invoca el endpoint del backend 
      .then(response => {
        setBancos(response.data);
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

    //Muestra el modal para confirmar cambio o no
    ModalSuccess.modalConfirmar(titleUpdate, mensajeUpdate, confirmarButtonUpdate, cancelarButtonUpdate, successTitleUpdate, successTextUpdate)
        .then((confirmed) => {
            if (confirmed) {// Si se confirma se modifica el registro
              setCargando(true);// Acá, llama o invoca el componente Loading Aleatorio, poniento la const en true
                var data = { // Le agrega todos los datos a la variable data
                  IDConfiguracion_Bancos:   bancos.IDConfiguracion_Bancos,
                  Descripcion:      bancos.Descripcion,
                  Estatal:          bancos.Estatal,
                  Pago_Automatico_Salarios:   bancos.Pago_Automatico_Salarios,
                  Correo:            bancos.Correo,
                  Contacto:          bancos.Contacto,
                  Codigo_Bancario:   bancos.Codigo_Bancario,
                  Codigo_Empresa:    bancos.Codigo_Empresa,
                  IDCompania:        bancos.IDCompania.IDCompania,
                };
                BancosServicios.setAuthToken(token);
                BancosServicios.update(bancos.IDConfiguracion_Bancos, data)//Invoca el endpoid del backend 
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


//Son las propiedades que se le va a pasar al formulario
const propsParaFormulario = {
  manejoCambioImput,
  editar,
  bancos,
  idFormulario,
  setBancos,
};
  
return(
  <>
    {/*Invoca al formulario y le pasa propiedades   */}
    <FormularioBancos  {...propsParaFormulario}/>

    {/*Muestra el Loading aleatorio con colores aleatorios y el SVG de New Impact     */}
    <LoadingAleatorio mostrar={cargando}/>
  </>
  );
};


export default BancosEditar;