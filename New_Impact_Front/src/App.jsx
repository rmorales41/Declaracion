import "./App.css";
import React, { useEffect, useState } from "react";
import { Routes, Route , useNavigate } from "react-router-dom";
import "bootstrap/dist/css/bootstrap.css";
import "bootstrap-icons/font/bootstrap-icons.css";
import Login from "./Componentes/Login/Login";
import Menu from "./Componentes/Menu/Menu";
import AuthServices from "./Servicios/AuthServices";
import Welcome from "./Componentes/Welcome/Welcome";
import {restTipoLetra, restTamanoLetra, restColorDrawer, restColorNavBar, restColorLetra, restNegrita ,restFondo, restImagenDeFondo} from './Variables/variables';
import ModalErrorToken from "./Componentes/Componentes/Modales/ModalesSweetalert2/ModalErrorToken";
import ValidaRestricciones from "./Hooks/ValidaRestricciones";
import ListaTiposDeLetras from "./Servicios/ConfiguracionServicios/TiposDeLetrasServicios/TiposDeLetrasServicios"
//Paises
import MantenimientoPaises from "./Componentes/Modelos/Compania/Paises/MantenimientoPaises";
import PaisesNuevo from "./Componentes/Modelos/Compania/Paises/PaisesNuevo";
import PaisesEditar from "./Componentes/Modelos/Compania/Paises/PaisesEditar";
//Configuraciones
import ConfiguracionesPerfil from "./Componentes/Modelos/Configuraciones/ConfiguracionDePerfil/ConfiguracionesPerfil";
import ConfiguracionDeEstilos from "./Hooks/ConfiguracionDeEstilos"
//Catalogo
import MantenimientoCatalogo from "./Componentes/Modelos/Contabilidad/Catalogo/MantenimientoCatalogo";
import CatalogoNuevo from "./Componentes/Modelos/Contabilidad/Catalogo/CatalogoNuevo";
import CatalogoEditar from "./Componentes/Modelos/Contabilidad/Catalogo/CatalogoEditar";
//Origen y Destinos
import MantenimientoOrigenDestino from "./Componentes/Modelos/Contabilidad/OrigenDestino/MantenimientoOrigenDestino";
import OrigenDestinoNuevo from "./Componentes/Modelos/Contabilidad/OrigenDestino/OrigenDestinoNuevo";
import OrigenDestinoEditar from "./Componentes/Modelos/Contabilidad/OrigenDestino/OrigenDestinoEditar";
//Niveles contables
import MantenimientoNiveles from "./Componentes/Modelos/Contabilidad/NivelContable/MantenimientoNiveles";
import NivelesNuevo from "./Componentes/Modelos/Contabilidad/NivelContable/NivelesNuevo";
import NivelesEditar from "./Componentes/Modelos/Contabilidad/NivelContable/NivelesEditar";
//Tipo de Cuenta
import MantenimientoTipoCuenta from "./Componentes/Modelos/Contabilidad/TipoCuenta/MantenimientoTipoCuenta";
import TipoCuentaNuevo from "./Componentes/Modelos/Contabilidad/TipoCuenta/TipoCuentaNuevo";
import TipoCuentaEditar from "./Componentes/Modelos/Contabilidad/TipoCuenta/TipoCuentaEditar";
//Asiento
import MantenimientoAsientos from "./Componentes/Modelos/Contabilidad/Asientos/MantenimientoAsientos";
import AsientosNuevo from "./Componentes/Modelos/Contabilidad/Asientos/AsientosNuevo";
import AsientosEditar from "./Componentes/Modelos/Contabilidad/Asientos/AsientosEditar";
//Tipo De Cambio
import MantenimientoTipoCambio from "./Componentes/Modelos/Configuraciones/TipoCambio/MantenimientoTipoCambio";
import TipoDeCambioNuevo from "./Componentes/Modelos/Configuraciones/TipoCambio/TipoDeCambioNuevo";
import TipoDeCambioEditar from "./Componentes/Modelos/Configuraciones/TipoCambio/TipoDeCambioEditar";
//Recordatorio
import MantenimientoRecordatorio from "./Componentes/Modelos/Contabilidad/Recordatorio/MantenimientoRecordatorio";
import RecordatorioNuevo from "./Componentes/Modelos/Contabilidad/Recordatorio/RecordatorioNuevo";
import RecordatorioEditar from "./Componentes/Modelos/Contabilidad/Recordatorio/RecordatorioEditar";
//Tipo de Asientos
import MantenimientoTipoAsiento from "./Componentes/Modelos/Contabilidad/TipoDeAsiento/MantenimientoTipoAsiento";
import TipoAsientoNuevo from "./Componentes/Modelos/Contabilidad/TipoDeAsiento/TipoAsientoNuevo";
import TipoAsientoEditar from "./Componentes/Modelos/Contabilidad/TipoDeAsiento/TipoAsientoEditar";
//Bancos
import MantenimientoBancos from "./Componentes/Modelos/Configuraciones/Bancos/MantenimientoBancos"
import BancosNuevo from "./Componentes/Modelos/Configuraciones/Bancos/BancosNuevo"
import BancosEditar from "./Componentes/Modelos/Configuraciones/Bancos/BancosEditar"
//Cunetas Bancarias
import MantenimientoCuentasBancarias from "./Componentes/Modelos/Contabilidad/CuentasBancarias/MantenimientoCuentasBancarias"
import CuentasBancariasNuevo from "./Componentes/Modelos/Contabilidad/CuentasBancarias/CuentasBancariasNuevo"
import CuentasBancariasEditar from "./Componentes/Modelos/Contabilidad/CuentasBancarias/CuentasBancariasEditar"
//Mayorizacion Temporal
import MayorizacionTemporal from "./Componentes/Modelos/Contabilidad/MayorizacionTemporal/MayorizacionTemporal"
//Asientos Historicos
import MantenimientoAsientosHistoricos from "./Componentes/Modelos/Contabilidad/AsientosHistoricos/MantenimientoAsientosHistoricos"
import AsientosHistoricosEditar from "./Componentes/Modelos/Contabilidad/AsientosHistoricos/AsientosHistoricosEditar"
//Datafonos
import MantenimientoDatafonos from "./Componentes/Modelos/Contabilidad/Datafonos/MantenimientoDatafonos"
import DatafonosNuevo from "./Componentes/Modelos/Contabilidad/Datafonos/DatafonosNuevo"
import DatafonosEditar from "./Componentes/Modelos/Contabilidad/Datafonos/DatafonosEditar"
//MayorizacionContable
import MayorizacionContable from "./Componentes/Modelos/Contabilidad/MayorizacionContable/MayorizacionContable"






