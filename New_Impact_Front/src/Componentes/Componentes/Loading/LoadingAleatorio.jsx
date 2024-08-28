import React, { useEffect, useState } from "react";
import NewImpactLoading from "./new_impact.svg";
import "./LoadingAleatorio.css";
import LoadingRing from "./LoadingRing";
import LoadingHourglass from "./LoadingHourglass";
import LoadingGrid from "./LoadingGrid";
import LoadingEllipsis from "./LoadingEllipsis";

const LoadingAleatorio = ({ mostrar }) => {
  const [indiceComponente, setIndiceComponente] = useState(0); 

  const componentes = [
    <LoadingRing />,
    <LoadingHourglass />,
    <LoadingGrid />,
    <LoadingEllipsis />,
    <LoadingEllipsis />,
    <LoadingGrid />,
    <LoadingHourglass />,
    <LoadingRing />,
  ];

  const cambiarComponente = () => {
    let nuevoIndice;
    do {
      nuevoIndice = Math.floor(Math.random() * componentes.length);
    } while (nuevoIndice === indiceComponente);

    setIndiceComponente(nuevoIndice);
  };

  useEffect(() => {
    cambiarComponente();
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // Genera aleatoriamente el color.
  function getRandomColor() {
    var letters = "0123456789ABCDEFG";
    var color = "#";
    for (var i = 0; i < 6; i++) {
      color += letters[Math.floor(Math.random() * 16)];
    }
    return color;
  }

  // Cada vez que se renderiza o se llama este componente se cambia a un color diferente
  useEffect(() => {
    const colorRandom = getRandomColor();
    document.documentElement.style.setProperty("--color-lds-ellipsis", colorRandom); // Para darle el color al Loading
  }, []);

  return (
    <>
      {mostrar ? (
        <div>
          <div className="overlay"> </div>
          <div className="loading-container">
            {componentes[indiceComponente]}
            <div>
              <img src={NewImpactLoading} alt="New Impact Loading" className="svg-wave" />
            </div>
          </div>
        </div>
      ) : (
        <></>
      )}
    </>
  );
};

export default LoadingAleatorio;
