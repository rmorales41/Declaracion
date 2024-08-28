import React, { useState, useEffect } from 'react';
import "./FormularioPaises.css";
import InputFormulario from "../../../Componentes/TextField/inputFormulario";
import Botones from "../../../Componentes/Boton/BotonesGuardarYCancelar";
import SelectFormulario from "../../../Componentes/TextField/SelectFormulario";
import ValidaRestricciones from '../../../../Hooks/ValidaRestricciones';
import SinAccesoAlFormulario from '../../../Componentes/Errores/SinAccesoAlFormulario';
import AuthServices from '../../../../Servicios/AuthServices';

const FormularioCompaniaPaises = (props) => {
const { 
    manejoCambioImput, nuevo, editar, companiaPaises, companiaIdioma, setIdioma, manejoImputIdioma,
    errores, manejoImputValidacion, defaul, setDefaul, errorsinSeleccionar, setCompaniaPaises, idFormulario
    } = props; // Extrae las props recibidas desde el componente PaisesNuevo

const manejoEventoSubmit = editar ? editar : nuevo; // Determina qué función debe ejecutar el formulario en función de la prop "modificar"
  const [sinPermisos, setSinPermisos] = useState(false);  
  const [restricciones, setRestricciones] = useState([]);

  //Se válida las restricciones cada vez que se refresca la página o se cambia el idFormulario
  useEffect(() => {
    const obtenerRestricciones = async () => {
      try {
        const codigo_compania = AuthServices.getCodigoCompania(); 
        const data = await ValidaRestricciones.validar(idFormulario, codigo_compania);//Invoca o llama el hook para validaciones de restricciones por usuarios
        setRestricciones(data);// La constante restricciones guarda lo que devuelve el hook, en este caso las restricciones que es un array
        setSinPermisos(false); // Tiene acceso a este formulario
      } catch (e) {
        console.error(e);
        setSinPermisos(true); // No Tiene acceso a este formulario, y muestra un mensaje de advertencia
        ValidaRestricciones.capturaDeErrores(e);
      }
    };
    obtenerRestricciones();
  }, [idFormulario]);

  return (  
    <div className="container_formuario">
        {!sinPermisos ? (
        <>
            <div className="card">
                <div className="card-body">
                {props.editar ?  
                    <h3 className="h3_title">Editar País {companiaPaises.Nombre}</h3> 
                    :
                    <h3 className="h3_title">Registrar Nuevo País</h3>
                }
                    <blockquote className="blockquote mb-0 ">
                        <form onSubmit={ (e) => {
                            e.preventDefault ()
                            manejoEventoSubmit ()
                            }} className="row g-3 needs-validation my-3 form_formuario">

                            {/*Campo Código Área*/}
                            <InputFormulario
                                classe={"col-md-2 position-relative"}
                                type={"text"}
                                nombreLabel={"Código Área"}
                                titlelabel={"Ejemplo de Código Área: +506"}
                                icono={<i className="bi bi-123"></i>}
                                id={"Codigo_Area"}
                                name={"Codigo_Area"}
                                titleInput={"Digite el Código Área de área del país"}
                                value={companiaPaises.Codigo_Area}
                                onChange={manejoCambioImput}
                                maxLength={"10"}
                                required={true}
                                restricciones={restricciones}
                                editarONuevo={props.editar}
                            />

                            {/*Campo Nombre*/}
                            <InputFormulario
                                classe={"col-md-3 position-relative"}
                                type={"text"}
                                nombreLabel={"Nombre del País"}
                                titlelabel={"Ejemplo de nombre: Costa Rica"}
                                icono={<i className="bi bi-pencil-square"></i>}
                                errores={errores.Nombre}
                                id={"Nombre"}
                                name={"Nombre"}
                                titleInput={"Digite el nombre del país"}
                                value={companiaPaises.Nombre}
                                onChange={manejoImputValidacion}
                                onBlur={manejoImputValidacion}
                                onKeyUp={manejoImputValidacion}
                                maxLength={"80"}
                                required={true}
                                restricciones={restricciones}
                                editarONuevo={props.editar}
                            />

                            {/*Campo Abreviatura*/}
                            <InputFormulario
                                classe={"col-md-2 position-relative"}
                                type={"text"}
                                nombreLabel={"Abreviatura"}
                                titlelabel={"Ejemplo de Abreviatura: CRI"}
                                icono={ <i className="bi bi-alphabet-uppercase"></i>}
                                id={"Abreviatura"}
                                name={"Abreviatura"}
                                titleInput={"Digite la Abreviatura del país"}
                                value={companiaPaises.Abreviatura}
                                onChange={manejoCambioImput}
                                maxLength={"3"}
                                required={false}
                                restricciones={restricciones}
                                editarONuevo={props.editar}
                            />

                            {/*Campo Simbolo_Moneda*/}
                            <InputFormulario
                                classe={"col-md-2 position-relative"}
                                type={"text"}
                                nombreLabel={"Símbolo de Moneda"}
                                titlelabel={"Ejemplo de Símbolo de Moneda: ₡"}
                                icono={<i className="bi bi-currency-exchange"></i>}
                                id={"Simbolo_Moneda"}
                                name={"Simbolo_Moneda"}
                                titleInput={"Digite el Símbolo de la Moneda del país"}
                                value={companiaPaises.Simbolo_Moneda}
                                onChange={manejoCambioImput}
                                maxLength={"10"}
                                required={true}
                                restricciones={restricciones}
                                editarONuevo={props.editar}
                            />

                            {/*Campo Nombre_Moneda*/}
                            <InputFormulario
                                classe={"col-md-3 position-relative"}
                                type={"text"}
                                nombreLabel={"Nombre de la Moneda"}
                                titlelabel={"Ejemplo del Nombre de la Moneda: Colón costarricense"}
                                icono={<i className="bi bi-pencil-square"></i>}
                                id={"Nombre_Moneda"}
                                name={"Nombre_Moneda"}
                                titleInput={"Digite el Símbolo de la Moneda del país"}
                                value={companiaPaises.Nombre_Moneda}
                                onChange={manejoCambioImput}
                                maxLength={"40"}
                                required={true}
                                restricciones={restricciones}
                                editarONuevo={props.editar}
                            />
                     
                            {/*Campo Moneda_Base_Comparacion*/}
                            <InputFormulario
                                classe={"col-md-2 position-relative"}
                                type={"text"}
                                nombreLabel={"Moneda de Comparación"}
                                titlelabel={"Ejemplo Moneda de Comparación: Dólar estadounidense"}
                                icono={<i className="bi bi-cash-coin"></i>}
                                id={"Moneda_Base_Comparacion"}
                                name={"Moneda_Base_Comparacion"}
                                titleInput={"Digite la Moneda de Comparación"}
                                value={companiaPaises.Moneda_Base_Comparacion}
                                onChange={manejoCambioImput}
                                maxLength={"40"}
                                required={false}
                                restricciones={restricciones}
                                editarONuevo={props.editar}
                            />

                             
                            {/*Campo Seleccionar opción para el formulario, editar y registrar un nuevo registro*/}
                            <SelectFormulario
                                editar = {props.editar}// esto es para saber si llame el select de editar o nuevo registro
                                classeDiv = {"col-md-3 position-relative"} // L clase de css del div contenedor
                                label = {"Idioma"} // Es el titulo arriba del select
                                title = {"Ejemplo de Idioma del país: Español"} // Este title es para el tooltips del incono antes del select
                                icono = { <i className="bi bi-translate"> </i>} // Icono que va antes del select
                                name = {"Compania_Idioma"} 
                                id = {"Compania_Idioma"}
                                titleSelect = {"Seleccioné un idioma para el país"}// Es el title del tooltips del select
                                selectOption = {"Seleccioné el idioma"}// Es el texto que sale en el select para seleccionar

                                onClick = {manejoImputIdioma}// Evento onClick
                                onBlur = {manejoImputIdioma}// Evento onBlur
                                onMouseDown = {manejoImputIdioma}// Evento onMouseDown
                                onMouseUp = {manejoImputIdioma}// Evento onMouseUp
                                onChangeEditar = {
                                    e => {setCompaniaPaises({ ...companiaPaises, Compania_Idioma: JSON.parse(e.target.value) })}
                                }
 
                                defaul = {defaul}// Es para saber si ocultar el selectOption despues de Seleccionar un item
                                setDefaul = {setDefaul}
                                value = {companiaPaises.Compania_Idioma ? companiaPaises.Compania_Idioma.IDIdioma : null}// El valor que agarra al seleccionar
                                detalle = {companiaPaises.Compania_Idioma ? companiaPaises.Compania_Idioma.Descripcion : ' '}// Lo que quiere que se mustre en select
                                onChangeNuevo = {e => {setIdioma(JSON.parse(e.target.value))}}// Evento que obserba si hay algun cambio en el select de registrar un nuevo registro 
                                mapEditar ={<>
                                    {companiaIdioma && companiaIdioma.map((companiaIdioma) => (
                                        <option key={companiaIdioma.IDIdioma}
                                        value={companiaIdioma.IDIdioma}>
                                              {companiaIdioma.Descripcion}
                                        </option>
                                        ))}
                                </>}// Este map es para que mustre todo lo que tiene el objeto que desea mostrar al editar
                                tituloNuveo={"Ejemplo de Idioma del país: Español"}
                                mapNuevo={<>
                                    {companiaIdioma && companiaIdioma.map((companiaIdioma) => (
                                        <option key={companiaIdioma.IDIdioma} 
                                            value={companiaIdioma.IDIdioma}>
                                                  {companiaIdioma.Descripcion}
                                        </option>
                                     ))}
                                </>}// Este map es para que mustre todo lo que tiene el objeto que desea mostrar en el nuevo registro
                                error={props.editar ? "" : errorsinSeleccionar.sinSeleccionar}// Muestra un error ya que siempre se debe de Seleccionar
                                restricciones={restricciones}
                                editarONuevo={props.editar}
                            />
                        
                            {/*Campo ISO*/}
                            <InputFormulario
                                classe={"col-md-2 position-relative"}
                                type={"text"}
                                nombreLabel={"Código ISO"}
                                titlelabel={"Ejemplo del código ISO del país: ISO 3166-2:CR"}
                                icono={<i className="bi bi-123"></i>}
                                id={"ISO"}
                                name={"ISO"}
                                titleInput={"Digite el código ISO del país"}
                                value={companiaPaises.ISO}
                                onChange={manejoCambioImput}
                                maxLength={"15"}
                                required={true}
                                restricciones={restricciones}
                                editarONuevo={props.editar}
                            />

                            {/*Campo Correo_Conexion*/}
                            <InputFormulario
                                classe={"col-md-5 position-relative"}
                                type={"email"}
                                nombreLabel={"Correo de Conexión"}
                                titlelabel={"Ejemplo del Correo de Conexión: conexion_2024@prueba.com"}
                                icono={<i className="bi bi-envelope-at"></i>}
                                id={"Correo_Conexion"}
                                name={"Correo_Conexion"}
                                titleInput={"Digite el Correo de Conexión"}
                                value={companiaPaises.Correo_Conexion}
                                onChange={manejoCambioImput}
                                maxLength={"180"}
                                required={false}
                                restricciones={restricciones}
                                editarONuevo={props.editar}
                            />

                            {/*Campo Usuario_Conexion_BC*/}
                             <InputFormulario
                                classe={"col-md-3 position-relative"}
                                type={"text"}
                                nombreLabel={"Usuario de conexión del BC"}
                                titlelabel={"Ejemplo del Usuario de conexión del BC: us*2024/bc"}
                                icono={<i className="bi bi-person-lock"></i>}
                                id={"Usuario_Conexion_BC"}
                                name={"Usuario_Conexion_BC"}
                                titleInput={"Digite el Usuario de conexión del BC"}
                                value={companiaPaises.Usuario_Conexion_BC}
                                onChange={manejoCambioImput}
                                maxLength={"20"}
                                required={false}
                                restricciones={restricciones}
                                editarONuevo={props.editar}
                            />

                            {/*Campo Clave_Conexion_Bc*/}
                            <InputFormulario
                                classe={"col-md-3 position-relative"}
                                type={"text"}
                                nombreLabel={"Clave de conexión del BC"}
                                titlelabel={"Ejemplo de la Clave de conexión del BC: pass*2024/bc"}
                                icono={<i className="bi bi-shield-lock"></i>}
                                id={"Clave_Conexion_Bc"}
                                name={"Clave_Conexion_Bc"}
                                titleInput={"Digite la Clave de conexión del BC"}
                                value={companiaPaises.Clave_Conexion_Bc}
                                onChange={manejoCambioImput}
                                maxLength={"50"}
                                required={false}
                                restricciones={restricciones}
                                editarONuevo={props.editar}
                            />

                            {/*Campo Url_Banco_Central*/}
                            <InputFormulario
                                classe={"col-md-6 position-relative"}
                                type={"text"}
                                nombreLabel={"Url del Banco Central"}
                                titlelabel={"Ejemplo de la  Url del Banco Central: www.banco_ejemplo.com/central"}
                                icono={<i className="bi bi-link-45deg"></i>}
                                id={"Url_Banco_Central"}
                                name={"Url_Banco_Central"}
                                titleInput={"Digite la Url del Banco Central"}
                                value={companiaPaises.Url_Banco_Central}
                                onChange={manejoCambioImput}
                                maxLength={"250"}
                                required={false}
                                restricciones={restricciones}
                                editarONuevo={props.editar}
                            />
 
                            {/*Campo Observación*/}
                            <InputFormulario
                                classe={"col-md-6 position-relative"}
                                type={"text"}
                                nombreLabel={"Observación"}
                                titlelabel={"Ejemplo de Observación del país: Centro América"}
                                icono={<i className="bi bi-pencil-square"></i>}
                                id={"Observaciones"}
                                name={"Observaciones"}
                                titleInput={"Digite una Observación del país"}
                                value={companiaPaises.Observaciones}
                                onChange={manejoCambioImput}
                                maxLength={"250"}
                                required={false}
                                restricciones={restricciones}
                                editarONuevo={props.editar}
                            />
                            
                            {/*Botones gurdar nuevo registro o guardar cambios y cancelar*/}
                            <Botones
                                editar={props.editar ? "Clic para guardar los cambios del registro" : "Clic para guardar el nuevo registro"}
                                ruta={`/MantenimientoPaises/${idFormulario}`}
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


export default FormularioCompaniaPaises;