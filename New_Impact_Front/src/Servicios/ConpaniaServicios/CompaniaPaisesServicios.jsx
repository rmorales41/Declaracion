import http from '../../http-common'; 
let authToken = null;

//Trae el Token para luego mandarlo en los endpoid 
const setAuthToken = (token) => {
  authToken = token;
};

//Consume el back end por medio de la url o endpoind, ademas se le manda el token 
//Get de todo o lista todos los Compania Paises 
const getAll = ()=>{
  const encabezado = {
    headers: {
      Authorization: `Bearer ${authToken}`, //Le manda el token en el encabezado de la consulta.
    },
  };
//return http.get(`api/compania_paises/?page=${page}`, encabezado);//La ruta o end poid que consume del back end
return http.get(`api/compania/paises/`, encabezado);//La ruta o end poid que consume del back end
}

//Create o crear nuevos Compania Paises 
const create = data =>{
  const encabezado = {
    headers: {
      Authorization: `Bearer ${authToken}`, //Le manda el token en el encabezado de la consulta.
    },
  };
return http.post(`api/compania/paises/create/`,data, encabezado);//La ruta o end poid que consume del back end
}

//Delete o eliminar Compania Paises 
const remove = IDPais => {
  const encabezado = {
    headers: {
      Authorization: `Bearer ${authToken}`, //Le manda el token en el encabezado de la consulta.
    },
  };
  return http.delete(`api/compania/paises/delete/${IDPais}/`, encabezado);//La ruta o end poid que consume del back end
};

//FindById o buscar por id Compania Paises 
const findBy = IDPais => {
  const encabezado = {
    headers: {
      Authorization: `Bearer ${authToken}`, //Le manda el token en el encabezado de la consulta.
    },
  };
  return http.get(`api/compania/paises/findby/${IDPais}/`, encabezado);//La ruta o end poid que consume del back end
};

//Update o editar Compania Paises 
const update = (IDPais, data) => {
  const encabezado = {
    headers: {
      Authorization: `Bearer ${authToken}`, //Le manda el token en el encabezado de la consulta.
    },
  };
  return http.put(`api/compania/paises/update/${IDPais}/`,data, encabezado);//La ruta o end poid que consume del back end
};

//search o bucador por Nombre y Código de Área de Compania Paises 
const search = (buscar) => {
  const encabezado = {
    headers: {
      Authorization: `Bearer ${authToken}`, //Le manda el token en el encabezado de la consulta.
    },
  };
  return http.get(`api/compania/paises/search/?buscar=${buscar}`, encabezado);//La ruta o end poid que consume del back end
};

//Get de todo o lista todas las compañías de países, pero sin paginación, para hacer validaciones de único en la creación de nuevas compañías de países
const ListarExistentesPaises = ()=>{
  const encabezado = {
    headers: {
      Authorization: `Bearer ${authToken}`, //Le manda el token en el encabezado de la consulta.
    },
  };
return http.get(`api/compania/paises/getAll/`, encabezado);//La ruta o end poid que consume del back end
}

//Eliminar todos los Compania Paises que tienen check 
const EliminarPaisesCheck = (data) => {
  const encabezado = {
    headers: {
      Authorization: `Bearer ${authToken}`, // Le manda el token en el encabezado de la consulta.
    },
    data // Le manda el data(array) en el encabezado, ya que las petisiciones delete no deja como el post
  };
  return http.delete(`api/compania/paises/deletecheck/`, encabezado); // La ruta o endpoint que consume del backend
}

//Hooks que devuelve
const CompaniaPaises = {
  setAuthToken,
  getAll,
  create,
  remove,
  findBy,
  update,
  search,
  ListarExistentesPaises,
  EliminarPaisesCheck,
};

export default CompaniaPaises;