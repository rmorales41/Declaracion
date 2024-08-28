import AuthServices from "../Servicios/AuthServices";
import ContabilidadConfiguracion from "../Servicios/ConfiguracionServicios/ContabilidadConfiguracionServicios/ContabilidadConfiguracionServicios"
import ValidaRestricciones from './ValidaRestricciones'

const obtenerFormato = async () => {
  let formato = " ";
  let configuracion = [];
  const token = AuthServices.getAuthToken();
  const codigo_compania = AuthServices.getCodigoCompania();
  if (!ValidaRestricciones.ValidarToken(token)) {return;}//valida el token

    ContabilidadConfiguracion.setAuthToken(token);
      try {
        const response = await ContabilidadConfiguracion.getAll(codigo_compania);
        configuracion = response.data;
        formato = response.data[0].Formato;
      } catch (e) {
       console.error(e)
       //ValidaRestricciones.capturaDeErrores(e);  
      }
  return {configuracion, formato};
}

// Se usa para los input normales para darle formatos de las cuentas catalogos ejemplo - > xxx-xxx-xxxx
const eventoInputFormato = (event, form) => {
  // Extraer las propiedades necesarias del evento
  const { name, value, selectionStart } = event.target;
  const unformattedValue = value.replace(/-/g, '');// Eliminar guiones del valor
  let cursorPosition = selectionStart;// Inicializar variables para el manejo del formato
  let formatIndex = 0;
  let formattedValue = '';

  for (let i = 0; i < unformattedValue.length; i++) { // Iterar sobre el valor sin formato
    if (form[formatIndex] === '-') {// Verificar si el carácter actual debe ser un guión
      if (formatIndex !== 0) {// Agregar un guión si no es el primer guión y avanzar la posición del cursor
        formattedValue += '-';
      }
      formatIndex++;
      if (cursorPosition === formattedValue.length) {
        cursorPosition++;
      }
    }
    formattedValue += unformattedValue[i];   // Agregar el carácter actual al valor formateado
    formatIndex++;
  }

  const indexOfDash = formattedValue.indexOf('-', cursorPosition);// Ajustar la posición del cursor si está antes de un guión
  if (indexOfDash !== -1 && selectionStart <= indexOfDash) {
    cursorPosition = selectionStart;
  }
  
  setTimeout(() => {// Establecer la posición del cursor después de un breve retraso
    event.target.setSelectionRange(cursorPosition, cursorPosition);
  });

  return { name, formattedValue };
};

// Se usa para los select Autocomplete para darle formatos de las cuentas catalogos ejemplo - > xxx-xxx-xxxx
const eventoSelectFormato = (event, value, form) => {
  // Si event es nulo, asignar un objeto vacío por defecto
  event = event || {};
  const selectionStart = event.target ? event.target.selectionStart : 0;

  const unformattedValue = value.replace(/-/g, ''); // Eliminar guiones del valor
  let cursorPosition = selectionStart; // Inicializar variables para el manejo del formato
  let formatIndex = 0;
  let formattedValue = '';

  for (let i = 0; i < unformattedValue.length; i++) { // Iterar sobre el valor sin formato
    if (form[formatIndex] === '-') { // Verificar si el carácter actual debe ser un guión
      if (formatIndex !== 0) { // Agregar un guión si no es el primer guión y avanzar la posición del cursor
        formattedValue += '-';
      }
      formatIndex++;
      if (cursorPosition === formattedValue.length) {
        cursorPosition++;
      }
    }
    formattedValue += unformattedValue[i]; // Agregar el carácter actual al valor formateado
    formatIndex++;
  }

  const indexOfDash = formattedValue.indexOf('-', cursorPosition); // Ajustar la posición del cursor si está antes de un guión
  if (indexOfDash !== -1 && selectionStart <= indexOfDash) {
    cursorPosition = selectionStart;
  }

  if (event.target && event.target.setSelectionRange) {
    setTimeout(() => { // Establecer la posición del cursor después de un breve retraso
      event.target.setSelectionRange(cursorPosition, cursorPosition);
    });
  }

  return { formattedValue };
};



//Formate el valor al formato de xxx/xxx esto se usa para el campo del codigo del asiento
const formatiarDato = (value) => {
  let formattedValue = value.toString().replace(/\//g, ""); // Convertir a cadena de texto y luego remover el carácter '/'
  if (formattedValue.length > 3) { // Formatear solo si hay más de 3 dígitos
    formattedValue = formattedValue.slice(0, 3) + '/' + formattedValue.slice(3);
  }
  return formattedValue;
};


const EventoManejoInputFormato = {
  obtenerFormato,
  eventoInputFormato,
  eventoSelectFormato,
  formatiarDato,
}

export default EventoManejoInputFormato;