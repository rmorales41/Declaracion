import http from '../http-common'; 
import {urlImagen} from "../Variables/variables"
let authToken = null; 
//Hook para guardar en el localStorage lo que trae a la hora de iniciar seccion 
const login = credentials => http.post('/api/autenticacion/inicio-sesion/',credentials);//Ruta o endpoid que consulta al back end para el inicio de seccion
const setAuthToken = token => localStorage.setItem('authToken', token);//Guarda el token en el localStorage
const getAuthToken = () => localStorage.getItem('authToken');//Retorna el token que esta guardado en el localStorage

const setAuthRefreshToken = refresh_token => localStorage.setItem('authRefreshToken', refresh_token);//Guarda el token en el localStorage
const getAuthRefreshToken = () => localStorage.getItem('authRefreshToken');//Retorna el token que esta guardado en el localStorage

const setUsername = username => localStorage.setItem('username', username);//Guarda el username en el localStorage
const getUsername = () => localStorage.getItem('username');//Retorna el username que esta guardado en el localStorage
const setBase_datos = baseDatos => localStorage.setItem('baseDatos', baseDatos);//Guarda la base datos activa en el localStorage
const getBase_datos = () => localStorage.getItem('baseDatos');//Retorna la base datos activa que esta guardado en el localStorage
const setAuth_esta_Loging = estaLogin => localStorage.setItem('estaLogin', estaLogin);//Guarda una variable en estado TRUE para saber si se logio correctamente.
const getAuth_esta_Loging = () => localStorage.getItem('estaLogin');//Retorna la variable  para saber si se logio correctamente, que esta guardado en el localStorage
const setEmail = email => localStorage.setItem('email', email);//Guarda el email en el localStorage
const getEmail = () => localStorage.getItem('email');//Retorna el email que esta guardado en el localStorage
const setRol = rol => localStorage.setItem('rol', rol);//Guarda el rol en el localStorage
const getRol = () => localStorage.getItem('rol');//Retorna el rol que esta guardado en el localStorage
const setRolActivo = rol_activo => localStorage.setItem('rol_activo', rol_activo);//Guarda el rol_activo en el localStorage
const getRolActivo = () => localStorage.getItem('rol_activo');//Retorna el rol_activo que esta guardado en el localStorage
const setTipoLetra = tipo_letra => localStorage.setItem('tipo_letra', tipo_letra);//Guarda el tipo_letra en el localStorage
const getTipoLetra = () => localStorage.getItem('tipo_letra');//Retorna el tipo_letra que esta guardado en el localStorage
const setTamanoLetra = tamano_letra => localStorage.setItem('tamano_letra', tamano_letra);//Guarda el tamano_letra en el localStorage
const getTamanoLetra = () => localStorage.getItem('tamano_letra');//Retorna el tamano_letra que esta guardado en el localStorage
const setColorDrawer = color_nav_lateral => localStorage.setItem('color_nav_lateral', color_nav_lateral);//Guarda el color del drawer o offcanvas o menu lateral en el localStorage
const getColorDrawer = () => localStorage.getItem('color_nav_lateral');//Retorna el color del drawer o offcanvas o menu lateral que esta guardado en el localStorage
const setColorNavBar = color_nav_header => localStorage.setItem('color_nav_header', color_nav_header);//Guarda el color del navBar o barra menu en el localStorage
const getColorNavBar = () => localStorage.getItem('color_nav_header');//Retorna el color del navBar o barra menu que esta guardado en el localStorage
const setColorLetra = color_letra => localStorage.setItem('color_letra', color_letra);//Guarda el color de la letra en el localStorage
const getColorLetra = () => localStorage.getItem('color_letra');//Retorna el color de la letra que esta guardado en el localStorage
const setNegrita = estilo =>  localStorage.setItem('estilo', estilo);//Guarda el si quiere negrita en la letra en el localStorage osea bold o none
const getNegrita = () => localStorage.getItem('estilo');//Retorna si quiere negrita en la letra que esta guardado en el localStorage osea bold o none
const setFondoDesktop = fondo_desktop => localStorage.setItem('fondo_desktop', fondo_desktop);//Guarda el color del fondo en el localStorage
const getFondoDesktop = () =>  localStorage.getItem('fondo_desktop');//Retorna el color del fondo en el localStorage

