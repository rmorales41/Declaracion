import  { useEffect } from 'react';
import Swal from 'sweetalert2';
import "./ModalConfirmar.css";

const ModalConfirmar = ({ title, text, icon, confirmButtonText, cancelButtonText, onConfirm, onCancel, successTitle, 
                                successText, successIcon, dismissTitle, dismissText, dismissIcon, show}) => {
  
  useEffect(() => {
    if (show) { // Verifica si show es true
      const swalWithBootstrapButtons = Swal.mixin({
        customClass: {
          confirmButton: "btn btn-confirmar mx-2",
          cancelButton: "btn btn-cancelar"
        },
        buttonsStyling: false
      });
      swalWithBootstrapButtons.fire({
        title,
        text,
        icon,
        showCancelButton: true,
        confirmButtonText,
        cancelButtonText,
        reverseButtons: true
      }).then((result) => {
        if (result.isConfirmed) {
          if (onConfirm) onConfirm();
          swalWithBootstrapButtons.fire({
            title: successTitle, 
            text: successText,   
            icon: successIcon
          });
        } else if ( result.dismiss === Swal.DismissReason.cancel) {
          if (onCancel) onCancel();
          swalWithBootstrapButtons.fire({
            title: dismissTitle, 
            text: dismissText,  
            icon: dismissIcon
          });
        }
      });
    }
  }, [title, text, icon, confirmButtonText, cancelButtonText, onConfirm, onCancel, successTitle, successText, successIcon, dismissTitle, dismissText, dismissIcon, show]);

  return null; // No necesitas renderizar nada en el DOM, SweetAlert2 se encarga de eso
};

export default ModalConfirmar;