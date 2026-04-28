import { useEffect, useState } from 'react';
import apiClient from '../api/apiClient';
import { useNavigate, Link } from 'react-router-dom';

const Cart = () => {
  const [items, setItems] = useState([]);
  const [total, setTotal] = useState(0); // Este es el que estaba estancado en 0
  const navigate = useNavigate();
  const API_BASE = "http://localhost:5000";

  const loadCart = async () => {
    const token = localStorage.getItem('token');
    if (token) {
      try {
        const res = await apiClient.get('/carrito');
        const dbCart = res.data;
        setItems(dbCart);
        localStorage.setItem('cart', JSON.stringify(dbCart));
        console.log("Carrito recuperado de la base de datos.");
      } catch (err) {
        console.error("Error recuperando carrito de la DB:", err);
        const rawData = localStorage.getItem('cart');
        setItems(rawData ? JSON.parse(rawData) : []);
      }
    } else {
      const rawData = localStorage.getItem('cart');
      setItems(rawData ? JSON.parse(rawData) : []);
    }
  };

  // --- LÓGICA DE CÁLCULO DE TOTAL (LA QUE FALTABA) ---
  useEffect(() => {
    const calcularTotal = () => {
      const suma = items.reduce((acc, item) => {
        // Aseguramos que precio sea número y cantidad también
        const p = parseFloat(item.precio) || 0;
        const c = parseInt(item.cantidad) || 0;
        return acc + (p * c);
      }, 0);
      setTotal(suma);
    };

    calcularTotal();
  }, [items]); // Cada vez que 'items' cambie, el total se actualiza

  useEffect(() => {
    loadCart();
    // Escuchar cambios externos (como del Navbar)
    const handleUpdate = () => loadCart();
    window.addEventListener('cartUpdated', handleUpdate);
    return () => window.removeEventListener('cartUpdated', handleUpdate);
  }, []);

  const handleCheckout = async () => {
    if (!items || items.length === 0) {
      alert("No hay productos para procesar.");
      return;
    }

    try {
      await apiClient.post('/ventas/checkout', { items: items });
      alert("🚀 ¡Venta realizada con éxito! Revisa tu historial.");
      localStorage.removeItem('cart');
      window.dispatchEvent(new Event('cartUpdated'));
      navigate('/mis-pedidos');
    } catch (err) {
      const errorMsg = err.response?.data?.message || "Error al procesar la venta";
      alert("Error: " + errorMsg);
    }
  };

  const removeItem = async (id) => {
  const token = localStorage.getItem('token');
  
  try {
    if (token) {
      // 1. Avisamos a la base de datos que lo borre
      await apiClient.delete(`/carrito/${id}`);
    }

    // 2. Actualizamos el estado local para que la UI responda rápido
    const updatedCart = items.filter(item => item.id_producto !== id);
    setItems(updatedCart);
    localStorage.setItem('cart', JSON.stringify(updatedCart));

    // 3. Notificamos a otros componentes (como el Navbar)
    window.dispatchEvent(new Event('cartUpdated'));
    
    console.log("Producto eliminado con éxito de nuestro proyecto");
  } catch (err) {
    console.error("Error al eliminar el producto:", err);
    alert("No se pudo eliminar el producto de la base de datos.");
  }
};
  
  if (items.length === 0) {
    return (
      <div style={{ textAlign: 'center', padding: '100px', background: '#f9f9f9', minHeight: '80vh' }}>
        <h2 style={{ color: '#ccc', fontSize: '3rem' }}>🛒</h2>
        <h3 style={{ color: '#555' }}>Tu carrito está vacío</h3>
        <p style={{ color: '#888' }}>Parece que aún no has elegido tu equipamiento profesional.</p>
        <Link to="/catalogo" style={{ color: '#B8860B', fontWeight: 'bold', textDecoration: 'none', borderBottom: '2px solid gold' }}>
          IR AL CATÁLOGO
        </Link>
      </div>
    );
  }

  return (
    <div style={{ background: '#1a1a1a', minHeight: '100vh', padding: '50px 20px' }}>
      <div style={{ maxWidth: '900px', margin: '0 auto', background: 'white', borderRadius: '15px', padding: '40px' }}>
        <header style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '30px' }}>
          <h2 style={{ margin: 0 }}>Resumen de Pedido</h2>
          <span style={{ color: '#888' }}>{items.length} artículos</span>
        </header>

        <table style={{ width: '100%', borderCollapse: 'collapse' }}>
          <thead>
            <tr style={{ textAlign: 'left', borderBottom: '2px solid #eee', color: '#B8860B', fontSize: '0.8rem' }}>
              <th style={{ padding: '10px' }}>PRODUCTO</th>
              <th>CANTIDAD</th>
              <th>PRECIO</th>
              <th>SUBTOTAL</th>
              <th></th>
            </tr>
          </thead>
          <tbody>
            {items.map(item => (
              <tr key={item.id_producto} style={{ borderBottom: '1px solid #f0f0f0' }}>
                <td style={{ padding: '15px', display: 'flex', alignItems: 'center', gap: '15px' }}>
                  <img src={`${API_BASE}${item.imagen_url}`} alt={item.nombre_producto} style={{ width: '50px', height: '50px', borderRadius: '5px', objectFit: 'cover' }} />
                  <span style={{ fontWeight: 'bold' }}>{item.nombre_producto}</span>
                </td>
                <td>{item.cantidad}</td>
                <td>S/ {parseFloat(item.precio).toFixed(2)}</td>
                <td style={{ fontWeight: 'bold' }}>S/ {(parseFloat(item.precio) * item.cantidad).toFixed(2)}</td>
                <td>
                  <button onClick={() => removeItem(item.id_producto)} style={{ background: 'none', border: 'none', color: 'red', cursor: 'pointer' }}>✕</button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>

        <div style={{ marginTop: '40px', textAlign: 'right', borderTop: '2px solid #eee', paddingTop: '20px' }}>
          <p style={{ fontSize: '1.5rem', fontWeight: 'bold' }}>Total: <span style={{ color: '#B8860B' }}>S/ {total.toFixed(2)}</span></p>
          <button 
            onClick={handleCheckout}
            style={{ background: '#1a1a1a', color: 'gold', border: 'none', padding: '15px 40px', borderRadius: '8px', fontWeight: 'bold', cursor: 'pointer', marginTop: '20px' }}
          >
            FINALIZAR COMPRA
          </button>
        </div>
      </div>
    </div>
  );
};

export default Cart;