function App() {
  //localStorage.clear();
  const isLoggedInAuth = AuthServices.getAuth_esta_Loging();
  const [estaLogin, setEstaLogin] = useState(isLoggedInAuth );
  const navigate = useNavigate();
  const [fontLinks, setFontLinks] = useState([]);

  //Cada vez que renderiza o refresque la página válida que se haya logueado correctamente.
  //Válida el token cada cierto tiempo, esto para que lo saque de la sección

 useEffect(() => {
    const estaLoginEnAuth = AuthServices.getAuth_esta_Loging();
    setEstaLogin(estaLoginEnAuth);

    if (estaLoginEnAuth) {
        tiposDeLetras();
          const verificarToken = async () => {
            const token = AuthServices.getAuthToken();
            const refreshToken = AuthServices.getAuthRefreshToken();
            if (token && refreshToken) {//Valida que no vatan null
              try {
                await AuthServices.verificarToken(token);
                  try {
                    const response = await AuthServices.tokenRefrescar(refreshToken);
                    localStorage.removeItem('authToken');
                    AuthServices.setAuthToken(response.data.access);
                  } catch (e) {            
                    AuthServices.removeAuthToken();//Elimina todo lo que tenga el localStorage 
                    setEstaLogin(null);
                    ModalErrorToken.errorDeToken();
                    navigate("/Login")
                  } 
              } catch (e) {
                AuthServices.removeAuthToken();//Elimina todo lo que tenga el localStorage 
                setEstaLogin(null);
                ModalErrorToken.errorDeToken();
                navigate("/Login")
              }
            }
          };

          verificarToken();
          const intervalId = setInterval(verificarToken, 120000);//120000 = 2 minutos 30000= medio segundo 300000=5minutos 3600000 = 1 hora
          return () => clearInterval(intervalId);
      }else{
        stylesNoLogueado();//Si no lo esta le asigna los estilos de no estar logiado
        //return;//Y return aca para que no continue 
      }

  }, [navigate]); // Remove 'estaLogin' from dependencies

  const tiposDeLetras = ()=>{
    const estaLoginEnAuth = AuthServices.getAuth_esta_Loging();
      if(estaLoginEnAuth){
        const token = AuthServices.getAuthToken();
        if (!ValidaRestricciones.ValidarToken(token)){return;}//valida el token
          ListaTiposDeLetras.setAuthToken(token);
          ListaTiposDeLetras.obtenerTipoDeLetras().then(response=>{
            setFontLinks(response.data)
          }).catch( e =>{
            ValidaRestricciones.capturaDeErrores(e);
          }) 
      }
  }

  useEffect(() => {
    const estaLoginEnAuth = AuthServices.getAuth_esta_Loging();
      if(estaLoginEnAuth){
      // Agregar los enlaces de CSS de Google Fonts
      fontLinks.forEach(link => {
        const fontLink = document.createElement('link');
        fontLink.href = link.Link; // Acceder al atributo Link de cada objeto en fontLinks
        fontLink.rel = 'stylesheet';
        document.head.appendChild(fontLink);  
      });  
    }
  
  }, [fontLinks]);

  const stylesNoLogueado = ()=>{
  //Asiga el tipo de letra, tamaño, negritra, y colores del fondo, menu lateral, menu superior
  ConfiguracionDeEstilos.cambiosDeCss(
    restTamanoLetra, restTipoLetra, restColorLetra, restColorDrawer,  restNegrita, restColorNavBar, restFondo, restImagenDeFondo
  );
  }

  const handleKeyDown = (event) => {
    // Verificar si la tecla presionada es F1 (código de tecla 112)
    if (event.keyCode === 112)  navigate("/Configuracion-Perfil/")

  };

  return (
    <div className="App" onKeyDown={handleKeyDown} tabIndex={0}>
       {estaLogin ? 
        (<Menu actualizarEstadoLogiado={setEstaLogin} />)
        :( <></>
       )}
     
       {/*--------------------- Se establecen las rutas --------------------- */}
      <Routes>
        {/* Renderizar la página de bienvenida si no está logueado */}
        <Route path="/Login" element={<Login setEstaLogin={setEstaLogin} />} />
        
        {/*Verifica si esta logiado, si lo esta lo dirige a menu y si no a login o en pantalla blanco */}

        {estaLogin ? (
          <>
          <Route path="/" element={<Menu actualizarEstadoLogiado={setEstaLogin} />} />
          <Route path="/MantenimientoPaises/:idFormulario" element={<MantenimientoPaises/>} />
          <Route path="/PaisesNuevo/:idFormulario" element={<PaisesNuevo/>} />
          <Route path="/PaisesEditar/:IDPais/:idFormulario" element={<PaisesEditar/>} />
          <Route path="/Configuracion-Perfil/" element={<ConfiguracionesPerfil/>} />
          <Route path="/MantenimientoCatalogo/:idFormulario" element={<MantenimientoCatalogo/>} />
          <Route path="/CatalogoNuevo/:idFormulario" element={<CatalogoNuevo/>} />
          <Route path="/CatalogoEditar/:Id/:idFormulario" element={<CatalogoEditar/>} />
          <Route path="/MantenimientoOrigenDestino/:idFormulario" element={<MantenimientoOrigenDestino/>} />
          <Route path="/OrigenDestinoNuevo/:idFormulario" element={<OrigenDestinoNuevo/>} />
          <Route path="/OrigenDestinoEditar/:Id/:idFormulario" element={<OrigenDestinoEditar/>} />
          <Route path="/MantenimientoNiveles/:idFormulario" element={<MantenimientoNiveles/>} />
          <Route path="/NivelesNuevo/:idFormulario" element={<NivelesNuevo/>} />
          <Route path="/NivelesEditar/:Id/:idFormulario" element={<NivelesEditar/>} />
          <Route path="/MantenimientoTipoCuenta/:idFormulario" element={<MantenimientoTipoCuenta/>} />
          <Route path="/TipoCuentaNuevo/:idFormulario" element={<TipoCuentaNuevo/>} />
          <Route path="/TipoCuentaEditar/:Id/:idFormulario" element={<TipoCuentaEditar/>} />
          <Route path="/MantenimientoAsientos/:idFormulario" element={<MantenimientoAsientos/>} />
          <Route path="/AsientosNuevo/:idFormulario" element={<AsientosNuevo/>} />
          <Route path="/AsientosEditar/:id/:idFormulario" element={<AsientosEditar/>} />
          <Route path="/MantenimientoTipoCambio/:idFormulario" element={<MantenimientoTipoCambio/>} />
          <Route path="/TipoDeCambioNuevo/:idFormulario" element={<TipoDeCambioNuevo/>} />
          <Route path="/TipoDeCambioEditar/:Id/:idFormulario" element={<TipoDeCambioEditar/>} />
          <Route path="/MantenimientoRecordatorio/:idFormulario" element={<MantenimientoRecordatorio/>} />
          <Route path="/RecordatorioNuevo/:idFormulario" element={<RecordatorioNuevo/>} />
          <Route path="/RecordatorioEditar/:Id/:idFormulario" element={<RecordatorioEditar/>} />
          <Route path="/MantenimientoTipoAsiento/:idFormulario" element={<MantenimientoTipoAsiento/>} />
          <Route path="/TipoAsientoNuevo/:idFormulario" element={<TipoAsientoNuevo/>} />
          <Route path="/TipoAsientoEditar/:Id/:idFormulario" element={<TipoAsientoEditar/>} />
          <Route path="/MantenimientoBancos/:idFormulario" element={<MantenimientoBancos/>} />
          <Route path="/BancosNuevo/:idFormulario" element={<BancosNuevo/>} />
          <Route path="/BancosEditar/:Id/:idFormulario" element={<BancosEditar/>} />
          <Route path="/MantenimientoCuentasBancarias/:idFormulario" element={<MantenimientoCuentasBancarias/>} />
          <Route path="/CuentasBancariasNuevo/:idFormulario" element={<CuentasBancariasNuevo/>} />
          <Route path="/CuentasBancariasEditar/:Id/:idFormulario" element={<CuentasBancariasEditar/>} />
          <Route path="/MayorizacionTemporal/:idFormulario" element={<MayorizacionTemporal/>} />
          <Route path="/MantenimientoAsientosHistoricos/:idFormulario" element={<MantenimientoAsientosHistoricos/>} />
          <Route path="/AsientosHistoricosEditar/:id/:idFormulario" element={<AsientosHistoricosEditar/>} />
          <Route path="/MantenimientoDatafonos/:idFormulario" element={<MantenimientoDatafonos/>} />
          <Route path="/DatafonosNuevo/:idFormulario" element={<DatafonosNuevo/>} />
          <Route path="/DatafonosEditar/:Id/:idFormulario" element={<DatafonosEditar/>} />
          <Route path="/MayorizacionContable/:idFormulario" element={<MayorizacionContable/>} />
          
          </>
        ) : (
          <>
          <Route path="/" element={<Welcome />} />
          <Route path="/MantenimientoPaises/:idFormulario" element={<Login setEstaLogin={setEstaLogin} />} />
          <Route path="/PaisesNuevo/:idFormulario" element={<Login setEstaLogin={setEstaLogin} />} />
          <Route path="/PaisesEditar/:IDPais/:idFormulario" element={<Login setEstaLogin={setEstaLogin} />} />
          <Route path="/Configuracion-Perfil/" element={<Login setEstaLogin={setEstaLogin} />} />
          <Route path="/MantenimientoCatalogo/:idFormulario" element={<Login setEstaLogin={setEstaLogin} />} />
          <Route path="/CatalogoNuevo/:idFormulario" element={<Login setEstaLogin={setEstaLogin} />} />
          <Route path="/CatalogoEditar/:Id/:idFormulario" element={<Login setEstaLogin={setEstaLogin} />} />
          <Route path="/MantenimientoOrigenDestino/:idFormulario" element={<Login setEstaLogin={setEstaLogin} />} />
          <Route path="/OrigenDestinoNuevo/:idFormulario" element={<Login setEstaLogin={setEstaLogin} />} />
          <Route path="/OrigenDestinoEditar/:Id/:idFormulario" element={<Login setEstaLogin={setEstaLogin} />} />
          <Route path="/MantenimientoNiveles/:idFormulario" element={<Login setEstaLogin={setEstaLogin} />} />
          <Route path="/NivelesNuevo/:idFormulario" element={<Login setEstaLogin={setEstaLogin} />} />
          <Route path="/NivelesEditar/:Id/:idFormulario" element={<Login setEstaLogin={setEstaLogin} />} />
          <Route path="/MantenimientoTipoCuenta/:idFormulario" element={<Login setEstaLogin={setEstaLogin} />} />
          <Route path="/TipoCuentaNuevo/:idFormulario" element={<Login setEstaLogin={setEstaLogin} />} />
          <Route path="/TipoCuentaEditar/:Id/:idFormulario" element={<Login setEstaLogin={setEstaLogin} />} />
          <Route path="/MantenimientoAsientos/:idFormulario" element={<Login setEstaLogin={setEstaLogin} />} />
          <Route path="/AsientosNuevo/:Id/:idFormulario" element={<Login setEstaLogin={setEstaLogin} />} />
          <Route path="/AsientosEditar/:id/:idFormulario" element={<Login setEstaLogin={setEstaLogin} />} />
          <Route path="/MantenimientoTipoCambio/:idFormulario" element={<Login setEstaLogin={setEstaLogin} />} />
          <Route path="/TipoDeCambioNuevo/:idFormulario" element={<Login setEstaLogin={setEstaLogin} />} />
          <Route path="/TipoDeCambioEditar/:Id/:idFormulario" element={<Login setEstaLogin={setEstaLogin} />} />
          <Route path="/MantenimientoRecordatorio/:idFormulario" element={<Login setEstaLogin={setEstaLogin} />} />
          <Route path="/RecordatorioNuevo/:idFormulario" element={<Login setEstaLogin={setEstaLogin} />} />
          <Route path="/RecordatorioEditar/:Id/:idFormulario" element={<Login setEstaLogin={setEstaLogin} />} />
          <Route path="/MantenimientoTipoAsiento/:idFormulario" element={<Login setEstaLogin={setEstaLogin} />} />
          <Route path="/TipoAsientoNuevo/:idFormulario"  element={<Login setEstaLogin={setEstaLogin} />} />
          <Route path="/TipoAsientoEditar/:Id/:idFormulario" element={<Login setEstaLogin={setEstaLogin} />} />
          <Route path="/MantenimientoBancos/:idFormulario" element={<Login setEstaLogin={setEstaLogin} />} />
          <Route path="/BancosNuevo/:idFormulario" element={<Login setEstaLogin={setEstaLogin} />} />
          <Route path="/BancosEditar/:Id/:idFormulario" element={<Login setEstaLogin={setEstaLogin} />} />
          <Route path="/MantenimientoCuentasBancarias/:idFormulario" element={<Login setEstaLogin={setEstaLogin} />} />
          <Route path="/CuentasBancariasNuevo/:idFormulario" element={<Login setEstaLogin={setEstaLogin} />} />
          <Route path="/CuentasBancariasEditar/:Id/:idFormulario" element={<Login setEstaLogin={setEstaLogin} />} />
          <Route path="/MayorizacionTemporal/:idFormulario" element={<Login setEstaLogin={setEstaLogin} />} />
          <Route path="/MantenimientoAsientosHistoricos/:idFormulario" element={<Login setEstaLogin={setEstaLogin} />} />
          <Route path="/AsientosHistoricosEditar/:id/:idFormulario"  element={<Login setEstaLogin={setEstaLogin} />} />
          <Route path="/MantenimientoDatafonos/:idFormulario"  element={<Login setEstaLogin={setEstaLogin} />} />
          <Route path="/DatafonosNuevo/:idFormulario" element={<Login setEstaLogin={setEstaLogin} />} />
          <Route path="/DatafonosEditar/:Id/:idFormulario" element={<Login setEstaLogin={setEstaLogin} />} />
          <Route path="/MayorizacionContable/:idFormulario" element={<Login setEstaLogin={setEstaLogin} />} />


          </>
        )}

      </Routes>
{/* */}
    </div>
  );
}

export default App;


