import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import apiClient from '../api/apiClient';

const Register = () => {
  const [formData, setFormData] = useState({
    nombre: '',
    apellido: '',
    correo: '',
    password: ''
    // id_rol eliminado por seguridad
  });
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      // Enviamos solo los datos personales
      await apiClient.post('/auth/register', formData);
      alert("Registro exitoso. Ahora puedes iniciar sesión.");
      navigate('/login');
    } catch (err) {
      alert(err.response?.data?.message || "Error al registrarse");
    }
  };

  return (
    <div style={{ maxWidth: '400px', margin: '50px auto', textAlign: 'center' }}>
      <h2 style={{ color: '#B8860B' }}>Únete a Culinaria Store</h2>
      <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '15px' }}>
        <input 
          type="text" 
          placeholder="Nombre" 
          value={formData.nombre}
          onChange={e => setFormData({...formData, nombre: e.target.value})} 
          required 
          style={{ padding: '10px' }}
        />
        <input 
          type="text" 
          placeholder="Apellido" 
          value={formData.apellido}
          onChange={e => setFormData({...formData, apellido: e.target.value})} 
          required 
          style={{ padding: '10px' }}
        />
        <input 
          type="email" 
          placeholder="Correo Electrónico" 
          value={formData.correo}
          onChange={e => setFormData({...formData, correo: e.target.value})} 
          required 
          style={{ padding: '10px' }}
        />
        <input 
          type="password" 
          placeholder="Contraseña" 
          value={formData.password}
          onChange={e => setFormData({...formData, password: e.target.value})} 
          required 
          style={{ padding: '10px' }}
        />
        <button 
          type="submit" 
          style={{ padding: '10px', background: 'black', color: 'gold', fontWeight: 'bold', border: '1px solid gold', cursor: 'pointer' }}
        >
          Crear Cuenta
        </button>
      </form>
    </div>
  );
};

export default Register;