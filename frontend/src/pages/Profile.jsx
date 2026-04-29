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

  const renderImage = () => {
  if (preview) return preview; // Si hay previsualización local (blob)
  if (perfil.foto_url) return `http://localhost:5000${perfil.foto_url}`; // Si hay foto en DB
  return null; // Si no hay nada, mostrar iniciales
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

  const handleUpdate = async (e) => {
    e.preventDefault();
    const formData = new FormData();
    formData.append('nombre', user.nombre);
    formData.append('apellido', user.apellido);
    formData.append('correo', user.correo);
    
    // Solo añadir la foto si el usuario seleccionó una nueva
    if (e.target.foto.files[0]) {
        formData.append('foto', e.target.foto.files[0]);
    }

    try {
        await apiClient.put('/auth/perfil', formData, {
            headers: { 'Content-Type': 'multipart/form-data' }
        });
        alert("¡Perfil actualizado!");
    } catch (err) {
        console.error(err);
        alert("Error al actualizar");
    }
};

  if (loading) return <div style={{textAlign:'center', padding:'100px', color:'gold'}}>Cargando Perfil...</div>;
  if (!perfil) return <div style={{textAlign:'center', padding:'100px'}}>Servidor no disponible.</div>;

  const initials = `${perfil.nombre?.charAt(0)}${perfil.apellido?.charAt(0)}`.toUpperCase();

  return (
    <div style={{ display: 'flex', justifyContent: 'center', padding: '50px', background: '#F9F9F9', minHeight: '90vh' }}>
      <div style={{ background: 'white', width: '100%', maxWidth: '450px', borderRadius: '20px', padding: '40px', boxShadow: '0 10px 30px rgba(0,0,0,0.05)', textAlign: 'center' }}>
        
        {/* SECCIÓN DE FOTO DE PERFIL */}
        <div style={{ position: 'relative', width: '120px', height: '120px', margin: '0 auto 30px' }}>
          {renderImage() ? (
            <img 
              src={renderImage()} 
              style={{ width: '100%', height: '100%', borderRadius: '50%', objectFit: 'cover', border: '3px solid gold', boxShadow: '0 4px 10px rgba(0,0,0,0.1)' }} 
              alt="Profile"
              onError={(e) => {
                console.error("Error cargando imagen, reintentando...");
                e.target.style.display = 'none'; // Si falla la carga, ocultamos el img roto
              }}
            />
          ) : (
            <div style={{ width: '100%', height: '100%', borderRadius: '50%', background: '#1a1a1a', color: 'gold', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '2.5rem', fontWeight: 'bold', border: '3px solid gold' }}>
              {initials}
            </div>
          )}
          
          {isEditing && (
            <label style={{ position: 'absolute', bottom: '5px', right: '5px', background: 'gold', width: '35px', height: '35px', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer', border: '2px solid white', boxShadow: '0 2px 5px rgba(0,0,0,0.2)', transition: '0.3s' }}>
              <input 
                type="file" 
                hidden 
                accept="image/*"
                onChange={(e) => {
                  const selectedFile = e.target.files[0];
                  if (selectedFile) {
                    setFile(selectedFile);
                    setPreview(URL.createObjectURL(selectedFile));
                  }
                }} 
              />
              <span style={{ fontSize: '1.2rem' }}>📷</span>
            </label>
          )}
        </div>

        {/* FORMULARIO DE DATOS */}
        <form onSubmit={handleSave} style={{ textAlign: 'left' }}>
          <div style={{ marginBottom: '15px' }}>
            <label style={{ fontSize: '0.75rem', fontWeight: 'bold', color: '#888', letterSpacing: '1px' }}>NOMBRE</label>
            <input 
              disabled={!isEditing}
              style={{ width: '100%', padding: '12px', marginTop: '5px', borderRadius: '8px', border: '1px solid #ddd', background: isEditing ? 'white' : '#f4f4f4', transition: '0.3s', outline: 'none' }}
              value={perfil.nombre || ''}
              onChange={(e) => setPerfil({...perfil, nombre: e.target.value})}
              placeholder="Tu nombre"
            />
          </div>

          <div style={{ marginBottom: '15px' }}>
            <label style={{ fontSize: '0.75rem', fontWeight: 'bold', color: '#888', letterSpacing: '1px' }}>APELLIDO</label>
            <input 
              disabled={!isEditing}
              style={{ width: '100%', padding: '12px', marginTop: '5px', borderRadius: '8px', border: '1px solid #ddd', background: isEditing ? 'white' : '#f4f4f4', transition: '0.3s', outline: 'none' }}
              value={perfil.apellido || ''}
              onChange={(e) => setPerfil({...perfil, apellido: e.target.value})}
              placeholder="Tu apellido"
            />
          </div>

          <div style={{ marginBottom: '25px' }}>
            <label style={{ fontSize: '0.75rem', fontWeight: 'bold', color: '#888', letterSpacing: '1px' }}>CORREO ELECTRÓNICO</label>
            <input 
              disabled={!isEditing}
              type="email"
              style={{ width: '100%', padding: '12px', marginTop: '5px', borderRadius: '8px', border: '1px solid #ddd', background: isEditing ? 'white' : '#f4f4f4', transition: '0.3s', outline: 'none' }}
              value={perfil.correo || ''}
              onChange={(e) => setPerfil({...perfil, correo: e.target.value})}
              placeholder="correo@ejemplo.com"
            />
          </div>

          {isEditing ? (
            <div style={{ display: 'flex', gap: '15px' }}>
              <button 
                type="submit" 
                style={{ flex: 1, padding: '14px', background: '#28a745', color: 'white', border: 'none', borderRadius: '10px', fontWeight: 'bold', cursor: 'pointer', transition: '0.3s' }}
              >
                GUARDAR CAMBIOS
              </button>
              <button 
                type="button" 
                onClick={() => { setIsEditing(false); setPreview(null); fetchProfile(); }} 
                style={{ flex: 1, padding: '14px', background: '#dc3545', color: 'white', border: 'none', borderRadius: '10px', fontWeight: 'bold', cursor: 'pointer', transition: '0.3s' }}
              >
                CANCELAR
              </button>
            </div>
          ) : (
            <button 
              type="button" 
              onClick={() => setIsEditing(true)}
              style={{ width: '100%', padding: '14px', background: '#1a1a1a', color: 'gold', border: 'none', borderRadius: '10px', fontWeight: 'bold', cursor: 'pointer', transition: '0.3s', letterSpacing: '1px' }}
            >
              EDITAR INFORMACIÓN
            </button>
          )}
        </form>
      </div>
    </div>
  );
};

export default Profile;