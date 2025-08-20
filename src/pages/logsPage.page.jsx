import { useState, useEffect } from 'react';
import SidebarToggle from '../components/Complements/SideBar.component';
import Header from '../components/Complements/Header.component';
import Loading from '../components/Complements/Loading.component'; // ✅ Import du loader

function LogsPage() {
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
          <Loading text="chargement des logs..." />
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
          minHeight: '100vh',
          boxSizing: 'border-box',
          display: 'flex',
          flexDirection: 'column',
        }}
      >
        <Header title="Les differents logs" />
            <div
                style={{
                    paddingTop: '2rem',
                    display: 'flex',
                    gap: '1.5rem',
                    justifyContent: 'center',
                    flexWrap: 'wrap',
                }}
                >
                {[
                    { href: "/Logs/HistoryLogsPage", label: "Voir les history logs" },
                    { href: "/Logs/AccessLogsPage", label: "Voir les access logs" },
                    { href: "/Logs/AppLogsPage", label: "Voir les app logs" },
                ].map(({ href, label }) => (
                    <a
                    key={href}
                    href={href}
                    style={{
                        display: 'inline-block',
                        padding: '14px 28px',
                        fontSize: '1.2rem',
                        fontWeight: '600',
                        color: '#1f2937',          // gris foncé
                        backgroundColor: '#3b82f6', // bleu vif
                        borderRadius: '12px',
                        boxShadow: '0 4px 8px rgba(59, 130, 246, 0.4)', 
                        textDecoration: 'none',
                        textAlign: 'center',
                        minWidth: '180px',
                        transition: 'all 0.3s ease',
                        userSelect: 'none',
                    }}
                    onMouseOver={e => {
                        e.currentTarget.style.backgroundColor = '#2563eb'; // bleu plus foncé
                        e.currentTarget.style.color = 'white';
                        e.currentTarget.style.boxShadow = '0 6px 12px rgba(37, 99, 235, 0.6)';
                        e.currentTarget.style.transform = 'translateY(-3px)';
                    }}
                    onMouseOut={e => {
                        e.currentTarget.style.backgroundColor = '#3b82f6';
                        e.currentTarget.style.color = '#1f2937';
                        e.currentTarget.style.boxShadow = '0 4px 8px rgba(59, 130, 246, 0.4)';
                        e.currentTarget.style.transform = 'none';
                    }}
                    >
                    {label}
                    </a>
                ))}
            </div>
      </main>
    </div>
  );
}

export default LogsPage;
