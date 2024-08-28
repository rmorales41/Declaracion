import React, { useEffect, useState } from "react";
import { useParams} from "react-router-dom";
import AuthServices from '../../../../Servicios/AuthServices';
import CatalogoServicios from '../../../../Servicios/ContabilidadServicios/CatalogoServicios';
import FormularioCatalogo from "./FormularioCatalogo";
import ModalConfirmar from '../../../Componentes/Modales/ModalesSweetalert2/ModalConfirmar';
import LoadingAleatorio from "../../../Componentes/Loading/LoadingAleatorio";
import EventoManejoInputFormato from "../../../../Hooks/EventoManejoInputFormato"
import TipoDeCuentaServicios from "../../../../Servicios/ContabilidadServicios/TipoCuentaServicios"
import NivelesServicios from "../../../../Servicios/ContabilidadServicios/NivelesServicios";
import dayjs from 'dayjs';
import ValidaRestricciones from "../../../../Hooks/ValidaRestricciones"

const CatalogoEditar = () => {
  const { Id, idFormulario } = useParams(); //es el id de companiaPaises

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
  const [actualizar, setActualizar] = useState(null);
  const [mostarModal, setMostarModal] = useState(false); 
  const [errores, setErrores] = useState({});
  const [cargando, setCargando] = useState(false);//Muestra o no el Loading
  const [formato, setFormato ]= useState("");//Formato de la cuenta ejemplo: xxxx-xxxx-xxx-xx
  const [erroresNombre_Cuenta, setErroresNombre_Cuenta] = useState({});//Guarda los diferentes mensajes de errores

  const [listaDeNiveles, setListaDeNiveles] = useState([]);
  const [listaDeCatalogo, setListaDeCatalogo] = useState([]);
  const [listaDeTipo_cuenta, setListaDeTipo_cuenta] = useState([]);
  const [selectedCuenta, setSelectedCuenta] = useState('');
  const [existenteOriginal, setExistenteOriginal] = useState("")

// Renderiza la página y hace el get de listar 
useEffect(() => {
  const codigoCompaniaAuth = parseInt(AuthServices.getCodigoCompania());
  setCatalogo({ ...catalogo, IDCompania: codigoCompaniaAuth});
  if (Id) {
    buscarPor(Id, codigoCompaniaAuth);//Realiza el metodo buscarPor id
    getListTipo_cuenta(codigoCompaniaAuth);// Invoca o llama el metodo listar cada ves que se renderiza la página, esto lo hace solo 1 ves 
    getListNiveles(codigoCompaniaAuth);// Invoca o llama el metodo listar cada ves que se renderiza la página, esto lo hace solo 1 ves 
    getListCatalogo(codigoCompaniaAuth);
  }
// eslint-disable-next-line
}, []); 

//Invoca el hook que tiene una funcio para trae solo el formato que se va usar en il input de Cuenta
useEffect(()=>{
  const cargarFormato = async () => {
    try { 
      const { formato } = await EventoManejoInputFormato.obtenerFormato();
      setFormato(formato);
    } catch (error) {
      console.error("Error cargarFormato : ", error);
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

//---------- Maneja los cambios del input de formatos ----------
const manejoImputFormato= (event) => {
  setSelectedCuenta("")
  const { name, formattedValue } = EventoManejoInputFormato.eventoInputFormato(event, formato);
  setCatalogo({ ...catalogo, [name]: formattedValue });
};

//---------- Maneja los cambios del input de del calendario para obtener la fecha ----------
const obtenerFecha = (date) => {
  const fechaFormateada = date.format('YYYY-MM-DD');
  setCatalogo({ ...catalogo, Fecha_Ultimo_Movimiento: fechaFormateada});
};

//---------- Maneja los cambios del input del campo Cuenta, para saber si ya existe ----------
const manejoImputValidacionExistente = event => {
  manejoImputFormato(event);
  setErrores(validarCuentaExiste(catalogo));
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


//---------- Metodo para buscar por id ----------
const buscarPor = (id, codigo_compania) => {
  const token = AuthServices.getAuthToken(); // Trae el token de local store
  if (!ValidaRestricciones.ValidarToken(token)) {return;}//valida el token
  setCargando(true); // Acá, llama o invoca el componente Loading Aleatorio, poniendo la const en true

    CatalogoServicios.setAuthToken(token);
    CatalogoServicios.findBy(id, codigo_compania) // Invoca el endpoint del backend 
      .then(response => {
        setCatalogo(prevCatalogo => ({
          ...prevCatalogo,
          ...response.data,
          IDContabilidad_Niveles: response.data.IDContabilidad_Niveles ? response.data.IDContabilidad_Niveles.IDContabilidad_Niveles : null,
          IDContabilidad_Tipo_cuenta: response.data.IDContabilidad_Tipo_cuenta ? response.data.IDContabilidad_Tipo_cuenta.IDContabilidad_Tipo_cuenta : null,
          Cuenta: response.data.Cuenta_Formateada // Asigna Cuenta_Formateada a Cuenta
        }));
        setCargando(false); // Oculta el componente Loading Aleatorio poniendo la const en false
        setExistenteOriginal(response.data.Nombre_Cuenta)
      })
      .catch(e => {
        setCargando(false); // Oculta el componente Loading Aleatorio poniendo la const en false
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


//Evento para cuando se confirma el eliminar en el modal
const eventoConfirmar = () => {
  if(actualizar)modificar();//Invoca o llama el metodo modificar
  setMostarModal(false);// Limpiar el estado después de confirmar
};

//Evento para cuando se cancela el editar en el modal
const eventoCancelar = () => {
  setMostarModal(false);
};

  //---------- Metodo para editar o modificar ----------
const modificar = () => {
  const token = AuthServices.getAuthToken(); //Trae el token de local store
  if (!ValidaRestricciones.ValidarToken(token)) {return;}//valida el token
  setCargando(true);// Acá, llama o invoca el componente Loading Aleatorio, poniento la const en true

  const data = {
    IDContabilidad_Catalogo: catalogo.IDContabilidad_Catalogo,
    IDOrigen: catalogo.IDOrigen,
    Cuenta: catalogo.Cuenta.replace(/-/g, ''),
    Permite_Sub_Cuentas: catalogo.Permite_Sub_Cuentas,
    Nombre_Cuenta: catalogo.Nombre_Cuenta,
    Nombre_Idioma: catalogo.Nombre_Idioma,
    Descripcion: catalogo.Descripcion,
    Fecha_Ultimo_Movimiento: dayjs(catalogo.Fecha_Ultimo_Movimiento).format('YYYY-MM-DD'),
    Requiere_Origen_Destino: catalogo.Requiere_Origen_Destino,
    Requiere_Control_Presupuestario: catalogo.Requiere_Control_Presupuestario,
    Permite_Transacciones: catalogo.Permite_Transacciones,
    Visible: catalogo.Visible,
    IDCompania: catalogo.IDCompania.IDCompania,
    IDContabilidad_Tipo_cuenta: catalogo.IDContabilidad_Tipo_cuenta,
    IDContabilidad_Niveles: catalogo.IDContabilidad_Niveles
  };

    CatalogoServicios.setAuthToken(token);
    CatalogoServicios.update(catalogo.IDContabilidad_Catalogo, data)//Invoca el endpoid del backend 
              .then(response => {
                setCargando(false);// Oculta el componente Loading Aleatorio poniendo la const en false
              })
              .catch(e => {// Muestra los mensajes personalizados del backend
                console.error(data);
                setCargando(false); // Desactiva el componente de carga
                ValidaRestricciones.capturaDeErrores(e); 
              });
          };

//Invoca modal ModalConfirmar
const editar = () => {
  setActualizar(catalogo.IDContabilidad_Catalogo)
  setMostarModal(true)//Invoca el moda ModalConfirmar 
};

//----Método para validar algun campo y si ya existe una compañia paises
const validarCuentaExiste = (catalogo) => {
  let errores = {} // Se declara un objeto de errores, para ir almacenando los errores
  const cuentaSinGuiones = catalogo.Cuenta.replace(/-/g, '')
  listaDeCatalogo.forEach(listaCuenta => {// Se hace un forEach de la variable lista la cual es la respuesta el endpoind 
    if (listaCuenta.Cuenta === cuentaSinGuiones) {// Busca en la lista si existe ya  
      errores.Nombre = "Esta cuenta ya existe"; // Si ya existe el nombre en el array se guarda un mesnaje para mostrarlo como error
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
      if(existenteOriginal !== nombreCuenta)errores.Nombre = "Ya existe una cuenta con este nombre, la cuenta es: " + listaCuenta.Cuenta_Formateada; // Si ya existe el nombre en el array se guarda un mensaje para mostrarlo como error
    }
  });

  return errores; // Devuelve los errores
};


//Son las propiedades que se le va a pasar al formulario
const propsParaFormulario = {
  manejoCambioImput,
  editar,
  catalogo,
  setCatalogo,
  idFormulario,
  formato,
  obtenerFecha,
  manejoImputValidacionExistente,
  errores,
  listaDeCatalogo,
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

return(
  <>
   {/*Invoca al formulario y le pasa propiedades   */}
   <FormularioCatalogo  {...propsParaFormulario}/>

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

    {/*Muestra el Loading aleatorio con colores aleatorios y el SVG de New Impact     */}
    <LoadingAleatorio mostrar={cargando}/>
  </>
  );
};


export default CatalogoEditar;