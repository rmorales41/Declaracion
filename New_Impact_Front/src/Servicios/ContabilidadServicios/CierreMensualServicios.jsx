import http from '../../http-common'; 
let authToken = null;

// Función para establecer el token de autenticación
const setAuthToken = (token) => authToken = token;

// Función para obtener los headers con el token de autenticación
const headersConfig = () => ({
  headers: {
    Authorization: `Bearer ${authToken}`,
  },
});


// Función para el cierre mensual 
const cierreMensual = (codigo_compania, fecha_mayorizacion) => {
  return http.get(`api/contabilidad/mayorizacion/accounting_mayorizacion/?codigo_compania=${codigo_compania}&fecha_mayorizacion=${fecha_mayorizacion}`, headersConfig()); // La ruta o endpoint que consume del back end
};


//Hooks que devuelve
const CierreMensualServicios = {
  setAuthToken,
  cierreMensual,
};

export default CierreMensualServicios;