const setImagenDesktop = imagen_desktop => {//Guarda la imagen de fondo en el localStorage
  const nuevaUrl = imagen_desktop.replace("/media/", "/static/");
  const urlCompleta = `${urlImagen}${nuevaUrl}`;
  if(urlCompleta) {
    localStorage.setItem('imagen_desktop', urlCompleta);
  }else{
    localStorage.setItem('imagen_desktop', " ");//Si no tiene imagen tiene que ir un espacio o si no revienta todo y no se puede loguear
  }
};
const getImagenDesktop = () =>  localStorage.getItem('imagen_desktop');//Retorna la imagen de fondo del localStorage

const setCodigoCompania = codigo => localStorage.setItem('codigo', codigo);//Guarda el codigo de la compañia en el localStorage
const getCodigoCompania = () =>  localStorage.getItem('codigo');//Retorna el codigo de la compañia del localStorage
const setIdAsigna = idAsigna => localStorage.setItem('idAsigna', idAsigna);//Guarda el id de asigna compañian el localStorage
const getIdAsigna = () =>  localStorage.getItem('idAsigna');//Retorna el id de asigna compañian del localStorage

// Guarda las compañías en el localStorage
const setCompanias = companias => {
  const companiasString = JSON.stringify(companias);
  localStorage.setItem('companias', companiasString);
};

// Retorna las compañías del localStorage
const getCompanias = () => {
  const companiasString = localStorage.getItem('companias');
  return JSON.parse(companiasString);
};

// Guarda las configuraciones de la compañía en el localStorage
const setCompaniaConfig = companiaConfig => {
  const companiasString = JSON.stringify(companiaConfig);
  localStorage.setItem('companiaConfig', companiasString);
};

// Retorna las configuraciones de la compañía del localStorage
const getCompaniaConfig = () => {
  const companiasString = localStorage.getItem('companiaConfig');
  return JSON.parse(companiasString);
};

const setTipoDeCambioCompra = compra => localStorage.setItem('compra', compra);
const getTipoDeCambioCompra = () =>  localStorage.getItem('compra');

const setTipoDeCambioVenta = venta => localStorage.setItem('venta', venta);
const getTipoDeCambioVenta = () =>  localStorage.getItem('venta');

const setTipoDeCambioPosVenta = posventa => localStorage.setItem('posventa', posventa);
const getTipoDeCambioPosVenta = () =>  localStorage.getItem('posventa');

// Guarda el menuFavoritos en el localStorage
const setFormulariosFavoritos = menuFavoritos => localStorage.setItem('menuFavoritos', JSON.stringify(menuFavoritos));

// Guarda las compañías en el localStorage
const setCompaniaActual = companias => {
  const companiaActual = JSON.stringify(companias);
  localStorage.setItem('companiaActual', companiaActual);
};

// Retorna las compañías del localStorage
const getCompaniaActual = () => {
  const companiaActual = localStorage.getItem('companiaActual');
  return JSON.parse(companiaActual);
};

// Retorna el menuFavoritos
const getFormulariosFavoritos = () => {
  const menuFavoritos = localStorage.getItem('menuFavoritos');
  return JSON.parse(menuFavoritos);
};

// Verfica el token para saber si es valido
// Verfica el token para saber si es valido
const verificarToken = (token) => {
  const authToken = token;
  const encabezado = {
    headers: {
      Authorization: `Bearer ${authToken}`, // Le manda el token en el encabezado de la consulta.
    },
  };

  return http.post(`api/autenticacion/verificar-token/`, null, encabezado); // La ruta o endpoid que consume del back end
}
 
 //Cierra la Seccion
 const cerrrarSeccion = (token)=>{
   authToken = token;
   const encabezado = {
       headers: {
         Authorization: `Bearer ${authToken}`, //Le manda el token en el encabezado de la consulta.
       },
     };
 
  return http.post(`api/autenticacion/cerrar-sesion/`, null, encabezado);//La ruta o end poid que consume del back end
 }
 
//Refrescar token
const tokenRefrescar = (token)=>{
  const data={
    refresh:token
   }

   return http.post(`api/autenticacion/token/refresh/`,data);//La ruta o end poid que consume del back end
 }

