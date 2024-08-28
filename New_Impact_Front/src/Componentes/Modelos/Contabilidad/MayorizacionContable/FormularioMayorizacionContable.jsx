import React from 'react';
import LoadingAleatorio from "../../../Componentes/Loading/LoadingAleatorio";
import { FormControl, FormLabel, FormGroup } from '@mui/material'; 
import CalendarioFormulario from '../../../Componentes/TextField/CalendarioFormulario';
import "./FormularioMayorizacionContable.css"
import Alert from '@mui/material/Alert';
import BotonGuardar from '../../../Componentes/Boton/BotonGuardar';

const FormularioMayorizacionContable = (props) => {
const { 
  titulo,
  eventoObtenerFecha,
  cargando,
  sinPermisos,
  restricciones,
  mayorizacionContable,
  realizarMayorizacionContable,
  error,
  } = props; // Extrae las props recibidas desde el componente PaisesNuevo

  return (  
    <>
    {!sinPermisos ? (
      <div className="container container_MayorizacionTemporal">
        <div className="card">
          <div className="card-body">
          
            {/*Alerta de mayorización contable.*/}
            <div className="container blockquote mb-0">
              <FormControl component="fieldset" variant="standard">
                <FormLabel component="legend">{titulo}</FormLabel>
                <FormGroup>
                  <div className="container" style={{ display: 'flex', alignItems: 'center' }}>
                      <Alert severity="warning">Este proceso convierte los asientos temporales en asientos mayorizados.</Alert>
                  </div>
                </FormGroup>
              </FormControl>
            </div>


              {/*Fecha__ultimo_cierre*/}
              <blockquote className="container blockquote grupo-fechas" >
                <FormControl component="fieldset" variant="standard">
                  <FormGroup>
                      <div className="card-body row g-3 needs-validation my-2 ">
                          
                          {/*Campo Fecha__ultimo_cierre*/}
                          <CalendarioFormulario
                              classe={"col-auto position-relative"}
                              id={"Fecha__ultimo_cierre"}
                              name={"Fecha__ultimo_cierre"}
                              nombreLabel={"Fecha del último cierre"}
                              value={mayorizacionContable.Fecha_ultimo_cierre}
                              restricciones={restricciones}
                              editarONuevo={props.editar}
                              required={true}
                              disabled={true}
                            />  


                          {/*Campo Fecha_ultima_mayorizacion*/}
                          <CalendarioFormulario
                              classe={"col-auto position-relative"}
                              id={"Fecha_ultima_mayorizacion"}
                              name={"Fecha_ultima_mayorizacion"}
                              nombreLabel={"Fecha de la última mayorización"}
                              value={mayorizacionContable.Fecha_ultima_mayorizacion}
                              restricciones={restricciones}
                              editarONuevo={props.editar}
                              required={true}
                              disabled={true}
                              
                            />  
                        </div>

                  </FormGroup>
                </FormControl>
              </blockquote>


             {/*fecha_mayorizacion.*/}
             <blockquote className="container blockquote mb-0">
              <FormControl component="fieldset" variant="standard">
                <FormGroup>

                  {/*Campo fecha_mayorizacion*/}
                  <CalendarioFormulario
                    classe={"col-auto position-relative"}
                    id={"fecha_mayorizacion"}
                    name={"fecha_mayorizacion"}
                    nombreLabel={"Fecha a mayorizar"}
                    value={mayorizacionContable.fecha_mayorizacion}
                    onChange={(date) => eventoObtenerFecha(date, "fecha_mayorizacion")}
                    restricciones={restricciones}
                    editarONuevo={props.editar}
                    required={true}
                    errores={error}
                  /> 

                  <div style={{margin:"0.300rem"}}></div>
                    {/*boton de mayorizacion.*/}
                    <BotonGuardar restricciones = {restricciones} 
                      editar={"Haz clic aquí para mayorizar. Este proceso convierte los asientos temporales en asientos mayorizados."}
                      onClick={realizarMayorizacionContable} 
                      nombre = {(<><i class="bi bi-gear-wide"></i> Mayorizar</>)} 
                  />


                </FormGroup>
              </FormControl>
            </blockquote>


          </div>
        </div>
      </div>
    ) : (
      <div className="sin_registros_Paises">
        <i className="bi bi-info-circle sin_registros_info" style={{ fontSize: "25px" }}>
          "Acceso denegado: No tienes permisos suficientes para acceder a este recurso."
        </i>
      </div>
    )}
    <LoadingAleatorio mostrar={cargando} />
    {/*Este es el componente para el SnackBar o TooltipFlotante*/}
  </>
  );
};


export default FormularioMayorizacionContable;