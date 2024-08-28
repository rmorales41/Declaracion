import http from '../../http-common'; 
let authToken = null;

//Trae el Token para luego mandarlo en los endpoid 
const setAuthToken = (token) => {
  authToken = token;
};

// Función para cambiar la compañía por Default.
const cambioDeCompaniaDefault = (codigo) => {
  const encabezado = {
    headers: {
      Authorization: `Bearer ${authToken}`, //Le manda el token en el encabezado de la consulta.
    },
  };
return http.post(`api/usuarios/default_compania/`,codigo, encabezado);//La ruta o end poid que consume del back end
}

const cambioDeCompania = {
  setAuthToken,
  cambioDeCompaniaDefault
}

export default cambioDeCompania;