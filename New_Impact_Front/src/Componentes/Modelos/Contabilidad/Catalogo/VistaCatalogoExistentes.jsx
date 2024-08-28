import React from "react";
import CaseModal from "../../../Componentes/Modales/ModalesPersonalizados/ModalCase"
import Tabla from "../../../Componentes/DataTable/StripedDataGrid"

export default function VistaCatalogoExistentes ({
  lista,
  mostrarModalCase,
  eventoCerrarModalCase,  
  setSelectedCuenta, 
  setErrores, 
  validarCuentaExiste, 
  catalogo, 
  setCatalogo,
  paraAsiento, 
  setIdCatalogo,
}){
  
//Este es el encabezado completo sin restricciones.
const columns = [
  { field: 'Cuenta_Formateada', headerName: 'Cuenta' , width:150 },
  { field: 'Nombre_Cuenta', headerName: 'Nombre de la Cuenta',  width:150 },
  // Agrega más columnas según sea necesario
];

const rows = lista.map((objeto, index) => ({
  id: index, // Utilizamos el índice como clave única para cada fila
  IDContabilidad_Catalogo : objeto.IDContabilidad_Catalogo,
  IDOrigen: objeto.IDContabilidad_Catalogo,
  Cuenta_Formateada: objeto.Cuenta_Formateada,
  Cuenta: objeto.Cuenta,
  Nombre_Cuenta: objeto.Nombre_Cuenta,
  Permite_Sub_Cuentas: objeto.Permite_Sub_Cuentas,
  IDContabilidad_Niveles: objeto.IDContabilidad_Niveles.Nivel
  // Agrega más campos según sea necesario
}));
 
//Depende del nivel o si permite sub cuentas recomienda la cuenta siguiente
const eventoOnClickCuenta = (params) => {
  const {Permite_Sub_Cuentas, IDContabilidad_Niveles, Cuenta_Formateada, IDContabilidad_Catalogo } = params.row;
  if(paraAsiento){//Si es para el formulario de Asientos
    if (Permite_Sub_Cuentas === false) {
      setSelectedCuenta(Cuenta_Formateada);//Le manda la cuenta que le dio clic
      setIdCatalogo(IDContabilidad_Catalogo);
    }
    return;
  }

  // Para recomendar la cuenta madre 
  if (Permite_Sub_Cuentas === true && IDContabilidad_Niveles !== 1) {
    const nextCuenta = recomendarCuentaMadre(Cuenta_Formateada);
    if (nextCuenta) {
      setSelectedCuenta(nextCuenta);
      setCatalogo({ ...catalogo, Cuenta: nextCuenta});
      setErrores(validarCuentaExiste({ ...catalogo, Cuenta: nextCuenta}));
    }
  }

  // Para recomendar la cuenta padre
  if (IDContabilidad_Niveles === 1) {
    const nextCuenta = recomendarCuentaPadre(Cuenta_Formateada);
    if (nextCuenta) {
      setSelectedCuenta(nextCuenta);
      setCatalogo({ ...catalogo, Cuenta: nextCuenta});
      setErrores(validarCuentaExiste({ ...catalogo, Cuenta: nextCuenta}));
    }
  }

  // Para recomendar la cuenta hija que recibe transacción
  if (Permite_Sub_Cuentas === false) {
    const nextCuenta = recomendarCuentaTransaccional(Cuenta_Formateada);
    if (nextCuenta) {
      setSelectedCuenta(nextCuenta);
      setCatalogo({ ...catalogo, Cuenta: nextCuenta});
      setErrores(validarCuentaExiste({ ...catalogo, Cuenta: nextCuenta}));
    }
  }

};

// Recomienda la cuenta que tiene recomendarCuentaTransaccional
const recomendarCuentaTransaccional = (currentCuenta) => {
  const partes = currentCuenta.split('-');
  const baseCuenta = partes.slice(0, partes.length - 1).join('-'); // Obtener la parte base de la cuenta sin el último número

  // Obtener todos los números de cuenta existentes que pertenecen al mismo segmento numérico
  const numerosExistentes = rows
    .filter(row => {
      const rowPartes = row.Cuenta_Formateada.split('-');
      return rowPartes[0] === partes[0] && rowPartes[1] === partes[1]; // Comparamos los primeros dos segmentos
    })
    .map(row => parseInt(row.Cuenta_Formateada.split('-').pop(), 10));

  // Obtener el número siguiente disponible dentro del subconjunto de números existentes
  let siguienteNumero = 1;
  while (true) {
    if (!numerosExistentes.includes(siguienteNumero)) {
      // Formatear el siguiente número con la misma longitud que el último número
      const formatoLongitud = partes.pop().length;
      return `${baseCuenta}-${siguienteNumero.toString().padStart(formatoLongitud, '0')}`;
    }
    siguienteNumero++;
  }
};

// Recomienda la cuenta madre
const recomendarCuentaMadre = (currentCuenta) => {
  const partes = currentCuenta.split('-');
  const primerSegmento = partes[0];
  const restoSegmentos = partes.slice(2);
  
  // Calcular el rango del primer segmento
  const primerSegmentoNumero = parseInt(primerSegmento, 10);
  const rangoInicio = Math.floor(primerSegmentoNumero / 100) * 100;
  const rangoFin = rangoInicio + 99;

  // Obtener todos los segundos segmentos existentes para el primer segmento dado dentro del rango
  const segundosSegmentosExistentes = rows
    .filter(row => {
      const rowPartes = row.Cuenta_Formateada.split('-');
      const rowPrimerSegmento = parseInt(rowPartes[0], 10);
      return rowPrimerSegmento >= rangoInicio && rowPrimerSegmento <= rangoFin && rowPartes[0] === primerSegmento;
    })
    .map(row => parseInt(row.Cuenta_Formateada.split('-')[1], 10))
    .sort((a, b) => a - b);

  // Buscar el siguiente segmento disponible
  let siguienteSegmento = 1;
  while (segundosSegmentosExistentes.includes(siguienteSegmento)) {
    siguienteSegmento++;
  }

  // Formatear el nuevo segmento
  const formatoLongitud = partes[1].length;
  const nuevoSegmento = siguienteSegmento.toString().padStart(formatoLongitud, '0');

  // Crear la nueva cuenta madre con el segmento disponible
  const nuevaCuentaMadre = `${primerSegmento}-${nuevoSegmento}-${restoSegmentos.join('-')}`;
  
  return nuevaCuentaMadre;
};

//Recomienda la cuenta padre
const recomendarCuentaPadre = (currentCuenta) => {
  const firstSegment = currentCuenta.split('-')[0];// Extraer el primer segmento numérico antes del primer guion '-'
  const firstDigit = parseInt(firstSegment[0], 10);// Extraer el primer dígito de la cuenta
  let maxRange = (firstDigit + 1) * 100 - 1;// Determinar el rango basado en el primer dígito
  let nextNumber = parseInt(firstSegment, 10) + 1;// Convertir el primer segmento a número

  while (nextNumber <= maxRange) {// Buscar el próximo número disponible dentro del rango
    const formattedNextCuenta = `${nextNumber.toString().padStart(firstSegment.length, '0')}${currentCuenta.slice(currentCuenta.indexOf('-'))}`;
    const found = rows.some(row => row.Cuenta_Formateada === formattedNextCuenta);// Verificar si la cuenta está en la lista
    if (!found) {
      return formattedNextCuenta;
    }
    nextNumber++;
  }
  return null; // Devuelve null si no se encuentra ningún número disponible dentro del rango
};

  return(
    <>
      <CaseModal 
        mostrarModalCase={mostrarModalCase}
        eventoCerrarModalCase={eventoCerrarModalCase}
        titulo={"Lista del Catálogo"}
        ancho={"570px"}
        alto={"75%"}
        ZIndex={999}
        overflow={"auto"}
        overflowBody={"auto"}
        cuerpo = {
          <>
            <Tabla
              rows={rows}
              columns={columns}
              disableColumnMenu={false}
              checkboxSelection={false}
              pageSizeOptions={[5,10,20,30,40,50,60,70,80,90,100]}
              pageSize={20}
              rowHeight={30}
              eventoOnClickCuenta={eventoOnClickCuenta}
              catalogo={true}
            />
          </>
        }
      />
     
    </>
  )
}
