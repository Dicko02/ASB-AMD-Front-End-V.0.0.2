import { useEffect, useState } from 'react';
import Loading from '../Complements/Loading.component';

function StatCard({totalEndpoints, lowEndpoints, mediumEndpoints, highEndpoints, criticalEndpoints}) {
  const [loading, setLoading] = useState(true);

  // États pour chaque statistique
  const [total, setTotal] = useState(0);
  const [low, setLow] = useState(0);
  const [medium, setMedium] = useState(0);
  const [high, setHigh] = useState(0);
  const [critical, setCritical] = useState(0);

  useEffect(() => {
    async function fetchStats() {
      try {
        
        // On utilise les props passées pour définir les états
        setTotal(totalEndpoints);
        setLow(lowEndpoints);
        setMedium(mediumEndpoints);
        setHigh(highEndpoints);
        setCritical(criticalEndpoints);

      } catch (err) {
        console.error('Erreur lors du chargement des stats :', err);
      } finally {
        setLoading(false);
      }
    }

    fetchStats();
  }, [totalEndpoints, lowEndpoints, mediumEndpoints, highEndpoints, criticalEndpoints]);

  if (loading){
    return <Loading text="Chargement des données statistiques liées aux endpoints..." />;
  }

  return (
    <div
      style={{
        width: '300px',
        padding: '12px 16px',
        height: 'auto',
        maxHeight: '175px',
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
        <span style={{ fontSize: '14px', color: '#6b7280' }}>Faible :</span>
        <span style={{ color: 'green', fontWeight: '600' }}>{low}</span>
      </div>

      <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '4px' }}>
        <span style={{ fontSize: '14px', color: '#6b7280' }}>Modéré :</span>
        <span style={{ color: 'orange', fontWeight: '600' }}>{medium}</span>
      </div>

      <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '4px' }}>
        <span style={{ fontSize: '14px', color: '#6b7280' }}>Haut :</span>
        <span style={{ color: 'orangered', fontWeight: '600' }}>{high}</span>
      </div>

      <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '0' }}>
        <span style={{ fontSize: '14px', color: '#6b7280' }}>Critique :</span>
        <span style={{ color: 'red', fontWeight: '600' }}>{critical}</span>
      </div>
    </div>
  );
}

export default StatCard;
