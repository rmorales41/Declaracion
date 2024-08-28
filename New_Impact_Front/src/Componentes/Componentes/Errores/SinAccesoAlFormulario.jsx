import React from "react";

const SinAccesoAlFormulario = () =>{

  return(
    <div className="sin_registros_Paises" >
          <i className="bi bi-info-circle" style={{fontSize:"25px", color: "red", marginBottom:"1%"}}>
            " Acceso denegado: No tienes permisos suficientes para acceder a este recurso."
          </i>
    </div>
  )
}

export default SinAccesoAlFormulario;