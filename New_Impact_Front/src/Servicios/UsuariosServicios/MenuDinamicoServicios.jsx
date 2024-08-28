import http from '../../http-common'; 
let authToken = null;

//Trae el Token para luego mandarlo en los endpoid 
const setAuthToken = (token) => {
  authToken = token;
};

//Consume el back end por medio de la url o endpoind, ademas se le manda el token 
//Get del  menu_dinamico
const getMenudinamico = (codigo_compania)=>{
  const encabezado = {
    headers: {
      Authorization: `Bearer ${authToken}`, //Le manda el token en el encabezado de la consulta.
    },
  };
return http.get(`api/usuarios/menu_dinamico/?codigo_compania=${codigo_compania}`, encabezado);//La ruta o end poid que consume del back end
}

//Hooks que devuelve
const Menudinamico = {
  setAuthToken,
  getMenudinamico,
};

export default Menudinamico;