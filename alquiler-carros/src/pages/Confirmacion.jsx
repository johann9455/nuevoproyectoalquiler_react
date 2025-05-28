import React from 'react';
import { useNavigate } from 'react-router-dom';
import {useCarrito} from '../context/CarritoContext'

export default function Confirmacion() {
  const navigate = useNavigate();
  const { state, dispatch } = useCarrito();

  const { requerimientos } = state;

  const volverAlInicio = () => {
    dispatch({ type: 'LIMPIAR_CARRITO' }); // limpia todo
    navigate('/');
  };
  
  return (
    <div style={{ padding: '20px' }}>
      <h2>¡Compra realizada con éxito!</h2>
      <p>Gracias, <strong>{requerimientos?.nombre}</strong>, por tu compra.</p>
      <p>La entrega será en: <strong>{requerimientos?.direccion}</strong>.</p>
      <p>Tipo de entrega: <strong>{requerimientos?.entrega}</strong>.</p>
      <p>¡Esperamos que disfrutes tu(s) producto(s)!</p>

      <button onClick={volverAlInicio} style={{ marginTop: '20px' }}>
        Volver al inicio
      </button>
    </div>
  );
}