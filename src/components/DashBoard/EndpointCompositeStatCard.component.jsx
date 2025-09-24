import { useEffect, useState } from 'react';
import Loading from '../Complements/Loading.component';

function EndpointCompositeStatCard({ totalEndpoints, NoADEndpoints, NoKasperskyEndpoints, NoGLPIEndpoints }) {
  const [total, setTotal] = useState(0);
  const [NoAD, setNoAD] = useState(0);
  const [NoKaspersky, setNoKaspersky] = useState(0);
  const [NoGLPI, setNoGLPI] = useState(0);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchStats() {
      try {
        setTotal(totalEndpoints);
        setNoAD(NoADEndpoints);
        setNoKaspersky(NoKasperskyEndpoints);
        setNoGLPI(NoGLPIEndpoints);
      } catch (err) {
        console.error('Erreur lors du chargement des stats :', err);
      } finally {
        setLoading(false);
      }
    }

    fetchStats();
  }, [totalEndpoints, NoADEndpoints, NoKasperskyEndpoints, NoGLPIEndpoints]);

  if (loading){
    return <Loading text="Chargement des données statistiques liées aux composants..." />;
  }

  return (
    <div
      style={{
        width: '300px',
        padding: '12px 16px',
        height: 'auto',
        maxHeight: '150px',
        backgroundColor: '#f9f9f9',
        borderRadius: '10px',
        boxShadow: '0 4px 12px rgba(0, 0, 0, 0.1)',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'stretch',
        fontFamily: 'sans-serif',
      }}
    >
      <div style={{ textAlign: 'center', fontWeight: 'bold', fontSize: '16px', marginBottom: '8px' }}>
        Total : {total}
      </div>

      <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '4px' }}>
        <span style={{ fontSize: '14px', color: '#6b7280' }}>NoAD :</span>
        <span style={{ fontWeight: '600' }}>{NoAD}</span>
      </div>

      <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '4px' }}>
        <span style={{ fontSize: '14px', color: '#6b7280' }}>NoKaspersky :</span>
        <span style={{ fontWeight: '600' }}>{NoKaspersky}</span>
      </div>

      <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '0' }}>
        <span style={{ fontSize: '14px', color: '#6b7280' }}>NoGLPI :</span>
        <span style={{ fontWeight: '600' }}>{NoGLPI}</span>
      </div>
    </div>
  );
}

export default EndpointCompositeStatCard;
