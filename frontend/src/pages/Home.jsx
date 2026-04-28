import { Link } from 'react-router-dom';

const Home = () => {
  return (
    <div style={{ fontFamily: 'Urbanist, sans-serif' }}>
      {/* HERO SECTION */}
      <section style={styles.hero}>
        <h1 style={styles.heroTitle}>La Excelencia en tu Cocina</h1>
        <p style={styles.heroSub}>Equipamiento profesional para amantes de la alta gastronomía.</p>
        <Link to="/catalogo" style={styles.btnGold}>EXPLORAR CATÁLOGO</Link>
      </section>

      {/* RESUMEN / FEATURES */}
      <section style={styles.features}>
        <div style={styles.featureCard}>
          <h3>Calidad Premium</h3>
          <p>Utensilios seleccionados de acero inoxidable y materiales de alta durabilidad.</p>
        </div>
        <div style={styles.featureCard}>
          <h3>Diseño Exclusivo</h3>
          <p>Estética que combina con las cocinas más modernas y exigentes.</p>
        </div>
        <div style={styles.featureCard}>
          <h3>Soporte Experto</h3>
          <p>Asesoría personalizada en la elección de tu equipamiento culinario.</p>
        </div>
      </section>

      {/* CTA FINAL */}
      <section style={{ textAlign: 'center', padding: '60px 20px', background: '#111', color: 'white' }}>
        <h2>¿Listo para elevar tu nivel?</h2>
        <p>Únete a la comunidad de chefs que confían en Culinaria Store.</p>
        <Link to="/register" style={{ color: 'gold', textDecoration: 'underline' }}>Crea tu cuenta ahora</Link>
      </section>
    </div>
  );
};

const styles = {
  hero: {
    height: '70vh',
    background: 'linear-gradient(rgba(0,0,0,0.6), rgba(0,0,0,0.6)), url("https://images.unsplash.com/photo-1556910103-1c02745aae4d?q=80&w=2070") center/cover',
    display: 'flex', flexDirection: 'column', justifyContent: 'center', alignItems: 'center', color: 'white', textAlign: 'center'
  },
  heroTitle: { fontSize: '4rem', margin: 0, fontWeight: '800' },
  heroSub: { fontSize: '1.2rem', marginBottom: '30px', color: '#ccc' },
  btnGold: { background: 'gold', color: 'black', padding: '15px 40px', borderRadius: '5px', textDecoration: 'none', fontWeight: 'bold', fontSize: '1.1rem' },
  features: { display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '40px', padding: '80px 10%', background: 'white' },
  featureCard: { textAlign: 'center', padding: '20px', borderBottom: '3px solid gold' }
};

export default Home;