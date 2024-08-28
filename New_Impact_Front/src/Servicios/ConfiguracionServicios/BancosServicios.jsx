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
//Get de todo o lista todo po compañia
const getAll = (codigo_compania) => http.get(`api/configuracion/bancos/?codigo_compania=${codigo_compania}`, headersConfig());//La ruta o end poid que consume del back end

//Create o crear nuevos 
const create = data => http.post(`api/configuracion/bancos/create/?codigo_compania=${data.IDCompania}`,data, headersConfig());//La ruta o end poid que consume del back end

//Delete o eliminar 
const remove = IDPais => http.delete(`api/configuracion/bancos/delete/${IDPais}/`, headersConfig());//La ruta o end poid que consume del back end

//FindById o buscar por id 
const findBy = (IDPais,codigo_compania) => http.get(`api/configuracion/bancos/findby/${IDPais}/?codigo_compania=${codigo_compania}`, headersConfig());//La ruta o end poid que consume del back end

//Update o editar  
const update = (id, data) =>  http.put(`api/configuracion/bancos/update/${id}/?codigo_compania=${data.IDCompania}`,data, headersConfig());//La ruta o end poid que consume del back end

//Eliminar todos los registros que tienen check 
const EliminarConCheck = (data) => {
  const encabezado = {
    headers: {
      Authorization: `Bearer ${authToken}`, // Le manda el token en el encabezado de la consulta.
    },
    data // Le manda el data(array) en el encabezado, ya que las petisiciones delete no deja como el post, y se tiene que hacer por el encabezado
  };
  return http.delete(`api/configuracion/bancos/deletecheck/`, encabezado); // La ruta o endpoint que consume del backend
}

//Hooks que devuelve
const BancosServicios = {
  setAuthToken,
  getAll,
  create,
  remove,
  findBy,
  update,
  EliminarConCheck,
};

export default BancosServicios;