import React, { useState, useEffect } from 'react';
import "./FormularioBancos.css";
import InputFormulario from "../../../Componentes/TextField/inputFormulario";
import TextAreaFormulario from '../../../Componentes/TextField/TextareaFormulario';
import SwitchFormulario from '../../../Componentes/TextField/SwitchFormulario';
import Botones from "../../../Componentes/Boton/BotonesGuardarYCancelar";
import ValidaRestricciones from '../../../../Hooks/ValidaRestricciones';
import SinAccesoAlFormulario from '../../../Componentes/Errores/SinAccesoAlFormulario';
import AuthServices from '../../../../Servicios/AuthServices';

const FormularioBancos = (props) => {
const { 
  manejoCambioImput,
  nuevo,
  editar,
  bancos,
  setBancos,
  idFormulario,
  } = props; // Extrae las props recibidas desde el componente PaisesNuevo

const manejoEventoSubmit = editar ? editar : nuevo; // Determina qué función debe ejecutar el formulario en función de la prop "modificar"
  const [sinPermisos, setSinPermisos] = useState(false);  
  const [restricciones, setRestricciones] = useState([]);
  const tituloNuevo = "Registrar banco.";
  const tituloEditar = `Editar banco `;
  const ruta = `/MantenimientoBancos/${idFormulario}`
 
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
                            manejoEventoSubmit ()
                            }} 
                            className="row g-3 needs-validation my-3 form_formuario">
                              
                               {/*Campo Descripcion*/}
                               <TextAreaFormulario
                                    classe={"col-md-4 position-relative"}
                                    type={"text"}
                                    nombreLabel={"Descripcion del banco"}
                                    titlelabel={"Ejemplo de Descripcion: "}
                                    icono={<i className="bi bi-calendar-date"></i>}
                                    id={"Descripcion"}
                                    name={"Descripcion"}
                                    titleInput={"Ingrese la descripcion."}
                                    value={bancos.Descripcion}
                                    onChange={manejoCambioImput}
                                    onBlur={manejoCambioImput}
                                    restricciones={restricciones}
                                    editarONuevo={props.editar}
                                    maxLength={"100"}
                                    required = {true}
                                />

                              {/*Campo Estatal*/}
                              <SwitchFormulario
                                    classe={"col-md-3 position-relative"}
                                    nombreLabel={"Tipo de banco"}
                                    titlelabel={"Seleccione si el banco es Estatal o privado"}
                                    icono={<i className="bi bi-bank2"></i>}
                                    id={"Estatal"}
                                    name={"Estatal"}
                                    value={bancos.Estatal}
                                    onChange={(isChecked) => {
                                      setBancos(prevObjeto => ({
                                        ...prevObjeto,
                                        Estatal: isChecked
                                      }));
                                    }}
                                    textStart={"Privado"} 
                                    textEnd={"Estatal"}
                                    restricciones={restricciones}
                                    editarONuevo={props.editar}
                                />

                              {/*Campo Pago_Automatico_Salarios*/}
                              <SwitchFormulario
                                    classe={"col-md-3 position-relative"}
                                    nombreLabel={"Pago automático de salarios"}
                                    titlelabel={"Seleccione si el pago es automático de los salarios."}
                                    icono={<i className="bi bi-cash-coin"></i>}
                                    id={"Estatal"}
                                    name={"Estatal"}
                                    value={bancos.Pago_Automatico_Salarios}
                                    onChange={(isChecked) => {
                                      setBancos(prevObjeto => ({
                                        ...prevObjeto,
                                        Pago_Automatico_Salarios: isChecked
                                      }));
                                    }}
                                    textStart={"No"} 
                                    textEnd={"Si"}
                                    restricciones={restricciones}
                                    editarONuevo={props.editar}
                                />

                            {/*Campo Correo*/}
                            <InputFormulario
                                classe={"col-md-5 position-relative"}
                                type={"email"}
                                nombreLabel={"Correo"}
                                titlelabel={"Ejemplo del Correo: ejemplo09@prueba.com"}
                                icono={<i className="bi bi-envelope-at"></i>}
                                id={"Correo"}
                                name={"Correo"}
                                titleInput={"Digite el Correo"}
                                value={bancos.Correo}
                                onChange={manejoCambioImput}
                                maxLength={"100"}
                                restricciones={restricciones}
                                editarONuevo={props.editar}
                            />

                            {/*Campo Contacto*/}
                            <InputFormulario
                                    classe={"col-auto position-relative"}
                                    type={"text"}
                                    nombreLabel={"Contacto"}
                                    titlelabel={"Ejemplo de Contacto: "}
                                    icono={<i className="bi bi-person-vcard-fill"></i>}
                                    id={"Contacto"}
                                    name={"Contacto"}
                                    titleInput={"Ingrese el Contacto."}
                                    value={bancos.Contacto}
                                    onChange={manejoCambioImput}
                                    onBlur={manejoCambioImput}
                                    restricciones={restricciones}
                                    editarONuevo={props.editar}
                                    maxLength={"120"}
                                />

                            {/*Campo Codigo_Bancario*/}
                            <InputFormulario
                                    classe={"col-auto position-relative"}
                                    type={"text"}
                                    nombreLabel={"Código Bancario"}
                                    titlelabel={"Ejemplo de Código Bancario: "}
                                    icono={<i className="bi bi-123"></i>}
                                    id={"Codigo_Bancario"}
                                    name={"Codigo_Bancario"}
                                    titleInput={"Ingrese el Código Bancario."}
                                    value={bancos.Codigo_Bancario}
                                    onChange={manejoCambioImput}
                                    onBlur={manejoCambioImput}
                                    restricciones={restricciones}
                                    editarONuevo={props.editar}
                                    maxLength={"5"}
                                    required = {true}
                                />
                    
                            {/*Campo Codigo_Empresa*/}
                            <InputFormulario
                                    classe={"col-auto position-relative"}
                                    type={"text"}
                                    nombreLabel={"Código de la empresa"}
                                    titlelabel={"Ejemplo de Código de la empresa: "}
                                    icono={<i className="bi bi-123"></i>}
                                    id={"Codigo_Empresa"}
                                    name={"Codigo_Empresa"}
                                    titleInput={"Ingrese el Código de la empresa."}
                                    value={bancos.Codigo_Empresa}
                                    onChange={manejoCambioImput}
                                    onBlur={manejoCambioImput}
                                    restricciones={restricciones}
                                    editarONuevo={props.editar}
                                    maxLength={"10"}
                                    required = {true}
                                />

                            {/*Botones gurdar nuevo registro o guardar cambios y cancelar*/}
                            <Botones
                                editar={props.editar ? "Clic para guardar los cambios del registro" : "Clic para guardar el nuevo registro"}
                                ruta={ruta}
                                restricciones = {restricciones}
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

    </div>
    );
};


export default FormularioBancos;