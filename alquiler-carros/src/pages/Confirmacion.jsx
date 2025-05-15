import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useCarrito } from '../context/CarritoContext';

export default function Confirmacion() {
  const navigate = useNavigate();
  const { state, dispatch } = useCarrito();

  const { requerimientos } = state;

  const volverAlInicio = () => {
    dispatch({ type: 'LIMPIAR_CARRITO' }); // limpia todo
    navigate('/');
  };