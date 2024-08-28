import RestriccionesXFormularios from "../Servicios/UsuariosServicios/RestriccionesXFormularios"
import AuthServices from "../Servicios/AuthServices"
import ModalSuccess from "../Componentes/Componentes/Modales/ModalesSweetalert2/ModalSuccess"

const validar = async (idFormulario, codigo_compania) => {
  const token = AuthServices.getAuthToken(); // Trae el token que se gurdo en el localStores cuando se logueo
  if (!ValidarToken(token)) return;//valida el token
  
  RestriccionesXFormularios.setAuthToken(token);
    try {
      const response = await RestriccionesXFormularios.getRestricciones(idFormulario, codigo_compania);
      return response.data;
    } catch (e) {
      capturaDeErrores(e);
      throw new Error("Ocurrió un error al obtener las restricciones.");
    }
}

const capturaDeErrores =  (e) => {
  console.error(e);
    if (e.response) {
      const errorStatus = "Error "+ e.response.status +"!";
      const mensajeError =  e.response.data.mensaje;
        console.error("Status",errorStatus, ", Error:", mensajeError);
        console.error("Datos del error:", e.response.data); // Muestra los datos del error devueltos por el servidor
          if (mensajeError !== undefined) {
            ModalSuccess.modalCapturaDeErrores(errorStatus, mensajeError); // Modal para mostrar los errores capturados que devuelve el backend
          }else {
            ModalSuccess.modalCapturaDeErrores(errorStatus, e.response.data.detail); //error  Modal para mostrar los errores capturados que devuelve el backend
          }
    } else if (e.request) {
      const mensajeError =  "La solicitud fue hecha pero no se recibió respuesta:"+ e.request;
      console.error(mensajeError);
      ModalSuccess.modalCapturaDeErrores("Error!",mensajeError);// Modal para que muestre los errores capturados que devulve el backend
    } else {
      console.error("Error al configurar la solicitud:", e.message);
      ModalSuccess.modalCapturaDeErrores("Error al configurar la solicitud:", e.message);// Modal para que muestre los errores capturados que devulve el backend
    }
}

//Valida si el token es correcto
const ValidarToken = (token) => {
  if (!token) { // Valida si se logueo y si trae token
    console.error("No se encontró un token válido");
    return false;
  }
  return true;
}


const ValidaRestricciones = {
  validar,
  capturaDeErrores,
  ValidarToken,
}

export default ValidaRestricciones;
