import * as React from 'react';
import { styled } from '@mui/material/styles';
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell, { tableCellClasses } from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';
import Paper from '@mui/material/Paper';
import Alert from '@mui/material/Alert';
import Stack from '@mui/material/Stack';

const StyledTableCell = styled(TableCell)(({ theme, fontSize }) => ({
  [`&.${tableCellClasses.head}`]: {
    backgroundColor: theme.palette.common.black,
    color: theme.palette.common.white,
    border: '1px solid rgba(224, 224, 224, 1)', // Borde para la cabecera
  },
  [`&.${tableCellClasses.body}`]: {
    fontSize: fontSize || 14, // Tamaño de fuente basado en la prop fontSize o 13px por defecto
  },
}));

const StyledTableRow = styled(TableRow)(({ theme, rowHeight }) => ({
  '&:nth-of-type(odd)': {
    backgroundColor: theme.palette.action.hover,
    
  },
  '&:last-child td, &:last-child th': {
    border: 0,
  },
  height: rowHeight || 30, // Establece la altura de la fila basada en la prop rowHeight o 20px por defecto
}));


export default function CustomizedTables({ 
         rows, columns, ancho, size, fontSize, 
         rowHeight, vistaAsiento, saldo, saldoExtranjero,
         campoFaltante, filas, asientoCuadrado
  }) {

  return (
    <TableContainer component={Paper}>
      <Table sx={{ maxWidth: ancho }} size={size} aria-label="customized table">
        <TableHead>
          <TableRow>
            {columns.map((column) => (
              <StyledTableCell key={column.field} fontSize={fontSize}>{column.headerName}</StyledTableCell>
            ))}
          </TableRow>
        </TableHead>
        <TableBody>
          {rows.map((row) => (
              <StyledTableRow key={row.id} rowHeight={rowHeight}>
              {columns.map((column) => (
                <StyledTableCell key={column.field} align={column.align || 'left'} fontSize={fontSize}>
                  {row[column.field]}
                </StyledTableCell>
              ))}
            </StyledTableRow>
          ))}
        </TableBody>
      </Table>
      {/*Se mustra solo si es llamdo en asientos o que la prop vistaAsiento sea true*/}
      {vistaAsiento && filas.length > 0 ? (<>
          {saldo > 0 || saldoExtranjero > 0 ? 
            (<>   
            <div >
              <Stack sx={{ width: '100%'}} >
                <Alert severity="error">Asiento desbalanceado, saldo faltante {campoFaltante} local: {saldo}, extranjero: {saldoExtranjero}</Alert>
              </Stack>
            </div>     
            </>)
          :
            (<>
                <Stack sx={{ width: '100%' }} spacing={2}>
                  <Alert severity="success">Asiento contable balanceado.</Alert>
                </Stack>
              
            </>)
          }
      </>):(<></>)}
    </TableContainer>
  );
}
