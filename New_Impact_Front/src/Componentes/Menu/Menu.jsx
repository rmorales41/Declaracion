import React, { useEffect, useState } from 'react';
import { Link, useNavigate } from "react-router-dom";
import AuthServices from '../../Servicios/AuthServices';
import MenuDinamicoServicios from '../../Servicios/UsuariosServicios/MenuDinamicoServicios';
import { styled, useTheme} from '@mui/material/styles';
import Box from '@mui/material/Box';
import MuiDrawer from '@mui/material/Drawer';
import MuiAppBar from '@mui/material/AppBar';
import Toolbar from '@mui/material/Toolbar';
import CssBaseline from '@mui/material/CssBaseline';
import Divider from '@mui/material/Divider';
import ListItem from '@mui/material/ListItem'; 
import ListItemButton from '@mui/material/ListItemButton'; 
import List from '@mui/material/List';
import NavBarmenu from '../NavBarmenu/NavBarmenu';
import Avatar from '../NavBarmenu/Avatar';
import Collapse from '@mui/material/Collapse'; 
import TooltipFlotante from "../Componentes/SnackBar/TooltipFlotante"
import CambioDeFlechas from "../Componentes/TextField/CambioDeFlechas"
import { FaBuildingCircleArrowRight } from "react-icons/fa6";
import ConfiguracionDeEstilos from "../../Hooks/ConfiguracionDeEstilos";
import UsuariosServicios from "../../Servicios/UsuariosServicios/CambioDeCompania"
import ModalConfirmar from '../Componentes/Modales/ModalesSweetalert2/ModalConfirmar';
import LoadingAleatorio from "../Componentes/Loading/LoadingAleatorio";
import AsignaCompaniaServico from "../../Servicios/UsuariosServicios/AsignaCompaniaServico"
import CompaniasServicios from "../../Servicios/ConpaniaServicios/CompaniasServicios"
import './Menu.css';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faBars, faAngleDown} from '@fortawesome/free-solid-svg-icons'; 
import useMediaQuery from '@mui/material/useMediaQuery';
import useTooltipCustom from '../Componentes/Tooltip/Tooltip';
import { BsBuildingCheck } from "react-icons/bs";
import { RiLogoutBoxLine } from "react-icons/ri";
import { CgCloseR } from "react-icons/cg";
import BotonMenu from "../Componentes/Boton/BotonMenu"
import ValidaRestricciones from '../../Hooks/ValidaRestricciones';
import CompaniaConfigServicios from "../../Servicios/ConfiguracionServicios/CompaniaConfigServicios/CompaniaConfigServicios"

//--> Estilos cuando el menú o el Drawer está abierto
const openedMixin = (theme, drawerWidth) => ({
  width: drawerWidth,
  transition: theme.transitions.create('width', {
    easing: theme.transitions.easing.sharp,
    duration: theme.transitions.duration.enteringScreen,
  }),
  overflowX: 'auto',
});

//--> Estilos cuando el menú o el Drawer está cerrado 
const closedMixin = (theme) => ({
  transition: theme.transitions.create('width', {
    easing: theme.transitions.easing.sharp,
    duration: theme.transitions.duration.leavingScreen,
  }),
  overflowX: 'hidden',
  width: `calc(${theme.spacing(7)} + 1px)`,
  [theme.breakpoints.up('sm')]: {
    width: `calc(${theme.spacing(8)} + 1px)`,
  },
});

const DrawerHeader = styled('div')(({ theme }) => ({
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'flex-end',
  padding: theme.spacing(0, 1),
  // necessary for content to be below app bar
  ...theme.mixins.toolbar,
}));

//--> Estilos del AppBar o navBar o el menu superior
const AppBar = styled(MuiAppBar, {
  shouldForwardProp: (prop) => prop !== 'open',
})(({ theme, open, drawerWidth }) => ({
  color: 'var(--color-AppBar)', 
  fontFamily: 'var(--fontFamily-AppBar)', 
  fontSize: 'var(--fontSize-AppBar)',
  fontWeight: "bold",
  backgroundColor: 'var(--backgroundColor-AppBar)', 
  zIndex: theme.zIndex.drawer + 1,
  transition: theme.transitions.create(['width', 'margin'], {
    easing: theme.transitions.easing.sharp,
    duration: theme.transitions.duration.leavingScreen,
  }),
  ...(open && {
    backgroundColor: 'var(--backgroundColor-AppBar)', 
    marginLeft: drawerWidth,
    color: 'var(--color-AppBar)',  
    fontFamily: 'var(--fontFamily-AppBar)', 
    fontSize: 'var(--fontSize-AppBar)',
    fontWeight: "bold",
    width: `calc(100% - ${drawerWidth}px)`,
    transition: theme.transitions.create(['width', 'margin'], {
      easing: theme.transitions.easing.sharp,
      duration: theme.transitions.duration.enteringScreen,
    }),
  }),
}));

const Drawer = styled(MuiDrawer, { shouldForwardProp: (prop) => prop !== 'open' })(
  ({ theme, open , drawerWidth}) => ({
    width: drawerWidth,
    flexShrink: 0,
    whiteSpace: 'nowrap',
    boxSizing: 'border-box',
    ...(open && {
      ...openedMixin(theme,drawerWidth),
      '& .MuiDrawer-paper': {
        ...openedMixin(theme,drawerWidth),
        backgroundColor: 'var(--backgroundColor-drawer)', 
        color: 'var(--color-drawer)', 
        fontFamily: 'var(--fontFamily-drawer)', 
        fontSize: 'var(--fontSize-drawer)',
        fontWeight: 'var(--fontWeight-drawer)',
      },
    }),
    ...(!open && {
      ...closedMixin(theme),
      '& .MuiDrawer-paper': {
        ...closedMixin(theme),
        backgroundColor: 'var(--backgroundColor-drawer)', // Set your desired background color for closed state
        color: 'var(--color-drawer)', 
        fontFamily: 'var(--fontFamily-drawer)', 
        fontSize: 'var(--fontSize-drawer)',
        fontWeight: 'var(--fontWeight-drawer)',
      },
    }),
  }),
);

