import { useEffect } from 'react';
import Swal from 'sweetalert2';

const ModalErrores = ({text, icon, show, onClose}) => {// Propiedades que se le pasan al componente
  useEffect(() => {//Observa la propiedad show
    if (show) { // Verifica si show es true
      Swal.fire({
        icon,
        text,
        confirmButtonColor: '#007676' // Cambia el color del boton OK
      }).then(() => {
        onClose(); // Llamar a la función onClose para cerrar el modal
      });
    }
  }, [ text, icon, show, onClose]);

  return null; // No necesitas renderizar nada en el DOM, SweetAlert2 se encarga de eso
};

export default ModalErrores;