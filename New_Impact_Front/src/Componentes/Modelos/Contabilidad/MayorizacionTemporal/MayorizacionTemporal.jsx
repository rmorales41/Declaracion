import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import AuthServices from '../../../../Servicios/AuthServices';
import ValidaRestricciones from '../../../../Hooks/ValidaRestricciones';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faFilePdf,} from '@fortawesome/free-solid-svg-icons';
import { RiFileExcel2Line } from "react-icons/ri";
import MayorizacionTemporalServicios from "../../../../Servicios/ContabilidadServicios/MayorizacionTemporalServicios";
import ModalSuccess from "../../../Componentes/Modales/ModalesSweetalert2/ModalSuccess";
import FormularioMayorizacionTemporal from "./FormularioMayorizacionTemporal";
import Reportes from "../../../Reportes/Reportes"

const MayorizacionTemporal = () => {
  const { idFormulario } = useParams();

  const InicializaMayorizacionTemporal = {
    fecha_mayorizacion: "",
    moneda: true,//Si es true es local, si es false es extranjera
    idioma: true,//Si es true es español, si es false es ingles
    opcion : "",
    codigo_compania:""
  }
   
  const [mayorizacionTemporal, setMayorizacionTemporal] = useState(InicializaMayorizacionTemporal);
  const [cargando, setCargando] = useState(false);
  const titulo = "Mayorización Temporal";
  const [hoveredItem, setHoveredItem] = useState(null);
  const [sinPermisos, setSinPermisos] = useState(false);  
  const [restricciones, setRestricciones] = useState([]);

  //Se válida las restricciones cada vez que se refresca la página o se cambia el idFormulario
  useEffect(() => {
    const obtenerRestricciones = async () => {
      try {
        const codigo_compania =  AuthServices.getCodigoCompania();
        const data = await ValidaRestricciones.validar(idFormulario, codigo_compania);//Invoca o llama el hook para validaciones de restricciones por usuarios
        setRestricciones(data);// La constante restricciones guarda lo que devuelve el hook, en este caso las restricciones que es un array
        setSinPermisos(false); // Tiene acceso a este formulario
      } catch (error) {
        console.error(error);
        setSinPermisos(true); // No Tiene acceso a este formulario, y muestra un mensaje de advertencia
      }
    };
    obtenerRestricciones();
  }, [idFormulario]);

  //Evento o funcio generico para obtener la fecha 
  const eventoObtenerFecha = async (date, field) => {
    if (!date || isNaN(date)){//Valida que la fecha no venga vacia
      const formattedDate = date.format('YYYY-MM-DD');
      setMayorizacionTemporal(prevAsiento => ({...prevAsiento, [field]: formattedDate}));
    } else {
      setMayorizacionTemporal(prevAsiento => ({...prevAsiento, [field]: null}));
    }
  };

  //Evento o funcion generico para obtener el evento del Switch
  const eventoDeSwitch = (field, value) => {
    setMayorizacionTemporal(prevState => ({
      ...prevState,
      [field]: value
    }));
  };

  //--> Muestra el SnackBar o el tooltips flotantes de observaciones
  const handleHover = (text) => setHoveredItem(text);

  //--> Oculta el SnackBar o el tooltips flotantes de observaciones
  const handleClose = () =>  setHoveredItem(null); 

  // Aquí se agregan más opciones al grupo de botones de radio MouseEnter y onMouseLeave
  //onMouseEnter={() => { handleHover("Clic para ver las opciones");}}
  const radioOptions = [
    { value: "opcion1",id:"opcion1", name:"opcion1", label: "Balance Comprobación (detalle)", labelPlacement: "end", onMouseLeave: handleClose,
      onMouseEnter: () => { handleHover("Balance Comprobación (detalle)")}, },
    
    { value: "opcion2",id:"opcion2", name:"opcion2", label: "Balance Comprobación (saldos)", labelPlacement: "end", onMouseLeave: handleClose,
      onMouseEnter: () => { handleHover("Balance Comprobación (saldos)")}, },
    
    { value: "opcion3",id:"opcion3", name:"opcion3", label: "Análisis / Balance de Situación", labelPlacement: "end", onMouseLeave: handleClose, 
      onMouseEnter: () => { handleHover("Análisis / Balance de Situación")}, },
    
    { value: "opcion4",id:"opcion4", name:"opcion4", label: "Análisis / Estado de Resultados", labelPlacement: "end", onMouseLeave: handleClose, 
      onMouseEnter: () => { handleHover("Análisis / Estado de Resultados")}, },
    
    { value: "opcion5",id:"opcion5", name:"opcion5", label: "Balance General", labelPlacement: "end", onMouseLeave: handleClose, 
      onMouseEnter: () => { handleHover("Balance General")}, },
    
    { value: "opcion6",id:"opcion6", name:"opcion6", label: "Estado Resultados", labelPlacement: "end", onMouseLeave: handleClose, 
      onMouseEnter: () => { handleHover("Estado Resultados")}, },
    
    { value: "opcion7",id:"opcion7", name:"opcion7", label: "Análisis / Estado Resultado Producción", labelPlacement: "end", onMouseLeave: handleClose, 
      onMouseEnter: () => { handleHover("Análisis / Estado Resultado Producción")}, },
  ];

//Funcion que valida cual es el reporte a mostrar en pdf
  const reportesPDF = async () => {
    if(!mayorizacionTemporal.fecha_mayorizacion){
      ModalSuccess.modalCapturaDeWarning("Seleccione una fecha"); // Modal para mostrar los errores capturados que devuelve el backend
      return 
    }else if(!mayorizacionTemporal.opcion){
      ModalSuccess.modalCapturaDeWarning("Seleccione una opción de reporte"); // Modal para mostrar los errores capturados que devuelve el backend
      return 
    }

    const codigo_compania = AuthServices.getCodigoCompania();
    const token = AuthServices.getAuthToken(); // Trae el token de local store
      if (!ValidaRestricciones.ValidarToken(token)) return null; // Valida el token
         MayorizacionTemporalServicios.setAuthToken(token); // Le manda el token al encabezado de la consulta del endpoind
         setCargando(true);
          try {
            let response = null
            let fecha_mayorizacion = mayorizacionTemporal.fecha_mayorizacion 
            let moneda = mayorizacionTemporal.moneda ? "Local" : "Extranjera"
            if(mayorizacionTemporal.opcion === "opcion1"){//Si esta marcado la opcion 1 Balance Comprobación (detalle)
              response = await MayorizacionTemporalServicios.getBalanceComprobacion(codigo_compania, fecha_mayorizacion, moneda) 
              Reportes.abrirReportes(response.data)//abre el reporte, 
            }
            setCargando(false);
          } catch (e) {
            setCargando(false);
            console.error(e)
            ValidaRestricciones.capturaDeErrores(e);//Valida y devulve los errores del back end
            return null;
          }
  };

  //Si tiene opciones de menus se manda en este Array con sus onclic, icono, y nombre
  const menuItems = [
    { text: 'Excel', icon: <RiFileExcel2Line style={{fontSize:"17px"}} /> },
    { text: 'Pdf', icon: <FontAwesomeIcon icon={faFilePdf} style={{fontSize:"17px"}} />, onClick: reportesPDF },
    { text: 'Email', icon: <i className="bi bi-envelope-arrow-up"></i>},
    { text: 'Whatsapp', icon: <i className="bi bi-whatsapp"></i>},
    { text: 'Telegram', icon: <i className="bi bi-telegram"></i>},
  ];

//Son las propiedades a formulario
const propsParaFormulario = {
  titulo,
  mayorizacionTemporal,
  setMayorizacionTemporal,
  eventoObtenerFecha,
  eventoDeSwitch,
  radioOptions,
  menuItems,
  cargando,
  hoveredItem,
  handleClose,
  idFormulario,
  sinPermisos,
  restricciones,
}

  return (
  <>
    <FormularioMayorizacionTemporal {...propsParaFormulario}/>
  </>
   
  );
}

export default MayorizacionTemporal;