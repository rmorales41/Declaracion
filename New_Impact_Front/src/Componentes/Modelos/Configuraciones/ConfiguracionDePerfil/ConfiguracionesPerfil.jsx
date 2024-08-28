import * as React from 'react';
import {useState, useEffect} from 'react';
import { useNavigate } from "react-router-dom";
import FormLabel from '@mui/material/FormLabel';
import FormControl from '@mui/material/FormControl';
import FormGroup from '@mui/material/FormGroup';
import "./ConfiguracionesPerfil.css";
import { Box } from '@mui/material'; 
import SwitchAnt from '../../../Componentes/TextField/AntSwitch';
import SelectAutoComplete from "../../../Componentes/TextField/SelectAutoComplete";
import PaletaDeColores from "../../../Componentes/TextField/PaletaDeColores";
import AuthServices from '../../../../Servicios/AuthServices';
import { FaBold } from "react-icons/fa";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import {faFillDrip, faPaintRoller, faPalette, faPaintbrush, faFont, faTextHeight, faArrowsRotate, faImage} from '@fortawesome/free-solid-svg-icons'; 
import AsignaCompaniaServico from "../../../../Servicios/UsuariosServicios/AsignaCompaniaServico";
import LoadingAleatorio from "../../../Componentes/Loading/LoadingAleatorio";
import ModalConfirmar from "../../../Componentes/Modales/ModalesSweetalert2/ModalConfirmar";
import BtnCancelar from "../../../Componentes/Boton/BotonCancelar";
import BtnGurdar from "../../../Componentes/Boton/BotonGuardar";
import ConfiguracionDeEstilos from "../../../../Hooks/ConfiguracionDeEstilos"
import {restTipoLetra, restTamanoLetra, restColorDrawer, restColorNavBar, restColorLetra, restNegrita ,restFondo, restImagenDeFondo} from '../../../../Variables/variables';
import useTooltipCustom from '../../../Componentes/Tooltip/Tooltip';
import ModalErroresConTitle from "../../../Componentes/Modales/ModalesSweetalert2/ModalErroresConTitulo";
import TiposDeLetrasServicios from "../../../../Servicios/ConfiguracionServicios/TiposDeLetrasServicios/TiposDeLetrasServicios";
import FormAgregarLetras from "../TipoDeLetras/TipoDeLetrasNuevo";
import ValidaRestricciones from '../../../../Hooks/ValidaRestricciones';

