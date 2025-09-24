import { useEffect, useState } from 'react';
import SidebarToggle from '../components/Complements/SideBar.component';
import Loading from '../components/Complements/Loading.component';

import StatCard from '../components/DashBoard/StatCard.component';
import EndpointCompositeStatCard from '../components/DashBoard/EndpointCompositeStatCard.component'
import PieArcLabel from '../components/DashBoard/PieArc.component';
import BarChartEndpoints from '../components/DashBoard/Bars.component';
import TopCriticalEndpointsCard from '../components/DashBoard/TopCritical.component';

// fonctions d’export
import { exportDashboardCSV, exportDashboardPDF } from '../utils/Export/exportDashboardInfo';

// Fonctions de comptage
import {
  countEndpoints,
  countLowPriorityEndpoints,
  countMediumPriorityEndpoints,
  countHighPriorityEndpoints,
  countCriticalPriorityEndpoints
} from '../utils/EndpointPriorityAndTotal';

// Fonction de conversion en pourcentage et de determination criticite par mois
import PercentageConvertion from '../utils/PercentageConvertion';
import AllCriticalyNumberPerMonth from '../utils/CriticatlyLevelNumberAndDate/AllCriticalyNumberPerMonth';

// Fonctions des No-Composants
import { 
  countEndpointsNoAD, 
  countEndpointsNoGLPI, 
  countEndpointsNoKaspersky 
} from '../utils/NoSource';

// API fetchers
import fetchAllEndpoints from '../api/endpoint/allEndpoints.api';
import fetchCritiquesDurables from '../api/logsAPI/critiquesDurables.api';

// Fonction pour obtenir les top N endpoints critiques
import getTopCriticalEndpoints from '../utils/TopCriticalEndpoints';

