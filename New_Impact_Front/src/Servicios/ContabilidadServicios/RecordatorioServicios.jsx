import http from '../../http-common';
let authToken = null;

// Función para establecer el token de autenticación
const setAuthToken = (token) => authToken = token;

// Función interna para obtener la configuración de los headers con el token de autenticación
const headersConfig = () => ({
  headers: {
    Authorization: `Bearer ${authToken}`,
  },
});

// Obtiene todos los registros para un código de compañía específico
const getAll = (codigo_compania) =>http.get(`api/contabilidad/recordatorio_asientos/?codigo_compania=${codigo_compania}`, headersConfig());

// Crea un nuevo registro con los datos proporcionados
const create = (data) => http.post(`api/contabilidad/recordatorio_asientos/create/?codigo_compania=${data.IDCompania}`, data, headersConfig());

// Elimina un registro por su ID
const remove = (Id) => http.delete(`api/contabilidad/recordatorio_asientos/delete/${Id}/`, headersConfig());

// Busca un registro por su ID y código de compañía
const findBy = (Id, codigo_compania) => http.get(`api/contabilidad/recordatorio_asientos/findby/${Id}/?codigo_compania=${codigo_compania}`, headersConfig());

// Actualiza un registro por su ID y con los datos proporcionados
const update = (Id, data) =>  http.put(`api/contabilidad/recordatorio_asientos/update/${Id}/?codigo_compania=${data.IDCompania}`, data, headersConfig());

// Busca registros utilizando un criterio de búsqueda y código de compañía
const search = (codigo_compania, buscar) => http.get(`api/contabilidad/recordatorio_asientos/search/?codigo_compania=${codigo_compania}&buscar=${buscar}`, headersConfig());

// Elimina todos los registros que tienen check, enviando un array de datos en el cuerpo de la solicitud
const EliminarConCheck = (data) => http.delete(`api/contabilidad/recordatorio_asientos/deletecheck/`, { ...headersConfig(), data });

// Objeto que contiene todas las funciones expuestas como servicios de recordatorio de asientos
const Recordatorio = {
  setAuthToken,
  getAll,
  create,
  remove,
  findBy,
  update,
  search,
  EliminarConCheck,
};

export default Recordatorio;