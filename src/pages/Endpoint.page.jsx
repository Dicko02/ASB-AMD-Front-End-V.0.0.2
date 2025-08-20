import { useState, useEffect } from 'react';
import Endpoint from "../components/Endpoint/Endpoint.component";
import SidebarToggle from '../components/Complements/SideBar.component';
import Header from '../components/Complements/Header.component';
import Loading from '../components/Complements/Loading.component'; // ✅ Import du loader

function EndpointPage() {
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Simule un délai de chargement de 2 secondes
    const timer = setTimeout(() => setLoading(false), 2000);
    return () => clearTimeout(timer);
  }, []);

  // ✅ Affiche le loader si en cours de chargement
  if (loading) {
    return (
      <div style={{ position: 'relative', minHeight: '100vh' }}>
        <SidebarToggle />
        <main
          style={{
            padding: '1.5rem',
            width: '100%',
            minHeight: '100vh',
            boxSizing: 'border-box',
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'center',
          }}
        >
          <Loading text="chargement des informations de l'endpoint..." />
        </main>
      </div>
    );
  }

  return (
    <div style={{ display: 'flex' }}>
      <SidebarToggle />
      <main
        style={{
          width: '100%',
          padding: '1.5rem',
          backgroundColor: '#f3f4f6',
          minHeight: '100vh',
          boxSizing: 'border-box',
          display: 'flex',
          flexDirection: 'column',
        }}
      >
        <Header title="Détail de l'Endpoint" />
        <div style={{ paddingTop: '2rem' }}>
          <Endpoint />
        </div>
      </main>
    </div>
  );
}

export default EndpointPage;
