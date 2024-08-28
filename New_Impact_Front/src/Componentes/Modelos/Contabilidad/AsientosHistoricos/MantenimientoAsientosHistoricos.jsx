import React, { useEffect, useState } from 'react';
import {useNavigate, useParams} from 'react-router-dom';
import AuthServices from '../../../../Servicios/AuthServices';
import AsientosHistoricosServicios from '../../../../Servicios/ContabilidadServicios/AsientosHistoricosServicios';
import ContenedorTabla  from '../../../Componentes/DataTable/ContenedorTabla';
import ValidaRestricciones from '../../../../Hooks/ValidaRestricciones';
import LoadingAleatorio from "../../../Componentes/Loading/LoadingAleatorio";
import ModalForm from "../../../Componentes/Modales/ModalesPersonalizados/ModalForm"
import CalendarioFormulario from '../../../Componentes/TextField/CalendarioFormulario';
import obtenerContabilidadConfiguracion from "../../../../Hooks/ContabilidadConfiguracion";
import ModalSuccess from "../../../Componentes/Modales/ModalesSweetalert2/ModalSuccess"

const MantenimientoAsientosHistoricos = () => {
  const { idFormulario } = useParams(); //es el id del formulario para buscar las restricciones 

  const InicializaAsientoModificado = {
    IDCompania: null,
    id_referencia: null,
    Fecha_Asiento: "",  
  }
  
  const [asientoModificado, setAsientoModificado] = useState(InicializaAsientoModificado);

  const [asientosHistoricos, setAsientosHistoricos] = useState([]);
  const [mostarModal, setMostarModal] = useState(false);
  const [mostarModalErrores, setMostarModalErrores] = useState(false);
  const [seleccionadosEliminados, setSeleccionadosEliminados] = useState([]);
  const [mensajeText, setMensajeText] = useState("");
  const [validarEliminar, setValidarEliminar] =  useState(false)
  const [encabezados, setEncabezados] = useState([])
  const [datos, setDatos] = useState([]);
  const [sinPermisos, setSinPermisos] = useState(false);  
  const [restricciones, setRestricciones] = useState([]);
  const [columnasNoVisibles, setColumnasNoVisibles] = useState([]);
  const [datosCompleto, setDatosCompleto] = useState([]);
  const [cargando, setCargando] = useState(false);//Muestra o no el Loading
  const [codigo_compania, setCodigo_compania] = useState(0);
  const compania = AuthServices.getCompaniaActual();//Se trae la compania actualmente conectada
  const simboloLocalDeMoneda = compania?.IDPais?.Simbolo_Moneda || '₡'; // 
  const [simboloDeModenada, setSimboloDeModenada] = useState(simboloLocalDeMoneda);
  const [abrirDublicados, setAbrirDublicados] = useState(false);
  const [error, setError] = useState(null);
  const simboloDeModenadaExtranjero = "$";
  const esParaAsiento = true;//Se utiliza porque no es posible buscar el registro únicamente por el ID.
  const navigate = useNavigate();// Para pasar a un link
  const rutaNuevo = `/${idFormulario}`;//La ruta para el formulario de agregar un nuevo registro
  const tituloPagina = "Asientos historicos contables";
  const rutaEditar = `/AsientosHistoricosEditar/${seleccionadosEliminados}/${idFormulario}`;//La ruta para el formulario de editar un registro
  const moduloEditar = "AsientosHistoricosEditar"

  //Eventos para abrir el modal o visor para dublicar
  const eventoAbrirDublicados = () => {
    setError(null)
    setAbrirDublicados(true);
  }
  const eventoCerrarDublicados = () =>  setAbrirDublicados(false);


  useEffect(()=>{
    const codigo_companiaAuth = AuthServices.getCodigoCompania();//Trae el código de la compañía que está guardado en el local Stores
    const compania = AuthServices.getCompaniaActual();//Se trae la compania actualmente conectada
    if (codigo_companiaAuth){
      setCodigo_compania(codigo_companiaAuth);//Valida que no venga vacio
      setAsientoModificado(prevAsiento => ({ ...prevAsiento, IDCompania: codigo_companiaAuth }));
    } 
    if (compania) setSimboloDeModenada(compania.IDPais.Simbolo_Moneda);//Valida que no venga vacio
  },[])


//Sé validan las restricciones cada vez que se refresca la página o se cambia el idFormulario
useEffect(() => {
   const obtenerRestricciones = async () => {
    try {
      const data = await ValidaRestricciones.validar(idFormulario, codigo_compania);
      setRestricciones(data);// La constante restricciones guarda lo que devuelve el hook, en este caso las restricciones que es un array
      setSinPermisos(false);// Tiene acceso a este formulario
          const nombresRestringidos = data.formulario.campos // Filtrar solo los campos con restricción "Novisible"
              .filter(campo => campo.restriccion_field === "Novisible")
              .map(campo => campo.nombre);
          setColumnasNoVisibles(nombresRestringidos);// Lenar el array con solo los nombres o campos restringidos
    }catch (e) {
      setSinPermisos(true);// No Tiene acceso a este formulario, y muestra un mensaje de sin acceso autorizado.
    }
  };

    if(codigo_compania)obtenerRestricciones();//Valida que haya un codigo_compania
}, [idFormulario, codigo_compania]);


//Evento para get o listar 
const getLista = (codigo_compania) => {
  const token = AuthServices.getAuthToken();// Trae el token de local store
  if (!ValidaRestricciones.ValidarToken(token)) return;//valida el token
  setCargando(true);// Acá, llama o invoca el componente Loading Aleatorio, poniento la const en true
  
  AsientosHistoricosServicios.setAuthToken(token); // Le manda el token al encabezado de la consulta del endpoind
  AsientosHistoricosServicios.getGroupList(codigo_compania) // Invoca o llama el metodo listar o el get de todo de servicios  
      .then(response => {
        setAsientosHistoricos(response.data); // Guarda lo que se devolvió del back-end en la variable que es un array
        setCargando(false);// Oculta el componente Loading Aleatorio poniendo la const en false
      })
      .catch(e => {
        setCargando(false);// Oculta el componente Loading Aleatorio poniendo la const en false
        console.error(e)
        //ValidaRestricciones.capturaDeErrores(e);//Valida y devulve los errores del back end
      });
};


// Renderiza el método getLista, cada vez que se entra a la página
useEffect(() => {
  if(codigo_compania) getLista(codigo_compania) // Llama el metodo  getLista
}, [codigo_compania]);// Observa estas variables y cada que tengan un cambio realizará el useEffect seleccionadosEliminados


//Evento para cuando se cancela el eliminar en el modal
const eventoCancelar = () => {
  setValidarEliminar(false);// Para controlar el mensaje del modal al tener varios seleccionados y le da eliminar al boton del registro
  setMostarModal(false);
};
 

// Función para cerrar el modal de errores
const handleCloseModalErrores = () =>  setMostarModalErrores(false);


// Evento para manejar todos los Checkboxs seleccionados al editar
const validaSeleccionadosEditar = (e) => {
  if(seleccionadosEliminados.length > 1 ){
    setMensajeText("¡Solo se puede editar un registro a la vez!")
    setMostarModalErrores(true)
  }else if(seleccionadosEliminados.length < 1 ){
    setMensajeText("¡Debes seleccionar un registro antes de continuar!")
    setMostarModalErrores(true)
  }else{
    navigate(rutaEditar) 
  }
};


// Evento para manejar todos los Checkboxs seleccionados al eliminar
const validaSeleccionadosEliminar = () => {
  if(seleccionadosEliminados.length > 0 ){// Si se seleccionar mas de un checkbox
    setMostarModal(true)// Muesta el modal para confirmar eliminar varios registro
  }else if(seleccionadosEliminados.length === 0){// Si no se selecciono ningun checkbox
     setMensajeText("¡Debes seleccionar un registro antes de continuar!")//Mensaje
    setMostarModalErrores(true)// Muesta el modal de error de que no se selecciono ningun registro
  }     
};
  

//Este es el encabezado completo sin restricciones.
const [encabezadosCompleto] = useState([
    { field: 'Codigo_Asiento',                headerName: 'Código de Asiento'},
    { field: 'Fecha_Asiento',                 headerName: 'Fecha del Asiento'},
    { field: 'Descripcion',                   headerName: 'Tipo de Asiento'},
    { field: 'Concepto',                      headerName: 'Concepto'},
    { field: 'Debito_Local',                  headerName: `Monto Local ${simboloDeModenada}`},
    { field: 'Debito_Extranjero',             headerName: `Monto Extranjero ${simboloDeModenadaExtranjero}`},
    { field: 'Usuario_Creador',               headerName: 'Usuario Creador'},
    { field: 'Mayorizado',                    headerName: 'Mayorizado'},
    { field: 'Automatico',                    headerName: 'Automático'},
    { field: 'Asiento_Modificado',            headerName: 'Asiento Modificado'},
    // Agrega más columnas según sea necesario
])


//Acá se modifica el encabezado, y los datos.
useEffect(() => {
  const encabezadosModificados = encabezadosCompleto.filter(encabezado => !columnasNoVisibles.includes(encabezado.field));
  setEncabezados(encabezadosModificados)// Se le manda el JSON con los encabezados modificados la const encabezados
}, [encabezadosCompleto, columnasNoVisibles]);


//Este es el JSON original con todos los datos y encabezados.simboloDeModenadaExtranjero
//Debe haber un campo llamado id, ya que Material UI lo utiliza en el grid. Sin este id, los filtros y la capacidad de respuesta de la paginación no funcionarán correctamente.
 useEffect(() => {
   const datosCompletoTemp = asientosHistoricos.map(objecto => ({
      id                          : objecto.IDReferencia,
      IDContabilidad_Asiento      : objecto.IDContabilidad_Asiento  ,
      Codigo_Asiento              : objecto.Codigo_Asiento  ,
      Concepto                    : objecto.Concepto  ,
      Fecha_Asiento               : objecto.Fecha_Asiento  ,     
      Fecha_Sistema               : objecto.Fecha_Sistema  ,    
      Debito_Local                : `${simboloDeModenada}${objecto.Debito_Local}`, 
      Credito_Local               : objecto.Credito_Local  ,
      Mayorizado                  : objecto.Mayorizado ? 'Sí' : 'No',
      Debito_Extranjero           : `${simboloDeModenadaExtranjero}${objecto.Debito_Extranjero}`, 
      Credito_Extranjero          : objecto.Credito_Extranjero  ,
      Detalle_Asiento             : objecto.Detalle_Asiento  ,     
      Asiento_Modificado          : objecto.Asiento_Modificado  ? 'Sí' : 'No',
      Usuario_Creador             : objecto.Usuario_Creador  ,   
      Observaciones               : objecto.Observaciones  ,   
      Automatico                  : objecto.Automatico  ? 'Automático' : 'Manual',
                  
      //Foreign Keys    
      Descripcion                 : objecto.Descripcion  ,
      IDContabilidad_Tipo_Asiento      : objecto.IDContabilidad_Tipo_Asiento  ,
      // Agrega más filas según sea necesario
  }));
  setDatosCompleto(datosCompletoTemp);// Guarda ese JSON en la const datosCompleto
}, [asientosHistoricos, simboloDeModenada]); 


//Acá se modifica el JSON original con todos los datos, a solo el JSON con los campos restringidos según el array columnasNoVisibles
useEffect(() => {
      const datosModificados = datosCompleto.map(datos => {
        const nuevosDatos = { ...datos };
        columnasNoVisibles.forEach(columna => delete nuevosDatos[columna]);
        return nuevosDatos;
      });
      setDatos(datosModificados);// Se le manda el JSON modificado de los datos a la const datos
}, [datosCompleto, columnasNoVisibles]);

//Evento que mustra el visor de fecha de asiento para duplicar el asiento
const abrirVisorDuplicarAsiento = (idDeFila)=>{
  eventoAbrirDublicados()
  if(idDeFila)setAsientoModificado(prevAsiento => ({ ...prevAsiento, id_referencia: idDeFila }));
}


//Si tiene opciones de menus se manda en este Array con sus onclic, icono, y nombre
const menuItems = [
  { text: 'Duplicar', icon: <i className="bi bi-copy"> </i>, onClick: abrirVisorDuplicarAsiento },
];


// Función genérica para manejar cambios en fechas, ademas valida el último cierre
const eventoObtenerFecha = async (date, field) => {
  if (!date || isNaN(date)){//Valida que la fecha no venga vacia
    setAsientoModificado(prevAsiento => ({ ...prevAsiento, [field]: null }));
    return;
  }

  const formattedDate = date.format('YYYY-MM-DD');
  const fechaCierre = await obtenerContabilidadConfiguracion.obtenerContabilidadConfiguracion();
  if (formattedDate <= fechaCierre[0].Ultimo_Cierre) {
    setAsientoModificado(prevAsiento => ({ ...prevAsiento, [field]: null }));
    setError("No se puede seleccionar una fecha anterior a la fecha del último cierre.")//Muestra el modal con el error en el modal de forms
  } else {
    setError(null)//No  muestra el modal con el error en el modal de forms
    setAsientoModificado(prevAsiento => ({ ...prevAsiento, [field]: formattedDate }));
  }
};

//Función o método para duplicar asientos históricos
const duplicarAsiento = async () => { 
  const token = AuthServices.getAuthToken(); // Trae el token del local store
  if (!ValidaRestricciones.ValidarToken(token)) return; // Valida el token
  if(!asientoModificado.Fecha_Asiento){ //Valida que la fecha no sea null o vacia
    setError("Seleccione una fecha válida.") 
    return 
  }

  setCargando(true); // Muestra el componente Loading

  try {
    AsientosHistoricosServicios.setAuthToken(token);
    await AsientosHistoricosServicios.duplicate(asientoModificado.IDCompania, asientoModificado.id_referencia, asientoModificado.Fecha_Asiento); // Invoca el endpoint del backend
    ModalSuccess.modalSuccesscorrectamente("Se duplico correctamente el asiento contable."); // Modal para que muestre que se modifico correctamente
  } catch (e) {
    ValidaRestricciones.capturaDeErrores(e); // Muestra los mensajes personalizados del backend
  } finally {
    setError(null)
    eventoCerrarDublicados();//Cierra el visor o modal de duplicar asientos
    setCargando(false); // Oculta el componente Loading poniendo la const en false
  }
};


//Son las propiedades a formulario o grid, ademas si se va agregar otra propiedad se tiene que agregar donde se llama DataTable en contenedorTabla
const propsParaDataTable = {
  datos, 
  encabezados,
  setSeleccionadosEliminados,
  seleccionadosEliminados,
  setValidarEliminar,
  idFormulario,
  restricciones,
  moduloEditar,
  esParaAsiento,
  menuItems,
};
 

return (
  <>
  {/*Propiedades que se le pasa al componente <ContenedorTabla*/}
    <ContenedorTabla
        ObjetoMapeado={asientosHistoricos}
        rutaNuevo={rutaNuevo}
        tituloPagina={tituloPagina}
        validaSeleccionadosEliminar={validaSeleccionadosEliminar}
        validaSeleccionadosEditar={validaSeleccionadosEditar}
        propsParaDataTable={propsParaDataTable}
        seleccionadosEliminados={seleccionadosEliminados}
        eventoCancelar={eventoCancelar}
        mostarModal={mostarModal}
        mensajeText={mensajeText}
        mostarModalErrores={mostarModalErrores}
        handleCloseModalErrores={handleCloseModalErrores}
        validarEliminar={validarEliminar}
        idFormulario={idFormulario}
        sinPermisos={sinPermisos}
        restricciones={restricciones}
        sinBotones={true}
    />


  {/*Visor o madal que muestra la fecha del asiento cuando se va a duplicar*/}
    <ModalForm 
      handleClose={eventoCerrarDublicados}
      open={abrirDublicados}
      dialogTitle={"Duplicar Asiento Contable"} 
      dialogContentText={"Ingrese la fecha del asiento contable que desea duplicar. La fecha seleccionada no puede ser anterior al último cierre."} 
      typeButton={"succes"} 
      ButtonText={"Duplicar"} 
      onSubmit={duplicarAsiento}
      disableBackdropClick={true}//Esta prop evita que se cierra la ventana al hacerle clic afuera de el
      restricciones = {restricciones}
      cuerpo={
      <>
        {/*Campo Fecha_Asiento */}
        <CalendarioFormulario
          classe={"col-auto position-relative"}
          titlelabel={"Ejemplo de la Fecha del Asiento :"}
          id={"Fecha_Asiento"}
          name={"Fecha_Asiento"}
          nombreLabel={"Fecha del Asiento"}
          value={asientoModificado.Fecha_Asiento}
          onChange={(date) => eventoObtenerFecha(date, "Fecha_Asiento")}
          restricciones={restricciones}
          editarONuevo={true}
          required = {true}
          errores={error}
        />  
    </>} 
  />


  {/*Muestra el Loading aleatorio con colores aleatorios y el SVG de New Impact*/}
  <LoadingAleatorio mostrar={cargando}/>


 </>
  );}

export default MantenimientoAsientosHistoricos;