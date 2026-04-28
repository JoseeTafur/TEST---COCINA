import { useState, useContext } from 'react';
import { AuthContext } from '../context/AuthContext';
import apiClient from '../api/apiClient';
import { useNavigate } from 'react-router-dom';

const Login = () => {
  const [formData, setFormData] = useState({ correo: '', password: '' });
  const { login } = useContext(AuthContext);
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const res = await apiClient.post('/auth/login', formData);
      login(res.data.user, res.data.token);
      navigate('/');
    } catch (err) {
      alert("Credenciales incorrectas");
    }
  };

  const onLoginSuccess = async (token) => {
  localStorage.setItem('token', token);
  
  // Recuperar el carrito de la DB
  try {
    const res = await apiClient.get('/carrito');
    if (res.data.length > 0) {
      localStorage.setItem('cart', JSON.stringify(res.data));
      window.dispatchEvent(new Event('cartUpdated'));
    }
  } catch (err) {
    console.error("No se pudo recuperar el carrito de la DB");
  }
  
  navigate('/catalogo');
};

  return (
    <div style={{ maxWidth: '400px', margin: '50px auto', textAlign: 'center' }}>
      <h2>Iniciar Sesión</h2>
      <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '15px' }}>
        <input type="email" placeholder="Correo" onChange={e => setFormData({...formData, correo: e.target.value})} required />
        <input type="password" placeholder="Contraseña" onChange={e => setFormData({...formData, password: e.target.value})} required />
        <button type="submit" style={{ padding: '10px', background: 'gold', fontWeight: 'bold' }}>Entrar</button>
      </form>
    </div>
  );
};

export default Login;