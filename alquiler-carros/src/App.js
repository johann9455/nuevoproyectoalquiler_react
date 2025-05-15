import React from 'react';
import { Routes, Route } from 'react-router-dom'; // Importa solo Routes y Route
import Requerimientos from './pages/Requerimientos';
import Productos from './pages/Productos';
import Carrito from './pages/Carrito';
import Confirmacion from './pages/Confirmacion';

function App() {
  return (
    <Routes> {/* Envuelve todo en Routes */}
      <Route path="/" element={<Requerimientos />} />
      <Route path="/productos" element={<Productos />} />
      <Route path="/carrito" element={<Carrito />} />
      <Route path="/confirmacion" element={<Confirmacion />} />
    </Routes>
  );
}

export default App;