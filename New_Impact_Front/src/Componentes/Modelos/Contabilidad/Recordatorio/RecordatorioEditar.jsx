import React, { useEffect, useState } from "react";
import { useParams} from "react-router-dom";
import AuthServices from '../../../../Servicios/AuthServices';
import RecordatorioServicios from "../../../../Servicios/ContabilidadServicios/RecordatorioServicios";
import FormularioRecordatorio from "./FormularioRecordatorio";
import LoadingAleatorio from "../../../Componentes/Loading/LoadingAleatorio";
import ValidaRestricciones from "../../../../Hooks/ValidaRestricciones"
import ModalSuccess from "../../../Componentes/Modales/ModalesSweetalert2/ModalSuccess"
import {titleUpdate, mensajeUpdate, confirmarButtonUpdate, 
        cancelarButtonUpdate, successTitleUpdate, successTextUpdate, titleDelete,
        mensajeDelete, confirmarButtonDelete, cancelarButtonDelete, successTitleDelete,
        successTextDelete
  }from '../../../../Variables/variables';

const RecordatorioEditar = ({llamadoDesdeUnModal, idDesdeModal, onClickCancelar, modificar, getListaRecordatorios}) => {
  const { idFormulario } = useParams(); //es el id de companiaPaises
  const { Id: paramId } = useParams(); // renombramos Id para evitar conflictos
  const Id = idDesdeModal || paramId;// Si idDesdeModal está vacío, utilizamos paramId

  const InicializaRecordatorio = {
    IDContabilidad_Recordatorio: null,
    IDUnico_Referencial: null,
    Frecuencia_Dias: 0,
    Observaciones: "",
    Notificado: null,
    IDCompania: 0,
  }
  
  const [recordatorio, setRecordatorio] = useState(InicializaRecordatorio);
  const [defaul, setDefaul] = useState(false)
  const [cargando, setCargando] = useState(false);//Muestra o no el Loading

// Renderiza la página y hace el get de listar 
useEffect(() => {
  const codigoCompaniaAuth = parseInt(AuthServices.getCodigoCompania());
  setRecordatorio({ ...recordatorio, IDCompania: codigoCompaniaAuth});
  if(Id) buscarPor(Id, codigoCompaniaAuth);//Realiza el metodo buscarPor id
// eslint-disable-next-line
}, [Id]); 

//---------- Maneja los cambios en los inputs ----------
const manejoCambioImput = event => {
  const { name, value } = event.target;
  setRecordatorio({ ...recordatorio, [name]: value });
}

//---------- Metodo para buscar por id ----------
const buscarPor = (id, codigo_compania) => {
  const token = AuthServices.getAuthToken(); // Trae el token de local store
  if (!ValidaRestricciones.ValidarToken(token)) {return;}//valida el token
  setCargando(true); // Acá, llama o invoca el componente Loading Aleatorio, poniendo la const en true

  RecordatorioServicios.setAuthToken(token);
  RecordatorioServicios.findBy(id, codigo_compania) // Invoca el endpoint del backend 
      .then(response => {
        setRecordatorio(response.data);
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
                  IDContabilidad_Recordatorio   : recordatorio.IDContabilidad_Recordatorio,
                  IDUnico_Referencial           : recordatorio.IDUnico_Referencial,
                  Frecuencia_Dias               : recordatorio.Frecuencia_Dias,
                  Observaciones                 : recordatorio.Observaciones,
                  Notificado                    : recordatorio.Notificado,
                  IDCompania                    : recordatorio.IDCompania.IDCompania,
                };
                RecordatorioServicios.setAuthToken(token);
                RecordatorioServicios.update(recordatorio.IDContabilidad_Recordatorio, data)//Invoca el endpoid del backend 
                  .then(response => {
                     if(llamadoDesdeUnModal) onClickCancelar();//Si se agrego correctamente, y la vista es llamada desde un modal o visor, al agregar correctamente se cierra el modal
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

//Evento para revome o eliminar 
const remove = (id) => {
  const token = AuthServices.getAuthToken()// Trae el token que se gurdo en el localStores cuando se logueo
  if (!ValidaRestricciones.ValidarToken(token)) return;//valida el token
  ModalSuccess.modalConfirmar(titleDelete, mensajeDelete, confirmarButtonDelete, cancelarButtonDelete, successTitleDelete, successTextDelete)
    .then((confirmed) => {
        if(confirmed) {// Si se confirma se elimina el registro setCargando(true)// Acá, llama o invoca el componente Loading Aleatorio, poniento la const en true
          setCargando(true)
          RecordatorioServicios.setAuthToken(token);
          RecordatorioServicios.remove(id)//Invoca el endpoid de elimanar o remove del back end
            .then((response) => {
              setCargando(false)// Oculta el componente Loading Aleatorio poniendo la const en false
              if(llamadoDesdeUnModal){
                getListaRecordatorios(recordatorio.IDCompania.IDCompania)//Refresca la lista de recordatorios
                onClickCancelar();//Si se agrego correctamente, y la vista es llamada desde un modal o visor, al agregar correctamente se cierra el modal
              } 
            }).catch(e => {
                setCargando(false);// Oculta el componente Loading Aleatorio poniendo la const en false   
                ValidaRestricciones.capturaDeErrores(e);               
            });
        }
    });
};

//Son las propiedades que se le va a pasar al formulario
const propsParaFormulario = {
  manejoCambioImput,
  editar,
  recordatorio,
  defaul, 
  setDefaul,
  idFormulario,
  llamadoDesdeUnModal,
  onClickCancelar,
  remove,
  Id,
  modificar,
};
  
return(
  <>
    {/*Invoca al formulario y le pasa propiedades   */}
    <FormularioRecordatorio  {...propsParaFormulario}/>

    {/*Muestra el Loading aleatorio con colores aleatorios y el SVG de New Impact     */}
    <LoadingAleatorio mostrar={cargando}/>
  </>
  );
};


export default RecordatorioEditar;