import * as React from 'react';
import { Link } from 'react-router-dom'; // Import Link from react-router-dom
import { styled } from '@mui/material/styles';
import MuiAccordion from '@mui/material/Accordion';
import MuiAccordionSummary from '@mui/material/AccordionSummary';
import MuiAccordionDetails from '@mui/material/AccordionDetails';
import Avatar from '../NavBarmenu/Avatar';
import useTooltipCustom from '../Componentes/Tooltip/Tooltip';
import {faBars, faAngleDown } from '@fortawesome/free-solid-svg-icons'; 
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { LiaUserCheckSolid } from "react-icons/lia";
import { BsBuildingCheck } from "react-icons/bs";
import { RiLogoutBoxLine } from "react-icons/ri";
import { FaBuildingCircleArrowRight } from "react-icons/fa6";
import './NavBarmenu.css';
import BotonMenu from "../Componentes/Boton/BotonMenu"

export default function CustomizedAccordions(
  {
    handleDrawerOpen, cerrarSesion, tipoLetra, tamanoLetra, colorNavBar, colorLetra, compania, 
    usuario, companias, tamano_letra, seleccionarCompania, tipoDeCambioCompra, tipoDeCambioVenta,
    menuFavoritos, navBarFavoritos
  }) {

  const [expanded, setExpanded] = React.useState(false);//'panel1'
  const TooltipCustom = useTooltipCustom();//Para renderizar el componente useTooltipCustom
  const getTooltipTitle = () => (expanded === 'panel1' ? 'Clic para cerrar el menú' : 'Clic para abrir el menú'); // Para el tooltips de si esta cerrado o abierto el menu

  const handleChange = (panel) => (event, newExpanded) => {
    setExpanded(newExpanded ? panel : false);
  };

  const Accordion = styled((props) => (
    <MuiAccordion disableGutters elevation={0} square {...props} />
  ))(({ theme }) => ({
    border: `none`,
    backgroundColor: 'var(--backgroundColor-AppBar)', 
    color: 'var(--color-AppBar)',   
    fontFamily: 'var(--fontFamily-AppBar)',
    fontSize: 'var(--fontSize-AppBar)',
    fontWeight: "bold",
    '&:not(:last-child)': {
      borderBottom: 0,
    },
  
    '&::before': {
      display: 'none',
      backgroundColor: 'var(--backgroundColor-AppBar)', 
      color: 'var(--color-AppBar)',   
      fontFamily: 'var(--fontFamily-AppBar)',
      fontSize: 'var(--fontSize-AppBar)',
      fontWeight: "bold",
    },
  }));
  
  const AccordionSummary = styled((props) => (
    <MuiAccordionSummary
      {...props}
    />
  ))(({ theme }) => ({
    backgroundColor: colorNavBar,
    color: colorLetra,  
    fontFamily: tipoLetra, 
    fontSize: tamanoLetra+"px",
    fontWeight: "bold",
    width:"20%",
    flexDirection: 'row-reverse',
    '& .MuiAccordionSummary-expandIconWrapper.Mui-expanded': {
      transform: 'rotate(90deg)',
    },
    '& .MuiAccordionSummary-content': {
      marginLeft: theme.spacing(1),
      backgroundColor: 'var(--backgroundColor-AppBar)', 
      color: 'var(--color-AppBar)',   
      fontFamily: 'var(--fontFamily-AppBar)',
      fontSize: 'var(--fontSize-AppBar)',
      fontWeight: "bold",
    },
  }));
  
  const AccordionDetails = styled(MuiAccordionDetails)(({ theme }) => ({
    padding: theme.spacing(2),
    borderTop: 'none',
    width:"20%",
    backgroundColor: 'var(--backgroundColor-AppBar)', 
    color: 'var(--color-AppBar)',   
    fontFamily: 'var(--fontFamily-AppBar)',
    fontSize: 'var(--fontSize-AppBar)',
    fontWeight: "bold",
  }));

  return (
    <div style={{ display: 'flex', alignItems: 'center' }}>

      <BotonMenu
              menuFavoritos={menuFavoritos}
      />

      <Accordion expanded={expanded === 'panel1'} onChange={handleChange('panel1')}>
        <AccordionSummary aria-controls="panel1d-content" id="panel1d-header">
          <TooltipCustom title={getTooltipTitle()}>
              <FontAwesomeIcon icon={faBars} className='abrirNavBar' style={{fontSize:"calc(var(--fontSize-drawer) + 6px)"}} />
          </TooltipCustom>
        </AccordionSummary>
    
        <AccordionDetails>
            <div className='container'>

               {/*boton para abrir el Drawer o menu lateral*/}
                <button className='nav-link' onClick={handleDrawerOpen} >
                  <TooltipCustom title="Clic para abrir el menú desplegable."> 
                    <FontAwesomeIcon icon={faBars} className='abrirMenuDrawer' style={{fontSize:"calc(var(--fontSize-drawer) + 5px)"}}/>
                  </TooltipCustom>
                </button>
                
                {/*--- Links del navBar o menu superior ---*/}
                {navBarFavoritos && navBarFavoritos.map((favoritos) => (
                  <>
                    <TooltipCustom placement="left" title={"Clic para ir a " + favoritos.nombre}>
                      <Link className="nav-link" to={""}  >{favoritos.nombre}</Link>
                    </TooltipCustom>
                  </>
                ))}
                      {/*Tipo De Cambio Compra y venta*/}
                      <div >
                        <label className="label-tipoCambio-NavBarmenu">
                            Compra : {tipoDeCambioCompra}
                        </label>

                        <label className="label-tipoCambio-NavBarmenu">
                              Venta : {tipoDeCambioVenta}
                        </label>
                      </div> 

                      {/*compañia conectada*/}
                        <button className="btn dropdown-item "
                               type="button" data-bs-toggle="dropdown">
                            <BsBuildingCheck /> {compania} <FontAwesomeIcon icon={faAngleDown} />
                        </button>

                      {/*Menu de compañias que se puede conectar*/}
                      <ul className="dropdown-menu">
                        {companias && companias.map((companiasC) => (
                          <>                       
                          <button className="dropdown-item"
                                  style={{fontSize:`${tamano_letra}px`}}  
                                  onClick={() => {
                                    seleccionarCompania(companiasC)
                                  }}   
                          >  
                            <FaBuildingCircleArrowRight /> {companiasC.nombre}
                          </button>
                          </>
                        ))}
                        </ul>
                  
                {/*Avatar de las iniciales del nombre*/}
                <TooltipCustom placement="right" title="Clic para ver el Usuario y Cerrar Sección">
                    <button className="btn btn-avatar" type="button" data-bs-toggle="dropdown" style={{marginLeft:"-10px"}}>
                      <Avatar nombre={usuario + " ."}/>
                    </button>
                </TooltipCustom> 

                {/*Menu de usuario , y cerrar seccion*/}
                <ul className="dropdown-menu">
                    <TooltipCustom placement="left" title={"Logueado con " + usuario}>
                        <div  className="dropdown-item text-dropdown " > <LiaUserCheckSolid /> {usuario}</div> 
                    </TooltipCustom> 

                    <TooltipCustom placement="left" title={"Estas conectado a " + compania}>
                        <div  className="dropdown-item text-dropdown"> <BsBuildingCheck /> {compania}</div>
                    </TooltipCustom> 

                    <TooltipCustom placement="left" title="Clic para Cerrar Sección">
                        <Link className="dropdown-item " onClick={cerrarSesion} to={"/"} >  
                              <div  title={"Estas conectado a " + compania} className="dropdown-item"> <RiLogoutBoxLine /> Cerrar Sección</div>
                          </Link>
                    </TooltipCustom> 
                </ul>
                
            </div>
        </AccordionDetails>
     
      </Accordion>

 

      
   
     
    </div>
  );
}
