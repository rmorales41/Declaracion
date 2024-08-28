import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import "./Login.css";
import Footer from "../Componentes/Footer/Footer";
import AuthServices from "../../Servicios/AuthServices";
import InputPassword from "../Componentes/TextField/inputPassword"
import InputUsername from "../Componentes/TextField/inputUsername"
import { BsShieldLock } from "react-icons/bs";
import { GoLock } from "react-icons/go";
import LoadingAleatorio from "../Componentes/Loading/LoadingAleatorio";
import TipoCambioServicios from '../../Servicios/ConfiguracionServicios/TipoDeCambioServicios/TipoDeCambioServicios';
import ValidaRestricciones from "../../Hooks/ValidaRestricciones";
import CompaniaConfigServicios from "../../Servicios/ConfiguracionServicios/CompaniaConfigServicios/CompaniaConfigServicios"

const Login = ({ setEstaLogin }) => {
  const [usuario_o_correo, setUsuario_o_correo] = useState("");
  const [contrasenia, setcontrasenia] = useState("");
  const [suscriptor, setSuscriptor] = useState("");
  const [errores, setErrores] = useState(false);
  const [cargando, setCargando] = useState(false);//Muestra o no el Loading
  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();
    setCargando(true)
    try {
      //Hace o llama el endpoint del login y le mada por parametros el username o email y el contrasenia y lo guarda en la variable respuestaDelLogin
      const respuestaDelLogin = await AuthServices.login({
        usuario_o_correo,
        contrasenia,
        suscriptor,
      }); 
      const { 
        token, 
        refresh_token,
        nombre_usuario, 
        email,
        base_datos_activa,
        rol,
        rol_activo,
        companias,
      } = respuestaDelLogin.data; // Guarda la respuestaDelLogin.data o sea el token y el username
      
      AuthServices.removeAuthToken();// Elimana el token del localStorage
      AuthServices.setAuthToken(token);// Guarda el token en el localStorage  
      AuthServices.setAuthRefreshToken(refresh_token);// Guarda el refresh_token en el localStorage  
      AuthServices.setUsername(nombre_usuario);// Guarda el username en el localStorage
      AuthServices.setBase_datos(base_datos_activa);// Guarda la username en el localStorage
      AuthServices.setAuth_esta_Loging("estaLogiado"); // Guarda el usuario como logueado en el localStorage
      AuthServices.setEmail(email);// Guarda eL email en el localStorage    
      AuthServices.setRol(rol);// Guarda el rol en el localStorage
      AuthServices.setRolActivo(rol_activo);// Guarda el rol_activo en el localStorage
      AuthServices.setCompanias(companias);// Guarda las compañias en el localStorage
      

      // Encuentra la compañía activa
      const companiaActiva = companias.find(compania => compania.activo === true);

      // Verifica si se encontró una compañía activa
      if (companiaActiva) {
          AuthServices.setTipoLetra(companiaActiva.tipo_letra);
          AuthServices.setTamanoLetra(companiaActiva.tamano_letra);
          AuthServices.setColorDrawer(companiaActiva.color_nav_lateral);
          AuthServices.setColorNavBar(companiaActiva.color_nav_header);
          AuthServices.setColorLetra(companiaActiva.color_letra);
          AuthServices.setNegrita(companiaActiva.estilo);
          AuthServices.setFondoDesktop(companiaActiva.fondo_desktop);
          AuthServices.setIdAsigna(companiaActiva.IDUsuarios_Asigna_Compania);
          AuthServices.setImagenDesktop(companiaActiva.imagen_desktop);
          AuthServices.setCodigoCompania(companiaActiva.codigo)
      } else {
          console.error('No se encontró una compañía activa.');
          ///Si no encutra una compañía activa le asigana la primera en la pocision 0
          AuthServices.setTipoLetra(companias[0].tipo_letra);// Guarda el tipo_letra en el localStorage    
          AuthServices.setTamanoLetra(companias[0].tamano_letra);// Guarda el tamano de letra en el localStorage
          AuthServices.setColorDrawer(companias[0].color_nav_lateral);// Guarda el color del menu lateral o drawer o offcanvas en el localStorage    
          AuthServices.setColorNavBar(companias[0].color_nav_header);// Guarda el color del nav bar en el localStorage
          AuthServices.setColorLetra(companias[0].color_letra);// Guarda el color de letra en el localStorage    
          AuthServices.setNegrita(companias[0].estilo);// Guarda none o bold o sea negrita o no en el localStorage
          AuthServices.setFondoDesktop(companias[0].fondo_desktop);// Guarda el color del fondo en el localStorage
          AuthServices.setIdAsigna(companias[0].IDUsuarios_Asigna_Compania);// Guarda el IDUsuarios_Asigna_Compania en el localStorage
          AuthServices.setImagenDesktop(companias[0].imagen_desktop);
          AuthServices.setCodigoCompania(companias[0].codigo)
      }
      setEstaLogin("estaLogiado");// Pone la variable EstaLogin en true en las prop de Login
      obtenerTipoDeCambioCompra(token);//ObtIener Tipo De Cambio Compra
      obtenerTipoDeCambioVenta(token);//ObtIener Tipo De Cambio Venta
      const codigoCompania = companiaActiva ? companiaActiva.codigo : companias[0].codigo;
      const confiCompania = await obtenerConfigCompania(token, codigoCompania);// Obtiene las configuraciones de la compañia
      AuthServices.setCompaniaConfig(confiCompania[0]);// Guarda las configraciones de la compañia en el localStorage

      setErrores(false);// Pone la variable errores en false o sea se logio correctamente
      navigate("/Menu"); // Redirecciona al Menu
      setCargando(false)
      limpiarLosCampos();// Limpia los canpos
    } catch (e) {
      setErrores(true);
      setCargando(false)
      ValidaRestricciones.capturaDeErrores(e);
      
    }
    setCargando(false)
  };

