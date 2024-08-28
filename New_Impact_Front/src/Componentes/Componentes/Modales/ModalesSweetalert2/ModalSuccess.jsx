import Swal from 'sweetalert2';
import "./ModalSuccess.css";

//Modal que se usa para cuando hay un evento correctamente
const modalSuccesscorrectamente =  (mensaje, timer) => {
  if(!timer) timer = 1800 // si no se le manda el timer le asigna 1800
  Swal.fire({// Modal para que muestre que se agregó correctamente
    position: "top-center",
    icon: "success",
    title: `${mensaje}`,
    showConfirmButton: false,
    timer: timer
  });
}

//Modal que se usa para que capture y muestra un error, se usa mas que nada para mensajes del back end
const modalCapturaDeErrores =  (title, mensaje) => {
  Swal.fire({// Modal para que capture y muestra un error
    title: `${title}`,
    text: `${mensaje}`,
    icon: "error",
    confirmButtonColor: "#038C8C",
  });
}

//Modal que se usa para mandar un mensaje de Warning
const modalCapturaDeWarning =  (mensaje, title) => {
  Swal.fire({// Modal para que capture y muestre un Warning
    title: `${title ? title : "Precaución"}`,
    text: `${mensaje}`,
    icon: "warning",
    confirmButtonColor: "#038C8C",
  });
}

//Modal que se usa para confirmar el eliminar o editar de los registros
const modalConfirmar = async (title, mensaje, confirmarButton, cancelarButton, successTitle, successText) => {
  try {
    const result = await Swal.fire({
      title: title,
      text: mensaje,
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#038C8C",
      cancelButtonColor: "#F28705",
      cancelButtonText: cancelarButton,
      confirmButtonText: confirmarButton,
      customClass: {
        confirmButton: 'btn custom-confirm-button mx-2',
        cancelButton: 'btn custom-cancel-button'
      },
      buttonsStyling: false
    });

    if (result.isConfirmed) {
      await Swal.fire({
        title: successTitle,
        text: successText,
        icon: "success",
        confirmButtonColor: "#038C8C",
      });
      return true; // Retorna true si se confirma
    } else {
      return false; // Retorna false si se cancela
    }
  } catch (error) {
    console.error("Error en modalConfirmar:", error);
    return false; // Retorna false en caso de error
  }
};

const ModalSuccess = {
  modalSuccesscorrectamente,
  modalCapturaDeErrores,
  modalCapturaDeWarning,
  modalConfirmar,
}

export default ModalSuccess;