//Elimana todo del localStorage
const removeAuthToken = () => {
  localStorage.removeItem('authToken');//Elimina el token del localStorage
  localStorage.removeItem('authRefreshToken');//Elimina el token del localStorage
  localStorage.removeItem('username');//Elimina el username del localStorage
  localStorage.removeItem('baseDatos');//Elimina la base de Datos del localStorage
  localStorage.removeItem('estaLogin');//Elimina la variable  para saber si se logio correctamente del localStorage
  localStorage.removeItem('email');//Elimina el email del localStorage
  localStorage.removeItem('rol');//Elimina el rol del localStorage
  localStorage.removeItem('rol_activo');//Elimina el rol_activo del localStorage
  localStorage.removeItem('tipo_letra');//Elimina el tipo_letra del localStorage
  localStorage.removeItem('tamano_letra');//Elimina el token del localStorage
  localStorage.removeItem('color_nav_lateral');//Elimina el color_nav_lateral del localStorage
  localStorage.removeItem('color_nav_header');//Elimina el color_nav_header del localStorage
  localStorage.removeItem('color_letra');//Elimina el color_letra del localStorage
  localStorage.removeItem('estilo');//Elimina el estilo del localStorage, estilo es para negrita
  localStorage.removeItem('fondo_desktop');//Elimina el fondo_desktopv del localStorage
  localStorage.removeItem('imagen_desktop');//Elimina la imagen_desktop del localStorage
  localStorage.removeItem('companias');//Elimina las companias del localStorage
  localStorage.removeItem('idAsigna');//Elimina el id Asigna compania del localStorage
  localStorage.removeItem('codigo');//Elimina el codigo de compania del localStorage
  localStorage.removeItem('companiaActual');//Elimina la companiaActual del localStorage
  localStorage.removeItem('companiaConfig');//Elimina las configuraciones de la compañia del localStorage
};

const eliminaConfiguraciones = () =>{
  localStorage.removeItem('tipo_letra');//Elimina el tipo_letra del localStorage
  localStorage.removeItem('tamano_letra');//Elimina el token del localStorage
  localStorage.removeItem('color_nav_lateral');//Elimina el color_nav_lateral del localStorage
  localStorage.removeItem('color_nav_header');//Elimina el color_nav_header del localStorage
  localStorage.removeItem('color_letra');//Elimina el color_letra del localStorage
  localStorage.removeItem('estilo');//Elimina el estilo del localStorage, estilo es para negrita
  localStorage.removeItem('fondo_desktop');//Elimina el fondo_desktopv del localStorage
  localStorage.removeItem('imagen_desktop');//Elimina la imagen_desktop del localStorage

}

const limpiaFormularioFavoritos = () =>{
  localStorage.removeItem('menuFavoritos');//Elimina el menuFavoritos del localStorage
}

//Hooks que devuelve
const AuthServices = {
  login,
  setAuthToken,
  getAuthToken,
  setAuthRefreshToken,
  getAuthRefreshToken,
  setUsername,
  getUsername,
  setBase_datos,
  getBase_datos,
  setAuth_esta_Loging,
  getAuth_esta_Loging,
  setEmail,
  getEmail,
  setRol,
  getRol,
  setRolActivo,
  getRolActivo,
  setTipoLetra,
  getTipoLetra,
  setTamanoLetra, 
  getTamanoLetra,
  setColorDrawer,
  getColorDrawer,
  setColorNavBar, 
  getColorNavBar,
  setColorLetra,
  getColorLetra,
  setNegrita,
  getNegrita,
  setFondoDesktop, 
  getFondoDesktop,
  setCompanias, 
  getCompanias,
  setCodigoCompania,
  getCodigoCompania,
  verificarToken,
  setTipoDeCambioCompra,
  getTipoDeCambioCompra,
  setTipoDeCambioVenta,
  getTipoDeCambioVenta,
  setTipoDeCambioPosVenta,
  getTipoDeCambioPosVenta,
  setIdAsigna,
  getIdAsigna,
  setImagenDesktop,
  getImagenDesktop,
  eliminaConfiguraciones,
  limpiaFormularioFavoritos,
  setFormulariosFavoritos,
  getFormulariosFavoritos,
  setCompaniaActual,
  getCompaniaActual,
  removeAuthToken,
  cerrrarSeccion,
  tokenRefrescar,
  setCompaniaConfig,
  getCompaniaConfig
};

export default AuthServices;

