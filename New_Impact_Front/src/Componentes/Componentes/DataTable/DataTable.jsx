import * as React from 'react';
import {useState } from 'react';
import { DataGrid, gridClasses , GridToolbar } from '@mui/x-data-grid';
import { Link } from 'react-router-dom';
import useTooltipCustom from '../Tooltip/Tooltip';
import Box from '@mui/material/Box';
import { alpha, styled } from '@mui/material/styles';
import { FiEdit } from "react-icons/fi";
import BotonMenu from "../Boton/BotonMenuPuntos"
import "./DataTable.css";
const ODD_OPACITY = 0.2;
  
//Se le da estilo a las filas de la tabla, una fila de un color y la otra de otro, ejemplo: blanco, negro,blanco, negro,blanco, negro,
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
        // Reset on touch devices, it doesn't add specificity
        '@media (hover: none)': {
          backgroundColor: alpha(
            theme.palette.primary.main,
            ODD_OPACITY + theme.palette.action.selectedOpacity,
          ),},},},},
}));

const DataTable = (
  { encabezados, eventoClickEliminar, seleccionadosEliminados, setSeleccionadosEliminados,
    dataGridRef, apiRef, setValidarEliminar, idFormulario, general, moduloEditar, filasFiltradas,
    menuItems, sinBotones,
  }) => {
  const TooltipCustom = useTooltipCustom(); // Para renderizar el Tooltip
  const [paginaInicial, setPaginaInicial] = useState(0); //Para posicionar la paginacion de la pagina

  //Se le agrega botones a cada regitrso
  const accionesBotones = React.useMemo(() => {
    // Include the actions column with custom styling
    return [
      ...encabezados,
      {
        field: 'acciones',
        headerName: 'Acciones',
        type: 'actions',
        width: 200,
        renderCell: (params) => (
          <div >
            {/* Boton editar o upDate */}
            <TooltipCustom title="Clic para editar o modificar este registro">
              <Link className="btn btn-primary m-1"
                to={`/${moduloEditar}/${params.row.id}/${idFormulario}`}// El usuario con el role lectura no puede editar
              ><FiEdit />
              </Link>
            </TooltipCustom>

            {/* Boton eliminar o delete*/}
            {!sinBotones && (
              <TooltipCustom title="Clic para eliminar este registro">
                <button className="btn btn-danger "
                  onClick={() => {
                    if(general){// Solo es el usuario con el role general puede eliminar, en el caso de asientos se elimina por el idunico_referencial, que es el mismo que params.row.id
                      setValidarEliminar(true);
                      eventoClickEliminar(params.row.id);
                    }
                  }}
                  disabled={!general}// Se desactiva el boton para todos los usuarios que no tengan el rol geneal
                ><i className="bi bi-trash3"></i>
                </button>
              </TooltipCustom>
            )}
            
             {/* Boton menu de opciones*/}
             { menuItems ? (<>
              <div className="btn-menu-tabla" >
                <BotonMenu  
                  items={menuItems} 
                  idUnico={params.row.id}
                />
              </div>
              </>):(<></>)}


          </div>
        ),
      },
    ];
  }, [encabezados, moduloEditar, idFormulario, sinBotones, general, menuItems, setValidarEliminar, eventoClickEliminar]); // Recalculate only when columns or event handler changes
  
const autosizeOptions = {includeOutliers: true,};

//Se le manda por propiedades el array al array seleccionadosEliminados 
const handleRowSelection = (newRowSelectionModel) => {
      setSeleccionadosEliminados(newRowSelectionModel);
};


  //El campo id en Material UI siempre debe ser único. 
  //Sin un id único, los filtros y la capacidad de respuesta de la tabla con paginación no funcionarán correctamente.
  return (
    <div className="data-grid-container">
      <Box sx={{ height: '100%', width: '100%' }}>
        <StripedDataGrid
          apiRef={apiRef}
          ref={dataGridRef}
          disableRowSelectionOnClick={true}
          keepNonExistentRowsSelected
          rows={filasFiltradas.reverse()}//le da vuelta siempre a la lisata para que se vea el ultimo al comienzo y primero al final
          columns={accionesBotones}//columns={accionesBotones.filter(columna => !columnasOcultas.includes(columna.field))}
          checkboxSelection={true} // Opcion de seleccion de check boxs
          initialState={{ 
            pagination: {paginationModel: { page: paginaInicial, pageSize: 10}, }, //Inicio de pagina, cuantos registros por defaul y en que pagina
           }}
          getRowClassName={(params) => params.indexRelativeToCurrentPage % 2 === 0 ? 'even' : 'odd'}//Para cambiar de color las filas
          pageSizeOptions={[5, 10, 20, 50, 100]}//Opciones de cuantos registros se quieren ver en la tabla
          onPageChange={(newPage) => setPaginaInicial(newPage)}//Cambio de pagina
          onRowSelectionModelChange={handleRowSelection}//Se le manda por propiedades el array al array seleccionadosEliminados    
          rowSelectionModel={seleccionadosEliminados}//Se le manda por propiedades el array al array seleccionadosEliminados    
          autosizeOptions={autosizeOptions}
          resizable={true}
          slots={{
            toolbar: GridToolbar,
          }}
        />
    </Box>
    </div>
  );
};

export default DataTable;


