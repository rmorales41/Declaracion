import * as React from 'react';
import { DataGrid, gridClasses, GridToolbar } from '@mui/x-data-grid';
import Box from '@mui/material/Box';
import { alpha, styled } from '@mui/material/styles';
import "./StripedDataGrid.css";

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

const DataTable = ({
  rows,
  columns,
  disableColumnMenu,
  checkboxSelection,
  pageSizeOptions,
  pageSize,
  rowHeight,
  eventoOnClickCuenta,
}) => {

  const [filterText, setFilterText] = React.useState('');

  const handleFilterChange = (event) => {
    setFilterText(event.target.value);
  };

  const filteredRows = rows.filter((row) =>
    Object.values(row).some(
      (value) => value && value.toString().toLowerCase().includes(filterText.toLowerCase())
    )
  );

  const getRowClassName = (params) => {
    let className = params.indexRelativeToCurrentPage % 2 === 0 ? 'even' : 'odd';
    if (params.row.IDContabilidad_Niveles !== 1)  className += ' cuentas-hijas';
    if (!params.row.Permite_Sub_Cuentas) className += ' no-subcuentas';

    return className.trim();
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-end'}}>
      <div style={{ marginBottom: 10}}>
        <div className='container'>
          <input
            title="Búsqueda en todos los encabezados de la tabla"
            className="form-control filtro flex-grow-1"
            type="text"
            value={filterText}
            onChange={handleFilterChange}
            placeholder="Buscar..."
            style={{ padding: 5, marginRight: 10, height:"32px" }}
          />
        </div>
      </div>
      <div className="data-grid-container" style={{ width: '100%', overflow: 'auto' }}>
        <Box sx={{ height: '100%', width: '100%' , zIndex: 99999  }}>
          <StripedDataGrid
            rows={filteredRows}
            columns={columns}
            initialState={{
              pagination: {
                paginationModel: { page: 0, pageSize: pageSize },
              },
            }}
            pageSizeOptions={pageSizeOptions}
            checkboxSelection={checkboxSelection}
            disableColumnMenu={disableColumnMenu}
            rowHeight={rowHeight}
            onRowClick={eventoOnClickCuenta}
            getRowClassName={getRowClassName}
            slots={{
              toolbar: () => <GridToolbar sx={{ zIndex: 9999 }} />,
            }}
          />
        </Box>
      </div>
    </div>
  );
}; 

export default DataTable;


