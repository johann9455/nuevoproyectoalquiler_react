import React from 'react';
import ReactDOM from 'react-dom/client';
import { BrowserRouter } from 'react-router-dom'; // Importa BrowserRouter
import { CarritoProvider } from './context/CarritoContext';
import App from './App';


const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  <React.StrictMode>
    <BrowserRouter> {/* Envuelve toda la app aquí */}
      <CarritoProvider>
        <App /> {/* Esto ya incluye las rutas */}
      </CarritoProvider>
    </BrowserRouter>
  </React.StrictMode>
);

