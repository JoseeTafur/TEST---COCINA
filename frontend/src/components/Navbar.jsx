// Navbar.jsx corregido
import { useContext, useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom'; // Añadimos useNavigate
import { AuthContext } from '../context/AuthContext';
import apiClient from '../api/apiClient';

const Navbar = () => {
  const { user, logout } = useContext(AuthContext);
  const [cartCount, setCartCount] = useState(0);
  const navigate = useNavigate(); // Inicializamos el hook de navegación

  const handleLogout = async () => {
    const localCart = JSON.parse(localStorage.getItem('cart')) || [];

    try {
      if (localCart.length > 0 && user) {
        await apiClient.post('/carrito/sync', { items: localCart });
      }
    } catch (err) {
      console.error("Error de sincronización final:", err);
    } finally {
      // 1. Ejecutamos el logout del context (limpia estado global)
      logout(); 
      
      // 2. Limpieza manual de seguridad
      localStorage.removeItem('token');
      localStorage.removeItem('cart');
      localStorage.removeItem('user');

      // 3. Notificar y REDIRIGIR
      window.dispatchEvent(new Event('cartUpdated'));
      navigate('/login', { replace: true }); // El 'replace' evita que vuelvan atrás con el botón del navegador
    }
  };

  // ... (tu lógica de badge se mantiene igual)

  return (
    <nav style={styles.nav}>
      <Link to="/" style={styles.logo}>CULINARIA STORE</Link>
      <div style={{ display: 'flex', alignItems: 'center', gap: '20px' }}>
        <Link to="/catalogo" style={styles.link}>Catálogo</Link>

        {user ? (
          <div style={{ display: 'flex', alignItems: 'center', gap: '20px' }}>
            <Link to="/perfil" style={styles.userLink}>
              Hola, <strong>{user?.nombre}</strong> 
              <span style={{ color: 'gold', marginLeft: '5px' }}>
                {user?.rol === 1 ? '(ADMIN)' : '(CLIENTE)'}
              </span>
            </Link>

{/* Enlace al Dashboard: Solo para Administradores */}
    {user?.rol === 1 && (
      <Link to="/admin/dashboard" style={styles.adminLink}>
        PANEL CONTROL
      </Link>
    )}

            <Link to="/carrito" style={styles.cartIcon}>
              🛒 {cartCount > 0 && <span style={styles.badge}>{cartCount}</span>}
            </Link>

      <Link to="/mis-pedidos" style={styles.link}>Mis Compras</Link>
    

            {/* BOTÓN CORREGIDO: Ahora llama a handleLogout */}
            <button onClick={handleLogout} style={styles.logoutBtn}>Salir</button>
          </div>
        ) : (
          <div style={{ display: 'flex', gap: '15px' }}>
            <Link to="/login" style={styles.link}>Login</Link>
            <Link to="/register" style={styles.registerBtn}>Registro</Link>
          </div>
        )}
      </div>
    </nav>
  );
};
// ... estilos

// Estilos rápidos para mantener la limpieza
const styles = {
  nav: { display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '0.8rem 2rem', background: '#111', borderBottom: '2px solid #B8860B', color: 'gold' },
  logo: { color: 'gold', fontWeight: 'bold', textDecoration: 'none', fontSize: '1.2rem' },
  link: { color: 'white', textDecoration: 'none', fontSize: '0.9rem' },
  userLink: { color: '#ccc', fontSize: '0.9rem', textDecoration: 'none' },
  cartIcon: { position: 'relative', fontSize: '1.2rem', textDecoration: 'none' },
  badge: { position: 'absolute', top: '-10px', right: '-10px', background: 'red', color: 'white', borderRadius: '50%', padding: '2px 6px', fontSize: '10px', fontWeight: 'bold' },
  adminLink: { color: 'gold', fontWeight: 'bold', textDecoration: 'none', fontSize: '0.9rem' },
  logoutBtn: { background: 'transparent', color: '#ff4d4d', border: '1px solid #ff4d4d', padding: '5px 12px', borderRadius: '4px', cursor: 'pointer', fontWeight: 'bold' },
  registerBtn: { color: 'black', background: 'gold', padding: '5px 15px', borderRadius: '4px', textDecoration: 'none', fontWeight: 'bold' }
};

export default Navbar;