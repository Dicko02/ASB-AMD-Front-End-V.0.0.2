import SidebarToggle from '../../components/Complements/SideBar.component';
import Header from '../../components/Complements/Header.component';
import UserAdd from '../../components/User/UserAdd.component';
import Footer from '../../components/Complements/Footer.component';

function UserAddForm() {
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
        <Header title="Ajout d'un Nouveau Compte" />
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
            <UserAdd />
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
}

export default UserAddForm;
