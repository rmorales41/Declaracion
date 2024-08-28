import React, { useState, useEffect } from "react";
import {useParams} from 'react-router-dom';
import AuthServices from '../../../../Servicios/AuthServices';
import TipoDeCuentaServicios from "../../../../Servicios/ContabilidadServicios/TipoCuentaServicios"
import NivelesServicios from "../../../../Servicios/ContabilidadServicios/NivelesServicios";
import CatalogoServicios from '../../../../Servicios/ContabilidadServicios/CatalogoServicios';
import LoadingAleatorio from "../../../Componentes/Loading/LoadingAleatorio";
import ModalSuccess from "../../../Componentes/Modales/ModalesSweetalert2/ModalSuccess"
import FormularioCatalogo from "./FormularioCatalogo";
import EventoManejoInputFormato from "../../../../Hooks/EventoManejoInputFormato"
import ValidaRestricciones from '../../../../Hooks/ValidaRestricciones';

const CatalogoNuevo = () => {
  const { idFormulario } = useParams(); //es el id del formulario para buscar las restricciones 

const InicializaCatalogo = {
  IDContabilidad_Catalogo: null,
  IDOrigen: 0,
  Cuenta: "",
  Permite_Sub_Cuentas: false,
  Nombre_Cuenta: "",
  Nombre_Idioma:  "",
  Descripcion:  "",
  Fecha_Ultimo_Movimiento: "",
  Requiere_Origen_Destino: false,
  Requiere_Control_Presupuestario: false,
  Permite_Transacciones: false,
  Visible: false,
  IDCompania:  0,
  IDContabilidad_Tipo_cuenta: "",
  IDContabilidad_Niveles: ""
}

const [catalogo, setCatalogo] = useState(InicializaCatalogo);
const [codigo_compania, setCodigo_compania] = useState(0);
const [listaDeTipo_cuenta, setListaDeTipo_cuenta] = useState([]);
const [listaDeNiveles, setListaDeNiveles] = useState([]);
const [listaDeCatalogo, setListaDeCatalogo] = useState([]);
const [validacion, setValidacion] = useState(false);
const [errores, setErrores] = useState({});//Guarda los diferentes mensajes de errores
const [erroresNombre_Cuenta, setErroresNombre_Cuenta] = useState({});//Guarda los diferentes mensajes de errores
const [cargando, setCargando] = useState(false);//Muestra o no el Loading
const [formato, setFormato ]= useState("");//Formato de la cuenta ejemplo: xxxx-xxxx-xxx-xx
const [mostrarCatalogoContable, setMostrarCatalogoContable] = useState(false);
const [selectedCuenta, setSelectedCuenta] = useState('');

//Invoca el hook que tiene una funcio para trae solo el formato que se va usar en il input de Cuenta
useEffect(()=>{
  const cargarFormato = async () => {
    try { 
      const { formato } = await EventoManejoInputFormato.obtenerFormato();
      setFormato(formato);
    } catch (e) {
      ValidaRestricciones.capturaDeErrores(e);
    }
  };
  cargarFormato();
},[catalogo])

//---------- Maneja los cambios en los inputs ----------
const manejoCambioImput = event => {
  const { name, value } = event.target;
  setCatalogo({ ...catalogo, [name]: value });
  setErroresNombre_Cuenta(validarNombreDeCuentaExiste({ ...catalogo, [name]: value }))
}

// Función genérica para manejar cambios en selects con mapeo personalizado para el objeto asiento
const eventoCambioDeSelect = (event, value, field, mapValueToField) => {
  setCatalogo(prevAsiento => ({ ...prevAsiento,[field]: value ? mapValueToField(value) : "" }));
};

const propsTipo_cuenta = {
  options: listaDeTipo_cuenta,
  getOptionLabel: (option) => `${option.Detalle} | ${option.Identificador}`,
};

const propsNiveles = {
  options: listaDeNiveles,
  getOptionLabel: (option) => `${option.Nombre_Nivel}`,
};

const valorNiveles = value => value.IDContabilidad_Niveles;
const valorTipo_cuenta = value => value.IDContabilidad_Tipo_cuenta;


//---------- Maneja los cambios del input de formatos ----------
const manejoImputFormato= (event) => {
  setSelectedCuenta("")
  const { name, formattedValue } = EventoManejoInputFormato.eventoInputFormato(event, formato);
  setCatalogo({ ...catalogo, [name]: formattedValue });
};


//---------- Maneja los cambios del input de del calendario para obtener la fecha ----------
const obtenerFecha = (date) => {
  if(!date){
    setCatalogo({ ...catalogo, Fecha_Ultimo_Movimiento: null});
    return 
  }
  const fechaFormateada = date.format('YYYY-MM-DD');
  setCatalogo({ ...catalogo, Fecha_Ultimo_Movimiento: fechaFormateada});
};


//---------- Maneja los cambios del input del campo Cuenta, para saber si ya existe ----------
const manejoImputValidacionExistente = event => {
  manejoImputFormato(event);
  setErrores(validarCuentaExiste(catalogo));
} 


//---------- Eventos del Modal de la lista ya existente del catálogo contable ----------
const eventoAbrirModalCase = () => setMostrarCatalogoContable(true);
const eventoCerrarModalCase = () => setMostrarCatalogoContable(false);

const rellenarFormato = () => {
  const cuentaSegments = catalogo.Cuenta ? catalogo.Cuenta.replace(/\s/g, '0').split('-') : [];
  const paddedValue = formato
    .split('-')
    .map((segment, index) => {
      const currentValue = cuentaSegments[index] || '';
      return currentValue.padEnd(segment.length, '0').substring(0, segment.length);
    })
    .join('-');
  // Actualizar el estado con el nuevo valor formateado y establecer el input como enfocado
  setCatalogo({ ...catalogo, Cuenta: paddedValue });
  setErrores(validarCuentaExiste({ ...catalogo, Cuenta: paddedValue}));
};


//---------- Metodo para crear un nuevo compañia pais ----------
const nuevo = (e) => {
  const token = AuthServices.getAuthToken();// Trae el token de local store
  if (!ValidaRestricciones.ValidarToken(token)) {return;}//valida el token
  setCargando(true);// Acá, llama o invoca el componente Loading Aleatorio, poniento la const en true

          // Verificar si hay errores en la combinación y si hay errores en la const errores
          if (Object.keys(errores).length !== 0 ) {
            setCargando(false);
            if(Object.keys(errores).length !== 0)ModalSuccess.modalCapturaDeWarning(errores.Nombre); // Modal para mostrar los errores capturados que devuelve el backend
            return;
          }

          var data = { // Le agrega todos los datos a la variable data
            IDContabilidad_Catalogo   : catalogo.IDContabilidad_Catalogo,
            IDOrigen                  : catalogo.IDOrigen ? catalogo.IDOrigen : 0,
            Cuenta                    : catalogo.Cuenta ? catalogo.Cuenta.replace(/-/g, '') : null,
            Permite_Sub_Cuentas       : catalogo.Permite_Sub_Cuentas,
            Nombre_Cuenta             : catalogo.Nombre_Cuenta ? catalogo.Nombre_Cuenta : null,
            Nombre_Idioma             : catalogo.Nombre_Idioma ? catalogo.Nombre_Idioma : null,
            Descripcion               : catalogo.Descripcion ? catalogo.Descripcion : null,
            Fecha_Ultimo_Movimiento   : catalogo.Fecha_Ultimo_Movimiento ? catalogo.Fecha_Ultimo_Movimiento : null,
            Requiere_Origen_Destino   : catalogo.Requiere_Origen_Destino,
            Requiere_Control_Presupuestario   : catalogo.Requiere_Control_Presupuestario,
            Permite_Transacciones     : catalogo.Permite_Transacciones,
            Visible                   : catalogo.Visible,
            IDCompania                : codigo_compania,
            IDContabilidad_Tipo_cuenta    : catalogo.IDContabilidad_Tipo_cuenta,
            IDContabilidad_Niveles        : catalogo.IDContabilidad_Niveles,
          };
          CatalogoServicios.setAuthToken(token);
          CatalogoServicios.create(data) // Invoca o llama el metodo create o registrar de servicios 
                .then(response => {
                  setValidacion(true);
                  setCargando(false);// Oculta el componente Loading Aleatorio poniendo la const en false
                  limpiaCampos();// Limpia todos los campos
                  ModalSuccess.modalSuccesscorrectamente("Se agregó correctamente el catalogo");// Modal para que muestre que se agregó correctamente
                })
                .catch(e => {
                  // Muestra los mensajes personalizados del backend
                  console.error(data);
                  setCargando(false); // Desactiva el componente de carga
                  ValidaRestricciones.capturaDeErrores(e);  
                });
            };



//----Método genérica para obtener listas para get o listar, Funcion o metodo generico para listar o get all
const getList = async (codigo_compania, servicio, setLista, servicioAux) => {
  const token = AuthServices.getAuthToken(); // Trae el token del local store
  if (!ValidaRestricciones.ValidarToken(token)) return; // Valida el token
  setCargando(true); // Muestra el componente Loading
  try {
    servicio.setAuthToken(token); // Le manda el token al encabezado de la consulta del endpoint
    const response = await (servicioAux ? servicioAux : servicio.getAll(codigo_compania)); // Invoca el método listar o el get de todo de servicios
    setLista(response.data); // Guarda lo que se devolvió del back-end en la variable que es un array
  } catch (e) {
    console.error(e);
  } finally {
    setCargando(false); // Oculta el componente Loading
  }
};

const getListTipo_cuenta = (codigo_compania) => getList(codigo_compania, TipoDeCuentaServicios, setListaDeTipo_cuenta);
const getListNiveles = (codigo_compania) => getList(codigo_compania, NivelesServicios, setListaDeNiveles);
const getListCatalogo = (codigo_compania) => getList(codigo_compania, CatalogoServicios, setListaDeCatalogo);


//----Método para validar algun campo y si ya existe una compañia paises
const validarCuentaExiste = (catalogo) => {
  let errores = {} // Se declara un objeto de errores, para ir almacenando los errores
  const cuentaSinGuiones = catalogo.Cuenta.replace(/-/g, '')
  listaDeCatalogo.forEach(listaCuenta => {// Se hace un forEach de la variable lista la cual es la respuesta el endpoind 
    if (listaCuenta.Cuenta === cuentaSinGuiones) {// Busca en la lista si existe ya  
      errores.Nombre = "La cuenta : " +listaCuenta.Cuenta_Formateada +" ya existe, digite otra diferente"; // Si ya existe el nombre en el array se guarda un mesnaje para mostrarlo como error
      errores.NombreCuenta = listaCuenta.Nombre_Cuenta
    } 
  })
  return errores; // Devuelve los errores 
}


//----Método para validar algun campo y si ya existe una compañia paises
const validarNombreDeCuentaExiste = (catalogo) => {
  let errores = {}; // Se declara un objeto de errores, para ir almacenando los errores
  const nombreCuenta = catalogo.Nombre_Cuenta.toUpperCase(); // Convertir nombre de la cuenta a mayúsculas

  listaDeCatalogo.forEach(listaCuenta => { // Se hace un forEach de la variable lista la cual es la respuesta del endpoint
    const nombreListaCuenta = listaCuenta.Nombre_Cuenta.toUpperCase(); // Convertir nombre de la cuenta de la lista a mayúsculas
    if (nombreListaCuenta === nombreCuenta) { // Busca en la lista si existe ya
      errores.Nombre = "Ya existe una cuenta con este nombre, la cuenta es: " + listaCuenta.Cuenta_Formateada; // Si ya existe el nombre en el array se guarda un mensaje para mostrarlo como error
    }
  });

  return errores; // Devuelve los errores
};


//Limpia todos los campos si se guarda los datos bien
const limpiaCampos = () => {
  setCatalogo(InicializaCatalogo);
  setValidacion(false);
  setCargando(false);// Oculta el componente Loading Aleatorio poniendo la const en false
  setSelectedCuenta('')
}


// Renderiza la página y hace el get de listar 
useEffect(() => {
  const codigoCompaniaAuth = parseInt(AuthServices.getCodigoCompania());
  getListCatalogo(codigoCompaniaAuth);// Invoca o llama el metodo listar cada ves que se renderiza la página, esto lo hace solo 1 ves
  getListTipo_cuenta(codigoCompaniaAuth);// Invoca o llama el metodo listar cada ves que se renderiza la página, esto lo hace solo 1 ves 
  getListNiveles(codigoCompaniaAuth);// Invoca o llama el metodo listar cada ves que se renderiza la página, esto lo hace solo 1 ves 
  setCodigo_compania(codigoCompaniaAuth);
  if (validacion) limpiaCampos();
// eslint-disable-next-line
}, [validacion]); 

//Son las propiedades a formulario
const propsParaFormulario = {
  manejoCambioImput,
  nuevo,
  catalogo,
  setCatalogo,
  idFormulario,
  formato,
  rellenarFormato,
  obtenerFecha,
  manejoImputValidacionExistente,
  errores,
  mostrarCatalogoContable,
  listaDeCatalogo,
  eventoCerrarModalCase,
  eventoAbrirModalCase,
  selectedCuenta, 
  setSelectedCuenta,
  validarCuentaExiste,
  setErrores,
  erroresNombre_Cuenta,
  eventoCambioDeSelect,
  propsTipo_cuenta,
  valorTipo_cuenta,
  propsNiveles,
  valorNiveles,
  listaDeTipo_cuenta,
  listaDeNiveles,
};

  return (  
    <>

    <button style={{marginTop:"5rem", marginBottom:"-5rem"}} onClick={limpiaCampos}>limpiar campos</button>
      {/*Invoca al formulario y le pasa propiedades*/}
      <FormularioCatalogo  {...propsParaFormulario}/>

      {/*Muestra el Loading aleatorio con colores aleatorios y el SVG de New Impact */}
      <LoadingAleatorio mostrar={cargando}/>
    </>
    )
}

export default CatalogoNuevo;