function DashBoardPage() {
  const [loading, setLoading] = useState(true);

  // Données brutes
  const [allEndpointsData, setAllEndpointsData] = useState([]);
  const [critiquesDurablesData, setCritiquesDurablesData] = useState([]);

  // Statistiques brutes
  const [totalEndpoints, setTotalEndpoints] = useState(0);
  const [lowEndpoints, setLowEndpoints] = useState(0);
  const [mediumEndpoints, setMediumEndpoints] = useState(0);
  const [highEndpoints, setHighEndpoints] = useState(0);
  const [criticalEndpoints, setCriticalEndpoints] = useState(0);

  // Statistiques No-Composants
  const [NoADEndpoints, setNoADEndpoints] = useState(0);
  const [NoKasperskyEndpoints, setNoKasperskyEndpoints] = useState(0);
  const [NoGLPIEndpoints, setNoGLPIEndpoints] = useState(0);

  const [AllCriticalyNumberPerMonthData, setAllCriticalyNumberPerMonthData] = useState([]);

  useEffect(() => {
    async function fetchData() {
      try {
        const allEndpoints = await fetchAllEndpoints();
        const critiquesDurables = await fetchCritiquesDurables();

        // Stocke les données brutes
        setAllEndpointsData(allEndpoints.data);
        setCritiquesDurablesData(critiquesDurables.data);

        // Statistiques brutes
        setTotalEndpoints(await countEndpoints(allEndpoints.data));
        setLowEndpoints(await countLowPriorityEndpoints(allEndpoints.data));
        setMediumEndpoints(await countMediumPriorityEndpoints(allEndpoints.data));
        setHighEndpoints(await countHighPriorityEndpoints(allEndpoints.data));
        setCriticalEndpoints(await countCriticalPriorityEndpoints(allEndpoints.data));

        // Statistiques No-Composants
        setNoADEndpoints(await countEndpointsNoAD(allEndpoints.data));
        setNoKasperskyEndpoints(await countEndpointsNoKaspersky(allEndpoints.data));
        setNoGLPIEndpoints(await countEndpointsNoGLPI(allEndpoints.data));

        // Données mensuelles
        setAllCriticalyNumberPerMonthData(await AllCriticalyNumberPerMonth(allEndpoints.data));

      } catch (err) {
        console.error("Erreur lors du fetch des endpoints ou critiques durables :", err);
      } finally {
        setLoading(false);
      }
    }

    fetchData();
  }, []);


  async function assembleDashboardData () {

    // Bloc statistiques brutes
    const total = totalEndpoints;
    const low = lowEndpoints;
    const medium = mediumEndpoints;
    const high = highEndpoints;
    const critical = criticalEndpoints;

    // Bloc statistiques No Composants
    const NoTotal = totalEndpoints;
    const NoAD = NoADEndpoints;
    const NoKaspersky = NoKasperskyEndpoints;
    const NoGLPI = NoGLPIEndpoints;

    // Bloc pourcentages
    const percentages = {
      low: await PercentageConvertion(low, total),
      medium: await PercentageConvertion(medium, total),
      high: await PercentageConvertion(high, total),
      critical: await PercentageConvertion(critical, total),
    };

    // Bloc mensuel
    const monthlyRaw = await AllCriticalyNumberPerMonth(allEndpointsData);
    const monthly = monthlyRaw.map(item => ({
      mois: item.nom,
      faibles: item.low,
      moyens: item.medium,
      hauts: item.high,
      critiques: item.critical,
    }));

    // Bloc Top 5 endpoints critiques
    const topEndpoints = getTopCriticalEndpoints(allEndpointsData, critiquesDurablesData, 5);

    return {
      stats: { total, low, medium, high, critical },
      NoComposantStats: { NoTotal, NoAD, NoKaspersky, NoGLPI },
      percentages,
      monthly,
      topEndpoints
    };
  };


  const handleExportCSV = async () => {
    const data = await assembleDashboardData();
    exportDashboardCSV(data);
  };

  const handleExportPDF = async () => {
    const data = await assembleDashboardData();
    exportDashboardPDF(data);
  };
  

  if (loading) {
    return (
      <div style={{ position: 'relative', minHeight: '100vh' }}>
        <SidebarToggle />
        <main
          style={{
            padding: '1.5rem',
            width: '100%',
            minHeight: '100vh',
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'center',
          }}
        >
          <Loading text="Chargement du tableau de bord..." />
        </main>
      </div>
    );
  }

  const adminSessionStr = localStorage.getItem('adminSession'); // chaîne JSON
  const adminSession = JSON.parse(adminSessionStr); // maintenant un objet JS
  const titre = adminSession.titre;
  const SA = "Super Admin";
  const AD = "Admin";

  let isVisibleADOrSA = false;
  if(titre === AD || titre === SA){
    isVisibleADOrSA = true;
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
        }}
      >
        {/* Zone boutons export */}
        <div
          style={{
            display: 'flex',
            justifyContent: 'flex-end',
            gap: '0.5rem',
            marginBottom: '1rem',
          }}
        >
          <button
            onClick={handleExportCSV}
            style={{
              backgroundColor: '#f3f4f6',
              border: '1px solid #ccc',
              borderRadius: '6px',
              padding: '0.5rem 1rem',
              fontSize: '0.875rem',
              cursor: 'pointer',
              transition: 'background-color 0.3s',
              display: isVisibleADOrSA ? 'block' : 'none'
            }}
            onMouseEnter={(e) => (e.currentTarget.style.backgroundColor = '#e5e7eb')}
            onMouseLeave={(e) => (e.currentTarget.style.backgroundColor = '#f3f4f6')}
          >
            Export CSV
          </button>

          <button
            onClick={handleExportPDF}
            style={{
              backgroundColor: '#f3f4f6',
              border: '1px solid #ccc',
              borderRadius: '6px',
              padding: '0.5rem 1rem',
              fontSize: '0.875rem',
              cursor: 'pointer',
              transition: 'background-color 0.3s',
              display: isVisibleADOrSA ? 'block' : 'none'
            }}
            onMouseEnter={(e) => (e.currentTarget.style.backgroundColor = '#e5e7eb')}
            onMouseLeave={(e) => (e.currentTarget.style.backgroundColor = '#f3f4f6')}
          >
            Export PDF
          </button>
        </div>

        {/* 🔢 Statistiques générales */}
        <div
          style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))',
            gap: '1.5rem',
            marginBottom: '2rem',
          }}
        >
          <StatCard 
            totalEndpoints={totalEndpoints || 0}
            lowEndpoints={lowEndpoints || 0}
            mediumEndpoints={mediumEndpoints || 0}
            highEndpoints={highEndpoints || 0}
            criticalEndpoints={criticalEndpoints || 0}
          />

          <EndpointCompositeStatCard
            totalEndpoints={totalEndpoints || 0}
            NoADEndpoints={NoADEndpoints || 0}
            NoKasperskyEndpoints={NoKasperskyEndpoints || 0}
            NoGLPIEndpoints={NoGLPIEndpoints || 0}
          />

          <TopCriticalEndpointsCard
            allEndpoints={allEndpointsData || []}
            critiquesDurables={critiquesDurablesData || []}
          />
        </div>

        {/* 📊 Graphiques */}
        <div
          style={{
            display: 'flex',
            flexDirection: 'column',
            gap: '2.5rem',
          }}
        >
          <h2 style={{ fontSize: '1.25rem', fontWeight: 600, color: '#374151' }}>
            Répartition actuelle
          </h2>
          <PieArcLabel
            totalEndpoints={totalEndpoints || 0}
            lowEndpoints={lowEndpoints || 0}
            mediumEndpoints={mediumEndpoints || 0}
            highEndpoints={highEndpoints || 0}
            criticalEndpoints={criticalEndpoints || 0}
          />

          <h2 style={{ fontSize: '1.25rem', fontWeight: 600, color: '#374151' }}>
            Évolution mensuelle
          </h2>
          <BarChartEndpoints
            AllCriticalyNumberPerMonth={AllCriticalyNumberPerMonthData || []}
          />
        </div>
      </main>
    </div>
  );
}

export default DashBoardPage;
