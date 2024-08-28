import AuthServices from "../Servicios/AuthServices";
import ContabilidadConfiguracion from "../Servicios/ConfiguracionServicios/ContabilidadConfiguracionServicios/ContabilidadConfiguracionServicios"
import ValidaRestricciones from './ValidaRestricciones'

//Este es un hook para obeter la configuracion de contabilidad
const obtenerContabilidadConfiguracion = async () => {
  let configuracion = [];
  const token = AuthServices.getAuthToken();
  const codigo_compania = AuthServices.getCodigoCompania();
  if (!ValidaRestricciones.ValidarToken(token)) return;//valida el token
    ContabilidadConfiguracion.setAuthToken(token);
      try {
        const response = await ContabilidadConfiguracion.getAll(codigo_compania);
        configuracion = response.data;
      } catch (e) {
       //ValidaRestricciones.capturaDeErrores(e); 
       console.error(e) 
      }
  return configuracion;
}

const obtenerContabilidadConfi = {
  obtenerContabilidadConfiguracion,
}

export default obtenerContabilidadConfi;