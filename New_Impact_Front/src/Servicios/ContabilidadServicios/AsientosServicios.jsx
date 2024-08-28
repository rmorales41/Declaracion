import http from '../../http-common'; 
let authToken = null;

//Consumos de endpoints al backend
//El token que se le manda al encabezado en cada petición
const setAuthToken = (token) => authToken = token;

//Encabezado genérico para los endpoint
const headersConfig = () => ({
  headers: {
    Authorization: `Bearer ${authToken}`,
  },
});

//El token que se le manda al encabezado en cada petición
const getAll = (codigo_compania) => http.get(`api/contabilidad/asientos/?codigo_compania=${codigo_compania}`, headersConfig());

//El agregar o crear un nuevo registro.
const create = (data, iDCompania) => http.post(`api/contabilidad/asientos/create/?codigo_compania=${iDCompania}`, data, headersConfig());

//El eliminar o delete un  registro.
const remove = (Id) => http.delete(`api/contabilidad/asientos/delete/${Id}/`, headersConfig());

//El buscar por el id refencial del registro 
const findBy = (Id, codigo_compania) => http.get(`api/contabilidad/asientos/findby/${Id}/?codigo_compania=${codigo_compania}`, headersConfig());

//El Modificar por el id refencial del registro  
const update = (codigo_compania, data) => http.put(`api/contabilidad/asientos/update/?codigo_compania=${codigo_compania}`, data, headersConfig());

//El eliminar por los check de las tablas o grid = eliminar por un arrays de ids
const EliminarConCheck = (data) => {
  const headers = {...headersConfig().headers,
    data: data,
  };
  return http.delete(`api/contabilidad/asientos/deletecheck/`, { headers });
};

//Busca por codigo, fecha, concepto, tipo asiento, esto para mostrar en el grid principal del mantenimiento de asientos
const getGroupList = (codigo_compania) =>  http.get(`api/contabilidad/asientos/group_list/?codigo_compania=${codigo_compania}`, headersConfig());

//Busca por el id referencial unico de los asientos, y se trae todos los asientos con ese id referencial, se usa para el modifcar
const individualFiltered = (idunico_referencial, codigo_compania) => http.get(`api/contabilidad/asientos/individual_filtered/?codigo_compania=${codigo_compania}&idunico_referencial=${idunico_referencial}`, headersConfig());

//Valida que un asiento ya existe por medio de codigo_compania, codigo_asiento, concepto, fecha_asiento, idcontabilidad_tipo_asiento
const validaAsientoExistente = (codigo_compania, codigo_asiento, concepto, fecha_asiento, idcontabilidad_tipo_asiento) => {
  return http.get(`api/contabilidad/asientos/validate_existence_accounting_entry/?codigo_compania=${codigo_compania}&codigo_asiento=${codigo_asiento}&concepto=${concepto}&fecha_asiento=${fecha_asiento}&idcontabilidad_tipo_asiento=${idcontabilidad_tipo_asiento}`, headersConfig());
}

//Elimina un registro por el idunico_referencial
const removeBy = (codigo_compania, idunico_referencial) => http.delete(`api/contabilidad/asientos/delete/?codigo_compania=${codigo_compania}&idunico_referencial=${idunico_referencial}`, headersConfig());

//Duplicar un registro por el idunico_referencial, y modifica la fecha del asiento (codigo_compania,id_referencia,fecha_asiento)
const duplicate = (codigo_compania, id_referencia, fecha_asiento) => http.get(`api/contabilidad/asientos/duplicate/?codigo_compania=${codigo_compania}&id_referencia=${id_referencia}&fecha_asiento=${fecha_asiento}`, headersConfig());
 
//Hooks que devuelve
const AsientosServicios = {
  setAuthToken,
  getAll,
  create,
  remove,
  findBy,
  update,
  EliminarConCheck,
  getGroupList,
  individualFiltered,
  validaAsientoExistente,
  removeBy,
  duplicate,
};

export default AsientosServicios;