import React, { useState, useEffect } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import apiClient from '../api/apiClient';
import '../styles/ProductDetail.css';

const ProductDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [product, setProduct] = useState(null);
  const [similarProducts, setSimilarProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [quantity, setQuantity] = useState(1);
  const API_BASE = "http://localhost:5000";

  useEffect(() => {
    const fetchProductData = async () => {
      try {
        setLoading(true);
        // Traer producto por ID
        const { data } = await apiClient.get(`/productos/${id}`);
        setProduct(data);

        // Traer similares (misma categoría)
        const allRes = await apiClient.get('/productos');
        const filtered = allRes.data
          .filter(p => p.id_categoria === data.id_categoria && p.id_producto !== parseInt(id))
          .slice(0, 4);
        setSimilarProducts(filtered);
      } catch (err) {
        console.error("Error al cargar datos:", err);
      } finally {
        setLoading(false);
      }
    };
    fetchProductData();
    window.scrollTo(0, 0);
  }, [id]);

const addToCart = async () => { // Convertir a async
  const userData = JSON.parse(localStorage.getItem('user'));
  if (!userData) {
    alert("Debes iniciar sesión para añadir productos.");
    navigate('/login');
    return;
  }

  if (!product || product.stock <= 0) {
    alert("Producto sin stock disponible.");
    return;
  }

  try {
    // --- NUEVA LÓGICA: Sincronización con Base de Datos ---
    // Llamamos al endpoint que definimos en nuestro cartController
    await apiClient.post('/carrito/add', { 
  id_producto: product.id_producto, 
  cantidad: quantity 
});

    // --- MANTENER LÓGICA LOCAL (Para velocidad de la UI) ---
    const cart = JSON.parse(localStorage.getItem('cart')) || [];
    const index = cart.findIndex(item => item.id_producto === product.id_producto);

    if (index > -1) {
      cart[index].cantidad += quantity;
    } else {
      cart.push({ 
        id_producto: product.id_producto, 
        nombre_producto: product.nombre_producto, 
        precio: product.precio, 
        imagen_url: product.imagen_url,
        cantidad: quantity 
      });
    }

    localStorage.setItem('cart', JSON.stringify(cart));
    
    // Notificamos al resto de la app
    window.dispatchEvent(new Event('cartUpdated'));
    alert("✅ Producto añadido a tu cuenta y carrito.");

  } catch (err) {
    console.error("Error al guardar en la base de datos:", err);
    alert("Hubo un problema al sincronizar tu carrito con el servidor.");
  }
};
  if (loading) return <div className="pdp-loader">Cargando experiencia culinaria...</div>;
  if (!product) return <div className="pdp-error">Producto no disponible.</div>;

  return (
    <div className="pdp-master-bg">
      <div className="pdp-wrapper">
        {/* BREADCRUMBS */}
        <nav className="pdp-breadcrumbs">
          <Link to="/">Inicio</Link> <span className="sep">/</span>
          <Link to="/catalogo">Catálogo</Link> <span className="sep">/</span>
          <span className="current">{product.nombre_categoria || 'Premium'}</span>
        </nav>

        <div className="pdp-main-layout">
          {/* IZQUIERDA: GALERÍA STICKY */}
          <section className="pdp-gallery">
            <div className="pdp-main-img-card">
              <div className="pdp-tags-overlay">
                {product.stock < 5 && product.stock > 0 && <span className="pdp-tag warn">ÚLTIMAS UNIDADES</span>}
                {product.stock <= 0 && <span className="pdp-tag out">AGOTADO</span>}
                <span className="pdp-tag premium">CALIDAD PRO</span>
              </div>
              <img src={`${API_BASE}${product.imagen_url}`} alt={product.nombre_producto} />
            </div>
          </section>

          {/* DERECHA: COMPRA */}
          <section className="pdp-info-panel">
            <header className="pdp-header">
              <span className="pdp-brand-label">Culinaria Store | Selección Gold</span>
              <h1 className="pdp-title">{product.nombre_producto}</h1>
              <span className={`pdp-availability ${product.stock > 0 ? 'in' : 'out'}`}>
                {product.stock > 0 ? `● En Stock (${product.stock} disp.)` : '● Agotado'}
              </span>
            </header>

            <div className="pdp-pricing">
              <div className="pdp-price-row">
                <span className="pdp-currency">S/</span>
                <span className="pdp-value">{parseFloat(product.precio).toFixed(2)}</span>
              </div>
              <p className="pdp-tax-info">Incluye IGV. Envío disponible a todo el país.</p>
            </div>

            <div className="pdp-actions-box">
              <div className="pdp-quantity-selector">
                <label>Cantidad</label>
                <div className="qty-controls">
                  <button onClick={() => setQuantity(Math.max(1, quantity - 1))}>−</button>
                  <input type="number" value={quantity} readOnly />
                  <button onClick={() => setQuantity(Math.min(product.stock, quantity + 1))}>+</button>
                </div>
              </div>
              <button className="pdp-btn-cart" onClick={addToCart} disabled={product.stock <= 0}>
                {product.stock > 0 ? 'AÑADIR AL PEDIDO' : 'PRODUCTO AGOTADO'}
              </button>
            </div>

            <div className="pdp-description-brief">
              <h3>Sobre este equipo:</h3>
              <p>{product.descripcion}</p>
            </div>
          </section>
        </div>

        {/* PRODUCTOS RELACIONADOS */}
        {similarProducts.length > 0 && (
          <section className="pdp-related">
            <h2 className="section-title">PRODUCTOS QUE PODRÍAN INTERESARTE</h2>
            <div className="pdp-related-grid">
              {similarProducts.map(p => (
                <Link to={`/producto/${p.id_producto}`} key={p.id_producto} className="pdp-related-card">
                  <img src={`${API_BASE}${p.imagen_url}`} alt={p.nombre_producto} />
                  <h4>{p.nombre_producto}</h4>
                  <span>S/ {parseFloat(p.precio).toFixed(2)}</span>
                </Link>
              ))}
            </div>
          </section>
        )}
      </div>
    </div>
  );
};

export default ProductDetail;