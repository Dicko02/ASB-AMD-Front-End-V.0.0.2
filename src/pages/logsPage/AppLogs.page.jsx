import { useEffect, useState } from 'react';
import LogsTable from "../../components/logsTable.component";
import fetchAppLogs from "../../api/logsAPI/view/appLogs.view.api";
import Loading from '../../components/Complements/Loading.component'; // Import du loader
import SidebarToggle from '../../components/Complements/SideBar.component';

function AppLogsPage() {
  const [appLogs, setAppLogs] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    async function chargerAppLogs() {
      try {
        const responseAppLogs = await fetchAppLogs();
        setAppLogs(responseAppLogs.data);
      } catch (error) {
        setError('Erreur lors du chargement des AppLogs.');
        console.error(error);
      } finally {
        setLoading(false);
      }
    }

    chargerAppLogs();
  }, []);

  if (loading) {
    return (
      <div style={{ position: 'relative', minHeight: '100vh' }}>
        <SidebarToggle />
        <main
          style={{
            padding: '1.5rem',
            width: '100%',
            backgroundColor: '#f3f4f6',
            minHeight: '100vh',
            boxSizing: 'border-box',
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'center',
          }}
        >
          <Loading text="chargement des App logs..." />
        </main>
      </div>
    );
  }

  if (error) {
    return (
      <p
        style={{
          textAlign: 'center',
          color: 'red',
          fontWeight: 'bold',
          marginTop: '50px',
        }}
      >
        {error}
      </p>
    );
  }

  return (
    <div style={{ display: 'flex' }}>
        <SidebarToggle />
      <main
        style={{
          marginLeft: '16rem',
          width: '100%',
          padding: '1.5rem',
          backgroundColor: '#f3f4f6',
          minHeight: '100vh',
          boxSizing: 'border-box',
          display: 'flex',
          flexDirection: 'column',
        }}
      >
        <div style={{ paddingTop: '2rem' }}>
          <div className="space-y-8">
            {/* Logs Application */}
            <LogsTable
              data={appLogs}
              title="Logs de l'application"
              logType="app"
            />
          </div>
        </div>
      </main>
    </div>
  );
}

export default AppLogsPage;