export default function ConfiguracionesPerfil(){

  const InicializaMiPerfil = {
    IDUsuarios_Asigna_Compania: " ",
    Activo: " ",
    Observaciones: ".",
    Tipo_Letra: " ",
    Tamano_Letra: " ",
    Color_Nav_Lateral: " ",
    Color_Nav_Header: " ",
    Color_Letra: " ",
    Estilo: " ",
    Fondo_Desktop: " ",
    IDCompania: " ",
    IDUsuarios_Identificador: " ",
    Imagen_Desktop:" ",
  } 

  const [miPerfil, setMiPerfil] = useState(InicializaMiPerfil);
  const [tipo_letra, setTipo_letra] = useState("");
  const [tamano_letra, setTamano_letra] = useState("");
  const [color_Drawer, setColor_Drawer] = useState("");
  const [color_navBar, setColor_navBar] = useState("");
  const [negrita, setNegrita] = useState("");
  const [color_letra, setColor_letra] = useState("");
  const [colorDefondo, setColorDefondo] = useState("");
  const [imagenDefondo, setImagenDefondo] = useState(" ");
  const [imagenDefondorest, setImagenDefondorest] = useState(false);
  const [idAsigna, setIdAsigna] = useState(null)
  const [cargando, setCargando] = useState(false);//Muestra o no el Loading
  const [mostarModal, setMostarModal] = useState(false);
  
  const [tipo_letraSinCambio, setTipo_letraSinCambio] = useState("");
  const [tamano_letraSinCambio, setTamano_letraSinCambio] = useState("");
  const [color_DrawerSinCambio, setColor_DrawerSinCambio] = useState("");
  const [color_navBarSinCambio, setColor_navBarSinCambio] = useState("");
  const [negritaSinCambio, setNegritaSinCambio] = useState("");
  const [color_letraSinCambio, setColor_letraSinCambio] = useState("");
  const [colorDefondoSinCambio, setColorDefondoSinCambio] = useState("");
  const [imagenDefondoSinCambio, setImagenDefondoSinCambio] = useState("");
  const [eliminarImagen, setEliminarImagen] = useState(false);
  const navigate = useNavigate();
  const [tiposDeLetras, setTiposDeLetras] = useState([])
 
  const TooltipCustom = useTooltipCustom(); // Para renderizar el Tooltip

  const listaTiposDeLetra = ()=>{
  const token = AuthServices.getAuthToken();
  if (!ValidaRestricciones.ValidarToken(token)) {return;}//valida el token
  setCargando(true);

    TiposDeLetrasServicios.setAuthToken(token);
    TiposDeLetrasServicios.obtenerTipoDeLetras().then(response=>{
      setTiposDeLetras(response.data)
      setCargando(false);
    }).catch( e =>{
      setCargando(false);
      ValidaRestricciones.capturaDeErrores(e);
    })

  }

  useEffect(()=>{
      const idAsignaAuth = AuthServices.getIdAsigna();//Trae el id de Asigna, compañía que tiene guardado en el localStore, la cual es la compañía activa.
      const codigo_companiaAuth = AuthServices.getCodigoCompania();
      setIdAsigna(idAsignaAuth);
      if(idAsignaAuth) buscarPor(idAsignaAuth, codigo_companiaAuth)//Busca la asignación de compañía por el ID que tiene en el localStore, y carga esa asignación de compañia
      listaTiposDeLetra();
  },[])
  
  useEffect(()=>{
    //Asiga el tipo de letra, tamaño, negritra, y colores del fondo, menu lateral, menu superior
    ConfiguracionDeEstilos.cambiosDeCss(
      tamano_letra, tipo_letra, color_letra, color_Drawer,  negrita, color_navBar, colorDefondo, imagenDefondo
    );
  },[tamano_letra, negrita, tipo_letra, colorDefondo, color_Drawer, color_navBar,color_letra, imagenDefondo])

   //Evento o función que maneja el cambio del Tipo de Letra.
  const eventoCambioTipoLetra = (event, value) => {
    if (value) {
       setTipo_letra(value.Nombre);
        setMiPerfil(prevPerfil => ({
          ...prevPerfil,
          Tipo_Letra: value.Nombre
        }));
    } else {
      const tipo_letraAuth = AuthServices.getTipoLetra();
      setTipo_letra(tipo_letraAuth); // Manejar el caso en que se borre la selección
      setMiPerfil(prevPerfil => ({
        ...prevPerfil,
        Tipo_Letra: " "
      }));
    }
  };

  //Array que se muestra en el SelectAutoComplete que se le pasa al SelectAutoComplete por props
  const propsFonts = {
    options: tiposDeLetras,
    getOptionLabel: (option) => option.Nombre,
  };

  //Evento o función que maneja el cambio del Tamaño de Letra.
  const eventoCambioTamanoLetra = (event, value) => {
    if (value) {
       setTamano_letra(value.nombre);
       setMiPerfil(prevPerfil => ({
        ...prevPerfil,
        Tamano_Letra: value.nombre
      }));
    } else {
      const tamano_letraAuth = AuthServices.getTamanoLetra();
       setTamano_letra(tamano_letraAuth); // Manejar el caso en que se borre la selección
       setMiPerfil(prevPerfil => ({
        ...prevPerfil,
        Tamano_Letra: tamano_letraAuth
      }));
    }
  };
 
  //Se crea el array del 1 al 100
  const sizes = Array.from({ length: 100 }, (_, index) => ({ nombre: (index + 1).toString() }));

  //Array que se muestra en el SelectAutoComplete que se le pasa al SelectAutoComplete por props
  const propsSizes = {
    options: sizes,
    getOptionLabel: (option) => option.nombre,
  };

//Evento o función que maneja el cambio del color del fondo.
const eventoCambioColorFondo = (nuevoColor) => {
  setColorDefondo(nuevoColor); 
    setMiPerfil(prevPerfil => ({
      ...prevPerfil,
      Fondo_Desktop: nuevoColor
    }));
};

//Evento o función que maneja el cambio del color del menú lateral o Drawer.
const eventoCambioColorDrawer = (nuevoColor) => {
  setColor_Drawer(nuevoColor); 
    setMiPerfil(prevPerfil => ({
      ...prevPerfil,
      Color_Nav_Lateral: nuevoColor
    }));
};

//Evento o función que maneja el cambio del color del menú superior o Nav Bar.
const eventoCambioColorNavBar = (nuevoColor) => {
  setColor_navBar(nuevoColor) 
    setMiPerfil(prevPerfil => ({
      ...prevPerfil,
      Color_Nav_Header: nuevoColor
    }));
};

//Evento o función que maneja el cambio del color de las letras, no son de todas.
const eventoCambioColorLetra = (nuevoColor) => {
  setColor_letra(nuevoColor) 
  setMiPerfil(prevPerfil => ({
    ...prevPerfil,
    Color_Letra: nuevoColor
  }));
};

//---------- Metodo para buscar por id  ----------
const buscarPor = (idAsigna, codigo_compania) => {
  const token = AuthServices.getAuthToken();//Trae el token de local store
  if (!ValidaRestricciones.ValidarToken(token)) {return;}//valida el token
  setCargando(true);// Acá, llama o invoca el componente Loading Aleatorio, poniento la const en true

    AsignaCompaniaServico.setAuthToken(token);
    AsignaCompaniaServico.findBy(idAsigna, codigo_compania)
            .then(response => {
              const data = response.data;
              const nuevoUrl = data.Imagen_Desktop.replace(/.*\/media\/([^/]+)/, "/media/$1");
                setMiPerfil(data);
                setTipo_letra(data.Tipo_Letra);
                setTamano_letra(data.Tamano_Letra);
                setColor_letra(data.Color_Letra);
                setColor_Drawer(data.Color_Nav_Lateral);
                setColor_navBar(data.Color_Nav_Header);
                setColorDefondo(data.Fondo_Desktop);
                setNegrita(data.Estilo);
                setImagenDefondo(nuevoUrl);
                // Almacenar los valores sin cambios en el estado
                setTipo_letraSinCambio(data.Tipo_Letra);
                setTamano_letraSinCambio(data.Tamano_Letra);
                setColor_letraSinCambio(data.Color_Letra);
                setColor_DrawerSinCambio(data.Color_Nav_Lateral);
                setColor_navBarSinCambio(data.Color_Nav_Header);
                setColorDefondoSinCambio(data.Fondo_Desktop);
                setNegritaSinCambio(data.Estilo);
                setImagenDefondoSinCambio(nuevoUrl);
              setCargando(false);// Oculta el componente Loading Aleatorio poniendo la const en false
            })
            .catch(e => {
                setCargando(false);// Oculta el componente Loading Aleatorio poniendo la const en false
                ValidaRestricciones.capturaDeErrores(e);
            });
    
};

//---------- Metodo para editar o modificar ----------
const modificar = (e) => {
  const token = AuthServices.getAuthToken(); //Trae el token de local store
  if (!ValidaRestricciones.ValidarToken(token)) {return;}//valida el token
  setCargando(true);// Acá, llama o invoca el componente Loading Aleatorio, poniento la const en true

    var imagen = document.getElementById('imagenDeFondo').files[0];
    AsignaCompaniaServico.setAuthToken(token);
    AsignaCompaniaServico.update(idAsigna, miPerfil, imagen)//Invoca el endpoid del backend 
              .then(response => {
                  if(imagenDefondorest){
                    const eliminaFondo = ". "
                    modificarImagenDeFondo(eliminaFondo);
                  }
                modificarCompaniaLocalStores();
                setCargando(false);// Oculta el componente Loading Aleatorio poniendo la const en false
                navigate("/");// Redirecciona al Menu
              })
              .catch(e => {
                setCargando(false);// Oculta el componente Loading Aleatorio poniendo la const en false
                ValidaRestricciones.capturaDeErrores(e);
              });
 };

const eventoCambioDeImagenFondo = (event) => {
  const imagen = event.target.files[0];
  setMiPerfil(prevPerfil => ({
    ...prevPerfil,
    Imagen_Desktop: imagen
  }));
};

// Este método o función cambia los valores de la compañía en la que está actualmente conectado
const modificarCompaniaLocalStores = ()=>{
  ConfiguracionDeEstilos.aplicaCambios(tipo_letra, tamano_letra, color_Drawer, color_navBar, color_letra, negrita, colorDefondo, imagenDefondo);
}

//Muestra el modal para que confirme o no
const eventoMostrarConfirmar  = (e)=>{
  setMostarModal(true);//Muestra el modal y, dependiendo de la respuesta, realiza eventoConfirmar o eventoCancelar
}

//Evento para confirmar en el modal ModalConfirmar cambio de compañía.
const eventoConfirmar = () => {
  setMostarModal(false);// Cierra el modal
  modificar();//Invoca o llama el método o función de editar.
};

//Evento para cuando se cancela el editar en el modal
const eventoCancelar = () => {
setMostarModal(false)// Cierra el modal
};

//Función o método para restablecer valores por default y le da al clic al botón Restablecer.
const restablecerDefaul = () => {
  setTipo_letra(restTipoLetra);
  setTamano_letra(restTamanoLetra);
  setColor_letra(restColorLetra);
  setColor_Drawer(restColorDrawer);
  setColor_navBar(restColorNavBar);
  setColorDefondo(restFondo);
  setNegrita(restNegrita);
  setImagenDefondo(restImagenDeFondo);
  setImagenDefondorest(true);

  ConfiguracionDeEstilos.aplicaCambios(
    restTipoLetra, restTamanoLetra, restColorDrawer, restColorNavBar, 
    restColorLetra, restNegrita, restFondo, imagenDefondo, restImagenDeFondo
  );

  setMiPerfil(prevPerfil => ({
    ...prevPerfil,
    Tipo_Letra: restTipoLetra,
    Tamano_Letra: restTamanoLetra,
    Fondo_Desktop: restFondo,
    Color_Nav_Lateral: restColorDrawer,
    Color_Nav_Header: restColorNavBar,
    Color_Letra: restColorLetra,
    Estilo: restNegrita,
    Imagen_desktop: restImagenDeFondo,
  }));
}

//Función o método para restablecer valores cuando no guarda y le da al clic al botón cancelar.
const restablecerSinCambios = ()=>{
  setCargando(true);
    ConfiguracionDeEstilos.aplicaCambios(
      tipo_letraSinCambio, tamano_letraSinCambio, color_DrawerSinCambio, color_navBarSinCambio, 
      color_letraSinCambio, negritaSinCambio, colorDefondoSinCambio, imagenDefondoSinCambio
    );

    ConfiguracionDeEstilos.cambiosDeCss(
        tamano_letraSinCambio, tipo_letraSinCambio, color_letraSinCambio, color_DrawerSinCambio,  
        negritaSinCambio, color_navBarSinCambio, colorDefondoSinCambio, imagenDefondoSinCambio
    );

    modificarImagenDeFondo(imagenDefondoSinCambio);
}

const eliminarImagenDeFondo = () =>{
  setEliminarImagen(true);
  setImagenDefondorest(true);
}

const modificarImagenDeFondo = (nuevaImagenDesktop)=>{
  const data = {asigna_compania_id: idAsigna, nueva_imagen_desktop: nuevaImagenDesktop}
  AsignaCompaniaServico.limpiarImagenDeFondo(data).then(response => {
    setCargando(false);// Oculta el componente Loading Aleatorio poniendo la const en false
  })
  .catch(e => {
    console.error(e);
    setCargando(false);// Oculta el componente Loading Aleatorio poniendo la const en false
  });
}

  return(
    <>
    <div className="container container_ConfiguracionesPerfil">
      <div className="card">
        <div className=" card-body">
          <blockquote className="container blockquote mb-0 "> 
                <FormControl component="fieldset" variant="standard">
                  <FormLabel component="legend">Configurar Mi Perfil</FormLabel>
                  <FormGroup>

                    {/*Editar Tipo de letra */}
                    <Box display="flex" alignItems="center"> 
                      <text className = "text-configuracion" style={{marginTop:"1rem", marginRight:"1.9rem"}}><FontAwesomeIcon icon={faFont}/> Fuentes de Tema</text> 
                      <SelectAutoComplete 
                        label = {tipo_letra} 
                        ancho = {180} 
                        defaultProps={propsFonts}
                        onChange={eventoCambioTipoLetra}
                        /> 

                    <FormAgregarLetras listaTiposDeLetra={listaTiposDeLetra} />
                    </Box>

                    {/*Editar Tamaño de letra */}
                    <Box display="flex" alignItems="center"> 
                      <text className = "text-configuracion" style={{marginTop:"1rem", marginRight:"1rem"}}><FontAwesomeIcon icon={faTextHeight}/> Tamaño de Fuente</text> 
                      <SelectAutoComplete 
                        label = {tamano_letra} 
                        ancho = {70} 
                        defaultProps={propsSizes} 
                        onChange={eventoCambioTamanoLetra}
                        />  
                    </Box>

                    {/*Editar Color de letra */}
                    <Box display="flex" alignItems="center" style={{marginTop:"0.550rem"}}> 
                       <text className = "text-configuracion"  style={{ marginRight:"2rem"}}><FontAwesomeIcon icon={faPaintbrush} /> Color de Fuente</text> 
                       <PaletaDeColores colorProp={color_letra} onColorChange={eventoCambioColorLetra}/>
                    </Box>

                    {/*Editar Negrita */}
                    <Box display="flex" alignItems="center" style={{marginTop:"0.450rem"}}> 
                      <text className = "text-configuracion" style={{ marginRight:"2rem"}}><FaBold /> Texto en Negrita</text> 
                      <SwitchAnt 
                        textStart={"Off"}
                        textEnd={"On"}
                        defaultChecked={negrita === "bold"}
                        onChange={(isChecked) => {
                          const estilo = isChecked ? "bold" : "none";
                          setNegrita(estilo);
                          setMiPerfil(prevPerfil => ({
                            ...prevPerfil,
                            Estilo: estilo
                          }));
                        }} 
                      />
                    </Box>

                    {/*Editar Color de Fondo */}
                    <Box display="flex" alignItems="center" style={{marginTop:"0.500rem"}}> 
                    <text className = "text-configuracion" style={{ marginRight:"2.3rem"}}><FontAwesomeIcon icon={faPaintRoller} /> Color de Fondo</text>
                      <PaletaDeColores colorProp={colorDefondo} onColorChange={eventoCambioColorFondo}/>
                    </Box>

                    {/*Editar Color de menu superior o nav bar */}
                    <Box display="flex" alignItems="center" style={{marginTop:"0.550rem"}}> 
                      <text className = "text-configuracion"  style={{ marginRight:"1.5rem"}}><FontAwesomeIcon icon={faPalette} /> Color del Menú superior</text>
                      <PaletaDeColores colorProp={color_navBar} onColorChange={eventoCambioColorNavBar}/>
                    </Box>

                    {/*Editar Color de menu lateral o drawer */}
                    <Box display="flex" alignItems="center" style={{marginTop:"0.550rem"}}> 
                      <text className = "text-configuracion"  style={{ marginRight:"2.2rem"}}><FontAwesomeIcon icon={faFillDrip} /> Color del Menú</text>
                      <PaletaDeColores colorProp={color_Drawer} onColorChange={eventoCambioColorDrawer}/>
                    </Box>

                    {/*Subir imagen de fondo */}
                    <Box display="flex" alignItems="center" style={{ marginTop: "0.550rem" }}>
                      <text className="text-configuracion" style={{ marginRight: "1.5rem" }}>
                        <FontAwesomeIcon icon={faImage} /> Imagen de Fondo
                      </text>
                      <input
                        className="form-control form-control-sm"
                        type="file"
                        id="imagenDeFondo"
                        style={{ width: "50%", marginRight:"1%" }}
                        onChange={eventoCambioDeImagenFondo}
                      />

                      <TooltipCustom title="Clic aquí para eliminar la imagen">
                          <button className="btn btn-danger "
                            style={{
                                    fontFamily: "var(--fontFamily-drawer)", 
                                    fontSize: "calc(var(--fontSize-drawer) - 2px)",
                                    color:"#ffffff",
                                    height:"2rem"
                                  }} 
                            onClick={eliminarImagenDeFondo}
                          > 
                            <i className="bi bi-trash3"></i>
                          </button>
                      </TooltipCustom>

                    </Box>
                   
                  </FormGroup>
                </FormControl>
          </blockquote>  

              {/*Contenedor de botones*/}
              <div className="container" style={{marginTop:"1%"}}>
                  <div className="d-flex justify-content-end align-items-end">
                      {/*Boton guardar*/}
                      <BtnGurdar editar={"Clic para guardar los cambios"} onClick={eventoMostrarConfirmar}/>

                      {/*Boton Restablecer*/} 
                      <TooltipCustom title="Clic aquí para restablecer las configuraciones por defecto del sistema">
                        <button className="btn btn-warning "
                          style={{marginRight:"1%", 
                                  fontFamily: "var(--fontFamily-drawer)", 
                                  fontSize: "calc(var(--fontSize-drawer) - 2px)",
                                  color:"#ffffff"
                                }} 
                          onClick={restablecerDefaul}
                        > 
                          <FontAwesomeIcon icon={faArrowsRotate} /> Restablecer
                        </button>
                      </TooltipCustom>

                      {/*Boton Cancelar*/} 
                      <BtnCancelar 
                        ruta={`/`}
                        onClick={() =>{restablecerSinCambios()}}
                      />

                  </div>
                </div>

                </div>

                  {/*Muestra el Modal o mensaje de Confimar*/}
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

                  <ModalErroresConTitle
                   title={"La imagen ha sido eliminada correctamente."}
                   icon={"warning"}
                   text={"Haz clic en el botón (Guardar) para aplicar los cambios o en el botón (Cancelar) para deshacerlos"}
                   show={eliminarImagen}
                  />

                  {/*Muestra el Loading aleatorio con colores aleatorios y el SVG de New Impact*/}
                  <LoadingAleatorio mostrar={cargando}/>
      </div>
    </div>
    </>
  )
}



