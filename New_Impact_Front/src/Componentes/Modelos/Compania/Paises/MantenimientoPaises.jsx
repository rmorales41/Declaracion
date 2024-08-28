import React, { useEffect, useState } from 'react';
import {useNavigate, useParams} from 'react-router-dom';
import AuthServices from '../../../../Servicios/AuthServices';
import CompaniaPaisesServicios from '../../../../Servicios/ConpaniaServicios/CompaniaPaisesServicios';
import ContenedorTabla  from '../../../Componentes/DataTable/ContenedorTabla';
import ValidaRestricciones from '../../../../Hooks/ValidaRestricciones';
import LoadingAleatorio from "../../../Componentes/Loading/LoadingAleatorio";

const MantenimientoPaises = () => {
  const { idFormulario } = useParams(); //es el id del formulario para buscar las restricciones 

  const [compania_Paises, setCompania_Paises] = useState([]);
  const [mostarModal, setMostarModal] = useState(false);
  const [mostarModalErrores, setMostarModalErrores] = useState(false);
  const [eliminar, setEliminar] = useState(null);
  const [eliminarSeleccionados, setEliminarSeleccionados] = useState(null);
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
  
  const navigate = useNavigate();// Para pasar a un link
  const rutaNuevo = `/PaisesNuevo/${idFormulario}`
  const tituloPagina = "Códigos de Áreas"
  const moduloEditar = "PaisesEditar"

  //Sé validan las restricciones cada vez que se refresca la página o se cambia el idFormulario
  useEffect(() => {
    const obtenerRestricciones = async () => {
      try {
        const codigo_compania = AuthServices.getCodigoCompania(); // Obtenemos el código cada vez que se ejecute el efecto
        const data = await ValidaRestricciones.validar(idFormulario, codigo_compania);
        setRestricciones(data);// La constante restricciones guarda lo que devuelve el hook, en este caso las restricciones que es un array
        setSinPermisos(false);// Tiene acceso a este formulario
            const nombresRestringidos = data.formulario.campos // Filtrar solo los campos con restricción "Novisible"
                .filter(campo => campo.restriccion_field === "Novisible")
                .map(campo => campo.nombre);
            setColumnasNoVisibles(nombresRestringidos);// Lenar el array con solo los nombres o campos restringidos
      } catch (error) {
        console.error(error);
        setSinPermisos(true);// No Tiene acceso a este formulario, y muestra un mensaje de sin acceso autorizado.
      }
    };
    
    obtenerRestricciones();
  }, [idFormulario]);

 //Evento para get o listar 
const getLista = () => {
  const token = AuthServices.getAuthToken();// Trae el token de local store
  if (!ValidaRestricciones.ValidarToken(token)) return;//valida el token
  setCargando(true);// Acá, llama o invoca el componente Loading Aleatorio, poniento la const en true
  
  CompaniaPaisesServicios.setAuthToken(token); // Le manda el token al encabezado de la consulta del endpoind
  CompaniaPaisesServicios.getAll() // Invoca o llama el metodo listar o el get de todo de servicios  
      .then(response => {
        setCompania_Paises(response.data); // Guarda lo que se devolvió del back-end en la variable que es un array
        setCargando(false);// Oculta el componente Loading Aleatorio poniendo la const en false
      })
      .catch(e => {
        setCargando(false);// Oculta el componente Loading Aleatorio poniendo la const en false
        //ValidaRestricciones.capturaDeErrores(e);//Valida y devulve los errores del back end
        console.error(e)
      });
};

// Renderiza el método getLista, cada vez que se entra a la página
useEffect(() => {
  getLista()// Llama el metodo  getLista
}, []);

//Evento para cuando se confirma el eliminar en el modal
const eventoConfirmar = () => {//si la variable eliminar no es null invoca el metodo eliminar
  if(eliminar) {
     remove(eliminar); // Invoca el metodo eliminar
     setEliminar(null); // Limpiar el estado después de confirmar
  }
  if(eliminarSeleccionados) {
    EliminarPaisesCheck(eliminarSeleccionados); // Invoca el metodo eliminar
    setEliminarSeleccionados(null); // Limpiar el estado después de confirmar
  }
  setMostarModal(false);  //Oculta el modal
};

  //Evento para cuando se cancela el eliminar en el modal
  const eventoCancelar = () => {
    setValidarEliminar(false);// Para controlar el mensaje del modal al tener varios seleccionados y le da eliminar al boton del registro
    setMostarModal(false);
  };
 
  //Evento para revome o eliminar las Compañias Paises 
  const remove = (IDPais) => {
    const token = AuthServices.getAuthToken()// Trae el token que se gurdo en el localStores cuando se logueo
    if (!ValidaRestricciones.ValidarToken(token)) {return;}//valida el token
    setCargando(true)// Acá, llama o invoca el componente Loading Aleatorio, poniento la const en true

         CompaniaPaisesServicios.setAuthToken(token);
         CompaniaPaisesServicios.remove(IDPais)//Invoca el endpoid de elimanar o remove del back end
              .then((response) => {
                getLista();
                setCargando(false);// Oculta el componente Loading Aleatorio poniendo la const en false
              })
              .catch(e => {
                setCargando(false);// Oculta el componente Loading Aleatorio poniendo la const en false 
                ValidaRestricciones.capturaDeErrores(e);       
          });
  };

  // Función para cerrar el modal de errores
  const handleCloseModalErrores = () => {
    setMostarModalErrores(false);
  };

  // Evento para manejar todos los Checkboxs seleccionados al editar
  const validaSeleccionadosEditar = (e) => {
    if(seleccionadosEliminados.length > 1 ){
      setMensajeText("¡Solo se puede editar un registro a la vez!")
      setMostarModalErrores(true)
    }else if(seleccionadosEliminados.length < 1 ){
      setMensajeText("¡Debes seleccionar un registro antes de continuar!")
      setMostarModalErrores(true)
    }else{
      navigate(`/PaisesEditar/${seleccionadosEliminados}/${idFormulario}`) 
    }
  };

  // Evento para manejar todos los Checkboxs seleccionados al elimiar
  const validaSeleccionadosEliminar = () => {
    if(seleccionadosEliminados.length > 0 ){// Si se seleccionar mas de un checkbox
      setEliminarSeleccionados(seleccionadosEliminados)// Invoca el eliminar varias compañias
      setMostarModal(true)// Muesta el modal para confirmar eliminar varios registro
    }else if(seleccionadosEliminados.length === 0){// Si no se selecciono ningun checkbox
      setMensajeText("¡Debes seleccionar un registro antes de continuar!")//Mensaje
      setMostarModalErrores(true)// Muesta el modal de error de que no se selecciono ningun registro
    }     
  };

 // Evento para revome o eliminar las Compañias Paises
 const EliminarPaisesCheck = (seleccionadosEliminados) => {
    const token = AuthServices.getAuthToken()// Trae el token que se gurdo en el localStores cuando se logueo
    if (!ValidaRestricciones.ValidarToken(token)) {return;}//valida el token
    setCargando(true)// Acá, llama o invoca el componente Loading Aleatorio, poniento la const en true

      CompaniaPaisesServicios.setAuthToken(token);
        var data = {ids: seleccionadosEliminados} // Crea un objeto con los IDs de las compañías seleccionadas
        CompaniaPaisesServicios.EliminarPaisesCheck(data)// Invoca el endpoid de elimanar o remove del back end
              .then((response) => {
              setSeleccionadosEliminados([])
              getLista();
              setCargando(false)// Oculta el componente Loading Aleatorio poniendo la const en false
              })
              .catch(e => {
              setCargando(false)// Oculta el componente Loading Aleatorio poniendo la const en false
              ValidaRestricciones.capturaDeErrores(e);               
          });
   
  };

  //Manejo del evento eliminar
  const eventoClickEliminar = (idEliminar) => {
    setEliminar(idEliminar)
    setMostarModal(true)
  }
  
  //Este es el encabezado completo sin restricciones.
  const [encabezadosCompleto] = useState([
    { field: 'Nombre', headerName: 'Nombre'},
    { field: 'Codigo_Area', headerName: 'Código de Área'},
    { field: 'Abreviatura', headerName: 'Abreviatura'},
    { field: 'Simbolo_Moneda', headerName: 'Símbolo de Moneda'},
    { field: 'Nombre_Moneda', headerName: 'Nombre de la Moneda'},
    { field: 'Compania_Idioma', headerName: 'Idioma '},
    { field: 'Moneda_Base_Comparacion', headerName: 'Moneda base de comparación'},
    { field: 'Url_Banco_Central', headerName: 'URL del Banco Central'},
    { field: 'Usuario_Conexion_BC', headerName: 'Usuario de conexión BC'},
    { field: 'Clave_Conexion_Bc', headerName: 'Clave de Conexión BC'},
    { field: 'Correo_Conexion', headerName: 'Correo de Conexión'},
    { field: 'ISO', headerName: 'ISO '},
    { field: 'Observaciones', headerName: 'Observación'},
    // Agrega más columnas según sea necesario
  ])

  //Acá se modifica el encabezado, y los datos.
  useEffect(() => {
    const encabezadosModificados = encabezadosCompleto.filter(encabezado => !columnasNoVisibles.includes(encabezado.field));
    setEncabezados(encabezadosModificados)// Se le manda el JSON con los encabezados modificados la const encabezados
  }, [encabezadosCompleto, columnasNoVisibles]);

  //Este es el JSON original con todos los datos y encabezados.
  useEffect(() => {
    const datosCompletoTemp = compania_Paises.map(compania => ({
      id: compania.IDPais ,
      Nombre: compania.Nombre,
      Codigo_Area: compania.Codigo_Area,
      Abreviatura: compania.Abreviatura,
      Simbolo_Moneda: compania.Simbolo_Moneda,
      Nombre_Moneda: compania.Nombre_Moneda,
      Compania_Idioma: compania.Compania_Idioma.Descripcion,
      Moneda_Base_Comparacion: compania.Moneda_Base_Comparacion,
      Url_Banco_Central: compania.Url_Banco_Central,
      Usuario_Conexion_BC: compania.Usuario_Conexion_BC,
      Clave_Conexion_Bc: compania.Clave_Conexion_Bc,
      Correo_Conexion: compania.Correo_Conexion,
      ISO: compania.ISO,
      Observaciones: compania.Observaciones,
      // Agrega más campos según sea necesario
    }));
    setDatosCompleto(datosCompletoTemp);// Guarda ese JSON en la const datosCompleto
  }, [compania_Paises]); 

  //Acá se modifica el JSON original con todos los datos, a solo el JSON con los campos restringidos según el array columnasNoVisibles
  useEffect(() => {
      const datosModificados = datosCompleto.map(datos => {
        const nuevosDatos = { ...datos };
        columnasNoVisibles.forEach(columna => delete nuevosDatos[columna]);
        return nuevosDatos;
      });
      setDatos(datosModificados);// Se le manda el JSON modificado de los datos a la const datos
  }, [datosCompleto, columnasNoVisibles]);

  //Son las propiedades a formulario
  const propsParaDataTable = {
    datos, 
    encabezados,
    eventoClickEliminar,
    setSeleccionadosEliminados,
    seleccionadosEliminados,
    setValidarEliminar,
    idFormulario,
    restricciones,
    moduloEditar,
  };


return (
  <>
   {/*Propiedades que se le pasa al componente <ContenedorTabla />*/}
  <ContenedorTabla
     ObjetoMapeado={compania_Paises}
     rutaNuevo={rutaNuevo}
     tituloPagina={tituloPagina}
     compania_Paises={compania_Paises}
     validaSeleccionadosEliminar={validaSeleccionadosEliminar}
     validaSeleccionadosEditar={validaSeleccionadosEditar}
     propsParaDataTable={propsParaDataTable}
     seleccionadosEliminados={seleccionadosEliminados}
     eventoConfirmar={eventoConfirmar}
     eventoCancelar={eventoCancelar}
     mostarModal={mostarModal}
     mensajeText={mensajeText}
     mostarModalErrores={mostarModalErrores}
     handleCloseModalErrores={handleCloseModalErrores}
     validarEliminar={validarEliminar}
     idFormulario={idFormulario}
     sinPermisos={sinPermisos}
     restricciones={restricciones}
  />

  {/*Muestra el Loading aleatorio con colores aleatorios y el SVG de New Impact*/}
  <LoadingAleatorio mostrar={cargando}/>
  </>
  );}

export default MantenimientoPaises;