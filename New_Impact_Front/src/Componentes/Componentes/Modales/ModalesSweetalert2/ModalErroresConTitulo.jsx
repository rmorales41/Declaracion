import { useEffect } from 'react';
import Swal from 'sweetalert2';

const ModalErroresConTitle = ({title, text, icon, show, onClose}) => {
  useEffect(() => {
    if (show) {
      Swal.fire({
        title,
        icon,
        text,
        confirmButtonColor: '#007676',
        onClose: onClose // Cerrar el modal al hacer clic en el botón "OK"
      });
    }
  }, [title, text, icon, show, onClose]);

  return null;
};

export default ModalErroresConTitle;