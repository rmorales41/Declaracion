import http from '../../../http-common'; 
let authToken = null;

//Trae el Token para luego mandarlo en los endpoid 
const setAuthToken = (token) => {
  authToken = token;
};

//Get All o Listar Tipos De Letras
const obtenerTipoDeLetras = ()=>{
  const encabezado = {
    headers: {
      Authorization: `Bearer ${authToken}`, //Le manda el token en el encabezado de la consulta.
    },
  };
return http.get(`api/configuracion/letras/`, encabezado);//La ruta o end poid que consume del back end
}

//Create o crear nuevos Tipos De Letras
const agregarTipoDeLetras = data =>{

  const encabezado = {
    headers: {
      Authorization: `Bearer ${authToken}`, //Le manda el token en el encabezado de la consulta.
    },
  };
return http.post(`api/configuracion/letras/create/`,data, encabezado);//La ruta o end poid que consume del back end
}

//Hooks que devuelve
const TiposDeLetrasServicios = {
  setAuthToken,
  obtenerTipoDeLetras,
  agregarTipoDeLetras,
};

export default TiposDeLetrasServicios;