import http from '../../http-common'; 
let authToken = null;

//Trae el Token para luego mandarlo en los endpoid 
const setAuthToken = (token) => {
  authToken = token;
};

//FindById o buscar por id de asigna Compañia 
const findBy = (IDUsuarios_Asigna_Compania, codigo_compania) => {
  const encabezado = {
    headers: {
      Authorization: `Bearer ${authToken}`, //Le manda el token en el encabezado de la consulta.
    },
  };
  return http.get(`api/usuarios/asigna_compania/findby/${IDUsuarios_Asigna_Compania}/?codigo_compania=${codigo_compania}`, encabezado);//La ruta o end poid que consume del back end
};

// Update o editar 
const update = (IDUsuarios_Asigna_Compania, data, imagen) => {
  const formData = new FormData();
  formData.append('Tipo_Letra', data.Tipo_Letra);
  formData.append('Tamano_Letra', data.Tamano_Letra);
  formData.append('Color_Nav_Lateral', data.Color_Nav_Lateral);
  formData.append('Color_Nav_Header', data.Color_Nav_Header);
  formData.append('Color_Letra', data.Color_Letra);
  formData.append('Estilo', data.Estilo);
  formData.append('Fondo_Desktop', data.Fondo_Desktop);
  if(imagen)formData.append('Imagen_Desktop', imagen);
  const encabezado = {
    headers: {
      Authorization: `Bearer ${authToken}`,
      'Content-Type': 'multipart/form-data' // Asegúrate de establecer el Content-Type como multipart/form-data
    },
  };

  return http.patch(`api/usuarios/asigna_compania/update/${IDUsuarios_Asigna_Compania}/`, formData, encabezado);
};

// Limpiar la Imagen de Fondo por ID de Asigna Compañia
const limpiarImagenDeFondo = data => {
  const encabezado = {
    headers: {
      Authorization: `Bearer ${authToken}`, // Envia el token en el encabezado de la consulta.
    },
  };
  return http.post(`api/usuarios/asigna_compania/modificaImagenDesktopView/`, data, encabezado); // Nueva ruta del endpoint en el backend
};

const AsignaCompaniaServico = {
  setAuthToken,
  findBy,
  update,
  limpiarImagenDeFondo,
}

export default AsignaCompaniaServico;