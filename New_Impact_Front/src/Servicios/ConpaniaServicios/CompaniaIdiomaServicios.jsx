import http from '../../http-common'; 
let authToken = null;

//Trae el Token para luego mandarlo en los endpoid 
const setAuthToken = (token) => {
  authToken = token;
};

//Consume el back end por medio de la url o endpoind, ademas se le manda el token 
//Get de todo o lista todos los Compania Idioma
const getAll = ()=>{
  const encabezado = {
    headers: {
      Authorization: `Bearer ${authToken}`, //Le manda el token en el encabezado de la consulta.
    },
  };
return http.get(`api/compania/idioma/`, encabezado);//La ruta o end poid que consume del back end
}

//Create o crear nuevos Compania Idioma 
const create = data =>{
  const encabezado = {
    headers: {
      Authorization: `Bearer ${authToken}`, //Le manda el token en el encabezado de la consulta.
    },
  };
return http.post(`api/compania/idioma/create/`,data, encabezado);//La ruta o end poid que consume del back end
}

//Delete o eliminar Compania Idioma por IDIdioma
const remove = IDIdioma => {
  const encabezado = {
    headers: {
      Authorization: `Bearer ${authToken}`, //Le manda el token en el encabezado de la consulta.
    },
  };
  return http.delete(`api/compania/idioma/delete/${IDIdioma}/`, encabezado);//La ruta o end poid que consume del back end
};

//FindById o buscar por id Compania Idioma 
const findBy = IDIdioma => {
  const encabezado = {
    headers: {
      Authorization: `Bearer ${authToken}`, //Le manda el token en el encabezado de la consulta.
    },
  };
  return http.get(`api/compania/idioma/findby/${IDIdioma}/`, encabezado);//La ruta o end poid que consume del back end
};

//Update o editar Compania Idioma 
const update = (IDIdioma, data) => {
  const encabezado = {
    headers: {
      Authorization: `Bearer ${authToken}`, //Le manda el token en el encabezado de la consulta.
    },
  };
  return http.put(`api/compania/idioma/update/${IDIdioma}/`,data, encabezado);//La ruta o end poid que consume del back end
};

//search o bucador por IDIdioma o Descripcion de Compania Idioma
const search = (buscar) => {
  const encabezado = {
    headers: {
      Authorization: `Bearer ${authToken}`, //Le manda el token en el encabezado de la consulta.
    },
  };
  return http.get(`api/compania/idioma/search/?buscar=${buscar}`, encabezado);//La ruta o end poid que consume del back end
};

//Get de toda la lista de todas las compañías de idiomas sin paginación para usar en el select de compañía países  
const selectListarIdiomas = () =>{
  const encabezado = {
    headers: {
      Authorization: `Bearer ${authToken}`, //Le manda el token en el encabezado de la consulta.
    },
  };
return http.get(`api/compania/idioma/getAll/`, encabezado);//La ruta o end poid que consume del back end
}

//Hooks que devuelve
const CompaniaIdioma = {
  setAuthToken,
  getAll,
  create,
  remove,
  findBy,
  update,
  search,
  selectListarIdiomas,
  
};

export default CompaniaIdioma;