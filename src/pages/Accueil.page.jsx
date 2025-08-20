import EndpointsList from '../components/Endpoint/tableauEndpoints.component';
import SidebarToggle from '../components/Complements/SideBar.component';
import Header from '../components/Complements/Header.component';

function Accueil() {

  return (
    <div style={{ position: 'relative', minHeight: '100vh' }}>
      <SidebarToggle />
      <main
        style={{
          padding: '1.5rem',
          width: '100%',
          minHeight: '100vh',
          display: 'flex',
          flexDirection: 'column',
          boxSizing: 'border-box',
        }}>
        <Header title="Liste des Endpoints" />
        <div
          style={{
            flexGrow: 1,
            display: 'flex',
            justifyContent: 'center',
            paddingTop: '2rem',
          }}
        >
          {<EndpointsList />}
        </div>
      </main>
    </div>
  );
}

export default Accueil;
