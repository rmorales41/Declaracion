import * as React from 'react';
import { useState } from 'react';
import Button from '@mui/material/Button';
import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import DialogTitle from '@mui/material/DialogTitle';
import useTooltipCustom  from '../../../Componentes/Tooltip/Tooltip';
import InputFormulario from "../../../Componentes/TextField/inputFormulario";

export default function ModalForm({props}) {

  const [open, setOpen] = useState(false);
  const TooltipCustom = useTooltipCustom();// Para renderizar el componente useTooltipCustom 

  const handleClickOpen = () => {
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
  };

  return (
    <React.Fragment>
      <TooltipCustom title="Clic aquí para agregar Información adicional del asiento contable">  
        <button className='btn btn-agregarLetras' onClick={handleClickOpen} >
        <i className="bi bi-info-circle-fill"
            style={{fontSize:"calc(var(--fontSize-drawer) + 10px"}}
        > </i>
        </button>
        
      </TooltipCustom>
      <Dialog
        open={open}
        onClose={handleClose}
        PaperProps={{
          component: 'form',
          onSubmit: (event) => {
            event.preventDefault();
          },
        }}
      >
        <DialogTitle>Información adicional del asiento contable</DialogTitle>
        <DialogContent>
            <div className="row g-1 needs-validation my-1 ">
              {/*Campo Numero_Largo*/}
              <InputFormulario
                classe={"position-relative"}
                type={"text"}
                nombreLabel={"Número Largo"}
                titlelabel={"Ejemplo del largo del asiento contable:"}
                icono={<i className="bi bi-123"></i>}
                id={"Numero_Largo"}
                name={"Numero_Largo"}
                titleInput={"Digite el Número largo del asiento contable"}
                value={props.asiento.Numero_Largo}
                onChange={props.manejoCambioImput}
                onBlur={props.manejoCambioImput}
                restricciones={props.restricciones}
                editarONuevo={props.editar}
                maxLength={"50"}
                required = {false}
              />  
            </div>
            
                    
        </DialogContent>
        <DialogActions>
          <Button onClick={handleClose}>Cerrar</Button>
        </DialogActions>
      </Dialog>
    

    </React.Fragment>
  );
}