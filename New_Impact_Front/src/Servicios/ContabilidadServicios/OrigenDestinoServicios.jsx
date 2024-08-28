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
const getAll = (codigo_compania) => http.get(`api/contabilidad/origen_destino/?codigo_compania=${codigo_compania}`, headersConfig());

// Crea un nuevo registro con los datos proporcionados
const create = (data) => http.post(`api/contabilidad/origen_destino/create/?codigo_compania=${data.IDCompania}`, data, headersConfig());

// Elimina un registro por su ID
const remove = (id) =>  http.delete(`api/contabilidad/origen_destino/delete/${id}/`, headersConfig());

// Busca un registro por su ID y código de compañía
const findBy = (id, codigo_compania) => http.get(`api/contabilidad/origen_destino/findby/${id}/?codigo_compania=${codigo_compania}`, headersConfig());

// Actualiza un registro por su ID y con los datos proporcionados
const update = (id, data) => http.put(`/api/contabilidad/origen_destino/update/${id}/?codigo_compania=${data.IDCompania}`, data, headersConfig());

// Elimina todos los registros que tienen check, enviando un array de datos en el cuerpo de la solicitud
const EliminarConCheck = (data) => http.delete(`api/contabilidad/origen_destino/deletecheck/`, { ...headersConfig(), data });

// Objeto que contiene todas las funciones expuestas como servicios de origen y destino
const OrigenDestinoServicios = {
  setAuthToken,
  getAll,
  create,
  remove,
  findBy,
  update,
  EliminarConCheck,
};

export default OrigenDestinoServicios;