import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useCarrito } from '../context/CarritoContext';
import styles from '../styles/Carrito.module.css';

export default function Carrito() {
  const navigate = useNavigate();
  const { state, dispatch } = useCarrito();
  const [tarjeta, setTarjeta] = useState({
    numero: '',
    expiracion: '',
    cvv: '',
    titular: ''
  });
  const [error, setError] = useState('');

  // Calcular totales
  const subtotal = state.productos.reduce((sum, p) => sum + p.precioDia, 0);
  const domicilio = state.requerimientos?.entrega === 'domicilio' ? 10000 : 0;
  const total = subtotal + domicilio;

  const handlePago = () => {
    // Validación de campos
    if (!/^\d{16}$/.test(tarjeta.numero)) {
      setError('Número de tarjeta inválido (16 dígitos requeridos)');
      return;
    }
    if (!/^\d{2}\/\d{2}$/.test(tarjeta.expiracion)) {
      setError('Formato de fecha MM/AA');
      return;
    }
    if (!/^\d{3}$/.test(tarjeta.cvv)) {
      setError('CVV inválido (3 dígitos requeridos)');
      return;
    }
    if (!tarjeta.titular.trim()) {
      setError('Nombre del titular requerido');
      return;
    }

    // Validación de presupuesto
    if (state.requerimientos?.presupuesto && total > state.requerimientos.presupuesto) {
      setError(`Presupuesto excedido en $${(total - state.requerimientos.presupuesto).toLocaleString()}`);
      return;
    }

    // Pago exitoso
    setError('');
    alert(`¡Pago exitoso por $${total.toLocaleString()}!`);
    dispatch({ type: 'LIMPIAR_CARRITO' });
    navigate('/confirmacion');
  };

  return (
    <div className={styles.container}>
      <div className={styles.header}>
        <h1 className={styles.title}>Resumen de Alquiler</h1>
        <button 
          className={styles.secondaryButton}
          onClick={() => navigate('/productos')}
        >
          ← Seguir alquilando
        </button>
      </div>

      <div className={styles.resumenSection}>
        <h2 className={styles.sectionTitle}>Vehículos seleccionados</h2>
        <div className={styles.tableContainer}>
          <table className={styles.productTable}>
            <thead>
              <tr>
                <th>Vehículo</th>
                <th>Precio/día</th>
                <th>Acción</th>
              </tr>
            </thead>
            <tbody>
              {state.productos.map((p) => (
                <tr key={p.id}>
                  <td>{p.marca} {p.modelo}</td>
                  <td>${p.precioDia.toLocaleString()}</td>
                  <td>
                    <button
                      className={styles.removeButton}
                      onClick={() => dispatch({ type: 'ELIMINAR_PRODUCTO', payload: p.id })}
                    >
                      Eliminar
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        <div className={styles.totales}>
          <div className={styles.totalRow}>
            <span>Subtotal:</span>
            <span>${subtotal.toLocaleString()}</span>
          </div>
          <div className={styles.totalRow}>
            <span>Costo de envío:</span>
            <span>${domicilio.toLocaleString()}</span>
          </div>
          <div className={styles.totalRow}>
            <strong>Total:</strong>
            <strong>${total.toLocaleString()}</strong>
          </div>
        </div>
      </div>
      <div className={styles.paymentSection}>
        <h2 className={styles.sectionTitle}>Datos de pago</h2>
       
        {error && <div className={styles.errorMessage}>{error}</div>}
 
        <div className={styles.formGroup}>
          <label className={styles.label}>Número de tarjeta</label>
          <input
            type="text"
            value={tarjeta.numero}
            onChange={(e) => setTarjeta({...tarjeta, numero: e.target.value.replace(/\D/g, '').slice(0, 16)})}
            className={styles.input}
            placeholder="1234 5678 9012 3456"
          />
        </div>
 
        <div className={styles.formRow}>
          <div className={styles.formGroup}>
            <label className={styles.label}>Fecha expiración (MM/AA)</label>
            <input
              type="text"
              value={tarjeta.expiracion}
              onChange={(e) => {
                const value = e.target.value.replace(/\D/g, '');
                if (value.length <= 4) {
                  setTarjeta({
                    ...tarjeta,
                    expiracion: value.length > 2 ? `${value.slice(0, 2)}/${value.slice(2)}` : value
                  });
                }
              }}
              className={styles.input}
              placeholder="MM/AA"
              maxLength={5}
            />
          </div>
 
          <div className={styles.formGroup}>
            <label className={styles.label}>CVV</label>
            <input
              type="password"
              value={tarjeta.cvv}
              onChange={(e) => setTarjeta({...tarjeta, cvv: e.target.value.replace(/\D/g, '').slice(0, 3)})}
              className={styles.input}
              placeholder="123"
              maxLength={3}
            />
          </div>
        </div>
 
        <div className={styles.formGroup}>
          <label className={styles.label}>Nombre del titular</label>
          <input
            type="text"
            value={tarjeta.titular}
            onChange={(e) => setTarjeta({...tarjeta, titular: e.target.value})}
            className={styles.input}
            placeholder="Como aparece en la tarjeta"
          />
        </div>
 
        <button
          className={styles.primaryButton}
          onClick={handlePago}
          disabled={state.productos.length === 0}
        >
          Confirmar Pago
        </button>
      </div>
    </div>
  );
}