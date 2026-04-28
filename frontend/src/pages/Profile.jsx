import { useEffect, useState } from 'react';
import apiClient from '../api/apiClient';

const Profile = () => {
  const [perfil, setPerfil] = useState(null);
  const [isEditing, setIsEditing] = useState(false);
  const [loading, setLoading] = useState(true);
  const [preview, setPreview] = useState(null);
  const [file, setFile] = useState(null);

  const fetchProfile = async () => {
    setLoading(true);
    try {
      const res = await apiClient.get('/auth/perfil');
      setPerfil(res.data);
    } catch (err) {
      console.error("Error de conexión:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { fetchProfile(); }, []);

  const handleSave = async (e) => {
    e.preventDefault();
    const formData = new FormData();
    // Enviamos todos los campos para que la actualización sea completa
    formData.append('nombre', perfil.nombre);
    formData.append('apellido', perfil.apellido);
    formData.append('correo', perfil.correo);
    if (file) formData.append('foto', file);

    try {
      await apiClient.put('/auth/perfil', formData, {
        headers: { 'Content-Type': 'multipart/form-data' }
      });
      setIsEditing(false);
      setPreview(null);
      fetchProfile(); // Recargamos para ver los cambios reflejados
    } catch (err) { 
      alert("Error al guardar cambios"); 
    }
  };

  if (loading) return <div style={{textAlign:'center', padding:'100px', color:'gold'}}>Cargando Perfil...</div>;
  if (!perfil) return <div style={{textAlign:'center', padding:'100px'}}>Servidor no disponible.</div>;

  const initials = `${perfil.nombre?.charAt(0)}${perfil.apellido?.charAt(0)}`.toUpperCase();

  return (
    <div style={{ display: 'flex', justifyContent: 'center', padding: '50px', background: '#F9F9F9', minHeight: '90vh' }}>
      <div style={{ background: 'white', width: '100%', maxWidth: '450px', borderRadius: '20px', padding: '40px', boxShadow: '0 10px 30px rgba(0,0,0,0.05)', textAlign: 'center' }}>
        
        <div style={{ position: 'relative', width: '120px', height: '120px', margin: '0 auto 20px' }}>
          {preview || perfil.foto_url ? (
            <img 
              src={preview || `http://localhost:5000${perfil.foto_url}`} 
              style={{ width: '100%', height: '100%', borderRadius: '50%', objectFit: 'cover', border: '3px solid gold' }} 
              alt="Profile"
            />
          ) : (
            <div style={{ width: '100%', height: '100%', borderRadius: '50%', background: '#1a1a1a', color: 'gold', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '2.5rem', fontWeight: 'bold', border: '3px solid gold' }}>
              {initials}
            </div>
          )}
          
          {isEditing && (
            <label style={{ position: 'absolute', bottom: 0, right: 0, background: 'gold', width: '35px', height: '35px', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer', border: '2px solid white' }}>
              <input type="file" hidden onChange={(e) => {
                setFile(e.target.files[0]);
                setPreview(URL.createObjectURL(e.target.files[0]));
              }} />
              📷
            </label>
          )}
        </div>

        <form onSubmit={handleSave} style={{ textAlign: 'left' }}>
          <div style={{ marginBottom: '15px' }}>
            <label style={{ fontSize: '0.75rem', fontWeight: 'bold', color: '#888' }}>NOMBRE</label>
            <input 
              disabled={!isEditing}
              style={{ width: '100%', padding: '10px', marginTop: '5px', borderRadius: '8px', border: '1px solid #ddd', background: isEditing ? 'white' : '#f0f0f0' }}
              value={perfil.nombre}
              onChange={(e) => setPerfil({...perfil, nombre: e.target.value})}
            />
          </div>

          <div style={{ marginBottom: '15px' }}>
            <label style={{ fontSize: '0.75rem', fontWeight: 'bold', color: '#888' }}>APELLIDO</label>
            <input 
              disabled={!isEditing}
              style={{ width: '100%', padding: '10px', marginTop: '5px', borderRadius: '8px', border: '1px solid #ddd', background: isEditing ? 'white' : '#f0f0f0' }}
              value={perfil.apellido}
              onChange={(e) => setPerfil({...perfil, apellido: e.target.value})}
            />
          </div>

          <div style={{ marginBottom: '20px' }}>
            <label style={{ fontSize: '0.75rem', fontWeight: 'bold', color: '#888' }}>CORREO ELECTRÓNICO</label>
            <input 
              disabled={!isEditing}
              style={{ width: '100%', padding: '10px', marginTop: '5px', borderRadius: '8px', border: '1px solid #ddd', background: isEditing ? 'white' : '#f0f0f0' }}
              value={perfil.correo}
              onChange={(e) => setPerfil({...perfil, correo: e.target.value})}
            />
          </div>

          {isEditing ? (
            <div style={{ display: 'flex', gap: '10px' }}>
              <button type="submit" style={{ flex: 1, padding: '12px', background: 'gold', border: 'none', borderRadius: '8px', fontWeight: 'bold', cursor: 'pointer' }}>GUARDAR</button>
              <button type="button" onClick={() => {setIsEditing(false); setPreview(null); fetchProfile();}} style={{ flex: 1, padding: '12px', background: '#eee', border: 'none', borderRadius: '8px', cursor: 'pointer' }}>CANCELAR</button>
            </div>
          ) : (
            <button 
              type="button" 
              onClick={() => setIsEditing(true)}
              style={{ width: '100%', padding: '12px', background: '#1a1a1a', color: 'gold', border: 'none', borderRadius: '8px', fontWeight: 'bold', cursor: 'pointer' }}
            >
              EDITAR PERFIL
            </button>
          )}
        </form>
      </div>
    </div>
  );
};

export default Profile;