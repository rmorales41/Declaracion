import AuthServices from "../Servicios/AuthServices";
import ValidaRestricciones from './ValidaRestricciones'
import CatalogoServicios from "../Servicios/ContabilidadServicios/CatalogoServicios"

//Este es un hook para obeter la cuenta formatiada del catalogo buscado por id
const obtenerCuentaFormatiada = async (id) => {
  let respuesta = [];
  const token = AuthServices.getAuthToken();
  const codigo_compania = AuthServices.getCodigoCompania();
  if (!ValidaRestricciones.ValidarToken(token)) return;//valida el token
  CatalogoServicios.setAuthToken(token);
      try {
        const response = await CatalogoServicios.findBy(id, codigo_compania);
        respuesta = response.data;
      } catch (e) {
       console.error(e) 
      }
  return respuesta;
}

const obtenerCatalogoHooks = {
  obtenerCuentaFormatiada,
}

export default obtenerCatalogoHooks;