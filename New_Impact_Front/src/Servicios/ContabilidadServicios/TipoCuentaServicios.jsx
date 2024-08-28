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
const getAll = (codigo_compania)=>http.get(`api/contabilidad/tipo_cuenta/?codigo_compania=${codigo_compania}`, headersConfig());//La ruta o end poid que consume del back end

//Create o crear nuevos 
const create = data =>http.post(`api/contabilidad/tipo_cuenta/create/?codigo_compania=${data.IDCompania}`,data, headersConfig());//La ruta o end poid que consume del back end

//Delete o eliminar 
const remove = IDPais => http.delete(`api/contabilidad/tipo_cuenta/delete/${IDPais}/`, headersConfig());//La ruta o end poid que consume del back end

//FindById o buscar por id 
const findBy = (IDPais,codigo_compania) => http.get(`api/contabilidad/tipo_cuenta/findby/${IDPais}/?codigo_compania=${codigo_compania}`, headersConfig());//La ruta o end poid que consume del back end

//Update o editar  
const update = (id, data) =>  http.put(`api/contabilidad/tipo_cuenta/update/${id}/?codigo_compania=${data.IDCompania}`,data, headersConfig());//La ruta o end poid que consume del back end

//search o bucador por todos los campos 
const search = (buscar, codigo_compania) => http.get(`api/contabilidad/tipo_cuenta/search/?buscar=${buscar}/?codigo_compania=${codigo_compania}`, headersConfig());//La ruta o end poid que consume del back end

//Eliminar todos los  que tienen check 
const EliminarConCheck = (data) => http.delete(`api/contabilidad/tipo_cuenta/deletecheck/`,  { ...headersConfig(), data }); // La ruta o endpoint que consume del backend

//Hooks que devuelve
const TipoCuentaServicios = {
  setAuthToken,
  getAll,
  create,
  remove,
  findBy,
  update,
  search,
  EliminarConCheck,
};

export default TipoCuentaServicios;