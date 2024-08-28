import React from "react";
import BtnCancelar from "./BotonCancelar";
import BtnGurdar from "./BotonGuardar";

const BotonesGuardarYCancelar = ({editar, ruta, restricciones, onClick, sinSubmit, onClickCancelar, cuerpo, sinGuardar}) =>{

  return(
    <div className="container" style={{marginTop:"1%"}}>
      <div className="d-flex justify-content-end align-items-end">
          {!sinGuardar && (
            <BtnGurdar editar={editar} restricciones = {restricciones} onClick={onClick} sinSubmit={sinSubmit}/>
          )}
          
          {cuerpo}
          <BtnCancelar ruta={ruta} onClickCancelar = {onClickCancelar}/>
         
      </div>
    </div>
  )}

export default BotonesGuardarYCancelar;