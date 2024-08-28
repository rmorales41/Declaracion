import React, { useState, useEffect } from 'react';
import {useNavigate, useParams } from 'react-router-dom';
import AuthServices from '../../../../Servicios/AuthServices';
import ValidaRestricciones from '../../../../Hooks/ValidaRestricciones';
import MayorizacionContableServicios from '../../../../Servicios/ContabilidadServicios/MayorizacionContableServicios';
import FormularioMayorizacionContable from "./FormularioMayorizacionContable";
import obtenerContabilidadConfiguracion from "../../../../Hooks/ContabilidadConfiguracion";
import ModalSuccess from "../../../Componentes/Modales/ModalesSweetalert2/ModalSuccess"

import { format, startOfMonth, endOfMonth, addMonths, startOfYear, endOfYear } from 'date-fns';

const CierreMensual = () => {
  const { idFormulario } = useParams();

  const InicializaCierreMensual = {
    fecha_mayorizacion: "",
    codigo_compania:"",
    Fecha_ultima_mayorizacion:"",
    Fecha_ultimo_cierre:"",
    Cierre_Contable:null,
  }
   

  const [cierreMensual, setCierreMensual] = useState(InicializaCierreMensual);
  const [cargando, setCargando] = useState(false);
  const titulo = "Mayorización Contable";
  const [sinPermisos, setSinPermisos] = useState(false);  
  const [restricciones, setRestricciones] = useState([]);
  const [error, setError] = useState(null);
  const moment = require('moment');
  const navigate = useNavigate();// Para pasar a un link

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


  //Le asiga el codigo compañia al objeto
  useEffect(()=>{
    const codigo_companiaAuth =  AuthServices.getCodigoCompania();
    setCierreMensual(prevAsiento => ({...prevAsiento, codigo_compania: codigo_companiaAuth}));
  },[])


//Evento o funcio generico para obtener la fecha 
const eventoObtenerFecha = async (date, name) => {
  if (!date || isNaN(date)){//Valida que la fecha no venga vacia, y que venga en el formato correcto
    setCierreMensual(prevAsiento => ({...prevAsiento, [name]: null}));
      setError("Seleccione una fecha válida.")
      return
    }

    const formatoDeFecha = date.format('YYYY-MM-DD');
    const respuesta = Advierte_Fecha_Final_Dia_Mayorizacion_y_Cierre(formatoDeFecha)
    if(respuesta ){
      setCierreMensual(prevAsiento => ({...prevAsiento, [name] : formatoDeFecha}));
      setError(null)
    }else{
      setCierreMensual(prevAsiento => ({...prevAsiento, [name]: null}));
      setError("Seleccione una fecha válida.")
    }
};


//----Método genérica para obtener listas para get o listar, Funcion o metodo generico para listar o get all
const realizarMayorizacionContable = async () => {
  const token = AuthServices.getAuthToken(); // Trae el token del local store
  if (!ValidaRestricciones.ValidarToken(token)) return; // Valida el token
  if(!cierreMensual.fecha_mayorizacion){
    ModalSuccess.modalCapturaDeWarning("Seleccione una fecha válida." )
    return;
  }

  setCargando(true); // Muestra el componente Loading
  try {
    MayorizacionContableServicios.setAuthToken(token); // Le manda el token al encabezado de la consulta del endpoint
   const response = await  MayorizacionContableServicios.mayorizacionContable(cierreMensual.codigo_compania, cierreMensual.fecha_mayorizacion); // Invoca el método listar o el get de todo de servicios
   ModalSuccess.modalSuccesscorrectamente(response.data.mensaje, 3000)
   navigate(`/`) //Se redirecciona al menú principal.
  } catch (e) {
    ValidaRestricciones.capturaDeErrores(e);//Valida y devulve los errores del back end
  } finally {
    setCargando(false); // Oculta el componente Loading
  }
};


//Carga las configuraciones de contabilidad para poner las fechas de último cierre y última mayorización
useEffect(() => {
  const contabilidad_Confi = async () => {
    const configuracionConta = await obtenerContabilidadConfiguracion.obtenerContabilidadConfiguracion();
    if (configuracionConta && configuracionConta.length > 0) {
      setCierreMensual(prevAsiento => ({...prevAsiento,
        Fecha_ultima_mayorizacion   : configuracionConta[0].Ultima_Mayorizacion || null,
        Fecha_ultimo_cierre         : configuracionConta[0].Ultimo_Cierre || null,
        Cierre_Contable             : configuracionConta[0].Cierre_Contable || null
      }));
     }
  };

  contabilidad_Confi();
}, []);


//Obtiene la fecha proxima a mayorizar
const obtenerFechaProximaMayorizacion = (ultimoCierreContable, tipoCierre) => {

  try {
    let fechaSiguientePrimerDia;
    let fechaSiguienteUltimoDia;

    if (tipoCierre === "1") {
      fechaSiguientePrimerDia = startOfMonth(addMonths(ultimoCierreContable, 1));
      fechaSiguienteUltimoDia = endOfMonth(fechaSiguientePrimerDia);
  
    } else if (tipoCierre === "2") {
      fechaSiguientePrimerDia = startOfYear(addMonths(ultimoCierreContable, 12 - ultimoCierreContable.getMonth()));
      fechaSiguienteUltimoDia = endOfYear(fechaSiguientePrimerDia);

    } else {
      throw new Error("El valor esperado para el parámetro 'Cierre_Contable' no es válido.");
    }

    return { primerDia: fechaSiguientePrimerDia, ultimoDia: fechaSiguienteUltimoDia };
  } catch (e) {
    console.error(`Error de tipo o valor: ${e.message}`);
    throw new Error(`Error de tipo o valor: ${e.message}`);
  }
};


//Advierte antes de lanzar la periticion real, que la fecha sea el último dia del mes.         
const Advierte_Fecha_Final_Dia_Mayorizacion_y_Cierre = (fecha_accion_contable) => {
  const fechaAccionContableDate = moment(fecha_accion_contable).toDate();
  const { Fecha_ultimo_cierre, Cierre_Contable } = cierreMensual;
  const ultimoCierreContableDate = moment(Fecha_ultimo_cierre).toDate();
  const { primerDia: fechaSiguientePrimerDia, ultimoDia: fechaSiguienteUltimoDia } = obtenerFechaProximaMayorizacion(ultimoCierreContableDate, Cierre_Contable);

  // Validar que fecha_accion_contable esté dentro del rango correspondiente
  if (!(fechaSiguientePrimerDia <= fechaAccionContableDate && fechaAccionContableDate <= fechaSiguienteUltimoDia)) {
      const mensaje = `El último cierre contable fue el ${format(ultimoCierreContableDate, 'dd-MM-yyyy')}, por lo que la fecha ingresada: ${format(fechaAccionContableDate, 'dd-MM-yyyy')} debería encontrarse en el rango del ${format(fechaSiguientePrimerDia, 'dd-MM-yyyy')} al ${format(fechaSiguienteUltimoDia, 'dd-MM-yyyy')}.`;
      ModalSuccess.modalCapturaDeWarning(mensaje);
      return false;
  }else if (fechaAccionContableDate.getDate() !== fechaSiguienteUltimoDia.getDate()) {// La fecha está dentro del rango, pero no es el último día.
      const mensaje = `La fecha ingresada ${format(fechaAccionContableDate, 'dd-MM-yyyy')} es correcta, sin embargo el día ${fechaAccionContableDate.getDate()} está antes del último día del mes a cerrar, el cual es: ${fechaSiguienteUltimoDia.getDate()}.`;
      ModalSuccess.modalCapturaDeWarning(mensaje);
      setError(null);
      return true;
  }else if(fechaAccionContableDate.getDate() === fechaSiguienteUltimoDia.getDate()){//La fecha es la correcta para mayorizar, es decir, el último día.
    setError(null);
    return true 
  }
}


//Son las propiedades a formulario
const propsParaFormulario = {
  titulo,
  eventoObtenerFecha,
  cargando,
  idFormulario,
  sinPermisos,
  restricciones,
  cierreMensual,
  realizarMayorizacionContable,
  error,
}

  return (
  <>
    {/*<FormularioMayorizacionContable {...propsParaFormulario}/>*/}
  </>
   
  );
}

export default CierreMensual;