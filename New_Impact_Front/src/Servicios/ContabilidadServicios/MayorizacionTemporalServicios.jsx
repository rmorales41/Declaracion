import http from '../../http-common'; 
let authToken = null;

//Trae el Token para luego mandarlo en los endpoid 
const setAuthToken = (token) => {
  authToken = token;
};

//Genera el reporte de Balance Comprobación (detalle) o opcion 1 en el grupo de radio button
// Función para obtener el Balance de Comprobación
const getBalanceComprobacion = (codigo_compania, fecha_mayorizacion, moneda) => {
  const encabezado = {
    headers: {
      Authorization: `Bearer ${authToken}`, // Le manda el token en el encabezado de la consulta.
    },
    responseType: 'arraybuffer' // La respuesta tiene que ser arraybuffer, sin esto no muestra ni las ñ ni las (tildes=(´))
  };
  return http.get(`api/contabilidad/mayorizacion/report_trial_balance_monthly_movement/?codigo_compania=${codigo_compania}&fecha_mayorizacion=${fecha_mayorizacion}&moneda=${moneda}`, encabezado); // La ruta o endpoint que consume del back end
};

//Hooks que devuelve
const MayorizacionTemporalServicios = {
  setAuthToken,
  getBalanceComprobacion,
};

export default MayorizacionTemporalServicios;