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
import countEndpoints from '../utils/EndpointPriorityLevelNumber/EndpointTotalNumber';
import countLowPriorityEndpoints from '../utils/EndpointPriorityLevelNumber/EndpointLowPriorityNumber';
import countMediumPriorityEndpoints from '../utils/EndpointPriorityLevelNumber/EndpointMediumPriorityNumber';
import countHighPriorityEndpoints from '../utils/EndpointPriorityLevelNumber/EndpointHighPriorityNumber';
import countCriticalPriorityEndpoints from '../utils/EndpointPriorityLevelNumber/EndpointCriticalyPriorityNumber';
import PercentageConvertion from '../utils/PercentageConvertion';
import AllCriticalyNumberPerMonth from '../utils/CriticatlyLevelNumberAndDate/AllCriticalyNumberPerMonth';

// Fonctions des No-Composants
import countEndpointsNoAD from '../utils/endpointComposantCount/NoAD';
import countEndpointsNoKaspersky from '../utils/endpointComposantCount/NoKaspersky';
import countEndpointsNoGLPI from '../utils/endpointComposantCount/NoGLPI';

function DashBoardPage() {
  const [loading, setLoading] = useState(true);

  const assembleDashboardData = async () => {

    // Bloc statistiques brutes
    const total   = await countEndpoints();
    const low     = await countLowPriorityEndpoints();
    const medium  = await countMediumPriorityEndpoints();
    const high    = await countHighPriorityEndpoints();
    const critical = await countCriticalPriorityEndpoints();

    // Bloc statistiques No Composants
    const NoTotal   = await countEndpoints();
    const NoAD     = await countEndpointsNoAD();
    const NoKaspersky  = await countEndpointsNoKaspersky();
    const NoGLPI    = await countEndpointsNoGLPI();

    // Bloc pourcentages
    const percentages = {
      low: await PercentageConvertion(low),
      medium: await PercentageConvertion(medium),
      high: await PercentageConvertion(high),
      critical: await PercentageConvertion(critical),
    };

    // Bloc mensuel
    const monthlyRaw = await AllCriticalyNumberPerMonth();
    const monthly = monthlyRaw.map(item => ({
      mois: item.nom,
      faibles: item.low,
      moyens: item.medium,
      hauts: item.high,
      critiques: item.critical,
    }));

    return {
      stats: { total, low, medium, high, critical },
      NoComposantStats: { NoTotal, NoAD, NoKaspersky, NoGLPI },
      percentages,
      monthly,
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


  useEffect(() => {
    const timer = setTimeout(() => setLoading(false), 2000);
    return () => clearTimeout(timer);
  }, []);

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
          <StatCard />
          <EndpointCompositeStatCard />
          <TopCriticalEndpointsCard />
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
          <PieArcLabel />

          <h2 style={{ fontSize: '1.25rem', fontWeight: 600, color: '#374151' }}>
            Évolution mensuelle
          </h2>
          <BarChartEndpoints />
        </div>
      </main>
    </div>
  );
}

export default DashBoardPage;
