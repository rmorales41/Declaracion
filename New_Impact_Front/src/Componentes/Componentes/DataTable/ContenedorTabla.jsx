import React, { useRef, useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import ModalConfirmar from '../Modales/ModalesSweetalert2/ModalConfirmar';
import ModalErrores from '../Modales/ModalesSweetalert2/ModalErrores';
import useTooltipCustom  from '../Tooltip/Tooltip';
import DataTable from './DataTable';
import { useGridApiRef } from '@mui/x-data-grid';
import * as XLSX from 'xlsx';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faFilePdf } from '@fortawesome/free-solid-svg-icons';
import { faFolderPlus } from '@fortawesome/free-solid-svg-icons';
import { jsPDF } from 'jspdf';
import 'jspdf-autotable';
import { RiFileExcel2Line } from "react-icons/ri";
import { FaFileDownload } from "react-icons/fa";
import './ContenedorTabla.css';
import { FiEdit } from "react-icons/fi";
import RestriccionesXFormularios from "../../../Servicios/UsuariosServicios/RestriccionesXFormularios"
import AuthServices from "../../../Servicios/AuthServices"
import LoadingAleatorio from "../Loading/LoadingAleatorio";
import ValidaRestricciones from '../../../Hooks/ValidaRestricciones';

const ContenedorTabla = (
  {rutaNuevo, 
  tituloPagina,  
  ObjetoMapeado,
  validaSeleccionadosEliminar, 
  validaSeleccionadosEditar, 
  propsParaDataTable, 
  seleccionadosEliminados, 
  eventoConfirmar, 
  eventoCancelar, 
  mostarModal, 
  mensajeText, 
  mostarModalErrores, 
  handleCloseModalErrores, 
  validarEliminar, 
  idFormulario,
  sinBotones,

  }
  ) => {
  const dataGridRef = useRef(null); // Referencia a la DataGrid, Para referenciar la tabla a exporta en el excel
  const apiRef = useGridApiRef();//Se referencia el datagrid
  const TooltipCustom = useTooltipCustom();// Para renderizar el componente useTooltipCustom
  const [sinPermisos, setSinPermisos] = useState(false);
  const [general, setGeneral] = useState(false);
  const [cargando, setCargando] = useState(false);//Muestra o no el Loading
  const [filterText, setFilterText] = React.useState('');

//Válida que el usuario tenga restricciones
  useEffect(() => {
    const restriccionesXFormularios = () => {
      const token = AuthServices.getAuthToken()// Trae el token que se gurdo en el localStores cuando se logueo
      const codigo_compania = AuthServices.getCodigoCompania();
      if (!ValidaRestricciones.ValidarToken(token)) {return;}//valida el token

        RestriccionesXFormularios.setAuthToken(token);
        RestriccionesXFormularios.getRestricciones(idFormulario, codigo_compania)
          .then(response => {
            const restriccionForm = response.data.formulario.restriccion_form;
            const restriccionEstado = {// Definir un objeto para mapear los valores de restricción a las funciones de estado
              "General": setGeneral,
            };
              if (restriccionEstado.hasOwnProperty(restriccionForm)) { // Verificar si el valor de restricción está en el objeto, y si es así, llamar a la función de estado correspondiente
                restriccionEstado[restriccionForm](true);
              } else { // Si el valor no está en el objeto, establecer todas las variables de estado en false
                setGeneral(false);
              }
            setSinPermisos(false)
          })
          .catch(e => {//try catch
            setSinPermisos(true)
            ValidaRestricciones.capturaDeErrores(e);
            
          });
     
    };
    restriccionesXFormularios();
  }, [idFormulario]);

// Función para descarga en Excel
  const descargarExcel = () => {
    setCargando(true)// Acá, llama o invoca el componente Loading Aleatorio, poniento la const en true
    const columnas = apiRef.current.exportState();
    const columnasNoVisibles = Object.keys(columnas.columns.columnVisibilityModel).filter(columna => columnas.columns.columnVisibilityModel[columna] === false);
    // Función para filtrar los datos del json dependiendo de los campos que estan visible en el datagrid
    const filtrarCampos = (objeto, camposNoVisibles, encabezados) => {
      const objetoFiltrado = {};
      for (const key in objeto) {
          if (key !== 'id' && !camposNoVisibles.includes(key)) {
              const nuevoEncabezado = encabezados.find(columna => columna.field === key);
              const nombreEncabezado = nuevoEncabezado ? nuevoEncabezado.headerName : key;
              objetoFiltrado[nombreEncabezado] = objeto[key];
          }
      }
      return objetoFiltrado;//Me devulve los datos que se vean en el datagrid o la tabla
    };
      
        const datosFiltrados = propsParaDataTable.datos.map(objeto =>  filtrarCampos(objeto, columnasNoVisibles, propsParaDataTable.encabezados));
        const worksheet = XLSX.utils.json_to_sheet(datosFiltrados);//Se crear una hoja de excel a partir de los datos filtrados
        const workbook = XLSX.utils.book_new();//Se crear un libro de trabajo
        XLSX.utils.book_append_sheet(workbook, worksheet, 'hoja 1');//Se agregar la hoja de cálculo al libro de trabajo
        const rango = XLSX.utils.decode_range(worksheet['!ref'])
        worksheet['!autofilter'] = { ref: XLSX.utils.encode_range(rango) }; // Configurar autofiltro en las columnas
        // Calcular el ancho máximo para los encabezados
        const columns = Object.keys(datosFiltrados[0]);
        const headerWidths = columns.map(col => ({wch: col.length }));
        // Calcular el ancho máximo para los datos
        const dataWidths = columns.map(col => ({wch: Math.max(...datosFiltrados.map(row => row[col] ? row[col].toString().length : 0))}));
        // Calcular el máximo entre los anchos de encabezados y datos
        const columnWidths = headerWidths.map((headerWidth, index) => ({ wch: Math.max(headerWidth.wch, dataWidths[index].wch) }));
        worksheet['!cols'] = columnWidths;// Realiza el autoFit al Excel o ajuste de ancho a las columnas
        setCargando(false)// Oculta el componente Loading Aleatorio poniendo la const en false
        XLSX.writeFile(workbook, tituloPagina + '.xlsx');// Escribir el libro de trabajo en un archivo y nombre del archivo
  };

// Función para descarga en Pdf
  const descargarPdf = ()=>{
    setCargando(true)// Acá, llama o invoca el componente Loading Aleatorio, poniento la const en true
    const columnas = apiRef.current.exportState();
    const columnasNoVisibles = Object.keys(columnas.columns.columnVisibilityModel).filter(columna => columnas.columns.columnVisibilityModel[columna] === false);
    // Función para filtrar los datos del json dependiendo de los campos que estan visible en el datagrid
    const filtrarCampos = (objeto, camposNoVisibles, encabezados) => {
      const objetoFiltrado = {};
      for (const key in objeto) {
          if (key !== 'id' && !camposNoVisibles.includes(key)) {
              const nuevoEncabezado = encabezados.find(columna => columna.field === key);
              const nombreEncabezado = nuevoEncabezado ? nuevoEncabezado.headerName : key;
              objetoFiltrado[nombreEncabezado] = objeto[key];
          }
      }
      return objetoFiltrado;//Me devulve los datos que se vean en el datagrid o la tabla
  };
        
      const nuevoJson = propsParaDataTable.datos.map(objeto =>  filtrarCampos(objeto, columnasNoVisibles, propsParaDataTable.encabezados));
       const doc = new jsPDF();
        doc.autoTable({
          head: [Object.keys(nuevoJson[0])],
          body: nuevoJson.map(obj => Object.values(obj))
        });
        setCargando(false)// Oculta el componente Loading Aleatorio poniendo la const en false
        doc.save(tituloPagina +'.pdf');
       
  }

//Evento para filtrar por todos los campos
const eventoFiltro = (event) => {
  setFilterText(event.target.value);
};
//Funcion  para filtrar por todos los campos
const filasFiltradas = propsParaDataTable.datos.filter((row) =>
  Object.values(row).some(
     (value) => value && value.toString().toLowerCase().includes(filterText.toLowerCase())
    )
);
  
  return (
    <div className="container_ContenedorTabla " > 
      {!sinPermisos ? (
      <>{/*Válida si la lista está vacía, si está vacía, muestra solo el botón de agregar o registrar*/}
        {ObjetoMapeado.length === 0 ? (
          <div className="sin_registros_Paises" >
              <i className="bi bi-info-circle sin_registros_info"> No se encuentra ningún Registro</i>
              {!sinBotones && (<>
                <Link className="btn btn-nuevo "
                    title="Clic para agregar o registrar un nuevo registro"
                    to={rutaNuevo }>
                    <i className="bi bi-plus-circle"> Registrar</i>
                </Link>
                </>)}
            </div>
            ) : ( 
            <>
              {/*Válida si la lista no está, vacía, muestra la otra vista*/}
              <div className="card text bg-light mb-3 " >
                <div className="card-header d-flex justify-content-between" >

                <div className="container-botones">

                    {/*Boton de nuevo */}
                    {!sinBotones && (
                      <div className="btns-opciones" >
                        <TooltipCustom title="Clic para agregar o registrar un nuevo registro"> 
                          <Link className="btn btn-nuevo btn-tablas"
                                to={rutaNuevo}>
                                <FontAwesomeIcon icon={faFolderPlus} />
                          </Link>
                        </TooltipCustom>
                      </div>
                    )}

                  
                    {/*Boton de eliminar con checks seleccionados*/}
                    {!sinBotones && (
                      <div className="btns-opciones">
                        <TooltipCustom title="Clic para eliminar todos los registros seleccionados"> 
                          <button className="btn btn-danger btn_eliminar_checks btn-tablas"
                            onClick={general ? validaSeleccionadosEliminar : undefined}
                            disabled={!general}>
                              <i className="bi bi-trash3"> </i>
                          </button>
                          </TooltipCustom>
                      </div>
                    )}

                    {/*Boton de editar con checks seleccionados*/}
                    <div className="btns-opciones">
                      <TooltipCustom  title="Clic para editar o modificar este registro"> 
                      <button className="btn btn-primary btn-tablas" 
                            onClick={ ()=>{validaSeleccionadosEditar()}}>
                            <FiEdit />
                      </button>
                      </TooltipCustom>
                    </div>

                    {/*Boton para ver las opciones de descarga.*/}
                      <div className="dropdown-center">
                      <TooltipCustom placement="top" title="Clic para ver las opciones de descarga">
                            <button className="btn btn-secondary " type="button" data-bs-toggle="dropdown">
                            <FaFileDownload />
                            </button>
                      </TooltipCustom>

                        {/*Opciones de descarga*/}
                        <ul className="dropdown-menu">
                          {/*Boton de exportar la tabla o datagrid a un excel <BsFiletypeXlsx/>*/}
                          <TooltipCustom placement="right" title="Clic para exportar a Excel todos los registros visibles">
                            <li>
                              <button className="dropdown-item " 
                                onClick={() => { descargarExcel() }}>  
                                <div className="exportar-text">
                                  <RiFileExcel2Line style={{fontSize:"17px"}} /> Exportar a Excel
                                </div>
                              </button>
                            </li>
                          </TooltipCustom>
                          
                          {/*Boton de exportar la tabla o datagrid a un pdf*/}
                          <TooltipCustom placement="right" title="Clic para exportar a Pdf todos los registros visibles"  >
                            <li>
                              <button title="Clic para exportar a Pdf todos los registros visibles" className="dropdown-item exportar-item" 
                                onClick={() => { descargarPdf() }}>
                                  <div className="exportar-text">
                                    <FontAwesomeIcon icon={faFilePdf} style={{fontSize:"17px"}}  /> Exportar a PDF
                                  </div>
                              </button>
                            </li>  
                          </TooltipCustom>              
                        </ul>
                      </div>

                </div>
                {/*Campo para filtra busqueda*/}
                  <div className="ml-auto d-flex flex-column">
                    <div className="input-group input-container">
                      <span className="input-group-text icon-span">
                        <i className="bi bi-search"></i>
                      </span>
                          
                      <input
                        title="Búsqueda en todos los encabezados de la tabla"
                        type="text"
                        className="form-control filtro flex-grow-1"
                        value={filterText}
                        onChange={eventoFiltro}
                        placeholder="Buscar..."
                      /> 
                    </div>
                          
                    {/*Si no encuentra nada manda mesaje de  No se encontró ningún país*/}
                    {filasFiltradas.length === 0 && (
                      <small className="errorSmall" id="helpId" style={{ marginTop: "1%" }}>
                        <i className="bi bi-exclamation-circle"> No se encontró ningún registro</i>
                      </small>
                    )}
                  </div>       
                </div>

                <div className="card-body ">
                <h3 className="h3_title">{tituloPagina}</h3>
                    <div className="table-responsive">
                      {/*Componente Tabla de registros*/}                
                      <DataTable
                        dataGridRef={dataGridRef}
                        apiRef={apiRef}
                        general={general}
                        datos={propsParaDataTable.datos} 
                        encabezados={propsParaDataTable.encabezados}  
                        eventoClickEliminar={propsParaDataTable.eventoClickEliminar}  
                        seleccionadosEliminados={propsParaDataTable.seleccionadosEliminados}  
                        setSeleccionadosEliminados={propsParaDataTable.setSeleccionadosEliminados} 
                        setValidarEliminar={propsParaDataTable.setValidarEliminar}  
                        idFormulario={propsParaDataTable.idFormulario}  
                        moduloEditar={propsParaDataTable.moduloEditar}  
                        props={propsParaDataTable}
                        filasFiltradas={filasFiltradas}
                        eventoFiltro={eventoFiltro}
                        menuItems={propsParaDataTable.menuItems}
                        eventoOnClicMenu={propsParaDataTable.eventoOnClicMenu}
                        sinBotones={sinBotones}
                      />
                      </div>
                </div>

                {/*Muestra el modal de sweetalert2 ModalConfirmar y le manda los mensajes por propiedades*/}
                {/*Si tiene mas de un check marcado muestra el modal con title y successText de varios eliminados*/}
                <ModalConfirmar
                    {...(seleccionadosEliminados.length > 1 ? (
                      validarEliminar === false? 
                        { title: `¿Estás seguro de eliminar ${seleccionadosEliminados.length} registros?` } 
                        :
                        { title: "¿Estás seguro de eliminar este registro?" }
                    ) :  
                    { title: "¿Estás seguro de eliminar este registro?" })}
                    text="¡No podrás revertir esta acción!"
                    icon="warning"
                    confirmButtonText="¡Sí, eliminar!"
                    cancelButtonText="No, cancelar!"
                    onConfirm={eventoConfirmar}
                    onCancel={eventoCancelar}
                    successTitle="¡Eliminado!"
                    {...(seleccionadosEliminados.length > 1 ? 
                      {successText : `Se eliminaron ${seleccionadosEliminados.length} registros correctamente.`} 
                      : 
                      {successText : "Se eliminó correctamente"})}
                    successIcon="success"
                    dismissTitle="Cancelado"
                    dismissText="No se eliminó ningún registro"
                    dismissIcon="error"
                    show={mostarModal}
                  /> 

                  <ModalErrores
                    text={mensajeText}
                    icon="warning"
                    show={mostarModalErrores}
                    onClose={handleCloseModalErrores} // Pasa la función de cierre
                  />

              </div>
            
            </>
          
      )}
      </>
      ):(
      <>{/*En el caso que no tenga permiso de ver del todo el formulario*/}
          <div className="sin_registros_Paises" >
              <i className="bi bi-info-circle sin_registros_info" style={{fontSize:"25px"}}>"Acceso denegado: No tienes permisos suficientes para acceder a este recurso."</i>
            </div>
      </>)}

    {/*Muestra el Loading aleatorio con colores aleatorios y el SVG de New Impact*/}
    <LoadingAleatorio mostrar={cargando}/>
  </div>
  
  );
};

export default ContenedorTabla;






