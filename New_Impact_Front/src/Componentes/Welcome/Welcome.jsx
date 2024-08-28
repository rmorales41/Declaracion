import "./Welcome.css";
import Footer from "../Componentes/Footer/Footer.jsx";
import { Link } from "react-router-dom";
import bienvenidaImg from "../../RecursosGraficos/ImagenesGlobales/scott-graham-5fNmWej4tAA-unsplash.jpg";
import Publicidad  from "../Publicidad/Publicidad.jsx";
import publicidadJSON   from "../../RecursosTemporales/ClientesPublicidad.json"
function Welcome() {
  return (

    <>

    <div className="contenedorGeneral">
      <header className="header">
        <h1 className="animacion-titulo">New Impact</h1>
        <Link to={"../Login"}>
          <button type="button" className="btn btn-primary bienvenidaBtn">
            Ingresar
          </button>
        </Link>
      </header>
      <div className="bienvenidaImg">
        <img src={bienvenidaImg} className="bienvenidaImg" />
      </div>
      <div className=" textContainer">
        <h3 className="tituloParrafo">Acerca de New Impact</h3>
        <p className="parrafoBienvenida">
          New Impact es la nueva herramienta de software de gestión empresarial
          de Sipav Internacional, es un ERP desarrollado en tecnología web que
          se adapta a las tendencias modernas que utilizan las aplicaciones de
          administración. Nuestro sistema integrado de administración comercial
          ahora es una plataforma web robusta, que le permite administrar de
          forma ágil, eficaz y eficiente; además de ofrecerle una experiencia
          muy agradable al interactuar con los diferentes módulos que la
          componen.
        </p>
        <br></br>
        <p className="parrafoBienvenida">
          Podrá disfrutar de una interfaz muy intuitiva que agiliza las
          transacciones comerciales, tomamos en cuenta las necesidades de cada
          uno de los componentes empresariales para abarcar los requerimientos
          más puntuales de nuestros usuarios.
        </p>
        <br></br>
        <p className="parrafoBienvenida">
          Más de 30 años de experiencia en la oferta de servicios y software
          administrativo nos respaldan y nos han llevado a brindar productos y
          servicios de calidad, New Impact es nuestra muestra de ello y nuestro
          más reciente producto. Engloba todo el conocimiento y experiencia
          adquiridos durante todos estos años por un equipo de profesionales
          dedicados a cubrir las necesidades de nuestros clientes.
        </p>
      </div>
      <div className="publicidadContainer">
        <h3 className="tituloParrafo">Espacio publicitario</h3>
        <Publicidad clientes={publicidadJSON}/>
      </div>

      <Footer />
    </div>
    </>
  );
}
export default Welcome;
