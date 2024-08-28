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

// Obtiene todos los registros filtradas por compañía
const getAll = (codigo_compania) => http.get(`api/planillas/planilla_funcionarios/?codigo_compania=${codigo_compania}`, headersConfig());

// Crea una nueva cuenta bancaria
const create = (data) => http.post(`api/planillas/planilla_funcionarios/create/?codigo_compania=${data.IDCompania}`, data, headersConfig());

// Elimina un registros por su ID
const remove = (Id) => http.delete(`api/planillas/planilla_funcionarios/delete/${Id}/`, headersConfig());

// Busca un registros por su ID y compañía
const findBy = (Id, codigo_compania) => http.get(`api/planillas/planilla_funcionarios/findby/${Id}/?codigo_compania=${codigo_compania}`, headersConfig());

// Actualiza una cuenta bancaria por su ID y compañía
const update = (Id, data) => http.put(`api/planillas/planilla_funcionarios/update/${Id}/?codigo_compania=${data.IDCompania}`, data, headersConfig());

// Elimina múltiples registros seleccionadas
const EliminarConCheck = (data) => http.delete(`api/planillas/planilla_funcionarios/deletecheck/`, {...headersConfig(),data: data, });

// Objeto que exporta todos los servicios de cuentas bancarias
const PlanillaFuncionariosServicios = {
  setAuthToken,
  getAll,
  create,
  remove,
  findBy,
  update,
  EliminarConCheck,
};

export default PlanillaFuncionariosServicios;