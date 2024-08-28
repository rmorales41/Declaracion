import React from 'react';
import LoadingAleatorio from "../../../Componentes/Loading/LoadingAleatorio";
import { FormControl, FormLabel, FormGroup } from '@mui/material'; 
import CalendarioFormulario from '../../../Componentes/TextField/CalendarioFormulario';
import GrupoRadioButtonFormulario from "../../../Componentes/TextField/GrupoRadioButtonFormulario";
import SwitchFormulario from '../../../Componentes/TextField/SwitchFormulario';
import BotoneraOpciones from "../../../Componentes/Boton/BotoneraOpciones";
import TooltipFlotante from "../../../Componentes/SnackBar/TooltipFlotante";
import "./FormularioMayorizacionTemporal.css"

const FormularioMayorizacionTemporal = (props) => {
const { 
  titulo,
  mayorizacionTemporal,
  setMayorizacionTemporal,
  eventoObtenerFecha,
  eventoDeSwitch,
  radioOptions,
  menuItems,
  cargando,
  hoveredItem,
  handleClose,
  sinPermisos,
  restricciones,
  } = props; // Extrae las props recibidas desde el componente PaisesNuevo

  return (  
    <>
    {!sinPermisos ? (
      <div className="container container_MayorizacionTemporal">
        <div className="card">
          <div className="card-body">
          
            {/*fecha_mayorizacion*/}
            <blockquote className="container blockquote mb-0">
              <FormControl component="fieldset" variant="standard">
                <FormLabel component="legend">{titulo}</FormLabel>
                <FormGroup>
                  <div className="container" style={{ display: 'flex', alignItems: 'center' }}>
                    <CalendarioFormulario
                      classe={"col-auto position-relative"}
                      titlelabel={"Ejemplo de la fecha de mayorización: "}
                      id={"fecha_mayorizacion"}
                      name={"fecha_mayorizacion"}
                      nombreLabel={"Aplicar movimientos hasta"}
                      value={mayorizacionTemporal.fecha_mayorizacion}
                      onChange={(date) => eventoObtenerFecha(date, "fecha_mayorizacion")}
                      restricciones={restricciones}
                      editarONuevo={true}
                      required={true}
                    />
                  </div>
                </FormGroup>
              </FormControl>
            </blockquote>

            {/*Grupo de Radio Button con las opciones de reportes*/}
            <div className="container container-horizontal">
              <div className="card-body row g-1 needs-validation my-0">
                <div className="container container-GrupoRadioButtonFormulario">
                  <GrupoRadioButtonFormulario
                    options={radioOptions}
                    restricciones={restricciones}
                    editarONuevo={true}
                    selectedValue={mayorizacionTemporal.opcion}
                    margenb={-1}
                    margenl={-1}
                    onValueChange={(value) => setMayorizacionTemporal({ ...mayorizacionTemporal, opcion: value })}
                  />
                </div>
              </div>

              {/*Switch de moneda moneda*/}
              <blockquote className="container blockquote" style={{marginLeft:"-6%"}}>
                <FormControl component="fieldset" variant="standard">
                  <FormGroup>
                    <div className="container" style={{ alignItems: 'center' }}>
                      <div className="card-body row needs-validation">
                        <SwitchFormulario
                          classe={"col-auto position-relative campoDiferencial"}
                          nombreLabel={"Tipo de moneda"}
                          titlelabel={"Seleccione si la moneda es local o extranjera."}
                          id={"moneda"}
                          name={"moneda"}
                          value={mayorizacionTemporal.moneda}
                          onChange={(isChecked) => eventoDeSwitch('moneda', isChecked)}
                          textStart={"Extranjera"}
                          textEnd={"Local"}//Extranjera
                          restricciones={restricciones}
                          editarONuevo={true}
                        />
                      </div>
                    </div>

                    {/*Switch de idioma idioma*/}
                    <div className="container" style={{ display: 'flex', alignItems: 'center', marginTop:"-1rem" }}>
                      <div className="card-body row needs-validation">
                        <SwitchFormulario
                          classe={"col-auto position-relative campoDiferencial"}
                          nombreLabel={"Idioma"}
                          titlelabel={"Seleccione si el idioma es Español o Ingles."}
                          id={"idioma"}
                          name={"idioma"}
                          value={mayorizacionTemporal.idioma}
                          onChange={(isChecked) => eventoDeSwitch('idioma', isChecked)}
                          textStart={"Ingles"}
                          textEnd={"Español"}
                          restricciones={restricciones}
                          editarONuevo={true}
                        />
                      </div>
                    </div>

                    {/*Boton de opciones de reportes, ejemplo pdf, excel, y demas*/}
                    <div className="container" style={{ display: 'flex', alignItems: 'center', marginTop:"-1rem" }}>
                      <div className="card-body row needs-validation">
                        <BotoneraOpciones 
                          items={menuItems} 
                        />
                      </div>
                    </div>
                  </FormGroup>
                </FormControl>
              </blockquote>
            </div>
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
    <TooltipFlotante open={!!hoveredItem} handleClose={handleClose} message={hoveredItem} />
  </>
  );
};


export default FormularioMayorizacionTemporal;