import http from '../../http-common'; 
let authToken = null;

//Trae el Token para luego mandarlo en los endpoid 
const setAuthToken = (token) => {
  authToken = token;
};

//Consume el back end por medio de la url o endpoind, ademas se le manda el token 
//Get del fomularios_restriccion
const getRestricciones = (modulo_id, codigo_compania)=>{
  const encabezado = {
    headers: {
      Authorization: `Bearer ${authToken}`, //Le manda el token en el encabezado de la consulta.
    },
  };

return http.get(`api/usuarios/fomularios_restriccion/${modulo_id}/?codigo_compania=${codigo_compania}`, encabezado);//La ruta o end poid que consume del back end
}

//Hooks que devuelve
const restriccionXFormulario = {
  setAuthToken,
  getRestricciones,
};

export default restriccionXFormulario;