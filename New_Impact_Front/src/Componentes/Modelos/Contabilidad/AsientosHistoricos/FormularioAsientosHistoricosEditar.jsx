import React, { useState, useEffect } from 'react';
import "./FormularioAsientosHistoricosEditar.css";
import InputFormulario from "../../../Componentes/TextField/inputFormulario";
import Botones from "../../../Componentes/Boton/BotonesGuardarYCancelar";
import ValidaRestricciones from '../../../../Hooks/ValidaRestricciones';
import SinAccesoAlFormulario from '../../../Componentes/Errores/SinAccesoAlFormulario';
import AuthServices from '../../../../Servicios/AuthServices';
import SwitchFormulario from '../../../Componentes/TextField/SwitchFormulario';
import CalendarioFormulario from '../../../Componentes/TextField/CalendarioFormulario';
import TextAreaFormulario from '../../../Componentes/TextField/TextareaFormulario';
import Tabla from "../../../Componentes/DataTable/GridAsientos"
import TablaAsiento from "../../../Componentes/DataTable/Tabla";
import CaseModal from "../../../Componentes/Modales/ModalesPersonalizados/ModalCase";

const FormularioAsientosHistoricosEditar = (props) => {
const { 
  asiento,
  encabezadoAsiento,
  idFormulario,
  //------------
  filas,
  setFilas, 
  encabezados, 
  abrirTotales, 
  listaCatalogosMovimientos, 
  mostrarTotales, 
  cerrarTotales, 
  rowsTablaCuadrados, 
  columnsTablaCuadrados, 
  saldoFaltante, 
  saldoExtranjeroFaltante, 
  nombreCampoFaltante, 
  asientoCuadrado,
  lista_tipo_Documento,
  mostrarAlerta, 
  setMostrarAlerta,
  getListCatalogosConMovimientos,
 
  } = props; // Extrae las props recibidas desde el componente PaisesNuevo

  const [sinPermisos, setSinPermisos] = useState(false);  
  const [restricciones, setRestricciones] = useState([]);
  const tituloNuevo = "Registrar";
  const tituloEditar = `Editar asiento historicos contable ${asiento.Codigo_Asiento}`;
  const ruta = `/MantenimientoAsientosHistoricos/${idFormulario}`

  //Se válida las restricciones cada vez que se refresca la página o se cambia el idFormulario
  useEffect(() => {
    const obtenerRestricciones = async () => {
      try {
        const codigo_compania =  AuthServices.getCodigoCompania();
        const data = await ValidaRestricciones.validar(idFormulario, codigo_compania);//Invoca o llama el hook para validaciones de restricciones por usuarios
        setRestricciones(data);// La constante restricciones guarda lo que devuelve el hook, en este caso las restricciones que es un array
        setSinPermisos(false); // Tiene acceso a este formulario
      } catch (error) {
        console.error(error);
        setSinPermisos(true); // No Tiene acceso a este formulario, y muestra un mensaje de advertencia
      }
    };
    obtenerRestricciones();
  }, [idFormulario]);

return (  
    <div className="container_formuario" >
        {!sinPermisos ? (
        <>
            <div className="card">
                <div className="card-body">
                {props.editar ?  
                    <h3 className="h3_title">{tituloEditar}</h3> 
                    :
                    <h3 className="h3_title">{tituloNuevo}</h3>
                }
                    <blockquote className="blockquote mb-0 ">
                        <form onSubmit={ (e) => {
                            e.preventDefault ()
                            }} 
                            className="row g-1 needs-validation my-3 form_formuario">
                              
{/* --------------------------------------- Encabezados del Asiento --------------------------------------- */}  
                            <div className="card-body row g-3 needs-validation my-2 ">
                               {/*Campo Codigo_Asiento*/}
                               <InputFormulario
                                    classe={"col-auto position-relative"}
                                    type={"text"}
                                    nombreLabel={"Código del Asiento."}
                                    titlelabel={"El campo Código del Asiento contable es basado en el día, mes y los últimos tres dígitos del año de la fecha del asiento, junto con el indicador del tipo de asiento seleccionado."}
                                    icono={<i className="bi bi-123"></i>}
                                    id={"Codigo_Asiento"}
                                    name={"Codigo_Asiento"}
                                    restricciones={restricciones}
                                    editarONuevo={props.editar}
                                    placeholder="000/0000000"
                                    value={encabezadoAsiento.Codigo_Asiento}
                                    disabled={true}
                               />   


                              {/*Campo Fecha_Asiento*/}
                              <CalendarioFormulario
                                    classe={"col-auto position-relative"}
                                    id={"Fecha_Asiento"}
                                    name={"Fecha_Asiento"}
                                    nombreLabel={"Fecha del Asiento"}
                                    value={encabezadoAsiento.Fecha_Asiento}
                                    restricciones={restricciones}
                                    editarONuevo={props.editar}
                                    disabled={true}
                                />  


                              {/*Campo IDContabilidad_Tipo_Asiento*/}
                              <InputFormulario
                                    type={"text"}
                                    classe={"col-auto position-relative"}
                                    nombreLabel={"Tipo de Asiento"}
                                    icono={<i className="bi bi-journal-check"></i>}
                                    id={"IDContabilidad_Tipo_Asiento"}
                                    name={"IDContabilidad_Tipo_Asiento"}
                                    restricciones={restricciones}
                                    editarONuevo={props.editar}
                                    value={encabezadoAsiento.IDContabilidad_Tipo_Asiento }
                                    disabled={true}
                               />  


                               {/*Campo Concepto*/}
                              <TextAreaFormulario
                                    classe={"col-md-4 position-relative"}
                                    nombreLabel={"Concepto del asiento"}
                                    icono={ <i className="bi bi-alphabet-uppercase"></i>}
                                    id={"Concepto"}
                                    name={"Concepto"}
                                    value={encabezadoAsiento.Concepto}
                                    restricciones={restricciones}
                                    editarONuevo={props.editar}
                                    row={"1"}
                                    disabled={true}
                               />


                              {/*Campo Diferencial*/}
                              <SwitchFormulario
                                    classe={"col-md-3 position-relative campoDiferencial"}
                                    nombreLabel={"Diferencial"}
                                    id={"Diferencial"}
                                    name={"Diferencial"}
                                    value={encabezadoAsiento.Diferencial}
                                    textStart={"No"} 
                                    textEnd={"Si"}
                                    restricciones={restricciones}
                                    editarONuevo={props.editar}
                                    disabled={true}
                                />
                            </div>

                            <hr/>
                            
{/* --------------------------------------- Tabla o grid que va agregando los asientos con sus detalles --------------------------------------- */}
                              {/* --------------------------------------- Tabla o grid que va agregando los asientos con sus detalles --------------------------------------- */}
                              <div className="card" style={{paddingTop:"0.500rem"}}>
                                <Tabla
                                    rows={filas}
                                    setRows={setFilas}
                                    columns={encabezados}
                                    disableColumnMenu={false}
                                    checkboxSelection={false}
                                    pageSizeOptions={[5, 10, 20, 30, 40, 50, 60, 70, 80, 90, 100]}
                                    pageSize={20}
                                    rowHeight={45}
                                    asiento={asiento}
                                    abrirTotales={abrirTotales}
                                    listaCatalogosMovimientos={listaCatalogosMovimientos}
                                    esEnModificarAsientos={true}
                                    mostrarAlerta={mostrarAlerta}
                                    setMostrarAlerta={setMostrarAlerta}
                                    getListCatalogosConMovimientos={getListCatalogosConMovimientos}
                                    lista_tipo_Documento={lista_tipo_Documento}
                                    sinBotones={true}
                                  />
                              </div>


                              <div className="card cardTableAsiento" style={{width:"580px"}}>
                                <div className="card-body cardTableAsiento">
                                  <TablaAsiento
                                      rows={rowsTablaCuadrados}
                                      columns={columnsTablaCuadrados}
                                      ancho={570}
                                      size={"small"}
                                      fontSize={13}
                                      rowHeight={20}
                                      vistaAsiento={true}
                                      saldo={saldoFaltante}
                                      saldoExtranjero={saldoExtranjeroFaltante}
                                      campoFaltante={nombreCampoFaltante}
                                      filas={filas}
                                      asientoCuadrado={asientoCuadrado}
                                    />
                                </div>
                              </div>


                            {/*Botones gurdar nuevo registro o guardar cambios y cancelar 30*/}
                            <Botones
                                editar={"Clic para guardar los cambios del registro"}
                                ruta={ruta}
                                restricciones = {restricciones}
                                sinSubmit={true}
                                sinGuardar={true}
                            />

                        </form>                         

                    </blockquote>
                </div>
            </div>
        </>
        ):(
        <>
            {/*En el caso que no tenga permiso de ver del todo el formulario*/}
            <SinAccesoAlFormulario/>
        </>
        )}


        {/*Muestra el modal con los totales del asiento, debito, credito local y extranjero*/}
        <CaseModal 
          mostrarModalCase={mostrarTotales}
          eventoCerrarModalCase={cerrarTotales}
          titulo={"Totales"}
          ancho={"635px"}
          alto={"20rem"}
          ZIndex={1000}
          cuerpo = {
            <>
              <TablaAsiento
                  rows={rowsTablaCuadrados}
                  columns={columnsTablaCuadrados}
                  ancho={570}
                  size={"small"}
                  fontSize={13}
                  rowHeight={20}
                  vistaAsiento={true}
                  saldo={saldoFaltante}
                  saldoExtranjero={saldoExtranjeroFaltante}
                  campoFaltante={nombreCampoFaltante}
                  filas={filas}
                  asientoCuadrado={asientoCuadrado}
                />
            </>
          }
        />


    </div>
    );
};

export default FormularioAsientosHistoricosEditar;
