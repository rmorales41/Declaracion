import AuthServices from "../Servicios/AuthServices";
import {urlImagen} from "../Variables/variables"

  const aplicarEstilos = () => {
    //Esto solo cuando cambia de compañia
    const companiasAuht = AuthServices.getCompanias(); //Trae las compañias del localStorage cuando se habia logueado
    //Asiga el tipo de letra, tamaño, negritra, y color de fondo dependiendo de la compañia que esta activa

    if (companiasAuht) { 
      AuthServices.eliminaConfiguraciones();
      const CompaniaActiva = companiasAuht.find(compania => compania.activo === true);// Busca la compañía que estaba activa 
      const tipo_letraAuth = CompaniaActiva.tipo_letra;
      const tamano_letraAuth = CompaniaActiva.tamano_letra;
      const negritaAuth = CompaniaActiva.estilo;
      const fondoAuth = CompaniaActiva.fondo_desktop;
      const colorLetraAuth = CompaniaActiva.color_letra;
      const colorDrawerAuth = CompaniaActiva.color_nav_lateral;
      const colorNavBarAuth = CompaniaActiva.color_nav_header;
      const idAsigna = CompaniaActiva.IDUsuarios_Asigna_Compania;

      const imagenDeFondoAuth = CompaniaActiva.imagen_desktop;

      const nuevaUrl = imagenDeFondoAuth ? imagenDeFondoAuth.replace("/media/", "/static/") : null;
      const imagenDesktopAuth = imagenDeFondoAuth ? `${urlImagen}${nuevaUrl}`: null;

      AuthServices.setTipoLetra(tipo_letraAuth);
      AuthServices.setTamanoLetra(tamano_letraAuth);
      AuthServices.setColorDrawer(colorDrawerAuth);
      AuthServices.setColorNavBar(colorNavBarAuth);
      AuthServices.setColorLetra(colorLetraAuth);
      AuthServices.setNegrita(negritaAuth);
      AuthServices.setFondoDesktop(fondoAuth);
      AuthServices.setIdAsigna(idAsigna);
      AuthServices.setImagenDesktop(imagenDeFondoAuth);
    
      //Aca se le manda a culquier clase de css lo que devulva cuando se loguea
      //Cambia los stylos al css por la classe
      document.documentElement.style.setProperty('--color-text-dropdown', 'black');//color del menu usuario en el avatar
      document.documentElement.style.setProperty('--fontSize-drawer', tamano_letraAuth +"px");// Le pasa la variable tamano_letra al css con la classe logo-collapse en la propiedad font-size
      document.documentElement.style.setProperty('--fontSize-drawer-submenus', (parseInt(tamano_letraAuth) - 4.8).toString()+"px");
      document.documentElement.style.setProperty('--fontSize-drawer-subsubmenus', (parseInt(tamano_letraAuth) - 4.8).toString()+"px");
      document.documentElement.style.setProperty('--backgroundColor-drawer', colorDrawerAuth); 
      document.documentElement.style.setProperty('--color-drawer', colorLetraAuth); 
      document.documentElement.style.setProperty('--fontFamily-drawer', tipo_letraAuth); 
      document.documentElement.style.setProperty('--fontSize-drawer', tamano_letraAuth+"px"); 
      document.documentElement.style.setProperty('--fontWeight-drawer', negritaAuth); 
      document.documentElement.style.setProperty('--backgroundColor-AppBar', colorNavBarAuth); 
      document.documentElement.style.setProperty('--color-AppBar', colorLetraAuth); 
      document.documentElement.style.setProperty('--fontFamily-AppBar', tipo_letraAuth); 
      document.documentElement.style.setProperty('--fontSize-AppBar', tamano_letraAuth+"px"); 
      document.documentElement.style.setProperty('--background-color-App', fondoAuth);

      document.documentElement.style.setProperty('--background-image-app', `url(${imagenDesktopAuth})`);
      document.body.style.backgroundColor = fondoAuth;
    }
   
  };

  const aplicaCambios = (tipo_letra, tamano_letra, color_Drawer, color_navBar, color_letra, negrita, colorDefondo, imagenDeFondo) =>{

    AuthServices.eliminaConfiguraciones();
    const companiasAuht = AuthServices.getCompanias(); //Trae las compañias del localStorage cuando se habia logueado
    const companiarActiva = companiasAuht.find(compania => compania.activo === true);// Busca la compañía que estaba activa anteriormente   
        if(companiarActiva){
          companiarActiva.tipo_letra = tipo_letra;
          companiarActiva.tamano_letra = tamano_letra;
          companiarActiva.color_nav_lateral = color_Drawer;
          companiarActiva.color_nav_header = color_navBar;
          companiarActiva.color_letra = color_letra;
          companiarActiva.estilo = negrita;
          companiarActiva.fondo_desktop = colorDefondo;
          companiarActiva.imagen_desktop = imagenDeFondo;
        }
        AuthServices.setTipoLetra(tipo_letra);
        AuthServices.setTamanoLetra(tamano_letra);
        AuthServices.setColorDrawer(color_Drawer);
        AuthServices.setColorNavBar(color_navBar);
        AuthServices.setColorLetra(color_letra);
        AuthServices.setNegrita(negrita);
        AuthServices.setFondoDesktop(colorDefondo);
        AuthServices.setImagenDesktop(imagenDeFondo);
        document.documentElement.style.setProperty('--background-color-App', colorDefondo );
        document.body.style.backgroundColor = colorDefondo;

        localStorage.removeItem('companias');//Elimina las compañias del localStorage anterior
        AuthServices.setCompanias(companiasAuht);//Guarda las compañias con la nueva compañia modificada

  }


  const cambiosDeCss = (tamano_letra, tipo_letra, colorLetra, colorDrawe,  negrita, colorNav, colorDeFondo, imagenDeFondo) =>{
      const nuevaUrl = imagenDeFondo.replace("/media/", "/static/");
      imagenDeFondo = `${urlImagen}${nuevaUrl}`;
  
      document.documentElement.style.setProperty('--color-text-dropdown', 'black');//color del menu usuario en el avatar
      document.documentElement.style.setProperty('--fontSize-drawer', tamano_letra +"px");// Le pasa la variable tamano_letra al css con la classe logo-collapse en la propiedad font-size
      document.documentElement.style.setProperty('--fontSize-drawer-submenus', (parseInt(tamano_letra) - 4.8).toString()+"px");
      document.documentElement.style.setProperty('--fontSize-drawer-subsubmenus', (parseInt(tamano_letra) - 4.8).toString()+"px");
      document.documentElement.style.setProperty('--backgroundColor-drawer', colorDrawe); 
      document.documentElement.style.setProperty('--color-drawer', colorLetra); 
      document.documentElement.style.setProperty('--fontFamily-drawer', tipo_letra); 
      document.documentElement.style.setProperty('--fontSize-drawer', tamano_letra+"px"); 
      document.documentElement.style.setProperty('--fontWeight-drawer', negrita); 
      document.documentElement.style.setProperty('--backgroundColor-AppBar', colorNav); 
      document.documentElement.style.setProperty('--color-AppBar', colorLetra); 
      document.documentElement.style.setProperty('--fontFamily-AppBar', tipo_letra); 
      document.documentElement.style.setProperty('--fontSize-AppBar', tamano_letra+"px"); 
      document.documentElement.style.setProperty('--background-image-app', `url(${imagenDeFondo})`);
      
      document.documentElement.style.setProperty('--background-color-App', colorDeFondo );
      document.body.style.backgroundColor = colorDeFondo;

  }
  

const ConfiguracionDeEstilos = {
  aplicarEstilos,
  aplicaCambios,
  cambiosDeCss
}

export default ConfiguracionDeEstilos;