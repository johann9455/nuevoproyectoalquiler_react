import React, { useState, useEffect, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { useCarrito } from '../context/CarritoContext';
import { obtenerProductos, TIPOS_DISPONIBLES } from './fakeApi';
import styles from '../styles/Productos.module.css';

export default function Productos() {
  const navigate = useNavigate();
  const { state: carritoState, dispatch } = useCarrito();

  const [productos, setProductos] = useState([]);
  const [productoSeleccionado, setProductoSeleccionado] = useState(null);
  const [pagina, setPagina] = useState(1);
  const [cargando, setCargando] = useState(false);
  const [finDeLista, setFinDeLista] = useState(false);
  const [filtros, setFiltros] = useState({ tipo: '', precioMax: '' });

  // Cargar productos por página
  const cargarProductos = useCallback(async (reiniciar = false) => {
    if (cargando || finDeLista) return;
    setCargando(true);
    try {
      const nuevos = await obtenerProductos(reiniciar ? 1 : pagina);
      if (nuevos.length === 0) {
        setFinDeLista(true);
      } else {
        setProductos(prev => reiniciar ? nuevos : [...prev, ...nuevos]);
        if (reiniciar) setPagina(2);
      }
    } catch (error) {
      console.error("Error cargando productos:", error);
    } finally {
      setCargando(false);
    }
  }, [pagina, cargando, finDeLista]);

  // Inicial: cargar primera página
  useEffect(() => {
    cargarProductos(true);
  }, [cargarProductos]);

  // Scroll infinito
  const handleScroll = useCallback((e) => {
    const { scrollTop, scrollHeight, clientHeight } = e.target;
    if (scrollHeight - scrollTop <= clientHeight * 1.1 && !cargando && !finDeLista) {
      setPagina(prev => prev + 1);
    }
  }, [cargando, finDeLista]);

  // Cargar más al cambiar página (scroll)
  useEffect(() => {
    if (pagina > 1) cargarProductos();
  }, [pagina, cargarProductos]);

  // Filtrar productos
  const productosFiltrados = productos.filter(p => {
    const coincideTipo = !filtros.tipo || p.tipo === filtros.tipo;
    const coincidePrecio = !filtros.precioMax || p.precioDia <= Number(filtros.precioMax);
    return coincideTipo && coincidePrecio;
  });

  const agregarAlCarrito = (producto) => {
    dispatch({ type: 'AGREGAR_PRODUCTO', payload: producto });
  };

  return (
    <div className={styles.container}>
      <header className={styles.header}>
        <h1 className={styles.title}>Catálogo de Vehículos</h1>
        <div className={styles.actions}>
          <button className={styles.carritoButton} onClick={() => navigate('/carrito')}>
            Ver Carrito ({carritoState.productos.length})
          </button>
        </div>
      </header>

      <section className={styles.filters}>
        <div className={styles.filterGroup}>
          <label className={styles.filterLabel}>Tipo de vehículo:</label>
          <select
            className={styles.filterSelect}
            value={filtros.tipo}
            onChange={(e) => {
              setFiltros({ ...filtros, tipo: e.target.value });
            }}
          >
            <option value="">Todos</option>
            {TIPOS_DISPONIBLES.map(tipo => (
              <option key={tipo} value={tipo}>{tipo}</option>
            ))}
          </select>
        </div>

        <div className={styles.filterGroup}>
          <label className={styles.filterLabel}>Precio máximo:</label>
          <input
            type="number"
            className={styles.filterInput}
            value={filtros.precioMax}
            onChange={(e) => setFiltros({ ...filtros, precioMax: e.target.value })}
            placeholder="Máximo COP"
          />
        </div>
      </section>

      <main className={styles.mainContent}>
        <section className={styles.productList} onScroll={handleScroll}>
          {productosFiltrados.map(producto => (
            <article
              key={producto.id}
              className={`${styles.productCard} ${productoSeleccionado?.id === producto.id ? styles.selected : ''}`}
              onClick={() => setProductoSeleccionado(producto)}
            >
              <img src={producto.imagen} alt={producto.marca} className={styles.productImage} />
              <div className={styles.productInfo}>
                <h3 className={styles.productTitle}>{producto.marca} {producto.modelo}</h3>
                <p className={styles.productPrice}>${producto.precioDia.toLocaleString()} /día</p>
                <p className={styles.productType}>{producto.tipo}</p>
                <button
                  className={styles.addButton}
                  onClick={(e) => {
                    e.stopPropagation();
                    agregarAlCarrito(producto);
                  }}
                >
                  Añadir al carrito
                </button>
              </div>
            </article>
          ))}

          {cargando && <div className={styles.loading}><p>Cargando más vehículos...</p></div>}
          {finDeLista && !cargando && <div className={styles.endMessage}><p>¡Has visto todos nuestros vehículos!</p></div>}
        </section>

        <aside className={styles.detailPanel}>
          {productoSeleccionado ? (
            <>
              <h2 className={styles.detailTitle}>{productoSeleccionado.marca} {productoSeleccionado.modelo}</h2>
              <img src={productoSeleccionado.imagen} alt={productoSeleccionado.marca} className={styles.detailImage} />
              <div className={styles.detailSpecs}>
                <p><strong>Precio por día:</strong> ${productoSeleccionado.precioDia.toLocaleString()}</p>
                <p><strong>Tipo:</strong> {productoSeleccionado.tipo}</p>
                <p><strong>Año:</strong> {productoSeleccionado.año}</p>
                <p><strong>Transmisión:</strong> {productoSeleccionado.transmision}</p>
                <p><strong>Descripción:</strong> {productoSeleccionado.descripcion}</p>
              </div>
              <button className={styles.primaryButton} onClick={() => agregarAlCarrito(productoSeleccionado)}>
                Alquilar este vehículo
              </button>
            </>
          ) : (
            <div className={styles.emptySelection}>
              <p>Selecciona un vehículo para ver detalles</p>
            </div>
          )}
        </aside>
      </main>
    </div>
  );
}