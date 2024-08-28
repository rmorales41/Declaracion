import React from "react";
import "./Footer.css";
import FooterDescripcion from "./FooterDescripcion";
import facebookImg from "../../../RecursosGraficos/ImagenesGlobales/facebook (1).png";
import whatsappImg from "../../../RecursosGraficos/ImagenesGlobales/whatsapp (1).png";
import webImg from "../../../RecursosGraficos/ImagenesGlobales/click.png";
import telefonoImg from "../../../RecursosGraficos/ImagenesGlobales/phone-call.png";
import { Link } from "react-router-dom";
const Footer = () => {
  return (
    <footer className="footer">
      <div className="footer row">
        <div className="footer col-4">
          <h5>Contactos</h5>
          <div className="footer container">
            <Link
              className="footer link"
              to={"https://www.facebook.com/SipavSA/?locale=es_LA"}
            >
              <img
                src={facebookImg}
                className="footer icono"
                alt="facebookLogo"
              ></img>
            </Link>
            <Link className="footer link" to={"tel:+50622574183"}>
              <img
                src={telefonoImg}
                className="footer icono"
                alt="telefonoIcono"
              ></img>
            </Link>
            <Link className="footer link" to={""}>
              <img
                src={whatsappImg}
                className="footer icono"
                alt="whatsappLogo"
              ></img>
            </Link>
            <Link className=" footer link" to={"https://sipavit.com/"}>
              <img src={webImg} className="footer icono" alt="webIcono"></img>
            </Link>
          </div>
        </div>
        <div className="footer col-4">
          <h5>Soporte</h5>
          <ul className="footer lista">
            <li>coordinador.ti@sipavint.com</li>
            <li>sipav.soporte04@sipavint.com</li>
            <li>sipav.soporte05@sipavint.com</li>
            <li>coordinador.cpa@sipavint.com</li>
          </ul>
        </div>
        <div className="footer col-4">
          <h5>Dirección</h5>
          <div className="footer container">
            <p>
              50 metros sur de la glesia de las ánimas, avenida 10, calle 22; placa
              1058. San José, Costa Rica.
            </p>
          </div>
        </div>
      </div>
      <div className="footer row">
        <hr className="footer linea" />
        <FooterDescripcion />
      </div>
    </footer>
  );
};

export default Footer;
