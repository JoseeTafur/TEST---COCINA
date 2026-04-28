import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { useContext } from 'react';
import { AuthProvider, AuthContext } from './context/AuthContext';
import Navbar from './components/Navbar';
import Home from './pages/Home';
import Login from './pages/Login';
import Register from './pages/Register';
import Cart from './pages/Cart';
import AdminDashboard from './pages/AdminDashboard';
import MyOrders from './pages/MyOrders';
import Profile from './pages/Profile.jsx';
import Catalogo from './pages/Catalogo';
import ProductDetail from './pages/ProductDetail';
import ProtectedRoute from './components/ProtectedRoute';

// 1. Protector para ADMINISTRADORES
const AdminRoute = ({ children }) => {
  const { user } = useContext(AuthContext);
  if (!user || user.rol !== 1) return <Navigate to="/" />;
  return children;
};

// 2. Protector para CUALQUIER USUARIO LOGUEADO (Clientes y Admins)
const PrivateRoute = ({ children }) => {
  const { user } = useContext(AuthContext);
  if (!user) return <Navigate to="/login" />;
  return children;
};

function App() {
  return (
    <AuthProvider>
      <Router>
        <Navbar />
        <Routes>
          {/* Rutas Públicas */}
          <Route path="/" element={<Home />} />
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          <Route 
  path="/carrito" 
  element={
    <ProtectedRoute>
      <Cart />
    </ProtectedRoute>
  } 
/>
          <Route path="/producto/:id" element={<ProductDetail />} />

          {/* Rutas Protegidas para Clientes/Usuarios */}
          <Route 
            path="/mis-pedidos" 
            element={
              <PrivateRoute>
                <MyOrders />
              </PrivateRoute>
            } 
          />

          {/* Ruta Protegida solo para Admins */}
          <Route 
            path="/admin/dashboard" 
            element={
              <AdminRoute>
                <AdminDashboard />
              </AdminRoute>
            } 
          />

          <Route 
  path="/perfil" 
  element={
    <PrivateRoute>
      <Profile />
    </PrivateRoute>
  } 
/>



<Route path="/catalogo" element={<Catalogo />} />

          {/* Ruta 404 - Siempre al final */}
          <Route path="*" element={
            <div style={{ padding: '50px', textAlign: 'center' }}>
              <h2>404 - Página no encontrada</h2>
              <p>Lo sentimos, el utensilio que buscas no está en nuestra cocina.</p>
            </div>
          } />
        </Routes>
      </Router>
    </AuthProvider>
  );
}

export default App;