const MiniDrawer =  ({ actualizarEstadoLogiado }) => {
  const theme = useTheme();
  const navigate = useNavigate();
  const esCelular = useMediaQuery(theme.breakpoints.down('md'));
  const [open, setOpen] = useState(false);
  const [anchoDelDrawer, setAnchoDelDrawer] = useState(240); // Para ajustar el ancho del drawer cuando esta abierto 240 por defaul

  const [usuarioMenu, setUsuarioMenu] = useState([]);
  
  const [usuario, setUsuario] = useState("");
  const [compania, setCompania] = useState("");
  const [tipo_letra, setTipo_letra] = useState("");
  const [tamano_letra, setTamano_letra] = useState("");
  const [color_Drawer, setColor_Drawer] = useState("");
  const [color_navBar, setColor_navBar] = useState("");
  const [color_letra, setColor_letra] = useState("");
  const [negrita, setNegrita] = useState("");
  const [colorDefondo, setColorDefondo] = useState("");
  const [imagenDefondo, setImagenDefondo] = useState("")
  const [companias, setCompanias] = useState([]);
  const estaLogiadoAuth = AuthServices.getAuth_esta_Loging();
  const [estaLogiado, setEstaLogiado] = useState(estaLogiadoAuth);
  const [abrirCollapse1, setAbrirCollapse1] = useState([]);
  const [abrirCollapse2, setAbrirCollapse2] = useState([]);
  const [abrirCollapse3, setAbrirCollapse3] = useState([]);
  const TooltipCustom = useTooltipCustom();//Para renderizar el componente useTooltipCustom
  const [hoveredItem, setHoveredItem] = useState(null);
  const [mostarModal, setMostarModal] = useState(false);// Para mostrar el modal de cambio de compañia 
  const companiaTem = AuthServices.getCompanias()
  const [companiaSeleccionada, setCompaniaSeleccionada] = useState(companiaTem !== null ? companiaTem : {});
  const [cargando, setCargando] = useState(false);//Muestra o no el Loading
  const [tipoDeCambioVenta, setTipoDeCambioVenta] = useState("");
  const [tipoDeCambioCompra, setTipoDeCambioCompra] = useState("");
  const [tipoDeCambioPosVenta, setTipoDeCambioPosVenta] = useState("");
  const [menuFavoritos, setMenuFavoritos] = useState([]);
  const [idAsignaCompania, setIdAsignaCompania] = useState("");
  const favoritosAuth = AuthServices.getFormulariosFavoritos();
  const [menuFavoritosAuth, setMenuFavoritosAuth] = useState(favoritosAuth || []);
  const [codigo_compania, setCodigo_compania] = useState(0);



  useEffect(()=>{
    const codigoAuth = AuthServices.getCodigoCompania();
    const id = AuthServices.getIdAsigna();
    setCodigo_compania(codigoAuth)
    getMenuDinamico(codigoAuth);// Para que refresque el menu cada ves que cambia la variable estaLogiado
    if(id){
      buscarPor(id, codigoAuth)
      setIdAsignaCompania(id)
    }
    if(codigoAuth)buscarCompaniaActual(codigoAuth);//Busca la compania actual para guardalo en el local Stores

  },[codigo_compania])

  useEffect(() => {
    const compraAuth = AuthServices.getTipoDeCambioCompra();
    const ventaAuth = AuthServices.getTipoDeCambioVenta();
    const posVentaAuth = AuthServices.getTipoDeCambioPosVenta();
    const id = AuthServices.getIdAsigna();
    setTipoDeCambioVenta(compraAuth);
    setTipoDeCambioCompra(ventaAuth);
    setTipoDeCambioPosVenta(posVentaAuth);
    if(id){
      buscarPor(id)
      setIdAsignaCompania(id)
    }
  }, []);

  //Lo hace cada que se abre la ventana o cambie la variable estaLogiado
  useEffect(() => {
    const usuarioAuht = AuthServices.getUsername();// Se trae el nombre username logiado o el nombre username
    const estaLogiadoAuth = AuthServices.getAuth_esta_Loging(); // Verifica si se logio y trae token
    const companiasAuht = AuthServices.getCompanias(); // Se trae las compañias cuando se logea 
    if(companiasAuht){
      const companiaDefault = companiasAuht.length > 0 ? companiasAuht.find(compania => compania.activo === true) : 'New Impact';

      setCompanias(companiasAuht);// Le Asigna las compañias cuando esta logiado
      setUsuario(usuarioAuht);//Le Asigna nombre username a la contante o variable usuario
      setEstaLogiado(estaLogiadoAuth);//Le Asigna si esta logiado a la contante o variable estaLogiado

      ConfiguracionDeEstilos.cambiosDeCss( 
        tamano_letra, tipo_letra, color_letra, color_Drawer,  negrita, color_navBar, colorDefondo, imagenDefondo
      )

      if(compania === ""){
        if(companiaDefault.nombre){
          setCompania(companiaDefault.nombre)
          document.title =  `New Impact - ${companiaDefault.nombre}`;//Se le agrega al titulo de la pagina el nombre la compañia conectada
        }
      }
    }
  }, [estaLogiado, compania, color_navBar, imagenDefondo, tamano_letra, tipo_letra, color_letra, color_Drawer, negrita, colorDefondo]);// Observa siempre la variable estaLogiado


  //----Método para get o listar para el menu dinamico
  const getMenuDinamico = (codigo) => {
    const token = AuthServices.getAuthToken();// Trae el token de local store
    if (!ValidaRestricciones.ValidarToken(token)) {return;}//valida el token
    setCargando(true)
      MenuDinamicoServicios.setAuthToken(token); // Le manda el token en el encabezado de la consulta del endpoind
      MenuDinamicoServicios.getMenudinamico(codigo) // Invoca o llama el metodo get de todo de servicios Menu dinamico  
        .then(response => {
          setUsuarioMenu(response.data); // Guada lo que se devolvió del back-end en la variable usarioMenu que es un array
          setCargando(false)
        })
        .catch(e => {
          setCargando(false)
          ValidaRestricciones.capturaDeErrores(e);
        });
     
    setCargando(false)
  };

  //--> Cerrar Sección
  const cerrarSesion = () => {
    const token = AuthServices.getAuthToken();
    AuthServices.cerrrarSeccion(token);
    AuthServices.removeAuthToken();
    setEstaLogiado(null); 
    actualizarEstadoLogiado(null);
    localStorage.removeItem('estaLogin');
    navigate("/Login")
  }

  //--> Abre el menú o el Drawer
  const handleDrawerOpen = () => setOpen(true);

  //--> Cierra el menú o el Drawer
  const handleDrawerClose = () => setOpen(false);

  //--> Muestra el SnackBar o el tooltips flotantes de observaciones
  const handleHover = (text) => setHoveredItem(text);

  //--> Oculta el SnackBar o el tooltips flotantes de observaciones
  const handleClose = () =>  setHoveredItem(null); 

  // Manejo del clic fuera del drawer para cerrarlo, si el drawer o menú lateral esta abierto y se le da clic afuera del drawer o menú lateral lo cierra
  useEffect(() => {
    const cerrarDrawerClicOut = (event) => {
      if (open && !event.target.closest('.MuiDrawer-root')) handleDrawerClose();
    };

    document.addEventListener('click', cerrarDrawerClicOut);
    return () => {
      document.removeEventListener('click', cerrarDrawerClicOut);
    };
  }, [open]);

  //Manejo del clic en el botón para abrir el menú lateral o el Drawer esto, ya que si le ponía un Tooltip no se abría el drawer o menú lateral
  const handleButtonClick = (e) => {
    e.stopPropagation(); // Evitar la propagación del evento al Tooltip --- esto soluciona el problema
    handleDrawerOpen();
  }; 

  //----> Eventos para abrir los menus de los principales ejemplo Proveedores, clientes, tesoreria, en el json seria  "categoria": "Módulo principal (nivel 1)",
  const eventoCollapseNivel1 = (index) => {
    const currentIndex = abrirCollapse1.indexOf(index);
    const nuevoAbrirCollapse1 = [...abrirCollapse1];
    if (currentIndex === -1) {
      nuevoAbrirCollapse1.push(index);
      setAnchoDelDrawer(330); // Abrir el drawer a 300px
    }else{
      nuevoAbrirCollapse1.splice(currentIndex, 1);
      if (!nuevoAbrirCollapse1.length) { // Si no hay eventos abiertos, volver a 240px
        setAnchoDelDrawer(240);
      }
    }
    setAbrirCollapse1(nuevoAbrirCollapse1);
  };

  //--------> Eventos para abrir los submenus en el JSON seria  "categoria": "Submódulos (nivel 2)"
  const eventoCollapseNivel2 = (index) => {
    const currentIndex = abrirCollapse2.indexOf(index);
    const nuevoAbrirCollapse2 = [...abrirCollapse1];
    if (currentIndex === -1) {
      nuevoAbrirCollapse2.push(index);
    }else{
      nuevoAbrirCollapse2.splice(currentIndex, 1);
    }
    setAbrirCollapse2(nuevoAbrirCollapse2);
  };

  //----> Eventos para abrir los sub submenus en el JSON seria  "categoria": "Sub-submódulos (nivel 3)"
  const eventoCollapseNivel3 = (index) => {
    const currentIndex = abrirCollapse3.indexOf(index);
    const nuevoAbrirCollapse3 = [...abrirCollapse3];
    if (currentIndex === -1) {
      nuevoAbrirCollapse3.push(index);
    }else{
      nuevoAbrirCollapse3.splice(currentIndex, 1);
    }
    setAbrirCollapse3(nuevoAbrirCollapse3);
  };

  //----> Evento para cambiar la compañia
  const eventoCambioCompania = (nombreCompania, codigoCompania) => {
    const token = AuthServices.getAuthToken();// Trae el token de local store
    const favoritosAuth = AuthServices.getFormulariosFavoritos(); // Obtener favoritos del usuario actual
    setCompania(nombreCompania)
    document.title = `New Impact - ${nombreCompania}`;//Se le agrega al titulo de la pagina el nombre la compañia conectada
    AuthServices.setCodigoCompania(codigoCompania);// Se trae el nombre username logiado o el nombre username
    if (!ValidaRestricciones.ValidarToken(token)) {return;}//valida el token
    setCargando(true)
      UsuariosServicios.setAuthToken(token);
      var codigo = {id_compania:codigoCompania};
      UsuariosServicios.cambioDeCompaniaDefault(codigo)
        .then(async response => {
          //----> Modifica el json que esta guardado ya en el localStorage cuando se habia logueado
          const companiasAuht = AuthServices.getCompanias(); //Trae las compañias del localStorage cuando se habia logueado
          if(companiasAuht){
            const nuevaCompaniaActiva = companiasAuht.find(compania => compania.codigo === codigoCompania);// Encuentra la compañía correspondiente al código activo
            if (nuevaCompaniaActiva) {
                const companiaAnteriorActiva = companiasAuht.find(compania => compania.activo === true);// Busca la compañía que estaba activa anteriormente
                if (companiaAnteriorActiva) {         
                    companiaAnteriorActiva.activo = false;// Cambia el estado activo de la compañía anterior a false
                }
                nuevaCompaniaActiva.activo = true;// Cambia el estado activo de la nueva compañía a true
                AuthServices.setCompanias(companiasAuht);// Guarda los cambios en localStorage
                ConfiguracionDeEstilos.aplicarEstilos();// Invoca o llama al hook personalizado con los estilos
                  setTipo_letra(nuevaCompaniaActiva.tipo_letra);// Le Asigna nombre de la compañia esta logiado
                  setTamano_letra(nuevaCompaniaActiva.tamano_letra);// Le Asigna el tamaño de letra esta logiado
                  setColor_letra(nuevaCompaniaActiva.color_letra);// Le Asigna color de letra esta logiado
                  setNegrita(nuevaCompaniaActiva.estilo);// Le Asigna si quiere negrita en la letrea de cuando esta logiado
                  setColor_Drawer(nuevaCompaniaActiva.color_nav_lateral);// Le Asigna color del drawer cada ves que cambia de compañia
                  setColor_navBar( nuevaCompaniaActiva.color_nav_header);// Le Asigna color del nav Bar cada ves que cambia de compañia
                  localStorage.removeItem('idAsigna');//Elimina el id Asigna compania del localStorage
                  AuthServices.setIdAsigna(nuevaCompaniaActiva.IDUsuarios_Asigna_Compania)// Guarda el nuevo id Asigna compania en el localStorage
                  localStorage.removeItem('codigo');//Elimina el codigo de compania del localStorage
                  AuthServices.setCodigoCompania(nuevaCompaniaActiva.codigo);//Le agrega el nuevo código al localStores
                  setCodigo_compania(nuevaCompaniaActiva.codigo);//Le agrega el nuevo código a la constante o variable codigo
                  document.documentElement.style.setProperty('--background-color-App', nuevaCompaniaActiva.fondo_desktop );
                  document.body.style.backgroundColor = nuevaCompaniaActiva.fondo_desktop;
                  getMenuDinamico(nuevaCompaniaActiva.codigo);
                  buscarCompaniaActual(nuevaCompaniaActiva.codigo);//Cambia de compañia
                const confiCompania = await obtenerConfigCompania(token, nuevaCompaniaActiva.codigo);// Obtiene las configuraciones de la compañia
                  localStorage.removeItem('companiaConfig');//Elimina las configuraciones de la compañia del localStorage
                  AuthServices.setCompaniaConfig(confiCompania[0]);// Guarda las configraciones de la nueva compañia en el localStorage

                const url = nuevaCompaniaActiva.imagen_desktop
                const nuevoUrl = url ? url.replace(/.*\/media\/([^/]+)/, "/media/$1") : null;
                  setImagenDefondo(nuevoUrl)// Le Asigna la imagen cada ves que cambia de compañia
                  if(favoritosAuth){
                    const idCompania = nuevaCompaniaActiva.IDUsuarios_Asigna_Compania;
                    const favoritosUsuario = favoritosAuth.filter(favorito => favorito.usuario.toString() === usuario.toString());// Filtrar los favoritos por usuario
                    const favoritosCompania = favoritosUsuario.filter(favorito => favorito.idAsignaCompania.toString() === idCompania.toString());// Filtrar los favoritos por compañia
                      setIdAsignaCompania(nuevaCompaniaActiva.IDUsuarios_Asigna_Compania)
                      setMenuFavoritos(favoritosCompania);
                  }
                navigate("/");// Redirecciona al Menu
                setCargando(false)
            }
            setCargando(false)
        }
        })
        .catch(e => {
          setCargando(false)
          ValidaRestricciones.capturaDeErrores(e);
        })
   
    setCargando(false)
  }

//Evento para confirmar en el modal ModalConfirmar cambio de compañia
  const eventoConfirmar = () => {
    const estaLogiado =  AuthServices.getAuth_esta_Loging();
    setMostarModal(false);// Cierra el modal
    if(estaLogiado){
      if(companiaSeleccionada.nombre){
         eventoCambioCompania(companiaSeleccionada.nombre, companiaSeleccionada.codigo);// Realiza la funcion de cambio decompañia
      }
    }
  };

  //Evento para cuando se cancela el editar en el modal
  const eventoCancelar = () => {
    setMostarModal(false)
  };

  //Evento que muestra el modal para confirmar el cambio d ecompañia si o no
  const seleccionarCompania = (compania) => {
    const estaLogiado =  AuthServices.getAuth_esta_Loging();
    if(estaLogiado){
      setCompaniaSeleccionada(compania);// Se guarda el objeto compania en setCompaniaSeleccionada
      setMostarModal(true);//Muestra el modal de confirmar cambio de compañia
    }
  };

  //---------- Metodo para buscar por id  ----------
  const buscarPor = (idAsigna, codigo) => {
  const token = AuthServices.getAuthToken();//Trae el token de local store
  if (!ValidaRestricciones.ValidarToken(token)) {return;}//valida el token
  setCargando(true);// Acá, llama o invoca el componente Loading Aleatorio, poniento la const en true
    AsignaCompaniaServico.setAuthToken(token);
    AsignaCompaniaServico.findBy(idAsigna, codigo)
            .then(response => {
              const data = response.data;
              const nuevoUrl = data.Imagen_Desktop.replace(/.*\/media\/([^/]+)/, "/media/$1");
                setTipo_letra(data.Tipo_Letra);
                setTamano_letra(data.Tamano_Letra);
                setColor_letra(data.Color_Letra);
                setNegrita(data.Estilo);
                setColor_Drawer(data.Color_Nav_Lateral);
                setColor_navBar(data.Color_Nav_Header);
                setImagenDefondo(nuevoUrl);
                setColorDefondo(data.Fondo_Desktop);
                setImagenDefondo(nuevoUrl);
                setCargando(false);// Oculta el componente Loading Aleatorio poniendo la const en false
            })
            .catch(e => {
                setCargando(false);// Oculta el componente Loading Aleatorio poniendo la const en false
                ValidaRestricciones.capturaDeErrores(e);
            });
     
  };

  const navBarFavoritos = [
    { "nombre": "POS", "ruta": "/Configuracion-Perfil/"},
    { "nombre": "FE" , "ruta": "/Configuracion-Perfil/"},
    { "nombre": "FL" , "ruta": "/Configuracion-Perfil/"},
    { "nombre": "RD" , "ruta": "/Configuracion-Perfil/"},
    { "nombre": "AP" , "ruta": "/Configuracion-Perfil/"},
    { "nombre": "CP" , "ruta": "/Configuracion-Perfil/"},
    { "nombre": "DP" , "ruta": "/Configuracion-Perfil/"},
    { "nombre": "BS" , "ruta": "/Configuracion-Perfil/"},
    { "nombre": "PRA" , "ruta": "/Configuracion-Perfil/"},
    { "nombre": "CC" , "ruta": "/Configuracion-Perfil/"},
  ];

// Evento para agregar o quitar formularios favoritos
  const eventoCambioDeFavorito = (menuItem, value) => {

      if (value === 1) { // Si se marca el rating, agrega el objeto al array
        const nuevoMenuFavoritosAuth = [...menuFavoritosAuth, menuItem]
        setMenuFavoritosAuth(nuevoMenuFavoritosAuth);
        AuthServices.limpiaFormularioFavoritos();
        AuthServices.setFormulariosFavoritos(nuevoMenuFavoritosAuth);
        const favoritosUsuario = nuevoMenuFavoritosAuth.filter(favorito => favorito.usuario.toString() === usuario.toString());// Filtrar los favoritos por usuario
        const favoritosCompania = favoritosUsuario.filter(favorito => favorito.idAsignaCompania.toString() === idAsignaCompania.toString());// Filtrar los favoritos por compañia
        setMenuFavoritos(favoritosCompania);
        
      } else { // Si se desmarca el rating, elimina el objeto del array
        const favoritosUsuario = menuFavoritosAuth.filter(favorito => favorito.usuario.toString() === usuario.toString());// Filtrar los favoritos por usuario
        const favoritosCompania = favoritosUsuario.filter(favorito => favorito.idAsignaCompania.toString() === idAsignaCompania.toString());// Filtrar los favoritos por compañia
        const nuevoMenuFavoritos = favoritosCompania.filter(submenu => submenu.id !== menuItem.id);
        const eliminarMenuFavoritos = favoritosCompania.filter(submenu => submenu.id === menuItem.id);
        setMenuFavoritos(nuevoMenuFavoritos);
        const nuevoMenuFavoritosAuth = menuFavoritosAuth.filter(item => !eliminarMenuFavoritos.includes(item)); // Eliminar los elementos de eliminarMenuFavoritos de menuFavoritosAuth
        AuthServices.limpiaFormularioFavoritos();
        AuthServices.setFormulariosFavoritos(nuevoMenuFavoritosAuth);
      }
  };

useEffect(() => {
  const favoritosAuth = AuthServices.getFormulariosFavoritos(); // Obtener favoritos del usuario actual
    if(favoritosAuth){
      const favoritosUsuario = favoritosAuth.filter(favorito => favorito.usuario.toString() === usuario.toString());// Filtrar los favoritos por usuario
      if(favoritosUsuario.length > 0){ 
        const favoritosCompania = favoritosUsuario.filter(favorito => favorito.idAsignaCompania.toString() === idAsignaCompania.toString());// Filtrar los favoritos por compañia
        setMenuFavoritos(favoritosCompania);
      }
    }
}, [usuario, idAsignaCompania]);

const buscarCompaniaActual = (codigo_compania) =>{
  const token = AuthServices.getAuthToken();//Trae el token de local store
  if (!ValidaRestricciones.ValidarToken(token)) {return;}//valida el token

      CompaniasServicios.setAuthToken(token);
      CompaniasServicios.findBy(codigo_compania)
          .then(response => {
            const data = response.data;
            localStorage.removeItem('companiaActual');//Elimina la companiaActual del localStorage
            AuthServices.setCompaniaActual(data)//Le agrega la companiaActual al localStorage
          })
          .catch(e => {
              ValidaRestricciones.capturaDeErrores(e);
          });
}

//---- Obtener configuraciones de compañias 
const obtenerConfigCompania = async (token ,codigoCompania) => {
  if (!ValidaRestricciones.ValidarToken(token)) return null; // Valida el token
  CompaniaConfigServicios.setAuthToken(token); // Le manda el token al encabezado de la consulta del endpoind
  try {
    const response = await CompaniaConfigServicios.getAll(codigoCompania); // Invoca el método listar o el get de servicios
    return response.data;
  } catch (e) {
    //ValidaRestricciones.capturaDeErrores(e); // Valida y devuelve los errores del backend
    console.error(e)
    return null;
  }
};

return (
    <Box  sx={{ display: 'flex'}} >
      <CssBaseline />
      <AppBar position="fixed" open={open}
         drawerWidth={anchoDelDrawer}   
         tipo_letra={tipo_letra} 
         tamano_letra={tamano_letra}
         color_Drawer={color_Drawer}
         color_navBar={color_navBar}
         color_letra={color_letra}
         negrita={negrita} 
         >
        <Toolbar>
          {/*Válida si la pantalla es muy pequeña, si lo es, invoca otro navBar que es responsivo*/}
          {esCelular ? (
            <>
               <NavBarmenu 
                handleDrawerOpen = {handleButtonClick}
                cerrarSesion = {cerrarSesion} 
                open = {open}
                compania = {compania}
                usuario = {usuario}
                handleHover = {handleHover}
                handleClose = {handleClose}
                companias = {companias}
                seleccionarCompania = {seleccionarCompania}
                hoveredItem={hoveredItem}
                tipoDeCambioCompra={tipoDeCambioCompra}
                tipoDeCambioVenta={tipoDeCambioVenta}
                navBarFavoritos={navBarFavoritos}
                menuFavoritos={menuFavoritos}
               />
            </>
          ) : (
            <>
             {/*boton para abrir el Drawer o menu lateral*/}
              <button className='nav-link' onClick={handleButtonClick} >
                  <TooltipCustom title="Clic para abrir el menú desplegable."> 
                    <FontAwesomeIcon icon={faBars} className='abrirMenu' />
                  </TooltipCustom>
              </button>

             {/*--- Links del navBar o menu superior ---*/}
              {navBarFavoritos && navBarFavoritos.map((favoritos) => (
                <>
                  <TooltipCustom placement="left" title={"Clic para ir a " + favoritos.nombre}>
                    <Link className="nav-link" to={""}  >{favoritos.nombre}</Link>
                  </TooltipCustom>
                </>
              ))}

              <BotonMenu
                menuFavoritos={menuFavoritos}
              />

                <Toolbar sx={{ marginLeft: 'auto'}}>

                  {/*--- Tipo de cambio para la compra y venta ---*/}
                  <div>
                      <TooltipCustom placement="left" title={"El tipo de cambio de compra para hoy es de: " + tipoDeCambioCompra}>
                        <label className="label-tipoCambio">Compra : {tipoDeCambioCompra}</label>
                      </TooltipCustom>
                      <TooltipCustom placement="left" 
                        title={"El tipo de cambio de venta para hoy es de: " + tipoDeCambioVenta + " , mientras que el de PosVenta es de: " + tipoDeCambioPosVenta}>
                        <label className="label-tipoCambio">Venta : {tipoDeCambioVenta}</label>
                      </TooltipCustom>
                      
                  </div> 

                  <div className="btn-group">
                      {/*compañia conectada*/}
                      <TooltipCustom placement="left" title={"Estas conectado a " + compania}>
                      <button className="btn dropdown-item "
                               type="button" data-bs-toggle="dropdown" 
                               onMouseEnter={() => { handleHover("Clic para ver las opciones de conexión a diferentes compañías");}}
                               onMouseLeave={handleClose}>
                            <BsBuildingCheck /> {compania} <FontAwesomeIcon icon={faAngleDown} />
                        </button>
                        </TooltipCustom>

                      {/*Menu de compañias que se puede conectar*/}
                      <ul className="dropdown-menu">
                        {companias && companias.map((companiasC) => (
                          <>
                          <TooltipCustom placement="left" title={"Clic para conectase a " + companiasC.nombre}>
                          <button className="dropdown-item"
                                  style={{fontSize:'var(--fontSize-drawer)'}}  
                                  onClick={() => {
                                    seleccionarCompania(companiasC)
                                  }}   
                          >  
                            <FaBuildingCircleArrowRight /> {companiasC.nombre}
                          </button>
                            </TooltipCustom>
                          </>
                        ))}
                        </ul>

                      {/*Avatar de las iniciales del nombre*/}
                      <TooltipCustom placement="left" title="Clic para ver el Usuario y Cerrar Sección">
                        <button className="btn btn-avatar" type="button" data-bs-toggle="dropdown" >
                          <Avatar nombre={usuario + " ."}/>
                        </button>
                      </TooltipCustom> 

                      {/*Menu de usuario , y cerrar seccion*/}
                      <ul className="dropdown-menu">
                        <TooltipCustom placement="left" title={"Logueado con " + usuario +", Clic aquí para configurar mi perfil"}>
                          <Link to={"/Configuracion-Perfil/"}  className="dropdown-item text-dropdown " > <i className="bi bi-person-gear"></i>{" Mi perfil "}</Link> 
                        </TooltipCustom>  
                        <TooltipCustom placement="left" title={"Estas conectado a " + compania}>
                          <div  className="dropdown-item text-dropdown"> <BsBuildingCheck /> {compania}</div>
                        </TooltipCustom>    
                          <TooltipCustom placement="left" title="Clic para Cerrar Sección">
                              <Link className="dropdown-item " onClick={cerrarSesion} to={"/"} >  
                                  <div  className="dropdown-item"> <RiLogoutBoxLine /> Cerrar Sección</div>
                              </Link>
                          </TooltipCustom> 
                      </ul>
                  </div>
                </Toolbar>
            </>
          )}
        </Toolbar>
      </AppBar>
          
      {/*El componente Drawer es el menu lateral y es de Material UI*/}
      <Drawer 
          variant="permanent" 
          anchor="left" 
          open={open} 
          drawerWidth={anchoDelDrawer}
      >
 
        {/*Encabezado del Drawer o menu lateral*/}
        <DrawerHeader>
          {/*Boton Cerrar Sección*/}
          <TooltipCustom title="Clic para Cerrar Sección">
              <Link className="btn btn_cerrarSesion" onClick={cerrarSesion} to={"/"} >  
                   <RiLogoutBoxLine />
              </Link>
          </TooltipCustom> 
          {/*Boton para cerrar el menú desplegable*/}
          <TooltipCustom title="Clic para cerrar el menú desplegable." > 
            <button className='btn btn_close'onClick={handleDrawerClose}>
              <CgCloseR /> 
            </button>
          </TooltipCustom>
        </DrawerHeader>
        {/*Si el Drawer esta abierto muestra el nombre de usuario abajo del logo, si no solo muestra el logo*/}
        {open ? (
          <div className='perfil-usuario-abierto'>
            <i className="bi bi-person-circle logo-usuario"></i>
            <h3 className="nombre-usuario">{usuario}</h3>
          </div>
        ):(
          <div className='perfil-usuario-cerrado'>
            <i className="bi bi-person-circle logo-usuario-cerrado"></i>
          </div>
        )}
         {/*Esta es la línea que se ve para separar el encabezado con la lista*/}
        <Divider sx={{backgroundColor:"black"}}/>

        <List className='list-menu'>
            {/*Desde acá es donde se forma el menú dinámico, empezando por mapear el nivel 1*/}
            {usuarioMenu &&
              usuarioMenu.sort((a, b) => a.posicion - b.posicion).map((menuNivel1, index1) => ( 
                <ListItem key={index1} disablePadding sx={{ display: 'block' }}> 
                  <ListItemButton 
                    sx={{ minHeight: 48, justifyContent: open ? 'initial' : 'center',  px: 2.5, marginBottom:"-14px",'&:hover':  {opacity: 0.5 } }}
                    onClick={() => {open && eventoCollapseNivel1(menuNivel1.id)}}
                    onMouseEnter={(e) => { handleHover(menuNivel1.Ayuda); }}// Mustra el SnackBar o tooltips flotante
                    onMouseLeave={handleClose}// Cierra el SnackBar o tooltips flotante
                  >
                    <TooltipCustom title={menuNivel1.nombre}> 
                        <i className={menuNivel1.logo + " logo-menu" } onClick={() => {!open && (handleDrawerOpen())}}> </i> 
                    </TooltipCustom> 

                    <CambioDeFlechas 
                      open={open}//Valida si esta abieto el menu lateral o drawer
                      tieneCollapse={menuNivel1.submenu.length}// Valida que tenga sub menus
                      subMenu={false}// Valida si es para el Nivel1
                      nombre={menuNivel1.nombre}// Se le manda el nombre  
                      collapseAbierto={abrirCollapse1.includes(menuNivel1.id)}// Verfica si esta abierto o cerrado el collapse
                      tamano_letra={tamano_letra}// Le manda el tamaño de la letra
                      tipo_letra={tipo_letra}// Le manda el tipo de la letra
                      classeDelLogo = {"logo-collapse-submenus"}
                      menuItem={{ id: 0, nombre: " ", ruta: " ", icono: " ", ayuda: " " }}
                    />
                  </ListItemButton>

                  {/*Desde acá es donde se forma el menú nivel 2*/}
                  {open ? (<>
                  {menuNivel1.submenu && menuNivel1.submenu.map((menuNivel2, index2) => (
                    <Collapse in={abrirCollapse1.includes(menuNivel1.id)} timeout="auto" unmountOnExit key={index2}>
                      <List disablePadding>
                        <ListItemButton 
                          sx={{ marginLeft:"15%", fontSize: 'var(--fontSize-drawer)', marginBottom:"-9px", fontFamily: tipo_letra, '&:hover': {opacity: 0.5 }}}
                          to={menuNivel2.ruta ? menuNivel2.ruta +`/${menuNivel2.idSubmenu}`: ""}// Se le manda el id del formulario para saber las restricciones de campos
                          onClick={() => eventoCollapseNivel2(menuNivel2.idSubmenu)}
                          onMouseEnter={(e) => { handleHover(menuNivel2.Ayuda);}}// Mustra el SnackBar o tooltips flotante
                          onMouseLeave={handleClose}// Cierra el SnackBar o tooltips flotante
                        >
                            <i className={menuNivel2.logo + " logos-submenus"} > </i> 
                            <CambioDeFlechas 
                              open={open}//Valida si esta abieto el menu lateral o drawer
                              tieneCollapse={menuNivel2.sub_submenu.length}// Valida que tenga sub menus
                              subMenu={true}// Valida si es para el Nivel1
                              collapseAbierto={abrirCollapse2.includes(menuNivel2.idSubmenu)}// Verfica si esta abierto o cerrado el collapse
                              tipo_letra={tipo_letra}// Le manda el tipo de la letra
                              classeDelLogo = {"logo-collapse-submenus"}
                              onRatingChange={eventoCambioDeFavorito}
                              nombre={ menuNivel2.nombreSubmenu}// Se le manda el nombre  
                              menuItem={{ 
                                id: menuNivel2.idSubmenu, 
                                nombre: menuNivel2.nombreSubmenu, 
                                ruta: menuNivel2.ruta +`/${menuNivel2.idSubmenu}`, 
                                icono: menuNivel2.logo, 
                                ayuda: menuNivel2.Ayuda,
                                usuario: usuario,
                                idAsignaCompania: idAsignaCompania,
                              }}
                              menuFavoritos = {menuFavoritos}
                            />
                            
                        </ListItemButton>
                        
                        {/*Desde acá es donde se forma el menú nivel 3*/}
                        {menuNivel2.sub_submenu && menuNivel2.sub_submenu.map((menuNivel3, index3) => (
                          <Collapse in={abrirCollapse2.includes(menuNivel2.idSubmenu)} timeout="auto" unmountOnExit key={index3}>
                            <List disablePadding>
                              <ListItemButton 
                                sx={{ marginLeft:"25%", fontFamily: tipo_letra, fontSize:'var(--fontSize-drawer)', '&:hover':{opacity: 0.5 }}}
                                to={menuNivel3.ruta ? menuNivel3.ruta + `/${menuNivel3.idSub_submenu}`: ""}// Se le manda el id del formulario para saber las restricciones de campos
                                onClick={() => eventoCollapseNivel3(menuNivel3.idSub_submenu)}
                                onMouseEnter={(e) => { handleHover(menuNivel3.Ayuda);}}// Mustra el SnackBar o tooltips flotante
                                onMouseLeave={handleClose}// Cierra el SnackBar o tooltips flotante
                                >
                                <i className={menuNivel3.logo + " logos-submenus"}> </i>
                                 <CambioDeFlechas 
                                  open={open}//Valida si esta abieto el menu lateral o drawer
                                  tieneCollapse={ menuNivel3.sub_subsubmenu.length}// Valida que tenga sub menus
                                  subMenu={true}// Valida si es para el Nivel1
                                  nombre={menuNivel3.nombreSub_submenu}// Se le manda el nombre  
                                  collapseAbierto={abrirCollapse3.includes(menuNivel3.idSub_submenu)}// Verfica si esta abierto o cerrado el collapse
                                  tamano_letra={tamano_letra}// Le manda el tamaño de la letra
                                  tipo_letra={tipo_letra}// Le manda el tipo de la letra
                                  classeDelLogo = {"logo-collapse-subsubmenus"}
                                  onRatingChange={eventoCambioDeFavorito}
                                  menuItem={{ 
                                    id: menuNivel3.idSub_submenu, 
                                    nombre:menuNivel3.nombreSub_submenu, 
                                    ruta: menuNivel3.ruta +`/${menuNivel3.idSub_submenu}`, 
                                    icono: menuNivel3.logo, 
                                    ayuda: menuNivel3.Ayuda, 
                                    usuario: usuario,
                                    idAsignaCompania: idAsignaCompania,
                                  }}
                                  menuFavoritos = {menuFavoritos}
                                />
                              </ListItemButton>

                               {/*Desde acá es donde se forma el menú nivel 4*/}
                                {menuNivel3.sub_subsubmenu && menuNivel3.sub_subsubmenu.map((menuNivel4, index4) => (
                                  <Collapse in={abrirCollapse3.includes(menuNivel3.idSub_submenu)} timeout="auto" unmountOnExit key={index4}>
                                    <List disablePadding>
                                      <ListItemButton 
                                        sx={{ marginLeft:"35%", fontFamily: tipo_letra, fontSize: 'var(--fontSize-drawer)', '&:hover':{opacity: 0.5 }}}
                                        to={menuNivel4.ruta ? menuNivel4.ruta + `/${menuNivel4.idSub_sub_submenu}`: ""}// Se le manda el id del formulario para saber las restricciones de campos
                                        onMouseEnter={(e) => { handleHover(menuNivel4.Ayuda);}}// Mustra el SnackBar o tooltips flotante
                                        onMouseLeave={handleClose}// Cierra el SnackBar o tooltips flotante
                                        >
                                        <i className={menuNivel4.logo + " logos-submenus"}> </i>
                                        <CambioDeFlechas 
                                          open={open}//Valida si esta abieto el menu lateral o drawer
                                          subMenu={true}// Valida si es para el Nivel1
                                          nombre={menuNivel4.nombreSub_sub_submenu}// Se le manda el nombre  
                                          tamano_letra={tamano_letra}// Le manda el tamaño de la letra
                                          tipo_letra={tipo_letra}// Le manda el tipo de la letra
                                          classeDelLogo = {"logo-collapse-subsubmenus"}
                                          onRatingChange={eventoCambioDeFavorito}
                                          menuItem={{ 
                                            id: menuNivel4.idSub_sub_submenu, 
                                            nombre: menuNivel4.nombreSub_sub_submenu, 
                                            ruta: menuNivel4.ruta +`/${menuNivel4.idSub_sub_submenu}`, 
                                            icono: menuNivel4.logo, 
                                            ayuda: menuNivel4.Ayuda,
                                            usuario: usuario,
                                            idAsignaCompania: idAsignaCompania,
                                          }}
                                          menuFavoritos = {menuFavoritos}
                                        />
                                      </ListItemButton>
                                       {/*Desde acá se agregaría otro nivel*/}
                                    </List>
                                  </Collapse> 
                                  
                                ))}
                            </List>
                          </Collapse>
                        ))}
                      </List>
                    </Collapse>
                  ))}
                </>):(<></>)}
                </ListItem>
              ))}
        </List>
      </Drawer>
              {/*Este es el componente para el SnackBar o TooltipFlotante*/}
              <TooltipFlotante open={!!hoveredItem} handleClose={handleClose} message={hoveredItem} />
              {/*Este es el componente para el modal de confirmar el cambio de compañia*/}
              <ModalConfirmar
                    title={`Deseas conectarse a ${companiaSeleccionada.nombre}?`}
                    text="¡No podrás revertir esta acción!"
                    icon="warning"
                    confirmButtonText="¡Sí, conectar!"
                    cancelButtonText="No, cancelar!"
                    onConfirm={eventoConfirmar}
                    onCancel={eventoCancelar}
                    successTitle={`Conectado a ${companiaSeleccionada.nombre}`}
                    successText={`Se conectó correctamente a ${companiaSeleccionada.nombre}`}
                    successIcon="success"
                    dismissTitle="Cancelado"
                    dismissText="No hubo ningún cambio."
                    dismissIcon="error"
                    show={mostarModal}
                  />

                {/*Muestra el Loading aleatorio con colores aleatorios y el SVG de New Impact*/}
                <LoadingAleatorio mostrar={cargando}/>   
    </Box>
  );
}

export default MiniDrawer;

