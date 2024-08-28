import http from '../../http-common'; 
let authToken = null;

//Encabezado genérico para los endpoint
const getHeaders = () => ({
  headers: {
    Authorization: `Bearer ${authToken}`,
  },
});

//El token que se le manda al encabezado en cada petición
const setAuthToken = (token) => authToken = token;

//Lista todos los registro o get all
const getAll = (codigo_compania) =>  http.get(`api/contabilidad/asientos_historicos/?codigo_compania=${codigo_compania}`, getHeaders());

//Busca por id y codigo compañia
const findBy = (Id, codigo_compania) => http.get(`api/contabilidad/asientos_historicos/findby/${Id}/?codigo_compania=${codigo_compania}`, getHeaders());

//Busca por codigo, fecha, concepto, tipo asiento, esto para mostrar en el grid principal del mantenimiento de asientos
const getGroupList = (codigo_compania) => http.get(`api/contabilidad/asientos_historicos/group_list/?codigo_compania=${codigo_compania}`, getHeaders());

//Busca por el id referencial unico de los asientos, y se trae todos los asientos con ese id referencial, se usa para el modifcar
const individualFiltered = (codigo_compania, idunico_referencial) => http.get(`api/contabilidad/asientos_historicos/individual_filtered/?codigo_compania=${codigo_compania}&idunico_referencial=${idunico_referencial}`, getHeaders());

//Duplicar Asientos Historicos Manuales en la tabla de asientos, se le manda por parametros codigo_compania, id_referencia, fecha_asiento
const duplicate = (codigo_compania, id_referencia, fecha_asiento) =>  http.get(`api/contabilidad/asientos_historicos/duplicate/?codigo_compania=${codigo_compania}&id_referencia=${id_referencia}&fecha_asiento=${fecha_asiento}`, getHeaders());

//Hooks que devuelve
const AsientosHistoricosServicios = {
  setAuthToken,
  getAll,
  findBy,
  getGroupList,
  individualFiltered,
  duplicate,
};

export default AsientosHistoricosServicios;