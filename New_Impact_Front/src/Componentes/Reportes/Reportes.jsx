//Hooks para reportes, en los servivios en el encabezado de los end point se tiene que ir responseType: 'arraybuffer'
// Método o función para generar reportes y abrirlos en una ventana emergente
const abrirReportes = async (response) => {
  const blob = new Blob([response], { type: 'application/pdf' });
  const url = URL.createObjectURL(blob);
  window.open(url);
};

const Reportes = {
  abrirReportes,
}

export default Reportes;
