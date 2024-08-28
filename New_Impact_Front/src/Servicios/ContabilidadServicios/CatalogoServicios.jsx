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

// Obtiene todos los elementos
const getAll = (codigo_compania) => http.get(`api/contabilidad/catalogo/?codigo_compania=${codigo_compania}`, headersConfig());

// Crea un nuevo elemento
const create = (data) => http.post(`api/contabilidad/catalogo/create/?codigo_compania=${data.IDCompania}`, data, headersConfig());

// Elimina un elemento por ID
const remove = (id) => http.delete(`api/contabilidad/catalogo/delete/${id}/`, headersConfig());

// Busca un elemento por su ID
const findBy = (id, codigo_compania) => http.get(`api/contabilidad/catalogo/findby/${id}/?codigo_compania=${codigo_compania}`, headersConfig());

// Actualiza un elemento por su ID
const update = (id, data) => http.put(`/api/contabilidad/catalogo/update/${id}/?codigo_compania=${data.IDCompania}`, data, headersConfig());

// Elimina múltiples elementos seleccionados
const EliminarConCheck = (data) => http.delete(`api/contabilidad/catalogo/deletecheck/`, { ...headersConfig(),data: data, });

// Obtiene todos los elementos filtrados de movimientos
const getAllFiltrado_movimientos = (codigo_compania) =>  http.get(`api/contabilidad/catalogo/filtered_movements/?codigo_compania=${codigo_compania}`, headersConfig());

// Objeto que exporta todos los servicios del catálogo
const CatalogoServicios = {
  setAuthToken,
  getAll,
  create,
  remove,
  findBy,
  update,
  EliminarConCheck,
  getAllFiltrado_movimientos,
};

export default CatalogoServicios;