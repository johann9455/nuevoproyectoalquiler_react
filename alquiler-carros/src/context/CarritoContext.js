import React, { createContext, useContext, useReducer, useEffect } from 'react';

const initialState = {
  productos: [],
  requerimientos: null
};

const carritoReducer = (state, action) => {
  switch (action.type) {
    case 'AGREGAR_PRODUCTO':
      return {
        ...state,
        productos: [...state.productos, action.payload]
      };
    case 'ELIMINAR_PRODUCTO':
      return {
        ...state,
        productos: state.productos.filter(p => p.id !== action.payload)
      };
    case 'GUARDAR_REQUERIMIENTOS':
      return {
        ...state,
        requerimientos: action.payload
      };
    case 'LIMPIAR_CARRITO':
      return initialState;
    default:
      return state;
  }
};