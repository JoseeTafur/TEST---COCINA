import { useEffect, useState } from 'react';
import apiClient from '../api/apiClient';

const AdminDashboard = () => {
  const [productos, setProductos] = useState([]);
  const [usuarios, setUsuarios] = useState([]);
  const [ventas, setVentas] = useState([]); 
  const [view, setView] = useState('productos'); 
  const [loading, setLoading] = useState(false);

  // Estados para el Modal
  const [modalMode, setModalMode] = useState(null);
  const [activeTab, setActiveTab] = useState(null);
  const [selectedItem, setSelectedItem] = useState({});

  const cargarDatos = async () => {
    setLoading(true);
    try {
      const resP = await apiClient.get('/productos');
      setProductos(resP.data);
      const resU = await apiClient.get('/auth/users');
      setUsuarios(resU.data);
      const resV = await apiClient.get('/ventas/todas'); 
      console.log("Datos de ventas recibidos:", resV.data[0]); 
      setVentas(resV.data);
    } catch (err) {
      console.error("Error al sincronizar con el servidor:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { cargarDatos(); }, []);

  const handleDelete = async (id, type) => {
    const msg = type === 'p' ? "¿Eliminar este producto?" : "¿Revocar acceso?";
    if (!window.confirm(msg)) return;
    try {
      const url = type === 'p' ? `/productos/${id}` : `/auth/users/${id}`;
      await apiClient.delete(url);
      cargarDatos();
    } catch (err) {
      alert("Error al eliminar.");
    }
  };

 const handleSubmit = async (e) => {
  e.preventDefault();
  const formData = new FormData(e.target); // Captura archivos y texto

  try {
    if (activeTab === 'producto') {
      // ENVIAMOS formData DIRECTAMENTE (sin convertir a objeto)
      if (modalMode === 'add') {
        await apiClient.post('/productos', formData);
      } else {
        await apiClient.put(`/productos/${selectedItem.id_producto}`, formData);
      }
    } else {
      // Para usuarios seguimos usando JSON (opcional, FormData también sirve)
      const data = Object.fromEntries(formData.entries());
      modalMode === 'add' 
        ? await apiClient.post('/auth/register', data) 
        : await apiClient.put(`/auth/users/${selectedItem.id_usuario}`, data);
    }
    setModalMode(null);
    cargarDatos();
    alert("✅ Base de datos actualizada con éxito");
  } catch (err) {
    console.error(err);
    alert("Error en la solicitud. Revisa la consola.");
  }
};
  const styles = {
    container: { padding: '40px', background: '#f8f9fa', minHeight: '100vh', fontFamily: 'Segoe UI, sans-serif' },
    header: { display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '30px' },
    navBtn: (active) => ({
      padding: '12px 25px', cursor: 'pointer', border: 'none', borderRadius: '8px',
      background: active ? '#B8860B' : '#1a1a1a', color: active ? 'white' : '#ccc',
      fontWeight: 'bold', marginRight: '10px', transition: '0.3s'
    }),
    tableCard: { background: 'white', borderRadius: '15px', boxShadow: '0 10px 30px rgba(0,0,0,0.05)', overflow: 'hidden' },
    table: { width: '100%', borderCollapse: 'collapse' },
    th: { background: '#1a1a1a', color: '#B8860B', padding: '15px', textAlign: 'left', fontSize: '0.85rem' },
    td: { padding: '15px', borderBottom: '1px solid #eee', color: '#444', fontSize: '0.9rem' },
    actionBtn: (color) => ({ padding: '6px 12px', border: 'none', borderRadius: '6px', color: 'white', background: color, cursor: 'pointer', marginRight: '5px', fontSize: '0.8rem' }),
    modalOverlay: { position: 'fixed', top: 0, left: 0, width: '100%', height: '100%', background: 'rgba(0,0,0,0.7)', display: 'flex', justifyContent: 'center', alignItems: 'center', zIndex: 1000 },
    modalBox: { background: 'white', padding: '35px', borderRadius: '15px', width: '450px', boxShadow: '0 20px 50px rgba(0,0,0,0.2)' },
    input: { width: '100%', padding: '12px', marginBottom: '15px', borderRadius: '8px', border: '1px solid #ddd', boxSizing: 'border-box' },
    saveBtn: { width: '100%', padding: '12px', background: '#1a1a1a', color: 'gold', border: 'none', borderRadius: '8px', fontWeight: 'bold', cursor: 'pointer' }
  };

  return (
    <div style={styles.container}>
      <header style={styles.header}>
        <div>
          <h1 style={{ margin: 0, color: '#1a1a1a' }}>Panel de Control</h1>
          <p style={{ color: '#888' }}>Gestión integral de Culinaria Store</p>
        </div>
        <div>
          <button style={styles.navBtn(view === 'productos')} onClick={() => setView('productos')}>UTENSILIOS</button>
          <button style={styles.navBtn(view === 'usuarios')} onClick={() => setView('usuarios')}>USUARIOS</button>
          <button style={styles.navBtn(view === 'ventas')} onClick={() => setView('ventas')}>VENTAS</button>
        </div>
      </header>

      <div style={styles.tableCard}>
        {/* Solo mostrar botón de "Nuevo" si no estamos en la pestaña de ventas */}
        {view !== 'ventas' && (
          <div style={{ padding: '20px', display: 'flex', justifyContent: 'flex-end', background: '#fdfdfd' }}>
            <button 
              onClick={() => { setModalMode('add'); setActiveTab(view === 'productos' ? 'producto' : 'usuario'); setSelectedItem({}); }}
              style={{ ...styles.saveBtn, width: 'auto', padding: '10px 20px', background: '#28a745', color: 'white' }}
            >
              + Nuevo {view === 'productos' ? 'Producto' : 'Usuario'}
            </button>
          </div>
        )}

        {loading ? (
          <p style={{ textAlign: 'center', padding: '50px' }}>Sincronizando base de datos...</p>
        ) : (
          <table style={styles.table}>
            <thead>
              <tr>
                {view === 'productos' ? (
                  <><th style={styles.th}>ID</th><th style={styles.th}>PRODUCTO</th><th style={styles.th}>PRECIO</th><th style={styles.th}>STOCK</th><th style={styles.th}>ACCIONES</th></>
                ) : view === 'usuarios' ? (
                  <><th style={styles.th}>ID</th><th style={styles.th}>NOMBRE</th><th style={styles.th}>CORREO</th><th style={styles.th}>ROL</th><th style={styles.th}>ACCIONES</th></>
                ) : (
                  <><th style={styles.th}>ID PEDIDO</th><th style={styles.th}>CLIENTE</th><th style={styles.th}>FECHA</th><th style={styles.th}>TOTAL</th><th style={styles.th}>ESTADO</th></>
                )}
              </tr>
            </thead>
            <tbody>
              {/* VISTA DE PRODUCTOS */}
              {view === 'productos' && productos.map(p => (
  <tr key={p.id_producto}>
    <td style={styles.td}>#{p.id_producto}</td>
    <td style={{ ...styles.td, display: 'flex', alignItems: 'center', gap: '10px' }}>
      {/* Miniatura de la imagen */}
      <img 
        src={`http://localhost:5000${p.imagen_url}`} 
        alt="preview" 
        style={{ width: '40px', height: '40px', borderRadius: '5px', objectFit: 'cover', border: '1px solid #ddd' }} 
      />
      <span style={{ fontWeight: 'bold' }}>{p.nombre_producto}</span>
    </td>
    <td style={styles.td}>S/ {parseFloat(p.precio).toFixed(2)}</td>
    <td style={styles.td}>{p.stock} un.</td>
                  <td style={styles.td}>
                    <button onClick={() => { setModalMode('edit'); setActiveTab('producto'); setSelectedItem(p); }} style={styles.actionBtn('#007bff')}>Editar</button>
                    <button onClick={() => handleDelete(p.id_producto, 'p')} style={styles.actionBtn('#dc3545')}>Eliminar</button>
                  </td>
                </tr>
              ))}

              {/* VISTA DE USUARIOS */}
              {view === 'usuarios' && usuarios.map(u => (
                <tr key={u.id_usuario}>
                  <td style={styles.td}>#{u.id_usuario}</td>
                  <td style={{ ...styles.td, fontWeight: 'bold' }}>{u.nombre} {u.apellido}</td>
                  <td style={styles.td}>{u.correo}</td>
                  <td style={styles.td}>{u.id_rol === 1 ? '👑 ADMIN' : '👤 CLIENTE'}</td>
                  <td style={styles.td}>
                    <button onClick={() => { setModalMode('edit'); setActiveTab('usuario'); setSelectedItem(u); }} style={styles.actionBtn('#007bff')}>Editar</button>
                    <button onClick={() => handleDelete(u.id_usuario, 'u')} style={styles.actionBtn('#dc3545')}>Eliminar</button>
                  </td>
                </tr>
              ))}

              {/* VISTA DE VENTAS */}
              {view === 'ventas' && ventas.map(v => (
  <tr key={v.id_pedido}>
    <td style={styles.td}>#{v.id_pedido}</td>
    <td style={{ ...styles.td, fontWeight: 'bold' }}>{v.nombre} {v.apellido}</td>
    <td style={styles.td}>
      {v.fecha_pedido 
        ? new Date(v.fecha_pedido).toLocaleDateString('es-PE', {
            day: '2-digit',
            month: '2-digit',
            year: 'numeric'
          }) 
        : 'Pendiente'}
    </td>
    <td style={{ ...styles.td, color: '#B8860B', fontWeight: 'bold' }}>S/ {parseFloat(v.total).toFixed(2)}</td>
    <td style={styles.td}>
      <span style={{ padding: '4px 10px', background: '#d4edda', color: '#155724', borderRadius: '20px', fontSize: '0.7rem', fontWeight: 'bold' }}>PAGADO</span>
    </td>
  </tr>
))}
            </tbody>
          </table>
        )}
      </div>

      {/* MODAL DINÁMICO */}
      {modalMode && (
        <div style={styles.modalOverlay}>
          <div style={styles.modalBox}>
            <h2 style={{ borderBottom: '2px solid gold', paddingBottom: '10px' }}>
              {modalMode === 'add' ? 'Añadir' : 'Actualizar'} {activeTab === 'producto' ? 'Utensilio' : 'Usuario'}
            </h2>
            <form onSubmit={handleSubmit} style={{ marginTop: '20px' }}>
              {activeTab === 'producto' ? (
                <>
  <label style={{ fontSize: '0.8rem', color: '#666' }}>Nombre del Producto</label>
  <input name="nombre_producto" style={styles.input} type="text" defaultValue={selectedItem.nombre_producto} required />

  <label style={{ fontSize: '0.8rem', color: '#666' }}>Imagen del Producto</label>
  <input 
    name="imagen" 
    style={{ ...styles.input, padding: '8px' }} 
    type="file" 
    accept="image/*" 
    // No ponemos required en edit para no obligar a cambiar la imagen siempre
    required={modalMode === 'add'} 
  />

  <label style={{ fontSize: '0.8rem', color: '#666' }}>Precio Unitario</label>
  <input name="precio" style={styles.input} type="number" step="0.01" defaultValue={selectedItem.precio} required />
  
  <label style={{ fontSize: '0.8rem', color: '#666' }}>Stock en Almacén</label>
  <input name="stock" style={styles.input} type="number" defaultValue={selectedItem.stock} required />

  <label style={{ fontSize: '0.8rem', color: '#666' }}>ID Categoría</label>
  <input name="id_categoria" style={styles.input} type="number" defaultValue={selectedItem.id_categoria || 1} required />
</>
              ) : (
                <>
                  <input name="nombre" style={styles.input} type="text" defaultValue={selectedItem.nombre} placeholder="Nombre" required />
                  <input name="apellido" style={styles.input} type="text" defaultValue={selectedItem.apellido} placeholder="Apellido" required />
                  <input name="correo" style={styles.input} type="email" defaultValue={selectedItem.correo} placeholder="Correo" required />
                  {modalMode === 'add' && <input name="password" style={styles.input} type="password" placeholder="Contraseña" required />}
                  <select name="id_rol" style={styles.input} defaultValue={selectedItem.id_rol}>
                    <option value="1">Administrador</option>
                    <option value="2">Cliente</option>
                  </select>
                </>
              )}
              <button type="submit" style={styles.saveBtn}>GUARDAR EN BASE DE DATOS</button>
              <button type="button" onClick={() => setModalMode(null)} style={{ ...styles.saveBtn, background: '#eee', color: '#333', marginTop: '10px' }}>Cancelar</button>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default AdminDashboard;