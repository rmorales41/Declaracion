import AuthServices from "../Servicios/AuthServices";

//Funcion para convertir colones a dorales
const convertirColonesADolares = (montoCRC, tipoCambio) => {
  if (tipoCambio <= 0) {
    throw new Error('El tipo de cambio debe ser mayor a 0');
  }
  const total = (montoCRC / tipoCambio)
  return decimalesUtilizados(total);
};

//Funcion para convertir dorales a colones
const convertirDolaresAColones = (montoUSD, tipoCambio) => {
  if (tipoCambio <= 0) {
    throw new Error('El tipo de cambio debe ser mayor a 0');
  }
  const total = (montoUSD * tipoCambio)
  return decimalesUtilizados(total);
};

// Funcion para determina los decimales que se utilizan, que estan la configuracion de la compañia
const decimalesUtilizados = (num) => {
  const configuracionCompania =  AuthServices.getCompaniaConfig();//Se trae todas las configuraion de la compañia que esta guardado en el local stores
  const desimalesConfig = configuracionCompania.Decimales_Globales_Precios;//Asiga los desimales que tiene la configuracion de la compañia
  const factor = Math.pow(10, desimalesConfig);
  const truncated = Math.floor(num * factor) / factor;
  const nextDigit = Math.floor((num * factor * 10) % 10); // Obtener el siguiente decimal

  // Redondear el último decimal si el siguiente decimal es 5 o mayor
  if (nextDigit >= 5) {
    return (Math.floor(num * factor) + 1) / factor;
  }
  return truncated;
};

const TipoDeCambio = {
  convertirColonesADolares,
  convertirDolaresAColones,
  decimalesUtilizados,
}

export default TipoDeCambio;