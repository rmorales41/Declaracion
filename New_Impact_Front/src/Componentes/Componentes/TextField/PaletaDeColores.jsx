import React, { useEffect, useState } from 'react';

export default function PaletaDeColores({colorProp, onColorChange }){
  const colorAuth = colorProp;
  const [color, setColor] = useState(colorAuth);

  useEffect(()=>{
    setColor(colorProp)
  },[colorProp])

  const eventoCambio = (event) => {
    setColor(event.target.value);
    onColorChange(event.target.value);
  };
  
  return (
    <div>
      
      <input
        type="color"
        id="colorPicker"
        name="colorPicker"
        style={{ height: '2rem', width: '2rem' }}
        value={color} // Establece el valor del input para reflejar el color seleccionado
        onChange={eventoCambio} // Maneja los cambios de color
      />

    </div>
    
  );
}