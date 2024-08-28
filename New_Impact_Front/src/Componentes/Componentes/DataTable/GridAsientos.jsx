import * as React from 'react';
import { format } from 'date-fns';
import { useCallback } from 'react';
import {
  GridRowModes,
  DataGrid,
  GridActionsCellItem,
  gridClasses,
  GridToolbar,
} from '@mui/x-data-grid';
import Box from '@mui/material/Box';
import { alpha, styled } from '@mui/material/styles';
import TipoDeCambio from '../../../Hooks/TipoDeCambio';
import AuthServices from '../../../Servicios/AuthServices';
import TipoDeCambioServicios from "../../../Servicios/ConfiguracionServicios/TipoDeCambioServicios/TipoDeCambioServicios"
import ValidaRestricciones from '../../../Hooks/ValidaRestricciones'
import ModalSuccess from "../../../Componentes/Componentes/Modales/ModalesSweetalert2/ModalSuccess"
import "./GridAsientos.css";
import useTooltipCustom  from '../../Componentes/Tooltip/Tooltip';
import AsientosServicios from "../../../Servicios/ContabilidadServicios/AsientosServicios";
import Alert from '@mui/material/Alert';
import {titleDelete, mensajeDelete, confirmarButtonDelete, cancelarButtonDelete, successTitleDelete, successTextDelete} from '../../../Variables/variables';

const ODD_OPACITY = 0.2;

const StripedDataGrid = styled(DataGrid)(({ theme }) => ({
  [`& .${gridClasses.row}.even`]: {
    backgroundColor: theme.palette.grey[200],
    '&:hover, &.Mui-hovered': {
      backgroundColor: alpha(theme.palette.primary.main, ODD_OPACITY),
      '@media (hover: none)': {
        backgroundColor: 'transparent',
      },
    },
    '&.Mui-selected': {
      backgroundColor: alpha(
        theme.palette.primary.main,
        ODD_OPACITY + theme.palette.action.selectedOpacity,
      ),
      '&:hover, &.Mui-hovered': {
        backgroundColor: alpha(
          theme.palette.primary.main,
          ODD_OPACITY +
            theme.palette.action.selectedOpacity +
            theme.palette.action.hoverOpacity,
        ),
        '@media (hover: none)': {
          backgroundColor: alpha(
            theme.palette.primary.main,
            ODD_OPACITY + theme.palette.action.selectedOpacity,
          ),
        },
      },
    },
  },
}));

