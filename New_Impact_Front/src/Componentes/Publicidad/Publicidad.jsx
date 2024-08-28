import React, { useState, useEffect } from "react";
import "./Publicidad.css";
function Publicidad(props) {
  const [clienteItem, setClienteItem] = useState(0);

  useEffect(() => {
    // Se configura el intervalo de duración del anuncio
    const interval = setInterval(() => {
      setClienteItem(
        (prevItem) =>
          // Se reinicia al primer cliente una vez llegado al último
          (prevItem + 1) % props.clientes.length
      );
    }, 10000);

    // Se limpia el intervalo
    return () => clearInterval(interval);
  }, [props]); // Se actualiza el efecto cuando cambian los props

  return (
    <>
      <div className="card mb-3 publicidadCard">
        <div className="row g-0">
          <div className="col-md-4 colPublicidad">
            <img
              src={props.clientes[clienteItem].logo}
              className="img-fluid rounded-start imgPublicidad"
              alt="imágen de la compañía"
            />
          </div>
          <div className="col-md-8  colCuerpo">
            <div className="card-body">
              <h5 className="card-title publicidadTitulo">
                {props.clientes[clienteItem].compania}
              </h5>
              <p className="card-text publicidadMensaje">
                {props.clientes[clienteItem].mensaje}
              </p>
              <p className="card-text">
                <small className="text-body-secondary publicidadEslogan">
                  <b>{props.clientes[clienteItem].eslogan}</b>
                </small>
              </p>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}

export default Publicidad;
