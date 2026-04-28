import { useEffect, useState } from 'react';
import apiClient from '../api/apiClient';

const MyOrders = () => {
  const [pedidos, setPedidos] = useState([]);
  const [loading, setLoading] = useState(true);
  const [detalleActivo, setDetalleActivo] = useState(null);
  const [productosDetalle, setProductosDetalle] = useState([]);

  const fetchPedidos = async () => {
    try {
      // Sincronizado con router.get('/mis-pedidos', ...)
      const res = await apiClient.get('/ventas/mis-pedidos');
      setPedidos(res.data);
    } catch (err) {
      console.error("Error al obtener pedidos:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchPedidos();
  }, []);

  const verDetalle = async (id_pedido) => {
    if (detalleActivo === id_pedido) {
      setDetalleActivo(null);
      return;
    }
    
    try {
      // Sincronizado con router.get('/detalle/:id_pedido', ...)
      const res = await apiClient.get(`/ventas/detalle/${id_pedido}`);
      setProductosDetalle(res.data);
      setDetalleActivo(id_pedido);
    } catch (err) {
      alert("No se pudo cargar el detalle del pedido");
    }
  };

  if (loading) return <div style={styles.loader}>Cargando historial culinario...</div>;

  return (
    <div style={styles.container}>
      <h2 style={styles.mainTitle}>Mi Historial de Compras</h2>

      {pedidos.length === 0 ? (
        <div style={styles.emptyState}>
          <p>Aún no has realizado ninguna compra profesional.</p>
        </div>
      ) : (
        <div style={{ marginTop: '20px' }}>
          {pedidos.map((pedido) => (
            <div key={pedido.id_pedido} style={styles.orderCard}>
              
              {/* CABECERA DEL PEDIDO */}
              <div style={{ ...styles.cardHeader, backgroundColor: detalleActivo === pedido.id_pedido ? '#fdf9f0' : 'white' }}>
    <div>
      <span style={styles.orderId}>ORDEN #00{pedido.id_pedido}</span>
      <p style={styles.totalText}>S/ {parseFloat(pedido.total).toFixed(2)}</p>
      <p style={styles.dateText}>
        {/* Ajustado a tu columna fecha_pedido de la DB */}
        Registrado el: {new Date(pedido.fecha_pedido).toLocaleString()}
      </p>
    </div>
    <div style={{ textAlign: 'right' }}>
      <span style={styles.statusBadge}>{pedido.estado}</span> {/* Ahora usa el ENUM de tu DB */}
      <br />
      <button onClick={() => verDetalle(pedido.id_pedido)} style={styles.detailBtn}>
        {detalleActivo === pedido.id_pedido ? 'Cerrar Detalle' : 'Ver Productos'}
      </button>
    </div>
  </div>

              {/* DETALLE DESPLEGABLE */}
              {detalleActivo === pedido.id_pedido && (
                <div style={styles.detailsSection}>
                  <table style={styles.table}>
                    <thead>
                      <tr style={styles.tableHead}>
                        <th style={{ textAlign: 'left' }}>Producto</th>
                        <th>Cant.</th>
                        <th>P. Unit.</th>
                        <th style={{ textAlign: 'right' }}>Subtotal</th>
                      </tr>
                    </thead>
                    <tbody>
                      {productosDetalle.map((prod, index) => (
                        <tr key={index} style={styles.tableRow}>
                          <td style={{ padding: '10px 0' }}>{prod.nombre_producto}</td>
                          <td style={{ textAlign: 'center' }}>{prod.cantidad}</td>
                          <td style={{ textAlign: 'center' }}>S/ {parseFloat(prod.precio_unitario).toFixed(2)}</td>
                          <td style={styles.subtotalCell}>
                            S/ {(prod.precio_unitario * prod.cantidad).toFixed(2)}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

const styles = {
  container: { maxWidth: '900px', margin: '40px auto', padding: '20px' },
  mainTitle: { borderBottom: '3px solid gold', paddingBottom: '10px', color: '#1a1a1a', fontWeight: '800' },
  loader: { textAlign: 'center', padding: '100px', color: '#B8860B', fontWeight: 'bold' },
  emptyState: { textAlign: 'center', marginTop: '50px', color: '#888', fontStyle: 'italic' },
  orderCard: { background: '#fff', marginBottom: '15px', borderRadius: '12px', boxShadow: '0 4px 12px rgba(0,0,0,0.08)', overflow: 'hidden', border: '1px solid #eee' },
  cardHeader: { padding: '20px', display: 'flex', justifyContent: 'space-between', alignItems: 'center', transition: '0.3s' },
  orderId: { fontSize: '0.75rem', color: '#B8860B', fontWeight: 'bold', letterSpacing: '1px' },
  totalText: { margin: '5px 0', fontSize: '1.3rem', fontWeight: '900', color: '#111' },
  dateText: { margin: 0, fontSize: '0.8rem', color: '#777' },
  statusBadge: { padding: '4px 12px', borderRadius: '20px', fontSize: '0.7rem', fontWeight: 'bold', background: '#d4edda', color: '#155724' },
  detailBtn: { marginTop: '10px', background: 'none', border: '1px solid #B8860B', color: '#B8860B', padding: '6px 15px', borderRadius: '6px', cursor: 'pointer', fontWeight: 'bold', fontSize: '0.8rem' },
  detailsSection: { padding: '20px', borderTop: '1px solid #eee', background: '#fdfdfd' },
  table: { width: '100%', borderCollapse: 'collapse' },
  tableHead: { fontSize: '0.75rem', color: '#999', borderBottom: '1px solid #eee' },
  tableRow: { borderBottom: '1px solid #f4f4f4', fontSize: '0.85rem' },
  subtotalCell: { textAlign: 'right', fontWeight: 'bold', color: '#111' },
};

export default MyOrders;