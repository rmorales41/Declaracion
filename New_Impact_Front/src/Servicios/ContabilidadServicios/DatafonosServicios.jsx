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

// Obtiene todas las cuentas bancarias filtradas por compañía
const getAll = (codigo_compania) => http.get(`api/contabilidad/datafonos/?codigo_compania=${codigo_compania}`, headersConfig());

// Crea una nueva cuenta bancaria
const create = (data) => http.post(`api/contabilidad/datafonos/create/?codigo_compania=${data.IDCompania}`, data, headersConfig());

// Elimina una cuenta bancaria por su ID
const remove = (Id) => http.delete(`api/contabilidad/datafonos/delete/${Id}/`, headersConfig());

// Busca una cuenta bancaria por su ID y compañía
const findBy = (Id, codigo_compania) => http.get(`api/contabilidad/datafonos/findby/${Id}/?codigo_compania=${codigo_compania}`, headersConfig());

// Actualiza una cuenta bancaria por su ID y compañía
const update = (Id, data) => http.put(`api/contabilidad/datafonos/update/${Id}/?codigo_compania=${data.IDCompania}`, data, headersConfig());

// Elimina múltiples cuentas bancarias seleccionadas
const EliminarConCheck = (data) => http.delete(`api/contabilidad/datafonos/deletecheck/`, {...headersConfig(),data: data, });

// Objeto que exporta todos los servicios de cuentas bancarias
const DatafonosServicios = {
  setAuthToken,
  getAll,
  create,
  remove,
  findBy,
  update,
  EliminarConCheck,
};

export default DatafonosServicios;