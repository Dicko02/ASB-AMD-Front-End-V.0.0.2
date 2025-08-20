import { useEffect, useState } from 'react';
import LogsTable from "../../components/logsTable.component";
import fetchAccessLogs from "../../api/logsAPI/view/accessLogs.view.api";
import Loading from '../../components/Complements/Loading.component'; // Import du loader
import SidebarToggle from '../../components/Complements/SideBar.component';

function AccessLogsPage() {
  const [accessLogs, setAccessLogs] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    async function chargerAccessLogs() {
      try {
        const responseAccessLogs = await fetchAccessLogs();
        setAccessLogs(responseAccessLogs.data);
      } catch (error) {
        setError('Erreur lors du chargement des AccessLogs.');
        console.error(error);
      } finally {
        setLoading(false);
      }
    }

    chargerAccessLogs();
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
            boxSizing: 'border-box',
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'center',
          }}

        >
          <Loading text="chargement des Access logs..." />
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
          width: '100%',
          padding: '1.5rem',
          minHeight: '100vh',
          boxSizing: 'border-box',
          display: 'flex',
          flexDirection: 'column',
        }}
      >
        <div style={{ paddingTop: '2rem' }}>
          <div className="space-y-8">
            <LogsTable
              data={accessLogs}
              title="Logs d'accès"
              logType="access"
            />
          </div>
        </div>
      </main>
    </div>
  );
}

export default AccessLogsPage;
