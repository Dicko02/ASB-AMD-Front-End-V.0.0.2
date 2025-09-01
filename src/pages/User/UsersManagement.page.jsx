import SidebarToggle from '../../components/Complements/SideBar.component';
import Header from '../../components/Complements/Header.component';
import UsersListe from '../../components/User/UsersListe.component';
import Footer from '../../components/Complements/Footer.component';

function UsersManagement() {
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
        }}
      >
        <Header title="Liste des Utilisateurs" />
        <div
          style={{
            flexGrow: 1,
            display: 'flex',
            justifyContent: 'center',
            paddingTop: '2rem',
            width: '100%',
            boxSizing: 'border-box',
          }}
        >
          <div style={{ width: '100%', maxWidth: 960 }}>
            <UsersListe />
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
}

export default UsersManagement;
