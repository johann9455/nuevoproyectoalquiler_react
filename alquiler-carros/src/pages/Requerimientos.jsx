import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useCarrito } from '../context/CarritoContext';
import styles from '../styles/Requerimientos.module.css';

export default function Requerimientos() {
  const navigate = useNavigate();
  const { state, dispatch } = useCarrito(); // Obtenemos state y dispatch del contexto

  // Estado del formulario que precarga datos existentes del contexto
  const [form, setForm] = useState({
    nombre: state.requerimientos?.nombre || '',
    presupuesto: state.requerimientos?.presupuesto?.toString() || '',
    direccion: state.requerimientos?.direccion || '',
    entrega: state.requerimientos?.entrega || ''
  });

  // Estado para manejar errores de validación
  const [errores, setErrores] = useState({});

  // Función de validación
  const validar = () => {
    const nuevosErrores = {};
    
    if (!form.nombre.trim()) {
      nuevosErrores.nombre = "Nombre requerido";
    } else if (form.nombre.length > 20) {
      nuevosErrores.nombre = "Máximo 20 caracteres";
    }

    if (!form.presupuesto) {
      nuevosErrores.presupuesto = "Presupuesto requerido";
    } else if (isNaN(Number(form.presupuesto))) {
      nuevosErrores.presupuesto = "Debe ser un número válido";
    }

    if (!form.direccion.trim()) {
      nuevosErrores.direccion = "Dirección requerida";
    }

    if (!form.entrega) {
      nuevosErrores.entrega = "Seleccione tipo de entrega";
    }

    setErrores(nuevosErrores);
    return Object.keys(nuevosErrores).length === 0;
  };

  // Manejar envío del formulario
  const handleSubmit = (e) => {
    e.preventDefault();
    
    if (validar()) {
      // Guardar en el contexto
      dispatch({
        type: 'GUARDAR_REQUERIMIENTOS',
        payload: {
          nombre: form.nombre,
          presupuesto: Number(form.presupuesto),
          direccion: form.direccion,
          entrega: form.entrega
        }
      });
      
      // Redirigir a la página de productos
      navigate('/productos');
    }
  };

  // Manejar cambios en los inputs
  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm({
      ...form,
      [name]: value
    });
  };

  return (
    <div className={styles.container}>
      <h1 className={styles.title}>Datos del Alquiler</h1>
      
      <form onSubmit={handleSubmit} className={styles.form}>
        {/* Campo Nombre */}
        <div className={styles.formGroup}>
          <label htmlFor="nombre" className={styles.label}>
            Nombre completo:
          </label>
          <input
            type="text"
            id="nombre"
            name="nombre"
            value={form.nombre}
            onChange={handleChange}
            className={`${styles.input} ${errores.nombre ? styles.inputError : ''}`}
            placeholder="Ej: Juan Pérez"
          />
          {errores.nombre && (
            <p className={styles.error}>{errores.nombre}</p>
          )}
        </div>

        {/* Campo Presupuesto */}
        <div className={styles.formGroup}>
          <label htmlFor="presupuesto" className={styles.label}>
            Presupuesto máximo (COP):
          </label>
          <input
            type="number"
            id="presupuesto"
            name="presupuesto"
            value={form.presupuesto}
            onChange={handleChange}
            className={`${styles.input} ${errores.presupuesto ? styles.inputError : ''}`}
            placeholder="Ej: 500000"
            min="0"
          />
          {errores.presupuesto && (
            <p className={styles.error}>{errores.presupuesto}</p>
          )}
        </div>

        {/* Campo Dirección */}
        <div className={styles.formGroup}>
          <label htmlFor="direccion" className={styles.label}>
            Dirección de entrega:
          </label>
          <input
            type="text"
            id="direccion"
            name="direccion"
            value={form.direccion}
            onChange={handleChange}
            className={`${styles.input} ${errores.direccion ? styles.inputError : ''}`}
            placeholder="Ej: Calle 123 #45-67"
          />
          {errores.direccion && (
            <p className={styles.error}>{errores.direccion}</p>
          )}
        </div>

        {/* Campo Tipo de Entrega */}
        <div className={styles.formGroup}>
          <label className={styles.label}>Tipo de entrega:</label>
          <div className={styles.radioGroup}>
            <label className={styles.radioLabel}>
              <input
                type="radio"
                name="entrega"
                value="domicilio"
                checked={form.entrega === 'domicilio'}
                onChange={handleChange}
                className={styles.radioInput}
              />
              <span className={styles.radioText}>Domicilio (+$10,000 COP)</span>
            </label>
            
            <label className={styles.radioLabel}>
              <input
                type="radio"
                name="entrega"
                value="recoge"
                checked={form.entrega === 'recoge'}
                onChange={handleChange}
                className={styles.radioInput}
              />
              <span className={styles.radioText}>Recoger en tienda</span>
            </label>
          </div>
          {errores.entrega && (
            <p className={styles.error}>{errores.entrega}</p>
          )}
        </div>

        {/* Botón de envío */}
        <button 
          type="submit" 
          className={styles.submitButton}
          aria-label="Continuar al catálogo"
        >
          Continuar al Catálogo
        </button>
      </form>
    </div>
  );
}