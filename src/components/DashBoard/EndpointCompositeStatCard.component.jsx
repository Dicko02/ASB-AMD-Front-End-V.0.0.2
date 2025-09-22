import { useEffect, useState } from 'react';
import Loading from '../Complements/Loading.component';

import countTotalEndpoints from '../../utils/EndpointPriorityLevelNumber/EndpointTotalNumber';
import countEndpointsNoAD from '../../utils/endpointComposantCount/NoAD';
import countEndpointsNoKaspersky from '../../utils/endpointComposantCount/NoKaspersky';
import countEndpointsNoGLPI from '../../utils/endpointComposantCount/NoGLPI';

function EndpointCompositeStatCard() {
  const [total, setTotal] = useState(0);
  const [NoAD, setNoAD] = useState(0);
  const [NoKaspersky, setNoKaspersky] = useState(0);
  const [NoGLPI, setNoGLPI] = useState(0);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchStats() {
      try {
        setTotal(await countTotalEndpoints());
        setNoAD(await countEndpointsNoAD());
        setNoKaspersky(await countEndpointsNoKaspersky());
        setNoGLPI(await countEndpointsNoGLPI());
      } catch (err) {
        console.error('Erreur lors du chargement des stats :', err);
      } finally {
        setLoading(false);
      }
    }

    fetchStats();
  }, []);

  if (loading){
    return <Loading text="chargement des donnees statistiques lie aux composants des differents endpoints..." />;
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
          Total-G : {total}
        </div>

        <div style={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          marginBottom: '8px',
        }}>
          <span style={{ fontSize: '14px', color: '#6b7280' /* gray-500 */ }}>NoAD :</span>
          <span style={{ fontWeight: '600' }}>{NoAD}</span>
        </div>

        <div style={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          marginBottom: '8px',
        }}>
          <span style={{ fontSize: '14px', color: '#6b7280' }}>NoKaspersky :</span>
          <span style={{ fontWeight: '600' }}>{NoKaspersky}</span>
        </div>

        <div style={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          marginBottom: '8px',
        }}>
          <span style={{ fontSize: '14px', color: '#6b7280' }}>NoGLPI :</span>
          <span style={{ fontWeight: '600' }}>{NoGLPI}</span>
        </div>

      </div>
    </div>
  );
}

export default EndpointCompositeStatCard;
