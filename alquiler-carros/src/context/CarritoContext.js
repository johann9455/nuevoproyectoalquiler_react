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

const CarritoContext = createContext();
 
export const useCarrito = () => {
  const context = useContext(CarritoContext);
  if (!context) {
    throw new Error('useCarrito debe usarse dentro de CarritoProvider');
  }
  return context;
};
 
export const CarritoProvider = ({ children }) => {
  const [state, dispatch] = useReducer(carritoReducer, initialState);
 
  // Opcional: Persistencia en localStorage
  useEffect(() => {
    const savedState = localStorage.getItem('carritoState');
    if (savedState) {
      dispatch({
        type: 'CARGAR_ESTADO',
        payload: JSON.parse(savedState)
      });
    }
  }, []);
 
  useEffect(() => {
    localStorage.setItem('carritoState', JSON.stringify(state));
  }, [state]);
 
  return (
    <CarritoContext.Provider value={{ state, dispatch }}>
      {children}
    </CarritoContext.Provider>
  );
};