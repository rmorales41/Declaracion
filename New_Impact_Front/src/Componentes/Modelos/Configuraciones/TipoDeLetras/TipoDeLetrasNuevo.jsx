import * as React from 'react';
import { useState } from 'react';
import Button from '@mui/material/Button';
import TextField from '@mui/material/TextField';
import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import DialogContentText from '@mui/material/DialogContentText';
import DialogTitle from '@mui/material/DialogTitle';
import "./TipoDeLetrasNuevo.css"
import useTooltipCustom  from '../../../Componentes/Tooltip/Tooltip';
import TiposDeLetrasServicios from '../../../../Servicios/ConfiguracionServicios/TiposDeLetrasServicios/TiposDeLetrasServicios';
import AuthServices from '../../../../Servicios/AuthServices';
import LoadingAleatorio from '../../../Componentes/Loading/LoadingAleatorio';
import ModalSuccess from '../../../Componentes/Modales/ModalesSweetalert2/ModalSuccess';
import Alert from '@mui/material/Alert';
import Stack from '@mui/material/Stack';
import { FcPlus } from "react-icons/fc";
import ValidaRestricciones from '../../../../Hooks/ValidaRestricciones';


export default function FormDialog({listaTiposDeLetra}) {

  const InicializaTipoDeLetra = {
    IDConfiguracion_Letras: null,
    Nombre: " ",
    Link: " ",
  }

  const [tipoDeLetra, setTipoDeLetra] = useState(InicializaTipoDeLetra);
  const [open, setOpen] = useState(false);
  const TooltipCustom = useTooltipCustom();// Para renderizar el componente useTooltipCustom 
  const [cargando, setCargando] = useState(false);//Muestra o no el Loading
  const [mostarModalErrores, setMostarModalErrores]  = useState(false);

  const handleClickOpen = () => {
    setOpen(true);
    setMostarModalErrores(false);
  };

  const handleClose = () => {
    setOpen(false);
    setMostarModalErrores(false);
  };

//---------- Maneja los cambios en los inputs ----------
const manejoCambioImput = event => {
  const { name, value } = event.target;
  setTipoDeLetra({ ...tipoDeLetra, [name]: value });
  setMostarModalErrores(false);
}

  //---------- Metodo para crear un nuevo compañia pais link----------
const nuevo = (e) => {
  const token = AuthServices.getAuthToken();
  if (!ValidaRestricciones.ValidarToken(token)) {return;}//valida el token
  setCargando(true);

  AuthServices.setAuthToken(token);
    var data = {
      IDConfiguracion_Letras: tipoDeLetra.IDConfiguracion_Letras,
      Nombre: tipoDeLetra.Nombre,
      Link: tipoDeLetra.Link,
      };
    TiposDeLetrasServicios.agregarTipoDeLetras(data) 
              .then(response => {
                setTipoDeLetra({Nombre:response.data.Nombre, Link: response.data.Link});
                setCargando(false);
                ModalSuccess.modalSuccesscorrectamente("Se agregó correctamente el tipo de letra");
                handleClose();
                setMostarModalErrores(false)
                listaTiposDeLetra();//refresca la lista de tipos de letras
              })
              .catch(e => {
                setCargando(false);
                setMostarModalErrores(true);
                ValidaRestricciones.capturaDeErrores(e);
              })
};

  return (
    <React.Fragment>
      <TooltipCustom title="Clic aquí para agregar nuevos tipos de letras">       
        <button className='btn btn-agregarLetras' onClick={handleClickOpen} >
          <FcPlus style={{fontSize:"calc(var(--fontSize-drawer) + 10px"}} />  
        </button>
        
      </TooltipCustom>
      <Dialog
        open={open}
        onClose={handleClose}
        PaperProps={{
          component: 'form',
          onSubmit: (event) => {
            event.preventDefault();
            nuevo();
          },
        }}
      >
        <DialogTitle>Agregar nuevas fuentes tipográficas</DialogTitle>
        <DialogContent>
          <DialogContentText>
              Para agregar nuevos tipos de letras, visite la página de Google Fonts 
              <a href="https://fonts.google.com/" target="_blank" rel="noreferrer"> aquí</a>.
          </DialogContentText>

            <TooltipCustom placement="top" title=" Para incluir el nombre, debe estar entre comillas simples (' ') y separado por comas, seguido de la palabra clave sans-serif. Por ejemplo, 'Roboto', sans-serif.">
              <TextField
                autoFocus
                required
                margin="dense"
                id="Nombre"
                name="Nombre"
                label="Nombre"
                type="text"
                fullWidth
                variant="standard"
                onChange={manejoCambioImput}
              />
            </TooltipCustom>

            <TooltipCustom 
                title="Para agregar el enlace, copia y pega el URL completo desde 'https' hasta 'swap' (sin comillas). Por ejemplo:
                https://fonts.googleapis.com/css2?family=Roboto:ital,wght@0,400;0,500;0,400;1,900&display=swap"
            >
              <TextField
                autoFocus
                required
                margin="dense"
                id="Link"
                name="Link"
                label="Link "
                type="text"
                fullWidth
                variant="standard"
                onChange={manejoCambioImput}
              />
            </TooltipCustom>

        {mostarModalErrores && (
           <Stack sx={{ width: '100%' }} spacing={2}>
             <Alert severity="error">Se produjo un error. Por favor, inténtalo de nuevo.</Alert>
           </Stack>
        )}
                    
        </DialogContent>
        <DialogActions>
          <Button onClick={handleClose}>Cancel</Button>
          <Button type="submit">Guardar</Button>
        </DialogActions>
      </Dialog>

       {/*Muestra el Loading aleatorio con colores aleatorios y el SVG de New Impact*/}
       <LoadingAleatorio mostrar={cargando}/>

    

    </React.Fragment>
  );
}