import React, { useState, useEffect } from 'react';
import apiClient from '../api/apiClient';
import ProductModal from '../components/ProductModal';
import { useNavigate } from 'react-router-dom';

const Catalogo = () => {
  const [productos, setProductos] = useState([]);
  const [selectedProduct, setSelectedProduct] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    apiClient.get('/productos')
      .then(res => setProductos(res.data))
      .catch(err => console.error("Error al cargar productos", err));
  }, []);

  return (
    <div style={{ padding: '40px 10%' }}>
      <h2 style={{ borderBottom: '2px solid gold', paddingBottom: '10px' }}>Catálogo Exclusivo</h2>
      
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(250px, 1fr))', gap: '30px', marginTop: '30px' }}>
        {productos.map(p => (
          <div key={p.id_producto} 
     onClick={() => navigate(`/producto/${p.id_producto}`)} 
     style={styles.productCard}>
            <img src={`http://localhost:5000${p.imagen_url}`} alt={p.nombre_producto} style={styles.img} />
            <div style={{ padding: '15px' }}>
              <h3 style={{ fontSize: '1rem', margin: '5px 0' }}>{p.nombre_producto}</h3>
              <p style={{ fontWeight: 'bold', color: '#B8860B' }}>S/ {p.precio}</p>
            </div>
          </div>
        ))}
      </div>

      <ProductModal 
        producto={selectedProduct} 
        isOpen={!!selectedProduct} 
        onClose={() => setSelectedProduct(null)} 
      />
    </div>
  );
};

const styles = {
  productCard: { background: 'white', borderRadius: '10px', overflow: 'hidden', boxShadow: '0 4px 15px rgba(0,0,0,0.1)', cursor: 'pointer', transition: 'transform 0.2s' },
  img: { width: '100%', height: '200px', objectFit: 'cover' }
};

export default Catalogo;