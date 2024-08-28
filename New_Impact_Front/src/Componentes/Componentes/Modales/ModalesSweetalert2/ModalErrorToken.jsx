import Swal from 'sweetalert2';
import AuthServices from '../../../../Servicios/AuthServices';

const errorDeToken =  () => {
    Swal.fire({
      title: "Tu sesión ha expirado.",
      text: "Por favor, inicia sesión nuevamente para continuar accediendo a nuestros servicios.",
      icon: "warning",
      confirmButtonColor: '#007676' // Cambia el color del boton OK
    });
}

const ModalErrorToken = {
  errorDeToken,
}

export default ModalErrorToken;