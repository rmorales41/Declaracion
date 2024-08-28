import http from '../../../http-common'; 
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
//Get de obtenerTipoDeCambioCompra
const obtenerTipoDeCambioCompra = () =>  http.get(`api/configuracion/tipo_cambio/obtenerTipoDeCambioCompra/`, headersConfig());//La ruta o end poid que consume del back end

//Consume el back end por medio de la url o endpoind, ademas se le manda el token 
//Get de obtenerTipoDeCambioVenta
const obtenerTipoDeCambioVenta = () => http.get(`api/configuracion/tipo_cambio/obtenerTipoDeCambioVenta/`, headersConfig());//La ruta o end poid que consume del back end

//Consume el back end por medio de la url o endpoind, ademas se le manda el token 
//Get de todo o lista todos los Compania Paises 
const getAll = (codigo_compania) => http.get(`api/configuracion/tipo_cambio/?codigo_compania=${codigo_compania}`, headersConfig());//La ruta o end poid que consume del back end

//Create o crear nuevos 
const create = (data) => http.post(`api/configuracion/tipo_cambio/create/?codigo_compania=${data.IDCompania}`,data, headersConfig());//La ruta o end poid que consume del back end

//Delete o eliminar 
const remove = (Id) => http.delete(`api/configuracion/tipo_cambio/delete/${Id}/`, headersConfig());//La ruta o end poid que consume del back end

//FindById o buscar por id 
const findBy = (Id, codigo_compania ) => http.get(`api/configuracion/tipo_cambio/findby/${Id}/?codigo_compania=${codigo_compania}`, headersConfig());//La ruta o end poid que consume del back end

//Update o editar  
const update = (Id, data) =>  http.put(`api/configuracion/tipo_cambio/update/${Id}/?codigo_compania=${data.IDCompania}`,data, headersConfig());//La ruta o end poid que consume del back end

//Eliminar todos los  que tienen check 
const EliminarConCheck = (data) => {
  const encabezado = {
    headers: {
      Authorization: `Bearer ${authToken}`, // Le manda el token en el encabezado de la consulta.
    },
    data // Le manda el data(array) en el encabezado, ya que las petisiciones delete no deja como el post
  };
  return http.delete(`api/configuracion/tipo_cambio/deletecheck/`, encabezado); // La ruta o endpoint que consume del backend
}

//searchbydate o bucador por la fecha
const searchbydate = (codigo_compania, Fecha) => {
  if(!authToken) return
  return http.get(`api/configuracion/tipo_cambio/searchbydate/?codigo_compania=${codigo_compania}&Fecha=${Fecha}`, headersConfig());//La ruta o end poid que consume del back end
};


//Hooks que devuelve
const TipoDeCambio = {
  setAuthToken,
  obtenerTipoDeCambioCompra,
  obtenerTipoDeCambioVenta,
  getAll,
  create,
  remove,
  findBy,
  update,
  EliminarConCheck,
  searchbydate,
};

export default TipoDeCambio;