import React, { useState, useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';

const ProductModal = ({ producto, isOpen, onClose }) => {
  const { user } = useContext(AuthContext);
  const navigate = useNavigate();
  const [quantity, setQuantity] = useState(1);
  const API_BASE = "http://localhost:5000";

  if (!isOpen || !producto) return null;

  const handleAddToCart = () => {
    if (!user) {
      if (window.confirm("Para comprar, necesitas iniciar sesión. ¿Ir al login?")) {
        navigate('/login');
      }
      return;
    }

    const cart = JSON.parse(localStorage.getItem('cart')) || [];
    const index = cart.findIndex(item => item.id_producto === producto.id_producto);

    if (index > -1) {
      cart[index].cantidad += quantity;
    } else {
      cart.push({ ...producto, cantidad: quantity });
    }

    localStorage.setItem('cart', JSON.stringify(cart));
    window.dispatchEvent(new Event('cartUpdated')); // Para actualizar el contador del navbar
    alert(`✅ Añadido: ${quantity} unidad(es) de ${producto.nombre_producto}`);
    onClose();
  };

  return (
    <div style={styles.overlay}>
      <div style={styles.modal}>
        <button onClick={onClose} style={styles.closeBtn}>×</button>
        
        <div style={styles.grid}>
          {/* Imagen */}
          <div style={styles.imgCol}>
            <img 
              src={producto.imagen_url ? `${API_BASE}${producto.imagen_url}` : '/default.png'} 
              alt={producto.nombre_producto} 
              style={styles.img}
            />
          </div>

          {/* Info */}
          <div style={styles.infoCol}>
            <span style={styles.category}>{producto.nombre_categoria || 'Utensilio Premium'}</span>
            <h2 style={styles.title}>{producto.nombre_producto}</h2>
            <p style={styles.price}>S/ {parseFloat(producto.precio).toFixed(2)}</p>
            
            <div style={styles.divider}></div>
            
            <p style={styles.desc}>{producto.descripcion}</p>
            
            <div style={styles.stockInfo}>
              {producto.stock > 0 ? (
                <span style={{color: 'green'}}>● Stock disponible: {producto.stock} unidades</span>
              ) : (
                <span style={{color: 'red'}}>● Agotado</span>
              )}
            </div>

            {producto.stock > 0 && (
              <div style={styles.actions}>
                <div style={styles.qtyBox}>
                  <button onClick={() => setQuantity(q => Math.max(1, q - 1))} style={styles.qtyBtn}>-</button>
                  <span style={styles.qtyVal}>{quantity}</span>
                  <button onClick={() => setQuantity(q => Math.min(producto.stock, q + 1))} style={styles.qtyBtn}>+</button>
                </div>
                <button onClick={handleAddToCart} style={styles.addBtn}>
                  AÑADIR AL CARRITO
                </button>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

// Estilos rápidos tipo Falabella/Premium
const styles = {
  overlay: { position: 'fixed', top: 0, left: 0, width: '100%', height: '100%', background: 'rgba(0,0,0,0.7)', display: 'flex', justifyContent: 'center', alignItems: 'center', zIndex: 1000 },
  modal: { background: 'white', width: '90%', maxWidth: '800px', borderRadius: '12px', padding: '30px', position: 'relative', animation: 'fadeIn 0.3s' },
  closeBtn: { position: 'absolute', top: '15px', right: '15px', border: 'none', background: 'none', fontSize: '30px', cursor: 'pointer' },
  grid: { display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '30px' },
  img: { width: '100%', borderRadius: '8px', objectFit: 'cover' },
  category: { color: '#B8860B', fontSize: '0.8rem', fontWeight: 'bold', textTransform: 'uppercase' },
  title: { margin: '10px 0', fontSize: '1.8rem', color: '#1a1a1a' },
  price: { fontSize: '1.5rem', fontWeight: 'bold', color: '#333' },
  divider: { height: '1px', background: '#eee', margin: '20px 0' },
  desc: { fontSize: '0.9rem', color: '#666', lineHeight: '1.5' },
  stockInfo: { margin: '20px 0', fontSize: '0.85rem' },
  actions: { display: 'flex', gap: '15px', alignItems: 'center' },
  qtyBox: { display: 'flex', alignItems: 'center', border: '1px solid #ddd', borderRadius: '5px' },
  qtyBtn: { padding: '10px 15px', border: 'none', background: 'none', cursor: 'pointer' },
  qtyVal: { padding: '0 15px', fontWeight: 'bold' },
  addBtn: { flex: 1, background: '#1a1a1a', color: 'gold', border: 'none', padding: '12px', borderRadius: '5px', fontWeight: 'bold', cursor: 'pointer' }
};

export default ProductModal;