//----Método para obtener Tipo De Cambio Compra
const obtenerTipoDeCambioCompra = (token) => {
  if (!ValidaRestricciones.ValidarToken(token)) {return;}//valida el token

    TipoCambioServicios.setAuthToken(token); 
    TipoCambioServicios.obtenerTipoDeCambioCompra() 
      .then(response => {
          const ultimoElemento = response.data[response.data.length - 1];
          const valorUltimoElemento = ultimoElemento["Valor"];
            AuthServices.setTipoDeCambioCompra(valorUltimoElemento);
      })
      .catch(e => {
        ValidaRestricciones.capturaDeErrores(e);
      });
 };

//----Método para obtener Tipo De Cambio Venta
const obtenerTipoDeCambioVenta = (token) => {
  if (!ValidaRestricciones.ValidarToken(token)) {return;}//valida el token

    TipoCambioServicios.setAuthToken(token); 
    TipoCambioServicios.obtenerTipoDeCambioVenta()
      .then(response => {
          const ultimoElemento = response.data[response.data.length - 1];
          const valorUltimoElemento = ultimoElemento["Valor"];
            AuthServices.setTipoDeCambioVenta(valorUltimoElemento);
            AuthServices.setTipoDeCambioPosVenta(valorUltimoElemento + 5);
      })
      .catch(e => {
        ValidaRestricciones.capturaDeErrores(e);
      });
 };

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

//const tipoDeCambioObjeto = await obtenerTipoDeCambioPorFecha(fechaModificada);//Obitiene el tipo de cambio por medio de la fecha del comprobante
  //Limpia los campos de username o email y la contrasenia cuando se loguea correctamenta
  const limpiarLosCampos = () => {
    setUsuario_o_correo("");
    setcontrasenia("");
    setSuscriptor("");
  };

  return (
    <>
    <div className="login ">
      <div className="container">
        <div className="container-secundario">
          <div className="card card-login">
            <form className="form-login" onSubmit={handleLogin}>
              <h2 className="h2-login">Spv New Impact</h2>
              <h3 className="h3-login">Inicio de Sesión</h3>
              {/*Usuario o su Email */}
              <InputUsername
              id = {"username"}
              placeholder = {"Usuario"}
              value = {usuario_o_correo}
              onChange = {(e) => setUsuario_o_correo(e.target.value)}
              variant = {"standard"}
              />

              {/*contraseña */}
               <InputPassword
               id = {"contrasenia"}
               placeholder = {"Contraseña"}
               value = {contrasenia}
               onChange = {(e) => setcontrasenia(e.target.value)}
               variant = {"standard"}
               icono = {<GoLock 
                style={{
                  fontSize:"19px",
                  marginLeft: '3.2rem',
                  marginRight: '0.450rem',
                  marginTop: '0.125rem', 
                  marginBottom: '0.300rem'
                }}
              />}
               />

              {/*suscriptor */}
               <InputPassword
               id = {"suscriptor"}
               placeholder = {"Código de suscriptor"}
               value = {suscriptor}
               onChange = {(e) => setSuscriptor(e.target.value)}
               variant = {"standard"}
               icono = {<BsShieldLock
                style={{
                  fontSize:"17px",
                  marginLeft: '3.3rem',
                  marginRight: '0.400rem',
                  marginTop: '0.125rem', 
                  marginBottom: '0.300rem'
                }}
              />}
               />

              {/*Mustra el mensaje de Usuario o contraseñas incorrecta*/}
              {errores && (
                  <div className="errorDiv">
                    <small className="errorSmall" id="helpId">
                      <i className="bi bi-exclamation-circle ">
                        {" "}
                        Credenciales incorrecta
                      </i>
                    </small>
                  </div>
                )}

                {/*Boton de Iniciar sesión */}
                <button type="submit" className="btn btn-login ">
                  Iniciar sesión
                </button>

                {/*Boton de  ¿Olvide mi contraseña? */}
                <Link className=" btn-recuperar-contrasena" to={"/Menu"}>
                  ¿Olvide mi contraseña?
                </Link>
                <div></div>
              </form>
            </div>
          </div>
        </div>
      </div>

      {/*Muestra el Loading aleatorio con colores aleatorios y el SVG de New Impact*/}
      <LoadingAleatorio mostrar={cargando}/>
      <Footer />
    </>
  );
};

export default Login;