const GridAsientos = ({
  columns,
  disableColumnMenu,
  checkboxSelection,
  pageSizeOptions,
  pageSize,
  rowHeight,
  eventoOnClickCuenta,
  rows, 
  setRows,
  abrirTotales,
  listaCatalogosMovimientos,
  listaOrigen,
  esEnModificarAsientos,

  mostrarAlerta,
  setMostrarAlerta,

  getListCatalogosConMovimientos,
  alertaEliminar,
  setAlertaEliminar,
  abrirAgregarTipoDeCambio,
  lista_tipo_Documento,

  sinBotones,
}) => {

  const [filterText, setFilterText] = React.useState('');
  const [rowModesModel, setRowModesModel] = React.useState({});
  const TooltipCustom = useTooltipCustom();// Para renderizar el componente useTooltipCustom 

  //Evento para el boton editar de cada registro en el grid
  const handleEditClick = useCallback((id) => () => {
    setRowModesModel({ ...rowModesModel, [id]: { mode: GridRowModes.Edit } });
  }, [rowModesModel, setRowModesModel]);

  //Evento para el boton guardar cambios al editar en cada registro en el grid
  const handleSaveClick = useCallback((id) => () => {
    setRowModesModel({ ...rowModesModel, [id]: { mode: GridRowModes.View } });
  }, [rowModesModel, setRowModesModel]);

//Evento para revome o eliminar las Compañias Paises 
 const eliminarAsiento = useCallback((idunico_referencial) => {
  const token = AuthServices.getAuthToken()// Trae el token que se gurdo en el localStores cuando se logueo
  if (!ValidaRestricciones.ValidarToken(token)) return;//valida el token
  const codigoCompaniaAuth = parseInt(AuthServices.getCodigoCompania());
    AsientosServicios.setAuthToken(token);
    AsientosServicios.remove(idunico_referencial)//Invoca el endpoid de elimanar o remove del back end
      .then((response) => {
          if(codigoCompaniaAuth) getListCatalogosConMovimientos(codigoCompaniaAuth)// Refresca la lista de catálogos con movimientos.
          //Se muestra el loading ya que al refrescar esta cargando de nuevo los datos
      }).catch(e => {
        console.error(e)          
      });
}, [getListCatalogosConMovimientos]);

//Evento para el boton eliminar filas en cada registro en el grid
  const handleDeleteClick = useCallback((id) => () => {
    // Muestra el moda para confirmar
    ModalSuccess.modalConfirmar(titleDelete, mensajeDelete, confirmarButtonDelete, cancelarButtonDelete, successTitleDelete, successTextDelete)
        .then((confirmed) => {
            if (confirmed) {// Si se confirma se elimina el registro
              setMostrarAlerta(false);
              setAlertaEliminar(true);
              if(esEnModificarAsientos){
                eliminarAsiento(id) //Verfica que sea en el modulo editar asientos
              } 
              setRows(rows.filter((row) => row.id !== id));
            } 
        });
  }, [eliminarAsiento, esEnModificarAsientos, rows, setAlertaEliminar, setMostrarAlerta, setRows]);

  //Evento para cancelar el evento editar en el grid
  const handleCancelClick = useCallback((id) => () => {
    setRowModesModel({
      ...rowModesModel,
      [id]: { mode: GridRowModes.View, ignoreModifications: true },
    });

    const editedRow = rows.find((row) => row.id === id);
    if (editedRow.isNew) {
      setRows(rows.filter((row) => row.id !== id));
    }
  }, [rowModesModel, rows, setRows]);


  const processRowUpdate = async (newRow) => {  
    // Verificar si la fecha es inválida o está vacía
    if (!newRow.Fecha_Comprobante || isNaN(new Date(newRow.Fecha_Comprobante).getTime())) {
      ModalSuccess.modalCapturaDeWarning("Para guardar los cambios, debe seleccionar una fecha de comprobante válida.");
      return; // Salir de la función si la fecha es inválida
    }
    
    const fechaModificada = format(newRow.Fecha_Comprobante, 'yyyy-MM-dd');// Formatear la fecha y obtener el tipo de cambio
    const tipoDeCambioObjeto = await obtenerTipoDeCambioPorFecha(fechaModificada);//Obitiene el tipo de cambio por medio de la fecha del comprobante
    const tipoDeCambioXFecha = tipoDeCambioObjeto.Venta

    if(tipoDeCambioXFecha === null){
      ModalSuccess.modalCapturaDeWarning("Para guardar los cambios, debe seleccionar una fecha de comprobante válida.");
      return // valida que no se pueda modificar nada sin el tipo de cambio ||
    }

    let updatedRow = { ...newRow, isNew: false }; 
    const filaActual = rows.find(row => row.id === newRow.id);// Obtener la fila anterior para comparar  

          if (parseFloat(filaActual?.Debito_Local) > 0 && newRow.Fecha_Comprobante !== filaActual?.Fecha_Comprobante) { 
            updatedRow = { ...updatedRow, 
                  Debito_Extranjero:  TipoDeCambio.convertirColonesADolares(parseFloat( 
                    updatedRow.Debito_Local 
                  ), parseFloat(tipoDeCambioXFecha)),
              };
          } 
          
          if (parseFloat(filaActual?.Debito_Extranjero) > 0 &&
              newRow.Fecha_Comprobante !== filaActual?.Fecha_Comprobante &&
              filaActual?.Debito_Local !== newRow.Debito_Local
            )  {  
            updatedRow = {...updatedRow,
                Debito_Local: TipoDeCambio.convertirDolaresAColones(parseFloat(
                  updatedRow.Debito_Extranjero
                ), parseFloat(tipoDeCambioXFecha)),
            };
          }
          
          if (parseFloat(filaActual?.Credito_Local) > 0 && newRow.Fecha_Comprobante !== filaActual?.Fecha_Comprobante) {   
            updatedRow = {...updatedRow, 
                  Credito_Extranjero: TipoDeCambio.convertirColonesADolares(parseFloat(
                    updatedRow.Credito_Local 
                  ), parseFloat(tipoDeCambioXFecha)),
              };
          }
          
          if (parseFloat(filaActual?.Credito_Extranjero) > 0 &&
            newRow.Fecha_Comprobante !== filaActual?.Fecha_Comprobante &&
            filaActual?.Credito_Extranjero !== newRow.Credito_Extranjero
            ) { 
            updatedRow = {...updatedRow, 
                  Credito_Local: TipoDeCambio.convertirDolaresAColones(parseFloat(
                    updatedRow.Credito_Extranjero 
                  ), parseFloat(tipoDeCambioXFecha)),
              };
          }

    // Validar que Debito_Local sea mayor que 0
    if (parseFloat(newRow.Debito_Local) > 0 && newRow.Debito_Local !== rows.find(row => row.id === newRow.id)?.Debito_Local) {
        updatedRow = {...updatedRow, Credito_Local: 0, Credito_Extranjero: 0,
              Debito_Extranjero: TipoDeCambio.convertirColonesADolares(parseFloat(updatedRow.Debito_Local), parseFloat(tipoDeCambioXFecha)),
          };
    }

    // Validar que Credito_Local sea mayor que 0
    if (parseFloat(newRow.Credito_Local) > 0 && newRow.Credito_Local !== rows.find(row => row.id === newRow.id)?.Credito_Local) {
        updatedRow = {...updatedRow, Debito_Local: 0, Debito_Extranjero: 0,
              Credito_Extranjero: TipoDeCambio.convertirColonesADolares(parseFloat(updatedRow.Credito_Local), parseFloat(tipoDeCambioXFecha)),
        };
    }

    // Validar que Debito_Extranjero sea mayor que 0
    if (parseFloat(newRow.Debito_Extranjero) > 0 && newRow.Debito_Extranjero !== rows.find(row => row.id === newRow.id)?.Debito_Extranjero) {
        updatedRow = { ...updatedRow, Credito_Local: 0, Credito_Extranjero: 0,
              Debito_Local: TipoDeCambio.convertirDolaresAColones(parseFloat(updatedRow.Debito_Extranjero), parseFloat(tipoDeCambioXFecha)),
          };
    }

    // Validar que Credito_Extranjero sea mayor que 0
    if (parseFloat(newRow.Credito_Extranjero) > 0 && newRow.Credito_Extranjero !== rows.find(row => row.id === newRow.id)?.Credito_Extranjero) {
        updatedRow = {...updatedRow, Debito_Local: 0, Debito_Extranjero: 0,
              Credito_Local: TipoDeCambio.convertirDolaresAColones(parseFloat(updatedRow.Credito_Extranjero), parseFloat(tipoDeCambioXFecha)),
          };
      }

    let requiereOrigenYDestino = false
    //Actualiza los id de cuenta del catalogo
    if(newRow.IDContabilidad_Catalogo){
      let itemEditCuentaG = listaCatalogosMovimientos.find(option => option.IDContabilidad_Catalogo === newRow.IDContabilidad_Catalogo);
      if(!itemEditCuentaG){//Esta validacion la hace ya que el value biene por id o por la cuenta formateada
        itemEditCuentaG = listaCatalogosMovimientos.find(option => option.Cuenta_Formateada === newRow.IDContabilidad_Catalogo);
      }
      requiereOrigenYDestino = itemEditCuentaG.Requiere_Origen_Destino
      const nuevoIdCuenta = itemEditCuentaG.IDContabilidad_Catalogo
      updatedRow = {...updatedRow, IDContabilidad_Catalogo: nuevoIdCuenta,  };//Actualiza el id de la cuenta
    }

    //Actualiza los id del origen, ademas depende de la cuenta seleccionada si la cuenta requiere origen y destino o no requiere si no requiere va null
    if(requiereOrigenYDestino){
      const idOrigen = listaOrigen.find(option => option.IDContabilidad_Origen === newRow.IDContabilidad_Origen);
        if(filaActual.IDContabilidad_Origen && (idOrigen === undefined || idOrigen === null)) {
          updatedRow = {...updatedRow, IDContabilidad_Origen: filaActual.IDContabilidad_Origen}
        }else{
          updatedRow = {...updatedRow, IDContabilidad_Origen: newRow.IDContabilidad_Origen}
        }
    }else if(!requiereOrigenYDestino){
        updatedRow = {...updatedRow, IDContabilidad_Origen: null}//si no requiere el id es null
    }

    //Actualiza los id de Tipo Documento  *IDConfiguracion_Tipo_Documento
    let idTipo_Documento = lista_tipo_Documento.find(option => option.IDConfiguracion_Tipo_Documento === newRow.IDConfiguracion_Tipo_Documento);
    if(filaActual.IDConfiguracion_Tipo_Documento && (idTipo_Documento === undefined || idTipo_Documento === null)) {
      updatedRow = {...updatedRow, IDConfiguracion_Tipo_Documento: filaActual.IDConfiguracion_Tipo_Documento}
    }else{
      updatedRow = {...updatedRow, IDConfiguracion_Tipo_Documento: newRow.IDConfiguracion_Tipo_Documento}
    }

    //Actualiza el id de tipo de cambio
    updatedRow = {...updatedRow, IDConfiguracion_Tipo_Cambio: tipoDeCambioObjeto.IDConfiguracion_Tipo_Cambio,  };
    //Actualiza el campo Dolar
    updatedRow = {...updatedRow, Dolar: parseFloat(tipoDeCambioXFecha).toFixed(2),};
    
    // Actualizar la fila en el estado de filas (rows)
    const updatedRows = rows.map((row) => (row.id === updatedRow.id ? updatedRow : row));
    setRows(updatedRows);

    return updatedRow;
};

  const handleRowModesModelChange = (newRowModesModel) => {
    setRowModesModel(newRowModesModel);
  };

  const handleFilterChange = (event) => {
    setFilterText(event.target.value);
  };

  const filteredRows = rows.filter((row) =>
    Object.values(row).some((value) =>
      value && value.toString().toLowerCase().includes(filterText.toLowerCase())
    )
  );

  const getRowClassName = (params) => {
    let className = params.indexRelativeToCurrentPage % 2 === 0 ? 'even' : 'odd';
    return className.trim();
  };

  const columnsWithActions = React.useMemo(() => {
    const newColumns = [...columns];
    //Sin botones se usa en asientos historicos que no puede ni eliminar ni editar nada
    if(!sinBotones) newColumns.push(
        {field: 'actions',type: 'actions',headerName: 'Acciones',cellClassName: 'actions',
          getActions: ({ id }) => {
            const isInEditMode = rowModesModel[id]?.mode === GridRowModes.Edit;
    
            if (isInEditMode) {
              return [
                <GridActionsCellItem
                  icon={<i className="bi bi-floppy"></i>}
                  label="Save"
                  sx={{
                    color: 'primary.main',
                  }}
                  onClick={handleSaveClick(id)}
                />,
                <GridActionsCellItem
                  icon={<i className="bi bi-x-circle"></i>}
                  label="Cancel"
                  className="textPrimary"
                  onClick={handleCancelClick(id)}
                  color="inherit"
                />,
              ];
            }
    
            return [
              <GridActionsCellItem
                icon={<i className="bi bi-pencil-square"></i>}
                label="Edit"
                className="textPrimary"
                onClick={handleEditClick(id)}
                color="inherit"
              />,
              <GridActionsCellItem
                icon={<i className="bi bi-trash3"></i>}
                label="Delete"
                onClick={handleDeleteClick(id)}
                color="inherit"
              />,
            ];
          },
        },
      );
    return newColumns;
  }, [columns, handleCancelClick, handleDeleteClick, handleEditClick, handleSaveClick, rowModesModel, sinBotones]);


//---- Método para obtener el tipo de cambio por fecha 
const obtenerTipoDeCambioPorFecha = async (fecha) => {
    const codigoCompaniaAuth = parseInt(AuthServices.getCodigoCompania());
    const token = AuthServices.getAuthToken(); // Trae el token de local store
      if (!ValidaRestricciones.ValidarToken(token)) return null; // Valida el token
      TipoDeCambioServicios.setAuthToken(token); // Le manda el token al encabezado de la consulta del endpoind
      try {
        const response = await TipoDeCambioServicios.searchbydate(codigoCompaniaAuth, fecha); // Invoca el método listar o el get de servicios
        return response.data;
      } catch (e) {
        console.error(e)
        abrirAgregarTipoDeCambio();
        //ValidaRestricciones.capturaDeErrores(e); // Valida y devuelve los errores del backend
        return null;
      }
};

return (
    <div>
      <div className="encabezadoSeachAsientos">
        <div className="button-encabezadoSeachAsientos">
          <TooltipCustom title="Clic para mostrar la ventana con los totales de crédito y débito, o utiliza el atajo de teclado (Shift + S)."> 
            <button className='btn btn-Totales' type="button" onClick={abrirTotales}><i className="bi bi-window-stack"> </i>Totales</button>
          </TooltipCustom>
        </div>

        <div className="search-encabezadoSeachAsientos card cardTableSeach">
          <div className="card-body cardTableSeach cardAsientos">
            <input
              title="Búsqueda en todos los encabezados de la tabla"
              className="form-control"
              type="text"
              value={filterText}
              onChange={handleFilterChange}
              placeholder="Buscar..."
            />
          </div>
        </div>
      </div>

      <div className="data-grid-container" style={{ width: '100%', overflow: 'auto' }}>
        <Box sx={{ height: '100%', width: '100%' }}>
          <StripedDataGrid
            rows={filteredRows}
            columns={columnsWithActions}
            initialState={{pagination: {paginationModel: { page: 0, pageSize: pageSize },},}}
            pageSizeOptions={pageSizeOptions}
            checkboxSelection={checkboxSelection}
            disableColumnMenu={disableColumnMenu}
            rowHeight={rowHeight}
            onRowClick={eventoOnClickCuenta}
            getRowClassName={getRowClassName}
            editMode="row"
            rowModesModel={rowModesModel}
            onRowModesModelChange={handleRowModesModelChange}
            processRowUpdate={processRowUpdate}
            slotProps={{toolbar: { setRows, setRowModesModel },}}
            slots={{
              toolbar: () => (
                <>
                  <div>
                    {mostrarAlerta ? (<>
                      <div className='contenedorAlerts'>
                        <Alert severity="success" onClose={() => {
                          setMostrarAlerta(false)
                          }}>
                          Se agregó correctamente el asiento.
                        </Alert>
                      </div>
                    </>):(<></>)}

                    {alertaEliminar ? (<>
                      <div className='contenedorAlerts'>
                        <Alert severity="warning" onClose={() => {
                          setAlertaEliminar(false)
                          }}>
                          Se eliminó correctamente el asiento.
                        </Alert>
                      </div>
                    </>):(<></>)}
                    <GridToolbar />
                  </div>
                </>
              ),
            }}
          />
        </Box>
      </div>
    </div>
  );
};

export default GridAsientos;


