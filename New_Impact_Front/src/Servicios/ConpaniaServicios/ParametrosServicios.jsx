import http from '../../http-common'; 
let authToken = null;

//Trae el Token para luego mandarlo en los endpoid 
const setAuthToken = (token) => authToken = token;

// Función interna para obtener la configuración de los headers con el token de autenticación
const headersConfig = () => ({
  headers: {
    Authorization: `Bearer ${authToken}`,
  },
});

//Consume el back end por medio de la url o endpoind, ademas se le manda el token 
//Get de todo o lista todos los Compania Paises 
const getAll = (codigo_compania)=> http.get(`api/compania/parametros/?codigo_compania=${codigo_compania}`, headersConfig());//La ruta o end poid que consume del back end

//Create o crear nuevos 
const create = (data) => http.post(`api/compania/parametros/create/?codigo_compania=${data.IDCompania}`,data, headersConfig());//La ruta o end poid que consume del back end

//Delete o eliminar 
const remove = id => http.delete(`api/compania/parametros/delete/${id}/`, headersConfig());//La ruta o end poid que consume del back end

//FindById o buscar por id 
const findBy = (id, codigo_compania) =>  http.get(`api/compania/parametros/findby/${id}/?codigo_compania=${codigo_compania}`, headersConfig());//La ruta o end poid que consume del back end

//Update o editar  
const update = (id, data) => http.put(`/api/compania/parametros/update/${id}/?codigo_compania=${data.IDCompania}`,data, headersConfig());//La ruta o end poid que consume del back end

//Eliminar todos los  que tienen check 
const EliminarConCheck = (data) => http.delete(`api/compania/parametros/deletecheck/`,  { ...headersConfig(), data }); // La ruta o endpoint que consume del backend

//Hooks que devuelve
const ParametrosServicios = {
  setAuthToken,
  getAll,
  create,
  remove,
  findBy,
  update,
  EliminarConCheck,
};

export default ParametrosServicios;