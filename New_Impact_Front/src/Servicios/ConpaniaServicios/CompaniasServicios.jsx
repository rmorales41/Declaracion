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
//Get de todo o lista todos 
const getAll = () => http.get(`api/compania/compania/`, headersConfig());//La ruta o end poid que consume del back end

//Create o crear nuevos
const create = data => http.post(`api/compania/compania/create/`,data, headersConfig());//La ruta o end poid que consume del back end

//Delete o eliminar 
const remove = id => http.delete(`api/compania/compania/delete/${id}/`, headersConfig());//La ruta o end poid que consume del back end

//FindById o buscar por id 
const findBy = id => http.get(`api/compania/compania/findby/${id}/`, headersConfig());//La ruta o end poid que consume del back end

//Update o editar 
const update = (id, data) => http.put(`api/compania/compania/update/${id}/`,data, headersConfig());//La ruta o end poid que consume del back end

//Eliminar todos los registros que tienen check 
const EliminarPaisesCheck = (data) => {
  const encabezado = {
    headers: {
      Authorization: `Bearer ${authToken}`, // Le manda el token en el encabezado de la consulta.
    },
    data // Le manda el data(array) en el encabezado, ya que las petisiciones delete no deja como el post
  };
  return http.delete(`api/compania/compania/deletecheck/`, encabezado); // La ruta o endpoint que consume del backend
}

//Hooks que devuelve
const CompaniasServicios = {
  setAuthToken,
  getAll,
  create,
  remove,
  findBy,
  update,
  EliminarPaisesCheck,
};

export default CompaniasServicios;