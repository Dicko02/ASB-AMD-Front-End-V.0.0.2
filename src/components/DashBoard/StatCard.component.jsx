import { useEffect, useState } from 'react';
import Loading from '../Complements/Loading.component';

import countEndpoints from '../../utils/EndpointPriorityLevelNumber/EndpointTotalNumber';
import countLowPriorityEndpoints from '../../utils/EndpointPriorityLevelNumber/EndpointLowPriorityNumber';
import countMediumPriorityEndpoints from '../../utils/EndpointPriorityLevelNumber/EndpointMediumPriorityNumber';
import countHighPriorityEndpoints from '../../utils/EndpointPriorityLevelNumber/EndpointHighPriorityNumber';
import countCriticalPriorityEndpoints from '../../utils/EndpointPriorityLevelNumber/EndpointCriticalyPriorityNumber';

function StatCard() {
  const [total, setTotal] = useState(0);
  const [low, setLow] = useState(0);
  const [medium, setMedium] = useState(0);
  const [high, setHigh] = useState(0);
  const [critical, setCritical] = useState(0);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchStats() {
      try {
        setTotal(await countEndpoints());
        setLow(await countLowPriorityEndpoints());
        setMedium(await countMediumPriorityEndpoints());
        setHigh(await countHighPriorityEndpoints());
        setCritical(await countCriticalPriorityEndpoints());
      } catch (err) {
        console.error('Erreur lors du chargement des stats :', err);
      } finally {
        setLoading(false);
      }
    }

    fetchStats();
  }, []);

  if (loading){
    return <Loading text="chargement des donnees statistiques lie aux endpoints..." />;
  }

  return (
    <div
      style={{
        width: '300px',
        padding: '20px',
        backgroundColor: '#f9f9f9',
        borderRadius: '10px',
        boxShadow: '0 4px 12px rgba(0, 0, 0, 0.1)',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        fontFamily: 'sans-serif',
      }}
    >
      <div style={{ width: '100%' }}>
        <div style={{ fontWeight: 'bold', marginBottom: '12px', fontSize: '18px' }}>
          Total-N : {total}
        </div>

        <div style={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          marginBottom: '8px',
        }}>
          <span style={{ fontSize: '14px', color: '#6b7280' /* gray-500 */ }}>Low :</span>
          <span style={{ color: 'green', fontWeight: '600' }}>{low}</span>
        </div>

        <div style={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          marginBottom: '8px',
        }}>
          <span style={{ fontSize: '14px', color: '#6b7280' }}>Medium :</span>
          <span style={{ color: 'orange', fontWeight: '600' }}>{medium}</span>
        </div>

        <div style={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          marginBottom: '8px',
        }}>
          <span style={{ fontSize: '14px', color: '#6b7280' }}>High :</span>
          <span style={{ color: 'orangered', fontWeight: '600' }}>{high}</span>
        </div>

        <div style={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
        }}>
          <span style={{ fontSize: '14px', color: '#6b7280' }}>Critical :</span>
          <span style={{ color: 'red', fontWeight: '600' }}>{critical}</span>
        </div>
      </div>
    </div>
  );
}

export default StatCard;
