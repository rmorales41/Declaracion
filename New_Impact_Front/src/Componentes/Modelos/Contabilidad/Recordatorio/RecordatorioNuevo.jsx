import React, { useState, useEffect } from "react";
import {useParams} from 'react-router-dom';
import AuthServices from '../../../../Servicios/AuthServices';
import RecordatorioServicios from "../../../../Servicios/ContabilidadServicios/RecordatorioServicios";
import LoadingAleatorio from "../../../Componentes/Loading/LoadingAleatorio";
import ModalSuccess from "../../../Componentes/Modales/ModalesSweetalert2/ModalSuccess"
import ValidaRestricciones from '../../../../Hooks/ValidaRestricciones';
import FormularioRecordatorio from "./FormularioRecordatorio";

const RecordatorioNuevo = ({llamadoDesdeUnModal, idDesdeModal, onClickCancelar, getListaRecordatorios}) => {

const { idFormulario } = useParams(); //es el id del formulario para buscar las restricciones 

const InicializaRecordatorio = {
  IDContabilidad_Recordatorio: null,
  IDUnico_Referencial: null,
  Frecuencia_Dias: 0,
  Observaciones: "",
  Notificado: null,
  IDCompania: 0,
}

const [recordatorio, setRecordatorio] = useState(InicializaRecordatorio);
const [codigo_compania, setCodigo_compania] = useState(0);
const [validacion, setValidacion] = useState(false);
const [cargando, setCargando] = useState(false);//Muestra o no el Loading

//---------- Maneja los cambios en los inputs ----------
const manejoCambioImput = event => {
  const { name, value } = event.target;
  setRecordatorio({ ...recordatorio, [name]: value });
}

//---------- Metodo para crear un nuevo compañia pais ----------
const nuevo = (e) => {
  const token = AuthServices.getAuthToken();// Trae el token de local store
  if (!ValidaRestricciones.ValidarToken(token)) return;//valida el token
  setCargando(true);// Acá, llama o invoca el componente Loading Aleatorio, poniento la const en true

          var data = { // Le agrega todos los datos a la variable data
            IDContabilidad_Recordatorio: recordatorio.IDContabilidad_Recordatorio,
            IDUnico_Referencial: idDesdeModal ? idDesdeModal : recordatorio.IDUnico_Referencial,
            Frecuencia_Dias: recordatorio.Frecuencia_Dias,
            Observaciones: recordatorio.Observaciones,
            Notificado: recordatorio.Notificado,
            IDCompania: codigo_compania,
          };

          RecordatorioServicios.setAuthToken(token);
          RecordatorioServicios.create(data) // Invoca o llama el metodo create o registrar de servicios 
                .then(response => {
                    setRecordatorio({
                        IDContabilidad_Recordatorio: response.data.IDContabilidad_Recordatorio,
                        IDUnico_Referencial: response.data.IDUnico_Referencial,
                        Frecuencia_Dias: response.data.Frecuencia_Dias,
                        Observaciones: response.data.Observaciones,
                        Notificado: response.data.Notificado,
                        IDCompania: response.data.IDCompania,
                    });

                  setValidacion(true);
                  setCargando(false);// Oculta el componente Loading Aleatorio poniendo la const en false
                  limpiaCampos();// Limpia todos los campos
                  ModalSuccess.modalSuccesscorrectamente("Se agregó correctamente el nuevo recordatorio");// Modal para que muestre que se agregó correctamente
                  if(llamadoDesdeUnModal){
                    getListaRecordatorios(codigo_compania)
                    onClickCancelar();//Si se agrego correctamente, y la vista es llamada desde un modal o visor, al agregar correctamente se cierra el modal
                  } 
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
  setRecordatorio(InicializaRecordatorio);
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
  recordatorio,
  setRecordatorio,
  idFormulario,
  llamadoDesdeUnModal,
  onClickCancelar,
}; 

  return (  
    <>
      {/*Invoca al formulario y le pasa propiedades*/}
      <FormularioRecordatorio {...propsParaFormulario} />

      {/*Muestra el Loading aleatorio con colores aleatorios y el SVG de New Impact */}
      <LoadingAleatorio mostrar={cargando}/>
    </>
    )
}

export default RecordatorioNuevo;