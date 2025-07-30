import SidebarToggle from '../components/Complements/SideBar.component';
import Header from '../components/Complements/Header.component';
import ConformitySettingCheckboxForm from '../components/Setting-Items/conformity.component'

function Setting() {

  return (
    <div style={{ position: 'relative', minHeight: '100vh' }}>
      <SidebarToggle />
      <main
        style={{
          padding: '1.5rem',
          width: '100%',
          backgroundColor: '#f3f4f6',
          minHeight: '100vh',
          display: 'flex',
          flexDirection: 'column',
          boxSizing: 'border-box',
        }}>
        <Header title="Paramètre" />
        <div
          style={{
            flexGrow: 1,
            display: 'flex',
            justifyContent: 'center',
            paddingTop: '2rem',
          }}
        >
          {<ConformitySettingCheckboxForm />}
        </div>
      </main>
    </div>
  );
}

export default Setting;
